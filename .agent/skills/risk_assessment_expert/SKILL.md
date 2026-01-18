---
name: Risk Assessment Expert
description: Specialized instructions for modifying, debugging, and understanding the Risk Assessment module (Bowtie, FAIR, ISO 27005).
---

# Risk Assessment Expert Skill

This skill provides context and rules for working on the Risk Assessment features of VERGE.

## 1. Governance & Standards
All changes to Risk Assessment MUST comply with:
- **ISO/IEC 27005**: For the overall risk management process.
- **FAIR (O-RT)**: For quantitative logic (risk calculation).
- **Bowtie Method**: For the visual structural logic of threats, barriers, and consequences.

Refer to `/AGENTS.md` in the root for the authoritative hierarchy.

## 2. Core Components
- `src/views/RiskAssessment/`: Contains the main views.
    - `BowtieEditor.tsx`: The primary visual editor for the Bowtie diagram.
    - `RiskHub.tsx`: The listing of assessments.
- `src/utils/fairEngine.ts`: The calculation engine for FAIR metrics.

## 3. Data Invariants
When modifying risk logic, ensure:
1.  **Threat Events** must always be the central node of a Bowtie.
2.  **Barriers** must be classified as either preventive (left side) or reactive (right side).
3.  **Assets** are the subject of the assessment; an assessment cannot exist without a linked asset.

## 4. Debugging Tips
- If the Bowtie graph is not rendering, check the `reactflow` node and edge props.
- If interactions (clicks, deletes) fail, verify the `onNodeClick` and event propagation in `BowtieEditor.tsx`.
- Ensure theme consistency (dark/light mode) propagates to the Canvas elements.
