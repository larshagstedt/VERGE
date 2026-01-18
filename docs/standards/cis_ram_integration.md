# CIS RAM v2.2 - Risk Assessment Method

**CIS RAM** (Center for Internet Security Risk Assessment Method) adapts ISO 27005 concepts specifically for the legal concept of "Reasonableness".

## 1. Core Philosophy: Duty of Care
CIS RAM asks: *"Is the risk treatment reasonable?"*
This is defined as whether the burden of the safeguard is less than the benefit of the risk reduction.

*   **Formula:** `Burden < (Risk_Pre - Risk_Post)`
*   *Note:* This is similar to ROSI (Return on Security Investment).

## 2. Integration into VERGE
VERGE uses CIS RAM concepts to validate Risk Treatment decisions.

### 2.1 Defining "Burden"
When a user adds a Barrier (Control) in VERGE, they should optionally define its "Cost" (Financial + Operational friction).
*   **Action for Agents:** When designing the " Barrier Edit" UI, suggest fields for `implementation_cost` and `maintenance_cost`.

### 2.2 Acceptable Risk Definition
CIS RAM defines acceptable risk not just by a flat line (Risk Appetite) but by the "Reasonableness" test.
*   *If a risk is high, but the cost to fix it destroys the business, it may be 'Reasonable' to accept it (with documentation).*

## 3. Impact Categories
CIS RAM suggests evaluating impact on:
1.  **Mission:** Can the organization achieve its goals?
2.  **Objectives:** Can we meet specific milestones?
3.  **Obligations:** Legal/contractual duties.

## 4. Agent Instructions
*   Use CIS RAM logic when the user asks for "Legal defensibility" of their risk assessment.
*   Map CIS Controls (Implementation Group 1, 2, 3) to "Barriers" in the Bowtie.
