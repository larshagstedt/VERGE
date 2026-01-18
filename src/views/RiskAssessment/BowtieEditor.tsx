import React, { useCallback, useEffect, useMemo } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
} from '@xyflow/react';
import type { Node, Edge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { RiskAssessment } from '../../types';

import { nodeTypes } from './BowtieNodes';
import { useTheme } from '../../hooks/useTheme';

// --- Editor Component ---

interface BowtieEditorProps {
    assessment: RiskAssessment | undefined;
    onNodeClick?: (nodeId: string, type: string) => void;
    onBarrierReorder?: (parentId: string, barrierIds: string[]) => void;
}

// Layout Constants
const BARRIER_SPACING = 140; 
const CENTER_OFFSET_X = 60; // 120 / 2
const CENTER_OFFSET_Y = 55; // Approx center of main box (Nub 24 + Box 78, Center ~ 63, - fudge)

// Handle Offsets (Approximate based on Node Styling)
const THREAT_HANDLE_OFFSET = { x: 200, y: 50 }; 
const TOP_EVENT_IN_OFFSET = { x: 0, y: 100 };   
const TOP_EVENT_OUT_OFFSET = { x: 200, y: 100 }; 
const CONS_HANDLE_OFFSET = { x: 0, y: 50 };      

// --- Bezier Helper Functions ---

// Calculate a point on a cubic bezier curve for a given t [0..1]
const getPointOnBezier = (
    p0: { x: number, y: number },
    p1: { x: number, y: number },
    p2: { x: number, y: number },
    p3: { x: number, y: number },
    t: number
) => {
    const oneMinusT = 1 - t;
    const oneMinusT2 = oneMinusT * oneMinusT;
    const oneMinusT3 = oneMinusT2 * oneMinusT;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
        x: oneMinusT3 * p0.x + 3 * oneMinusT2 * t * p1.x + 3 * oneMinusT * t2 * p2.x + t3 * p3.x,
        y: oneMinusT3 * p0.y + 3 * oneMinusT2 * t * p1.y + 3 * oneMinusT * t2 * p2.y + t3 * p3.y,
    };
};

// Calculate control points to match React Flow's default BezierEdge
const getControlPoints = (
    src: { x: number, y: number },
    tgt: { x: number, y: number }
) => {
    // Horizontal layout creates 'horizontal' bezier handles
    const midX = (src.x + tgt.x) / 2;
    return {
        p1: { x: midX, y: src.y },
        p2: { x: midX, y: tgt.y }
    };
};

// --- Arc Length Parametrization (LUT) for Even Distribution ---

const SAMPLES = 100;

// Generate LUT: Map distance -> t
const generateBezierLUT = (
    p0: { x: number, y: number },
    p1: { x: number, y: number },
    p2: { x: number, y: number },
    p3: { x: number, y: number }
) => {
    const lut = [];
    lut.push({ t: 0, len: 0, x: p0.x, y: p0.y });
    
    let totalLen = 0;
    let prev = p0;
    
    for (let i = 1; i <= SAMPLES; i++) {
        const t = i / SAMPLES;
        const pt = getPointOnBezier(p0, p1, p2, p3, t);
        const d = Math.sqrt((pt.x - prev.x)**2 + (pt.y - prev.y)**2);
        totalLen += d;
        lut.push({ t, len: totalLen, x: pt.x, y: pt.y });
        prev = pt;
    }
    
    return { lut, totalLen };
};

// Get t for a specific distance along the curve
const getTForDistance = (targetDist: number, lut: { t: number, len: number }[]) => {
    // Binary search or linear scan (since sorted)
    for (let i = 0; i < lut.length - 1; i++) {
        if (lut[i].len <= targetDist && lut[i+1].len >= targetDist) {
            // Interpolate
            const dRange = lut[i+1].len - lut[i].len;
            const tRange = lut[i+1].t - lut[i].t;
            const frac = (targetDist - lut[i].len) / dRange;
            return lut[i].t + frac * tRange;
        }
    }
    return 1;
};


