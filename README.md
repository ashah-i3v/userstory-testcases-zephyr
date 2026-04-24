# userstory-testcases-zephyr

## Purpose
This skill supports an end-to-end workflow for:
- creating or improving business-ready user stories
- gating Jira changes behind explicit approval
- generating Zephyr-ready test cases with traceability
- gating Zephyr publication behind explicit approval
- generating internal and/or external documentation when requested

It is designed to keep outputs BA/PO-friendly while grounding requirements in verified codebase behavior.

## What This Skill Covers
- Story creation and story refinement
- Jira context inspection through Atlassian MCP (read-only)
- Zephyr test generation and publish workflow
- Documentation generation as a separate deliverable
- Mandatory preflight checks and failure codes
- Structured execution logging

## Operation Modes
- Mode 1: Create a new story
  - Jira project key confirmation is required before proceeding.
- Mode 2: Improve an existing Jira story
  - Atlassian MCP readiness is required.
- Mode 3: Generate test cases and publish to Zephyr
  - Atlassian MCP and Zephyr MCP readiness are required.
  - The Excel template format must be valid before test generation.
- Mode 4: Generate help documentation
  - Requires sufficient feature context or a Jira issue key.
  - When Jira context is used, Atlassian MCP readiness is required.

## Approval Gates (Exact Tokens)
Use these tokens exactly as written:
- APPROVED_FOR_JIRA_UPDATE
- APPROVED_FOR_ZEPHYR_PUBLISH
- CHANGES_REQUIRED: <comments>

Tokens are case-sensitive.

## Required Inputs
- Operation mode: 1, 2, 3, or 4
- Story source:
  - Jira issue key, or
  - raw user story text
- Optional context:
  - priority/risk
  - module/feature name
  - environment constraints
  - sprint/release context
  - documentation audience: internal, external, or both

Mode 3 additionally requires the canonical Zephyr import template:
- .github/skills/userstory-testcases-zephyr/templates/atm-exporter.xlsx

## Quick Start
Use one of the following prompts as-is, then provide any requested missing context.

### Mode 1: Create A New Story
```text
Create a new user story for [feature description]
```

### Mode 2: Improve An Existing Jira Story
```text
Improve user story ELT-123
```
```text
Review and improve this user story: [paste story text]
```

### Mode 3: Generate Zephyr Tests And Publish
```text
Create test cases for ELT-123 and publish to Zephyr
```
```text
Generate Zephyr test cases for user story: [paste story text]
```

### Mode 4: Generate Help Documentation
```text
Generate help document for [feature name]
```
```text
Create internal and external help documentation for [feature name]
```
```text
Generate help document for ELT-123
```

## Workflow Summary
1. Preflight checks
2. Mode routing
3. Read/normalize/enrich from codebase (and Jira when applicable)
4. Story quality review
5. Story improvement proposal
6. Jira review gate
7. Jira update step (manual payload if MCP is read-only)
8. Test case generation (mode 3)
9. Zephyr review gate (mode 3)
10. Zephyr publish (mode 3)

## Required Output Order
The skill output must preserve this section order:
1. Preflight Check Result
2. Operation Mode
3. User Story
4. Story Improvement Proposal
5. Documentation Output
6. Jira Review Request
7. Jira Approval Status
8. Jira Update Result
9. Test Cases
10. Coverage and Gaps
11. Zephyr Review Request
12. Zephyr Approval Status
13. Zephyr Publish Result
14. Execution Log

Mode-specific sections may be omitted only when not applicable.

## Execution Log Standard
Each response must include an execution log entry format:
- [timestamp] [stage] action -> outcome

Example:
- [2026-03-23T15:12:05Z] [Story Review] Parsed user story -> Completed

## Safety and Quality Rules
- Do not invent business requirements.
- Do not write to Jira before Jira approval.
- Do not publish to Zephyr before Zephyr approval.
- Do not bypass MCP readiness for required modes.
- Acceptance criteria must be testable and written in Given/When/Then form.
- Cover positive, negative, boundary, and integration/failure scenarios where relevant.
- Preserve traceability from test cases to acceptance criteria.

## Included References
- Core behavior and policy: SKILL.md
- Story structure: references/story-format.md
- Documentation format: references/documentation-format.md
- Zephyr Excel format: references/excel-template-format.md
- Atlassian MCP setup: references/installation-atlassian.md
- Zephyr MCP setup: references/installation-zephyr.md
- Review template: templates/review-request.md

## Recommended Usage
- Start with mode selection and source input.
- Run preflight before any story/Jira/Zephyr action.
- Use approval gates to control external write steps.
- Keep documentation output separate from story output.
- Always include execution logs for traceability.
