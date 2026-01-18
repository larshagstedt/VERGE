# ISO/IEC 27005:2022 - Information Security Risk Management

**ISO/IEC 27005** provides guidance on the risk management process specified in ISO/IEC 27001. It is the tactical "How-To" for InfoSec risk.

## 1. The Risk Management Process
This process aligns 1:1 with VERGE's workflow.

### 1.1 Context Establishment (Clause 6)
*   **Basic Criteria:** Risk evaluation criteria, impact criteria, and risk acceptance criteria.
*   **Scope:** Boundaries of the risk management.
*   *Application:* Users configure this in the "Context" module.

### 1.2 Risk Assessment (Clause 7)
*   **Identification (7.2):** Finding assets, threats, existing controls, and vulnerabilities.
    *   *VERGE:* Bowtie Construction.
*   **Analysis (7.3):** Estimating the level of risk.
    *   *Methodology:* ISO 27005 allows qualitative or quantitative. VERGE mandates **Quantitative (FAIR)** per `AGENTS.md`.
    *   *Event-Based:* ISO 27005 explicitly supports "event-based" (Bowtie) analysis in Annex A.
*   **Evaluation (7.4):** Comparing results against criteria.

### 1.3 Risk Treatment (Clause 8)
*   Treatment options:
    *   **Modify:** Add controls (barriers).
    *   **Retain:** Accept the risk.
    *   **Avoid:** Stop the activity.
    *   **Share:** Insure or outsource.

## 2. Annex A: Techniques
ISO 27005 Annex A lists "Event-based" approaches as valid.
*   **Axiom:** The Bowtie method is a recognized implementation of Event-based risk analysis under ISO 27005.

## 3. Agent Instructions
*   When a user asks about "Compliance with ISO 27005," refer them to the **Process Workflow**.
*   Process steps MUST stick to the `Identification -> Analysis -> Evaluation -> Treatment` sequence.
