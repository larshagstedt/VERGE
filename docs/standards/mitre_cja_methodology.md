# MITRE CJA - Crown Jewel Analysis

**Crown Jewel Analysis (CJA)** is a methodology for identifying those cyber assets that are most critical to the accomplishment of an organization’s mission.

## 1. Process Overview
CJA reverses the typical "Asset Inventory" list. Ideally, users should start with Mission Objectives, not Servers.

### 1.1 The Dependency Map
1.  **Mission Objectives:** Top-level goals (e.g., "Deliver Clean Water").
2.  **Tasks/Functions:** What processes achieve that mission? (e.g., "Water Filtration").
3.  **Information Assets:** What data supports that task? (e.g., "SCADA Control Data").
4.  **Hardware/Software Assets:** What systems hold that info? (e.g., "PLC Controller").

## 2. VERGE Implementation
The "DependencyMapper" component in VERGE is designed to support CJA.
*   **Logic:** Risk Inheritance.
    *   If a Server goes down, the Task fails.
    *   If the Task fails, the Mission fails.
*   **Impact Propagation:**
    *   Loss Magnitude (FAIR) should be estimated at the *Mission* level, then inherited down to the *Asset* level.

## 3. "Crown Jewels"
*   **Definition:** Assets where the failure would cause Mission Failure.
*   **Agent Instructions:**
    *   Prioritize risk assessments on Crown Jewels.
    *   When filtering assets, allow users to filter by "Criticality" derived from CJA.

## 4. Relationship to BIA
CJA is essentially a standard *Business Impact Analysis (BIA)* but focused on Mission Assurance rather than just financial loss.
