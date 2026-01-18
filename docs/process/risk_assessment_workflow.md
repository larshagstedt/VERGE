# Risk Assessment Workflow

This document outlines the standard workflow for risk assessment within VERGE. It strictly follows the **ISO/IEC 27005:2022** iterative process.

## 1. Context Policy (Scope)
Before assessing risk, the user MUST define the context.
*   **External Context:** Regulatory environment, market conditions.
*   **Internal Context:** Organization structure, assets types (Confidentiality, Integrity, Availability requirements).

## 2. Risk Assessment Process
The core loop consists of three distinct steps:

### 2.1 Risk Identification
**Goal:** Find, recognize, and describe risks.
*   **Action:** User creates a new Bowtie diagram.
*   **Inputs:**
    *   Select Asset (from Inventory).
    *   Identify Threat Sources (Threat Communities).
    *   Define the Top Event (Loss Event).
    *   Identify Consequences.

### 2.2 Risk Analysis
**Goal:** Comprehend the nature of risk and determine the level of risk.
*   **Action:** Populate the Bowtie with data.
*   **Inputs (FAIR Factors):**
    *   Estimate Threat Event Frequency (TEF).
    *   Estimate Loss Magnitude (LM) for each Consequence.
    *   Define Barrier/Control efficacy (Strength).
*   **Output:** The system calculates the inherent and residual risk (ALE).

### 2.3 Risk Evaluation
**Goal:** Compare the results of risk analysis with risk criteria to determine whether the risk and/or its magnitude is acceptable or tolerable.
*   **Action:** System highlights risks exceeding the "Risk Appetite."
*   **Decision:**
    *   **Treat:** Proceed to Risk Treatment.
    *   **Accept:** Log formal acceptance.
    *   **Avoid:** Cease the activity causing the risk.
    *   **Transfer:** Share risk (e.g., insurance).

## 3. Risk Treatment
**Goal:** Select and implement options for addressing risk.
*   **Action:** Add new Barriers to the Bowtie.
*   **Effect:**
    *   Adding Left-side barriers reduces LEF.
    *   Adding Right-side barriers reduces LM.
*   **Recalculation:** The system re-runs the analysis to show "Proposed Risk" vs "Current Risk."

---

> **Agent Note:** The UI should guide the user through these phases sequentially. Do not ask for "Treatment" decisions before "Analysis" is complete.
