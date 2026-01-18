import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ThreatNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="group relative w-[200px]">
      <div
        className={cn(
          "bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-600 rounded-sm shadow-sm overflow-hidden",
          selected && "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
        )}
      >
        <div className="h-6 bg-gradient-to-r from-blue-700 to-blue-500 border-b border-gray-400 dark:border-slate-600" />
        <div className="p-3 text-center">
          <div className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-tighter mb-1">
            {typeof data.label === 'string' ? data.label : "New Contact Event"}
          </div>
          <div className="mt-4 h-3 w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-blue-600" />
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400 dark:!bg-slate-500 border !border-white dark:!border-slate-800 rounded-none -mr-1" />
    </div>
  );
});

export const TopEventNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="relative flex items-center justify-center w-[200px] h-[200px]">
      <div className={cn(
        "absolute inset-0 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-red-700 border-2 border-red-800 flex items-center justify-center",
        "filter drop-shadow-lg",
        selected && "ring-4 ring-blue-300 dark:ring-blue-900 scale-105 transition-transform"
      )}>
        <div className="bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-600 w-3/4 h-1/2 flex items-center justify-center text-center p-2 shadow-inner">
          <div className="font-bold text-gray-900 dark:text-slate-100 text-sm leading-tight uppercase">
            {typeof data.label === 'string' ? data.label : "Threat Event"}
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-gray-800 dark:!bg-gray-200 border-2 !border-white dark:!border-slate-900 rounded-full -ml-1.5 z-10" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-800 dark:!bg-gray-200 border-2 !border-white dark:!border-slate-900 rounded-full -mr-1.5 z-10" />
    </div>
  );
});

export const ConsequenceNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="group relative w-[200px]">
      <div
        className={cn(
          "bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-600 rounded-sm shadow-sm overflow-hidden",
          selected && "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
        )}
      >
        <div className="h-6 bg-gradient-to-r from-red-700 to-red-500 border-b border-gray-400 dark:border-slate-600" />
        <div className="p-3 text-center">
          <div className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-tighter mb-1">
            {typeof data.label === 'string' ? data.label : "Loss Event"}
          </div>
          <div className="mt-4 h-3 w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-red-600" />
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-400 dark:!bg-slate-500 border !border-white dark:!border-slate-800 rounded-none -ml-1" />
    </div>
  );
});

export const BarrierNode = memo(({ data, selected }: NodeProps) => {
  const isPreventive = data.barrierType === 'Preventive';
  const headerGradient = isPreventive ? "from-blue-700 to-blue-500" : "from-green-700 to-green-500";
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-4 h-6 bg-gray-800 dark:bg-slate-700 rounded-t-sm shadow-sm" />
      <div className={cn(
        "w-[120px] bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-600 shadow-sm flex flex-col relative z-10 transition-all overflow-hidden",
        selected && "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900"
      )}>
        <div className={cn("h-4 bg-gradient-to-r border-b border-gray-400 dark:border-slate-600", headerGradient)} />
        <div className="p-2 text-[10px] font-bold text-gray-800 dark:text-slate-200 text-center uppercase truncate leading-tight">
          {typeof data.label === 'string' ? data.label : ''}
        </div>
        <div className="flex flex-col space-y-1 mt-1 px-2 pb-2">
          <div className="h-2 w-1/3 bg-black dark:bg-white/20" />
          <div className="h-2 w-1/3 bg-blue-600" />
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-400 dark:!bg-slate-500 border !border-white dark:!border-slate-800 rounded-none -ml-1" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400 dark:!bg-slate-500 border !border-white dark:!border-slate-800 rounded-none -mr-1" />
    </div>
  );
});

// ... existing nodes ...

export const AssetNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div className="relative flex flex-col items-center w-[200px]">
      <div className={cn(
        "w-16 h-16 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-2xl flex items-center justify-center shadow-md z-10",
        selected && "border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50"
      )}>
        <span className="text-2xl">🏢</span>
      </div>
      <div className="mt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-center">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {typeof data.label === 'string' ? data.label : "Asset"}
        </div>
        {data.type && <div className="text-[10px] text-slate-400 font-medium uppercase">{data.type as string}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-slate-400 dark:!bg-slate-600 border-2 !border-white dark:!border-slate-800 rounded-full" />
    </div>
  );
});

export const nodeTypes = {
  asset: AssetNode,
  threat: ThreatNode,
  topEvent: TopEventNode,
  consequence: ConsequenceNode,
  barrier: BarrierNode
};
