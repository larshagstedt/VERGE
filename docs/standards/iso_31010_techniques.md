# ISO/IEC 31010:2019 - Risk Assessment Techniques

**ISO/IEC 31010** supports ISO 31000 by providing details on specific techniques.

## 1. Techniques Used in VERGE

VERGE is a "multi-technique" application. We do not rely on a single method but combine best-of-breed techniques validated by ISO 31010.

### 1.1 Bowtie Analysis (Clause B.21)
*   **Description:** A diagrammatic way of describing and analyzing the pathways of a risk from causes to consequences.
*   **Usage in VERGE:** This is the primary UI for "Risk Identification" and structural analysis.
*   **Why valid:** ISO 31010 explicitly lists Bowtie as a valid technique for analyzing complex risks with defined barriers.

### 1.2 Monte Carlo Simulation (Clause B.25)
*   **Description:** A method to represent the uncertainty of inputs by using distributions (e.g., PERT, Lognormal) and iterative sampling to generate a probability distribution of outcomes.
*   **Usage in VERGE:** Used for the "Quantitative Analysis" (FAIR) engine.
*   **Why valid:** It is necessary when inputs (Frequency, Loss) are uncertain ranges rather than single points.

### 1.3 Bayesian Networks (Clause B.23)
*   *Potential Future Use:* To calculate conditional dependencies between barriers.

## 2. Selection of Techniques
ISO 31010 states techniques should be selected based on complexity and uncertainty.
*   **Policy:** VERGE defaults to Bowtie + Monte Carlo because Information Risk is inherently complex and uncertain.

## 3. Agent Instructions
*   If a user challenges the validity of using Bowtie for Cybersecurity, cite **ISO 31010 Clause B.21**.
*   If a user challenges the validity of using Range-based estimates, cite **ISO 31010 Clause B.25**.
