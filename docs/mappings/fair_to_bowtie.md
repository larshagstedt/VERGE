# Mapping: FAIR vs. Bowtie Method

This document defines the normative mapping between the **Factor Analysis of Information Risk (FAIR)** ontology and the **Bowtie** risk assessment method for the VERGE application.

Design decisions and data structures MUST adhere to this mapping to ensure semantic consistency.

## 1. High-Level Alignment

| Bowtie Component | FAIR Component (Approximate) | Semantic Bridge |
| :--- | :--- | :--- |
| **Hazard / Risk Source** | **Risk Source / Contact Frequency** | The entity or condition acting upon the asset. |
| **Threat (Left Side)** | **Threat Event Frequency (TEF)** | The chain of events leading up to the loss. |
| **Control (Preventive)** | **Resistance Strength / Avoidance** | Measures that reduce the probability of the Threat Event occurring. |
| **Top Event** | **Loss Event (LE)** | The moment control is lost; the Threat Event creates a Loss Event. |
| **Control (Detective)** | **Vulnerability (Probability of Action)** | Measures that detect the event (affects Vulnerability). |
| **Consequence (Right Side)** | **Loss Magnitude (LM)** | The tangible impact or loss resulting from the event. |
| **Control (mitigative)** | **Loss Response / Mitigation** | Measures that reduce the magnitude of the loss after the event. |

---

## 2. Detailed Structural Mapping

### 2.1 The "Top Event" as the Pivot Point
In Bowtie analysis, the **Top Event** is the moment the "Hazard" is released. In FAIR, this aligns with the **Loss Event** (specifically the primary Loss Event Frequency).

*   **Axiom:** The Top Event in VERGE is semantically equivalent to the occurrence of a FAIR Loss Event.
*   **Implication:** When a user defines a Top Event (e.g., "Data Breach"), they are instantiating a FAIR Loss Event node.

### 2.2 Left Side (Likelihood / Frequency)
The left side of the specific Bowtie diagram maps to calculating **Loss Event Frequency (LEF)** in FAIR.

*   **Bowtie Threats**: These are the specific **Threat Communities** or vectors initiating action.
*   **Preventive Barriers**: These act as **Resistance Strength**. They lower the **Threat Capability** or **Contact Frequency** effectively reducing the probability of the Top Event.
*   **Vulnerability**: In FAIR, Vulnerability is `P(Threat Action > Resistance)`. In Bowtie, missing or failed preventive barriers *increase* Vulnerability.

### 2.3 Right Side (Impact / Magnitude)
The right side of the Bowtie diagram maps to **Loss Magnitude (LM)** in FAIR.

*   **Bowtie Consequences**: These are the specific **Forms of Loss** (Productivity, Response, Replacement, Fines, Reputation, Competitive Advantage).
*   **Mitigative Barriers**: These reduce the impact. In FAIR terms, they are controls that lower **Loss Magnitude**.
    *   *Example:* Backups (Mitigative Barrier) reduce Productivity Loss (FAIR Form of Loss).

---

## 3. Barrier Classification Rules

Agents MUST classify barriers (controls) based on their position in this mapping:

1.  **Avoidance Control** (FAIR) = **Preventive Barrier** (Bowtie)
    *   *Function:* Reduces Threat Event Frequency (TEF).
    *   *Location:* Left of Top Event.

2.  **Vulnerability Control** (FAIR) = **Hardening / Detective Barrier** (Bowtie)
    *   *Function:* Reduces Vulnerability (likelihood of success given an attack).
    *   *Location:* Often integrated into the Asset or immediately preceding the Top Event.

3.  **Responsive/Containment Control** (FAIR) = **Mitigative/Recovery Barrier** (Bowtie)
    *   *Function:* Reduces Loss Magnitude (LM).
    *   *Location:* Right of Top Event.

## 4. Derived Metrics

*   **Residual Risk** (ALE) is calculated by traversing the Bowtie:
    *   `Tone` (Threats) mitigated by `Preventive Barriers` = `Likelihood of Top Event` (LEF).
    *   `Top Event` extending to `Consequences` mitigated by `Recovery Barriers` = `Total Impact` (LM).
    *   `LEF * LM = Risk`.
