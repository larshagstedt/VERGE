# FAIR Ontology - Deep Dive

This document details the **Factor Analysis of Information Risk (FAIR)** ontology. It complements the high-level mapping in `fair_to_bowtie.md`.

## 1. The Relationship Tree

Risk is derived from the interaction of frequency and magnitude.

### 1.1 Loss Event Frequency (LEF) Branch
LEF is the probable frequency, within a given timeframe, that a threat agent will inflict harm upon an asset.

*   **Threat Event Frequency (TEF):** How often do threats attempt to act?
    *   **Contact Frequency (CF):** How often does the threat come into contact with the asset?
    *   **Probability of Action (PoA):** Once in contact, does the threat act?
*   **Vulnerability (Vuln):** The probability that a threat event will succeed.
    *   **Threat Capability (TCap):** The level of force/skill the threat applies.
    *   **Resistance Strength (RS):** The difficulty of the defense (Control Strength).
    *   *Formula:* `Vuln = P(TCap > RS)`

### 1.2 Loss Magnitude (LM) Branch
LM is the tangible harm resulting from a Loss Event.

*   **Primary Loss:** Direct loss to the asset owner (e.g., replacement cost).
*   **Secondary Loss:** Fallout (Reputation, Legal, etc.).
    *   **Secondary Loss Event Frequency (SLEF):** How often does the primary loss trigger secondary stakeholders?
    *   **Secondary Loss Magnitude (SLM):** How much do they punish us?

## 2. Forms of Loss (Six Forms)
Agents MUST allow users to tag losses with these six categories (Source: FAIR Book):

1.  **Productivity Loss:** Reduced ability to produce goods/services.
2.  **Response Costs:** Expenses to manage the event (Incident Response).
3.  **Replacement Costs:** To replace/repair assets.
4.  **Fines & Judgments:** Legal penalties.
5.  **Competitive Advantage (CA) Loss:** Missed opportunities / IP theft.
6.  **Reputation Damage:** External stakeholders stop doing business.

## 3. Data Collection: Estimates
FAIR relies on "Calibrated Estimates" - ranges, not points.
*   **PERTS Distributions:** Min / Most Likely / Max.
*   **Confidence Level:** Standard is 90% confidence (BetaPERT).

## 4. Agent Instructions
*   When calculating Risk, you MUST use the chain `TEF -> Vuln -> LEF -> LM -> Risk`.
*   Do NOT shortcuts this logic (e.g., estimating "Risk" directly as "High/Medium/Low" without factors is forbidden).
