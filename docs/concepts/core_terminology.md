# Core Terminology and Definitions

The following definitions are **normative** for the VERGE application. They are derived principally from **ISO/IEC 27000** and **FAIR (O-RT)**.

Where standards differ, VERGE adopts the **FAIR** definition for quantitative precision, nested within the **ISO 27005** process structure.

---

## 1. Primary Entities

### Asset
**Definition:** Anything that has value to the organization and needs protection.
*   **Source:** ISO/IEC 27000:2018
*   **VERGE Specific:** Assets must support "taggability" and hierarchical ownership. In FAIR terms, an asset is the object upon which a Threat acts.

### Risk
**Definition:** The probable frequency and probable magnitude of future loss.
*   **Source:** FAIR
*   **Contrast:** ISO defines risk as "effect of uncertainty on objectives." We use the FAIR definition because it is computable (`Frequency * Magnitude`).

### Threat (Threat Agent / Risk Source)
**Definition:** Anything (e.g., object, substance, human) that is capable of acting against an asset in a manner that can result in harm.
*   **Key Attribute:** Must be capable of applying a force (Intentional or Accidental).
*   **Role in Bowtie:** Appears on the far Left side.

### Vulnerability
**Definition:** The probability that a Threat Event will become a Loss Event.
*   **Source:** FAIR
*   **Formula:** `Vulnerability = P(Threat Capability > Resistance Strength)`
*   **Note:** It is a probability percentage (0% - 100%), not a "weakness" in the abstract sense.

---

## 2. Process Concepts

### Threat Event
**Definition:** An occurrence where a Threat Agent acts against an Asset.
*   **State:** This is an "attempt." It does not necessarily result in loss (blockable by defenses).

### Loss Event (Top Event)
**Definition:** The specific point in time when the Threat Agent's action succeeds in compromising the Asset.
*   **Bowtie Logical Equivalent:** Top Event.
*   **Note:** This splits the timeline between "Pre-incident" (Left) and "Post-incident" (Right).

### Control (Barrier)
**Definition:** A measure that is modifying risk.
*   **Source:** ISO Guide 73 / ISO 31000
*   **Types:**
    *   **Preventive:** Modifies the frequency of the Threat Event.
    *   **Detective:** Identifies the event (enables response).
    *   **Corrective:** Modifies the magnitude of the consequences.

---

## 3. Quantitative Metrics

### LEF (Loss Event Frequency)
The probable frequency, within a given timeframe (e.g., 1 year), that a Threat Agent will inflict harm upon an Asset.

### PLM (Primary Loss Magnitude)
The direct financial loss resulting immediately from the Loss Event (e.g., value of the stolen asset).

### SLM (Secondary Loss Magnitude)
The fallout losses (e.g., Reputation, Fines) dealing with external stakeholders.

### ALE (Annualized Loss Exposure)
The complete derived risk metric.
*   `ALE = LEF * (PLM + SLM)` (Simplified)
*   *Note:* In Monte Carlo simulations, this is a distribution, not a single number.
