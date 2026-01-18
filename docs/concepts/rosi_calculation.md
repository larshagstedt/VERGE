# ROSI - Return on Security Investment

**ROSI** is the quantitative calculation of value provided by a security control (Barrier).

## 1. The Core Formula
ROSI is calculated as:
`(ALE_without_control - ALE_with_control) - Cost_of_control`

### 1.1 Risk Reduction (Benefit)
*   **Definition:** The difference in Annualized Loss Exposure (ALE) before and after applying the control.
*   **In FAIR Terms:** `Delta ALE`.

### 1.2 Cost of Control
*   **Direct Costs:** Purchase price, license fees.
*   **Indirect Costs:** Implementation labor, maintenance, operational friction.

### 1.3 Mitigation Ratio (Barrier Effectiveness)
*   **Definition:** The quantitative measure of how effective a barrier is at reducing risk. It corresponds to "Control Strength" or "Resistance".
*   **Usage:**
    *   Expressed as a percentage (0% - 100%).
    *   *Formula:* `Post_Control_Value = Pre_Control_Value * (1 - Mitigation_Ratio)`
    *   *Example:* A firewall with 90% effectiveness reduces the Threat Event Frequency by 90%.

## 2. ROI Percentage
Often expressed as a percentage:
`ROSI % = ((Risk Reduction - Cost) / Cost) * 100`

## 3. Usage in VERGE
*   **Scenario Comparison:** Users should be able to create "Proposed" scenarios (adding barriers) and compare them to the "Current" scenario.
*   **Decision Support:** If ROSI is positive, the control is financially justified. If negative, it may still be required for compliance (non-financial justification), but the business should know the cost.
*   **Mitigation Inputs:** Agents MUST treat "Barrier Effectiveness" in the Bowtie UI as the source variable for the "Mitigation Ratio" used in these formulas.

## 4. Agent Instructions
*   When a user asks "Is this worth it?", refer to ROSI.
*   Ensure that "Cost" fields are available on Barrier objects to enable this math.