// Helper: Calculate clustered barrier position using Bezier Arc Length
const getClusteredBezierPosition = (
    start: { x: number, y: number }, // P0
    end: { x: number, y: number },   // P3
    index: number,
    total: number
) => {
    const { p1, p2 } = getControlPoints(start, end);
    const { lut, totalLen } = generateBezierLUT(start, p1, p2, end);
    
    // Calculate total width requirement
    // Usually we want BARRIER_SPACING, but if totalLen is small, we squeeze?
    // Let's keep fixed spacing and center.
    
    const totalClusterWidth = (total - 1) * BARRIER_SPACING;
    const startDist = (totalLen - totalClusterWidth) / 2;
    
    const targetDist = startDist + index * BARRIER_SPACING;
    
    // Clamp to [0, totalLen] to prevent going off-curve
    const clampedDist = Math.max(0, Math.min(totalLen, targetDist));
    
    const t = getTForDistance(clampedDist, lut);
    const pos = getPointOnBezier(start, p1, p2, end, t);

    return {
        x: pos.x - CENTER_OFFSET_X,
        y: pos.y - CENTER_OFFSET_Y
    };
};

const getClosestTOnBezier = (
    pos: { x: number, y: number },
    p0: { x: number, y: number },
    p1: { x: number, y: number },
    p2: { x: number, y: number },
    p3: { x: number, y: number }
) => {
   // Since we have LUT logic available, we could use projection, but simplistic closest-point search 
   // is robust enough for drag interactions.
   // Re-using the iterative search from before as it works well for "snap to curve".
    let bestT = 0.5;
    let minDist = Infinity;
    
    for (let t = 0; t <= 1; t += 0.02) {
        const pt = getPointOnBezier(p0, p1, p2, p3, t);
        const dist = (pt.x - pos.x) ** 2 + (pt.y - pos.y) ** 2;
        if (dist < minDist) {
            minDist = dist;
            bestT = t;
        }
    }
    
    for (let t = Math.max(0, bestT - 0.02); t <= Math.min(1, bestT + 0.02); t += 0.002) {
        const pt = getPointOnBezier(p0, p1, p2, p3, t);
        const dist = (pt.x - pos.x) ** 2 + (pt.y - pos.y) ** 2;
        if (dist < minDist) {
            minDist = dist;
            bestT = t;
        }
    }
    
    return bestT;
};


