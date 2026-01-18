# ISO/IEC 27001:2022 - Relevance to VERGE

**ISO/IEC 27001** defines the requirements for an *Information Security Management System (ISMS)*. While VERGE is a software tool, not an organization, it is designed to facilitate compliance with Clause 6 (Planning) and Clause 8 (Operation).

## 1. Key Principles for VERGE

### 1.1 Context of the Organization (Clause 4)
*   **Relevance:** The application must allow users to define their organizational context.
*   **Implementation:** The "Context" view in VERGE directly supports this by allowing users to map:
    *   Interested Parties (Stakeholders)
    *   Scope of the ISMS
    *   Interfaces and Dependencies

### 1.2 Leadership and Commitment (Clause 5)
*   **Relevance:** Risk ownership.
*   **Implementation:** Assets and Risks must have assignable "Owners" to demonstrate accountability.

### 1.3 Actions to Address Risks and Opportunities (Clause 6.1)
This is the core functional requirement for VERGE.
*   **General (6.1.1):** Determine risks that need to be addressed to ensure the ISMS can achieve its intended outcome.
*   **Information Security Risk Assessment (6.1.2):**
    *   Establish and maintain risk acceptance criteria.
    *   Ensure repeatable, consistent risk assessments.
    *   *VERGE Alignment:* The Bowtie/FAIR method provides the "repeatable, consistent" methodology required here.
*   **Information Security Risk Treatment (6.1.3):**
    *   Select appropriate risk treatment options.
    *   Formulate a Risk Treatment Plan.
    *   *VERGE Alignment:* The "Barriers" in Bowtie diagrams represent the controls selected for treatment.

## 2. Annex A Controls
VERGE assumes the role of a "tool" to help users select and monitor Annex A controls.
*   **preventive controls** -> Left-side barriers.
*   **detective controls** -> Monitoring barriers.
*   **corrective controls** -> Right-side barriers.

## 3. Agent Instructions
When proposing features related to "Governance" or "Compliance":
1.  Verify if the feature helps the user satisfy a specific ISO 27001 Clause.
2.  If yes, explicitly reference that Clause in the UI or documentation.
