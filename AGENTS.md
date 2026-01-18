# AGENTS.md – Authoritative Instructions for AI Agents

This repository contains a risk analysis application whose **core design, logic, and data model are governed by authoritative risk management standards**.

AI agents (including Antigravity, Cursor, Copilot, Codex, etc.) MUST follow the rules below when reasoning about or modifying this codebase.

---

## 1. Normative Source of Truth

The directory `/docs/` in the repository root contains **authoritative and normative source material**.

These documents MUST be consulted and respected for **all design decisions**, including but not limited to:

- Domain concepts and terminology
- Risk semantics
- Process flow and state transitions
- Entity relationships and constraints
- Analytical rules and invariants

> **IMPORTANT:**  
> `/docs/` is not background material.  
> It is the *primary authority* for how the application is designed and behaves.

---

## 2. Standards Hierarchy (Design Authority)

The following standards are treated as **normative**, in descending order of authority:

1. **ISO/IEC 27005** (Process Lifecycle)
2. **FAIR (O-RT)** (Quantitative Logic)
3. **Bowtie Method** (Visual/Structural Logic)

- `/docs/standards/iso_27001_relevance.md` (ISMS Governance)
- `/docs/standards/iso_27005_details.md` (Risk Management Process)
- `/docs/standards/iso_31000_principles.md` (Risk Principles)
- `/docs/standards/iso_31010_techniques.md` (Bowtie, Monte Carlo)
- `/docs/standards/fair_deep_dive.md` (FAIR Ontology)
- `/docs/standards/cis_ram_integration.md` (Reasonableness & Duty of Care)
- `/docs/standards/mitre_cja_methodology.md` (Crown Jewel Analysis)
- `/docs/concepts/rosi_calculation.md` (Return on Investment)
- Relevant mappings in `/docs/mappings/fair_to_bowtie.md`

---

## 3. Required Agent Behavior

When making design or implementation decisions, AI agents MUST:

1. **Explicitly align decisions with documented concepts.**
2. **Preserve controlled vocabulary** as defined in `/docs/concepts/core_terminology.md`.
3. **Respect strict constraints**, such as:
   - Every Threat Event is tied to a Risk Source and an Asset.
   - Every Loss Event is anchored to an Asset.
   - Barriers affect either frequency or magnitude (or both).
4. **Ask for Clarification** regarding *business logic* or *ambiguities* in the standards.
   - Do NOT assume intended behavior if it contradicts or is absent from `/docs/`.
   - Do NOT ask for clarification on purely technical implementation details (e.g., "React vs Vue", "CSS grid vs flex") unless specified otherwise.

If a proposed change conflicts with `/docs/`, the agent MUST:
- Flag the conflict.
- Explain the deviation.
- Prefer standards compliance over code elegance.

---

## 4. Scope of Agent Creativity

AI agents are encouraged to be creative ONLY in:

- GUI layout and presentation
- Visualization techniques
- UX ergonomics
- Non-semantic styling or refactoring

AI agents MUST NOT:
- Invent new risk concepts.
- Rename domain entities arbitrarily.
- Alter process flow semantics.
- Weaken analytical constraints.

---

## 5. Reading Strategy & Capability Checks

Before implementing or modifying core logic, agents SHOULD:

1. **Capability Check:** Verify that referenced documentation files actually exist before quoting them. Do not hallucinate content.
2. **Review Core Docs:**
   - `/docs/concepts/core_terminology.md`
   - `/docs/process/risk_assessment_workflow.md`
   - `/docs/mappings/fair_to_bowtie.md`
3. **Fall back to PDFs:** If a concept is not in the markdown summaries, check the PDF standards in `/docs/` (ISO, FAIR) if your capabilities allow, or ask the user.

Failure to do so is considered a defect in agent behavior.

---

## 6. Guiding Principle

> This application is **standards-driven, not framework-driven**.  
> Code exists to serve risk theory — not the other way around.