export const BowtieEditor: React.FC<BowtieEditorProps> = ({ 
    assessment, 
    allAssessments = [], 
    asset,
    onNodeClick, 
    onBarrierReorder,
    onSwitchAssessment
}) => {
    const { theme } = useTheme();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const onNodeDrag = useCallback((event: React.MouseEvent, node: Node) => {
        setNodes((currentNodes) => {
            const topEventNode = currentNodes.find(n => n.type === 'topEvent');
            if (!topEventNode) return currentNodes;

            const topEventId = assessment?.topEvent.id;
            const currentTopEventPos = node.id === topEventId ? node.position : topEventNode.position;

            // Scenario 1: Dragging a Barrier (Reordering)
            if (node.type === 'barrier') {
                const parentId = node.data.parentId as string;
                const barrierType = node.data.barrierType as string;
                if (!parentId) return currentNodes;

                // 1. Determine Bezier Curve Control Points
                let p0 = { x: 0, y: 0 };
                let p3 = { x: 0, y: 0 };

                if (barrierType === 'Preventive') {
                    const threatNode = currentNodes.find(n => n.id === parentId);
                    if (!threatNode) return currentNodes;
                    
                    p0 = { x: threatNode.position.x + THREAT_HANDLE_OFFSET.x, y: threatNode.position.y + THREAT_HANDLE_OFFSET.y };
                    p3 = { x: currentTopEventPos.x + TOP_EVENT_IN_OFFSET.x, y: currentTopEventPos.y + TOP_EVENT_IN_OFFSET.y };
                } else {
                    const consNode = currentNodes.find(n => n.id === parentId);
                    if (!consNode) return currentNodes;

                    p0 = { x: currentTopEventPos.x + TOP_EVENT_OUT_OFFSET.x, y: currentTopEventPos.y + TOP_EVENT_OUT_OFFSET.y };
                    p3 = { x: consNode.position.x + CONS_HANDLE_OFFSET.x, y: consNode.position.y + CONS_HANDLE_OFFSET.y };
                }

                const { p1, p2 } = getControlPoints(p0, p3);

                // 2. Find Dragged Node's closest 't' on this curve
                const nodeCenter = {
                    x: node.position.x + CENTER_OFFSET_X,
                    y: node.position.y + CENTER_OFFSET_Y
                };
                
                const t = getClosestTOnBezier(nodeCenter, p0, p1, p2, p3);
                
                // 3. Update Dragged Node Visual Position (Snap to Curve)
                const snappedPos = getPointOnBezier(p0, p1, p2, p3, t);
                const updatedDraggedNode = {
                    ...node,
                    position: { 
                        x: snappedPos.x - CENTER_OFFSET_X, 
                        y: snappedPos.y - CENTER_OFFSET_Y 
                    }
                };

                // 4. Calculate Expected Order
                const siblings = currentNodes
                    .filter(n => n.type === 'barrier' && n.data.parentId === parentId);
                
                const siblingProjections = siblings.map(sib => {
                    if (sib.id === node.id) return { id: sib.id, t: t }; 
                    const sibCenter = { x: sib.position.x + CENTER_OFFSET_X, y: sib.position.y + CENTER_OFFSET_Y };
                    const sibT = getClosestTOnBezier(sibCenter, p0, p1, p2, p3);
                    return { id: sib.id, t: sibT };
                });

                siblingProjections.sort((a, b) => a.t - b.t);

                const newOrderIds = siblingProjections.map(p => p.id);
                const currentSortedSiblings = [...siblings].sort((a,b) => (a.data.index as number) - (b.data.index as number));
                const currentOrderIds = currentSortedSiblings.map(s => s.id);

                const isDifferent = newOrderIds.some((id, idx) => id !== currentOrderIds[idx]);

                if (isDifferent && onBarrierReorder) {
                     onBarrierReorder(parentId, newOrderIds);
                }
                
                return currentNodes.map(n => n.id === node.id ? updatedDraggedNode : n);
            }

            // Scenario 2: Dragging Endpoint (Stickiness)
            return currentNodes.map(n => {
                if (n.id === node.id) return node; // It's the one dragging

                if (n.type === 'barrier') {
                    const parentId = n.data.parentId as string;
                    if (!parentId) return n;

                    const barrierIndex = n.data.index as number;
                    const totalBarriers = n.data.total as number;
                    const barrierType = n.data.barrierType as string;

                    let p0 = { x: 0, y: 0 };
                    let p3 = { x: 0, y: 0 };
                    let shouldUpdate = false;

                    const topEventId = assessment?.topEvent.id;

                    if (barrierType === 'Preventive') {
                        const threatId = parentId;
                        if (node.id === threatId || node.id === topEventId) {
                            const threatNode = currentNodes.find(cn => cn.id === threatId);
                            const tPos = (node.id === threatId) ? node.position : (threatNode ? threatNode.position : {x:0, y:0});
                            const tePos = (node.id === topEventId) ? node.position : currentTopEventPos;

                            if (threatNode) {
                                p0 = { x: tPos.x + THREAT_HANDLE_OFFSET.x, y: tPos.y + THREAT_HANDLE_OFFSET.y };
                                p3 = { x: tePos.x + TOP_EVENT_IN_OFFSET.x, y: tePos.y + TOP_EVENT_IN_OFFSET.y };
                                shouldUpdate = true;
                            }
                        }
                    } else if (barrierType === 'Mitigative') {
                        const consId = parentId;
                        if (node.id === consId || node.id === topEventId) {
                            const consNode = currentNodes.find(cn => cn.id === consId);
                            const tPos = (node.id === topEventId) ? node.position : currentTopEventPos;
                            const cPos = (node.id === consId) ? node.position : (consNode ? consNode.position : {x:0, y:0});

                            if (consNode) {
                                p0 = { x: tPos.x + TOP_EVENT_OUT_OFFSET.x, y: tPos.y + TOP_EVENT_OUT_OFFSET.y };
                                p3 = { x: cPos.x + CONS_HANDLE_OFFSET.x, y: cPos.y + CONS_HANDLE_OFFSET.y };
                                shouldUpdate = true;
                            }
                        }
                    }
                    
                    if (shouldUpdate) {
                         // Recalculate based on Bezier logic + LUT
                         const newPos = getClusteredBezierPosition(p0, p3, barrierIndex, totalBarriers);
                         return { ...n, position: newPos };
                    }
                }
                return n;
            });
        });
    }, [setNodes, onBarrierReorder]);

    // Initial Layout Effect
    useEffect(() => {
        if (!assessment) return;

        // PRESERVE LAYOUT: Capture current positions map
        const currentNodesMap = new Map(nodes.map(n => [n.id, n]));

        const flowNodes: Node[] = [];
        const flowEdges: Edge[] = [];
        const CENTER_X = 400;
        const CENTER_Y = 300;
        const SPACING_X = 250;
        const SPACING_Y = 150;

        // Use the actual ID from the data
        const topEventNodeId = assessment.topEvent.id;
        const existingTopEvent = currentNodesMap.get(topEventNodeId);
        const topEventPos = existingTopEvent 
            ? existingTopEvent.position 
            : { x: CENTER_X, y: CENTER_Y };

        // --- ASSET NODE (TOP) ---
        if (asset) {
            const ASSET_NODE_Y = 100;
            const ASSET_NODE_X = 400; // Aligned with center
            
            flowNodes.push({
                id: 'asset-node',
                type: 'asset',
                data: { label: asset.name, type: asset.type },
                position: { x: ASSET_NODE_X, y: ASSET_NODE_Y },
                zIndex: 5,
                draggable: false, // Anchor point
            });
        }

        flowNodes.push({
            id: topEventNodeId,
            type: 'topEvent',
            data: { label: assessment.topEvent.label },
            position: topEventPos,
            zIndex: 10
        });

        // --- ASSET CONNECTION ---
        if (asset) {
            flowEdges.push({
                id: `e-asset-${topEventNodeId}`,
                source: 'asset-node',
                target: topEventNodeId,
                type: 'straight',
                animated: false,
                style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' }, 
            });
        }

        // Offsets
        const THREAT_HANDLE_OFFSET = { x: 200, y: 12 };
        const TOP_EVENT_IN_OFFSET = { x: 0, y: 100 };
        const TOP_EVENT_OUT_OFFSET = { x: 200, y: 100 };
        const CONS_HANDLE_OFFSET = { x: 0, y: 12 };

        // 2. Left Side: Threats (Inputs)
        assessment.threats.forEach((threat, index) => {
            const existing = currentNodesMap.get(threat.id);
            const defaultY = CENTER_Y + (index - (assessment.threats.length - 1) / 2) * SPACING_Y;
            const defaultX = CENTER_X - SPACING_X * 2;
            const threatPos = existing ? existing.position : { x: defaultX, y: defaultY };

            flowNodes.push({
                id: threat.id,
                type: 'threat',
                data: { label: threat.label },
                position: threatPos,
                zIndex: 10
            });

            const pathBarriers = assessment.barriers.filter(b => b.parentId === threat.id);
            pathBarriers.forEach((barrier, bIndex) => {
                const p0 = { x: threatPos.x + THREAT_HANDLE_OFFSET.x, y: threatPos.y + THREAT_HANDLE_OFFSET.y };
                const p3 = { x: topEventPos.x + TOP_EVENT_IN_OFFSET.x, y: topEventPos.y + TOP_EVENT_IN_OFFSET.y };

                // Use new LUT-based positioner
                const pos = getClusteredBezierPosition(p0, p3, bIndex, pathBarriers.length);

                flowNodes.push({
                    id: barrier.id,
                    type: 'barrier',
                    data: { 
                        label: barrier.label, 
                        barrierType: barrier.barrierType, 
                        parentId: threat.id,
                        index: bIndex,
                        total: pathBarriers.length
                    },
                    position: pos,
                    zIndex: 20
                });
            });

            flowEdges.push({
                id: `e-${threat.id}-${topEventNodeId}`,
                source: threat.id,
                target: topEventNodeId,
                type: 'default', // Bezier Curve matching control points
                animated: false,
                style: { strokeWidth: 2, stroke: '#94a3b8' }
            });
        });

        // 3. Right Side: Consequences (Outputs)
        assessment.consequences.forEach((cons, index) => {
            const existing = currentNodesMap.get(cons.id);
            const defaultY = CENTER_Y + (index - (assessment.consequences.length - 1) / 2) * SPACING_Y;
            const defaultX = CENTER_X + SPACING_X * 2;
            const consPos = existing ? existing.position : { x: defaultX, y: defaultY };

            flowNodes.push({
                id: cons.id,
                type: 'consequence',
                data: { label: cons.label },
                position: consPos,
                zIndex: 10
            });

            const pathBarriers = assessment.barriers.filter(b => b.parentId === cons.id);
            pathBarriers.forEach((barrier, bIndex) => {
                const p0 = { x: topEventPos.x + TOP_EVENT_OUT_OFFSET.x, y: topEventPos.y + TOP_EVENT_OUT_OFFSET.y };
                const p3 = { x: consPos.x + CONS_HANDLE_OFFSET.x, y: consPos.y + CONS_HANDLE_OFFSET.y };

                const pos = getClusteredBezierPosition(p0, p3, bIndex, pathBarriers.length);

                flowNodes.push({
                    id: barrier.id,
                    type: 'barrier',
                    data: { 
                        label: barrier.label, 
                        barrierType: barrier.barrierType, 
                        parentId: cons.id,
                        index: bIndex,
                        total: pathBarriers.length
                    },
                    position: pos,
                    zIndex: 20
                });
            });

            flowEdges.push({
                id: `e-${topEventNodeId}-${cons.id}`,
                source: topEventNodeId,
                target: cons.id,
                type: 'default', 
                animated: false,
                style: { stroke: '#ef4444', strokeWidth: 2 }
            });
        });

        // --- GHOST ASSESSMENTS ---
        const ghosts = allAssessments.filter(a => a.id !== assessment.id);
        const ghostCount = ghosts.length;
        if (ghostCount > 0) {
            ghosts.forEach((ghost, idx) => {
                const dir = idx % 2 === 0 ? -1 : 1;
                const multiplier = Math.floor(idx / 2) + 1;
                const offsetX = dir * multiplier * 250;
                
                const ghostX = CENTER_X + offsetX;
                const ghostY = CENTER_Y - 100; // Slightly higher than main line

                flowNodes.push({
                    id: `ghost-${ghost.id}`,
                    type: 'topEvent', // Re-use Top Event shape for the ghost
                    data: { label: ghost.title || 'Other Assessment' },
                    position: { x: ghostX, y: ghostY },
                    zIndex: 1, // Behind
                    style: { opacity: 0.4, filter: 'blur(1px)', transform: 'scale(0.8)' },
                    draggable: false
                });
            });
        }

        setNodes(flowNodes);
        setEdges(flowEdges);

    }, [assessment, allAssessments, asset, setNodes, setEdges]);
    
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const [isDraggingParent, setIsDraggingParent] = React.useState(false);

    const onNodeDragStart = useCallback((_: React.MouseEvent, node: Node) => {
        if (node.type !== 'barrier') {
            setIsDraggingParent(true);
        }
    }, []);

    const onNodeDragStop = useCallback(() => {
        setIsDraggingParent(false);
    }, []);

    if (!assessment) return <div className="p-10 text-center text-gray-500">Select or Create an Assessment</div>;

    return (
        <div className={`w-full h-full border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 ${isDraggingParent ? 'disable-barrier-transitions' : ''}`}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(_, node) => onNodeClick && onNodeClick(node.id, node.type || 'unknown')}
                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                onConnect={onConnect}
                fitView
            >
                <Background 
                    key={theme}
                    color={theme === 'dark' ? '#334155' : '#cbd5e1'} 
                    gap={20} 
                />
                <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm fill-slate-600 dark:fill-slate-400" />
            </ReactFlow>
        </div>
    );
};
