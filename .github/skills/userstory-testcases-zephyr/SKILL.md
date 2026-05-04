---
name: userstory-testcases-zephyr
description: "Use when a user story must be created or improved, reviewed before Jira update, converted into Zephyr test cases, and reviewed again before Zephyr publish. Supports Atlassian MCP Server (read-only), Zephyr MCP setup, gated approvals, BA/PO-friendly story output, and separate internal or external documentation generation."
---

# 🚀 User Story & Zephyr Test Management

Manage the complete lifecycle of user stories: from scratch creation through Jira, Zephyr test publication, and audience-specific user documentation — with approval gates at every stage.

> **Built for:** BA/PO-ready user stories, review-gated Jira updates, Zephyr publication, and format-validated end-user documentation.
>
> `Mode 1` Create Story  ·  `Mode 2` Improve Story  ·  `Mode 3` Generate Tests  ·  `Mode 4` Generate Docs
>
> **Approval gates:** `APPROVED_FOR_JIRA_UPDATE`  ·  `APPROVED_FOR_ZEPHYR_PUBLISH`  ·  `CHANGES_REQUIRED: <comments>`

---

## ✨ What This Skill Does

| Capability | Mode | What It Does |
| --- | --- | --- |
| 📖 Create Story | 1 | Build a 6-section story grounded in codebase context |
| 🔍 Improve Story | 2 | Enrich an existing Jira story with validators, edge cases, errors |
| 🧪 Generate & Publish Tests | 3 | **ALWAYS** creates test cases, requests approval, and publishes to Zephyr (no partial execution) |
| 📚 Generate Documentation | 4 | Format-validated internal and external user guides saved to `docs/` |

### 🧭 Quick Reference

```text
┌─────────┬───────────────────────────────┬───────────────────────────────┐
│ Mode    │ Primary Outcome               │ Approval Gate                 │
├─────────┼───────────────────────────────┼───────────────────────────────┤
│ 1       │ New 6-section story           │ Jira gate before create/update│
│ 2       │ Improved existing story       │ Jira gate before create/update│
│ 3       │ Story + Zephyr-ready tests    │ Jira gate + Zephyr gate       │
│ 4       │ Internal/external help docs   │ Format validation mandatory   │
└─────────┴───────────────────────────────┴───────────────────────────────┘
```

---

## 🎯 When To Use This Skill

| Use Case | Choose This Mode |
| --- | --- |
| Feature request needs a brand-new story | `Mode 1` |
| Existing Jira story is thin, vague, or missing validation detail | `Mode 2` |
| Approved story must be turned into traceable test cases | `Mode 3` |
| Feature needs internal or external user guidance in `docs/` | `Mode 4` |

> **Rule of thumb:** stories are written for BA/PO consumption, tests are written for Zephyr import, and documentation is written for end users.

---

## 💬 Trigger Phrases

### 1️⃣ Mode 1 — Create A New Story

```text
Create a new user story for [feature description]
```

> ⚠️ The skill must confirm the Jira project key before proceeding.

### 2️⃣ Mode 2 — Update An Existing Story

```text
Improve user story ELT-123
```
```text
Review and improve this user story: [paste story text]
```

### 3️⃣ Mode 3 — Generate Zephyr Tests And Publish (Always Complete)

**Important:** All Mode 3 requests follow the complete workflow: generate → review → publish. Whether you say "generate" or "generate and publish", the full flow is always executed.

```text
Generate Zephyr test cases for CI-317
```
```text
Create test cases for ELT-123 and publish to Zephyr
```
```text
Generate Zephyr test cases for user story: [paste story text]
```
```text
Generate tests for [feature name]
```

### 4️⃣ Mode 4 — Generate Help Document

```text
Generate help document for [feature name]
```
```text
Create internal and external help documentation for [feature name]
```
```text
Generate help document for ELT-123
```

### ⚡ Fast Start Prompts

```text
Mode 1: Create a new user story for lienholder signup with ELT ID
Mode 2: Improve user story MVS-2607 before Jira update
Mode 3: Generate Zephyr test cases for CI-317
        (Will always: generate tests → request approval → publish to Zephyr)
Mode 4: Create internal and external help docs for lienholder signup with ELT ID
```

---

## 🔴 Approval Tokens

Use the following tokens **exactly as written** — they are case-sensitive:

| Gate | Token | When |
| --- | --- | --- |
| Jira review | `APPROVED_FOR_JIRA_UPDATE` | After story review (Modes 1/2/3) |
| Zephyr publish | `APPROVED_FOR_ZEPHYR_PUBLISH` | After test review (Mode 3) |
| Request revision | `CHANGES_REQUIRED: <comments>` | Any mode, any stage |

> ❌ Never write to Jira or Zephyr before receiving the corresponding approval token.

### Jira Write Enforcement (Modes 1/2/3)

- Before receiving `APPROVED_FOR_JIRA_UPDATE`, only draft and review content is allowed.
- The agent must not invoke Jira write tools before approval, including:
  - `createJiraIssue`
  - `editJiraIssue`
  - `addCommentToJiraIssue`
- If approval token is missing, return a pending Jira review state and stop.

---

## ⚙️ Operating Modes

| Mode | Purpose | Atlassian MCP | Zephyr MCP |
| --- | --- | --- | --- |
| **1** — Create Story | Build new story from scratch | ❌ Not required | ❌ Not required |
| **2** — Update Story | Improve existing Jira story | ✅ Read-only | ❌ Not required |
| **3** — Zephyr Tests | Generate tests and publish | ✅ Read-only | ✅ Required |
| **4** — Documentation | Generate user docs with validation | ⚡ Conditional | ❌ Not required |

## 🎛️ Mode Selection Card

```text
Need a brand-new story?             ──▶  Mode 1
Need to strengthen an existing one? ──▶  Mode 2
Need Zephyr import-ready test data? ──▶  Mode 3
Need end-user documentation?        ──▶  Mode 4
```

---

## 📥 Required Inputs

| Input | Required? | Notes |
| --- | --- | --- |
| Operation mode | ✅ Yes | `1`, `2`, `3`, or `4` |
| Story source | ✅ Yes | Jira issue key **or** raw story text |
| Priority / risk | Optional | Helps refine scope and test depth |
| Feature / module name | Optional | Strongly recommended for Modes 3 and 4 |
| Environment constraints | Optional | Include release, sprint, policy, or dependency limits |
| Zephyr template file | Mode 3 | `atm-exporter.xlsx` is the canonical import format |
| Documentation audience | Mode 4 | `internal`, `external`, or `both` |
| Output naming inputs | Mode 4 | Module + feature name used for docs path generation |

### Mode 4️⃣ Input Rules

```text
Jira key provided?      Yes ──▶ Use Jira + codebase + existing docs
Jira key provided?      No  ──▶ Require feature name + module + enough functional detail
Codebase missing?       Yes ──▶ Stop; do not generate documentation from Jira alone
```

---

## 🔍 Codebase Context Requirements

Before writing or improving any story, inspect the codebase for domain context. Translate findings into business language.

### Inspect These Sources

| Source | Extract |
| --- | --- |
| API endpoints | Supported actions, inputs, and outcomes |
| Request and response DTOs | Business-relevant fields, optionality, and constraints |
| Domain entities and enums | Business concepts, states, and allowed values |
| Validators | Field-level rules, limits, and conditional constraints |
| Error models and problem details | Existing user-facing error outcomes |
| Existing help or support documentation | Current user guidance that may need revision |

### Rules For Using Codebase Context

| Rule | Expectation |
| --- | --- |
| Improve the story with evidence | Use findings to enrich ACs, validation, edge cases, and errors |
| Docs require code grounding | ❌ Never generate documentation from Jira alone |
| Zephyr requires strict template fidelity | Preserve sheet, columns, ordering, and field format exactly |
| Translate to business language | Prefer user outcomes over technical implementation terms |
| Hide implementation detail | ❌ No class names, method names, routes, DB terms, or HTTP mechanics |
| Surface uncertainty explicitly | Record assumptions when codebase coverage is incomplete |
| Keep an audit trail | Log each meaningful inspection in the Execution Log |

> **Critical translation rule:** extract from code, then rewrite for business readers. Do not paste engineering language straight into the story.

---

## 📖 Required Story Format

**See:** [Story Format Guide](references/story-format.md) for complete requirements.

Generate all **6 required sections**:

| # | Section | Contains |
| --- | --- | --- |
| 1 | **User Story** | Role, goal, benefit |
| 2 | **Description** | Context, scope, constraints, dependencies |
| 3 | **Acceptance Criteria** | Given/When/Then format, 3+ criteria, testable |
| 4 | **Validation Rules** | Field-level constraints grounded in codebase |
| 5 | **Edge Cases** | Boundary conditions, special scenarios |
| 6 | **Error Handling Scenarios** | User-facing error messages from code |

---

## 📚 Documentation Output — Mandatory Format

**See:** [Documentation Format Guide](references/documentation-format.md) for complete requirements.

When Mode 4 is invoked, ALL generated documentation **MUST** conform to the required format.

### Required Document Structure

```markdown
# [Feature Name] — [Internal User Guide | External User Guide]

## Overview
## When to Use This
## How to Access
## [Section Name]
### Field Guide
| Field | Description | Required? | Notes |
## Buttons
| Button | What It Does |
## Business Rules
```

### Audience Rules

| Rule | Internal 🏛️ | External 👤 |
| --- | --- | --- |
| Admin-only and back-office fields | ✅ Include | ❌ Exclude |
| Supervisor-level procedures | ✅ Include | ❌ Exclude |
| Operational notes and exceptions | ✅ Include | ❌ Exclude |
| Document Tracking section | ✅ Include | ❌ Exclude |
| Hidden fields (`SetDisabledFieldsForExternal`) | ✅ Include | ❌ Exclude |
| Carrier/external-user perspective | ✅ Include | ✅ Only this |

### Mandatory Compliance Checks

1. Heading must match: `# [Feature Name] — [Internal User Guide | External User Guide]`
2. All required sections present in correct order
3. Field Guide tables: exactly 4 columns (Field \| Description \| Required? \| Notes)
4. Buttons tables: exactly 2 columns (Button \| What It Does)
5. ❌ No embedded story content (User Story, Acceptance Criteria, Validation Rules, etc.)
6. Output path matches audience and module naming scheme
7. ❌ Do not generate if code context is insufficient or unavailable

---

## 🧪 Zephyr Excel Import Format (Mode 3)

**See:** [Excel Template Format Guide](references/excel-template-format.md) for complete requirements.

| Property | Value |
| --- | --- |
| Template file | `.github/skills/userstory-testcases-zephyr/templates/atm-exporter.xlsx` |
| Worksheet | `Sheet0` with header row 1 |
| Required columns | 18 in exact order (Key, Name, Status, Precondition, Objective, …) |
| Test categories | Positive, negative, boundary, integration/failure |
| Traceability | Map every test case to one or more acceptance criteria |


---

## 🔧 External Dependencies

### Atlassian MCP Server

**See:** [Atlassian MCP Installation Guide](references/installation-atlassian.md) for complete setup.

| Property | Value |
| --- | --- |
| Options | HTTP (Rovo — Recommended) or stdio (Local) |
| Required for | Modes 2, 3, and 4 (when Jira context needed) |
| Purpose | Read-only access to Jira for inspecting stories |
| HTTP Config | `{"type": "http", "url": "https://mcp.atlassian.com/v1/mcp"}` |
| stdio Config | `{"type": "stdio", "command": "npx", "args": ["-y", "@atlassianlabs/mcp-server-atlassian"]}` |
| Available Tools | `getJiraIssue`, `searchJiraIssues`, `listJiraProjects`, `getJiraProject` |

### Zephyr MCP Server

**See:** [Zephyr MCP Installation Guide](references/installation-zephyr.md) for complete setup.

| Property | Value |
| --- | --- |
| Server | `jira-zephyr-mcp` |
| Source | https://github.com/leorosignoli/jira-zephyr-mcp |
| Required for | Mode 3 only |
| Purpose | Manage Zephyr test plans, cycles, and test publication |
| Prerequisites | Node.js 18+, Jira API token, Zephyr API token |
| Config Location | `.vscode/mcp.json` with `JIRA_BASE_URL`, `JIRA_USERNAME`, `JIRA_API_TOKEN`, `ZEPHYR_API_TOKEN` |

---

## 🛡️ Preflight Policy

Run preflight before any story generation, Jira update, or Zephyr action.

> All preflight checks are **active**, not passive. Use terminal tool calls to verify. Do not assume any MCP server is available without executing the commands. Attempt the corrective action before returning a failure code.

```text
Preflight always runs first.

Mode 1 ──▶ Input validation + Jira project confirmation
Mode 2 ──▶ Atlassian MCP readiness
Mode 3 ──▶ Atlassian MCP + Zephyr MCP + template validation
Mode 4 ──▶ Audience inputs + code context + docs format validation
```

### Base Checks

| # | Check | Mode |
| --- | --- | --- |
| 1 | Validate the selected mode | All |
| 2 | Validate Jira issue key format when provided | All |
| 3 | Confirm Jira project key with user (do not proceed until confirmed) | 1 |
| 4 | Complete Atlassian MCP Server Readiness Sequence | 2 |
| 5 | Complete Atlassian MCP + Zephyr MCP Readiness Sequences | 3 |
| 6 | Validate `atm-exporter.xlsx` is available, readable, and mappable | 3 |
| 7 | Validate documentation audience and output naming inputs are present | 4 |
| 8 | Require Jira key or sufficient feature context | 4 |
| 9 | Complete Atlassian MCP Readiness Sequence if Jira key provided | 4 |
| 10 | Confirm code context is available; stop with `PRECONDITION_FAILED` if not | 4 |
| 11 | Run Documentation Format Validation Sequence after generation | 4 |
| 12 | If required MCP servers unavailable, stop with `MCP_SESSION_RESTART_REQUIRED` | 2/3/4 |
| 13 | Verify Jira approval token before any Jira write operation | 1/2/3 |

### 🔵 Atlassian MCP Server Readiness Sequence

> Stop immediately if any step fails. Do not attempt automatic installation or configuration.

```
Step 1          Step 2           Step 3          Step 4
[Verify         [Verify          [Verify Jira    [Confirm
 Installation]→  Read-Only]    →  Site Access] →  Readiness]
```

**Step 1️⃣ — Verify MCP Server Installation**

Check `.vscode/mcp.json` or user MCP config for an `atlassian` server entry with either:
- `"type": "http"` + URL `https://mcp.atlassian.com/v1/mcp` (Rovo), or
- `"type": "stdio"` + command `npx` + args containing `@atlassianlabs/mcp-server-atlassian`

Search for Atlassian MCP tools via `tool_search` with pattern `atlassian.*jira|jira.*issue`.

If tools are unavailable, instruct the user to:
1. Install Atlassian MCP (HTTP Rovo or `@atlassianlabs/mcp-server-atlassian`)
2. Add to VS Code MCP configuration
3. Configure OAuth for Jira with read-only scopes
4. For stdio: restrict to `"allow": ["get*", "fetch*", "search*", "list*"]`
5. Start a new chat session

Stop with `ATLASSIAN_MCP_NOT_INSTALLED`.

**Step 2️⃣ — Verify Read-Only Configuration**

| Config Type | Action |
| --- | --- |
| HTTP (Rovo) | Read-only enforced by OAuth scopes — no check needed |
| stdio | Verify write tools are disabled: `createJiraIssue`, `updateJiraIssue`, `addJiraComment`, etc. |

If write operations are available on stdio, instruct user to add:
```json
"allow": ["get*", "fetch*", "search*", "list*"],
"deny": ["create*", "update*", "delete*", "add*", "edit*"]
```
Stop with `ATLASSIAN_MCP_NOT_READONLY`.

**Step 3️⃣ — Verify Jira Site Access**

- Search for `atlassian|jira` MCP tools and attempt a read operation
- If unavailable or failing: verify OAuth is active, re-authenticate if needed
- Stop with `ATLASSIAN_MCP_CONNECTIVITY_FAILED`

**Step 4️⃣ — Confirm Readiness**

Record `[Atlassian MCP Server] Ready (Read-Only)` in the Execution Log.

### 🟢 Zephyr MCP Readiness Sequence

> Stop after attempting the corrective action for each step before returning a failure code.

```
Step 1       Step 2        Step 3       Step 4         Step 5
[Verify   →  [Verify    →  [Verify   →  [Verify     →  [Confirm
 Install]      Config]       Runtime]     Connectivity]   Readiness]
```

**Step 1️⃣ — Verify Installation**

- Run `node --version` — must be Node.js 18+
- Check that `jira-zephyr-mcp/dist/index.js` exists locally
- If missing, run:
  ```sh
  git clone https://github.com/leorosignoli/jira-zephyr-mcp.git
  cd jira-zephyr-mcp && npm install && npm run build
  ```
- Stop with `MCP_INSTALL_FAILED` if Node.js is absent or build fails

**Step 2️⃣ — Verify Configuration**

Check these locations in order for required values:
- `.env` in `jira-zephyr-mcp/`
- `.vscode/mcp.json`
- VS Code user settings under `github.copilot.mcp.servers`

Required values: `JIRA_BASE_URL`, `JIRA_USERNAME`, `JIRA_API_TOKEN`, `ZEPHYR_API_TOKEN`

- If any are missing, ask the user and write supplied values to `.env`
- If `jira-zephyr-mcp` entry is missing from MCP config, create it in `.vscode/mcp.json`
- Stop with `MCP_ENV_MISSING` if values remain missing after prompt

**Step 3️⃣ — Verify Runtime**

- Restart MCP servers if configuration changed
- Call a Zephyr MCP tool to check responsiveness
- If not running, start with `node dist/index.js` from `jira-zephyr-mcp/`
- If tools still unavailable in this session after start: stop with `MCP_SESSION_RESTART_REQUIRED`
- Stop with `MCP_START_FAILED` if server fails to start

**Step 4️⃣ — Verify Connectivity**

- Call a test operation (e.g., list test cycles for a known project)
- If authentication fails, ask user to verify tokens and retry once
- Stop with `MCP_AUTH_FAILED` if retry also fails

**Step 5️⃣ — Confirm Readiness**

Record `[Zephyr MCP] Ready` in the Execution Log.

### 📋 Documentation Format Validation Sequence (Mode 4 Only)

> Run after generating documentation and before presenting output to the user.

```
Step 1       Step 2        Step 3       Step 4         Step 5
[Verify   →  [Validate  →  [Validate →  [Validate   →  [Confirm
 Paths]        Structure]    Audience]    Sources]        Compliance]
```

**Step 1️⃣ — Verify Output Path Structure**

- Confirm `docs/` exists; create `docs/internal/` and/or `docs/external/` as needed
- Confirm module subfolder exists or create it
- Stop with `DOCS_PATH_CREATION_FAILED` if any path cannot be created

**Step 2️⃣ — Validate Document Structure**

For each generated file, verify:

| Check | Requirement |
| --- | --- |
| Heading (line 1) | `# [Feature Name] — [Internal User Guide \| External User Guide]` |
| Sections | Overview → When to Use → How to Access → [Feature Sections] → Business Rules |
| Field Guide tables | Exactly 4 columns: Field \| Description \| Required? \| Notes |
| Buttons tables | Exactly 2 columns: Button \| What It Does |
| No embedded story | ❌ No User Story, Acceptance Criteria, Validation Rules sections |

Stop with `DOCUMENTATION_FORMAT_VIOLATION` on any failure.

**Step 3️⃣ — Validate Audience Rules**

| Audience | Requirement |
| --- | --- |
| Internal | Admin-only fields, back-office procedures, operational notes included |
| External | Hidden fields, admin functions, internal-only procedures excluded; carrier-focused language |

Stop with `DOCUMENTATION_AUDIENCE_MISMATCH` on any violation.

**Step 4️⃣ — Validate Content Sources**

- Documentation must be grounded in actual codebase behavior
- Jira context is secondary only (scope/terminology, not overriding code)
- Stop with `DOCUMENTATION_SOURCE_INVALID` if Jira-only without code grounding

**Step 5️⃣ — Confirm Format Compliance**

Record `[Documentation Format] Validated — Ready for Output` in the Execution Log.

### ⛔ Preflight Failure Codes

| Code | Scope | Meaning |
| --- | --- | --- |
| `ATLASSIAN_MCP_NOT_INSTALLED` | 🔵 Atlassian MCP | Server not installed or unavailable in current session |
| `ATLASSIAN_MCP_NOT_READONLY` | 🔵 Atlassian MCP | Write permissions enabled — must be restricted to read-only |
| `ATLASSIAN_MCP_CONNECTIVITY_FAILED` | 🔵 Atlassian MCP | Cannot connect to Jira via MCP Server |
| `MCP_INSTALL_FAILED` | 🟢 Zephyr MCP | Could not be cloned, installed, or built |
| `MCP_ENV_MISSING` | 🟢 Zephyr MCP | One or more required environment values are missing |
| `MCP_START_FAILED` | 🟢 Zephyr MCP | Server failed to start |
| `MCP_AUTH_FAILED` | 🟢 Zephyr MCP | Authentication failed (Jira API or Zephyr API credentials invalid) |
| `MCP_SESSION_RESTART_REQUIRED` | 🔄 Session | MCP installed/configured — user must start a new chat session |
| `ZEPHYR_TEMPLATE_INVALID` | 🗂️ Zephyr Import | Template file missing, unreadable, or incompatible |
| `DOCS_PATH_CREATION_FAILED` | 📚 Documentation | `docs/` folder or subfolder could not be created (permission denied) |
| `DOCUMENTATION_FORMAT_VIOLATION` | 📚 Documentation | Document structure does not match required format |
| `DOCUMENTATION_AUDIENCE_MISMATCH` | 📚 Documentation | Content does not match requested audience rules |
| `DOCUMENTATION_SOURCE_INVALID` | 📚 Documentation | Documentation not grounded in codebase context |
| `PRECONDITION_FAILED` | ⚠️ General | Another preflight requirement failed |

> **Fail fast:** Do not continue to story work, Jira updates, or Zephyr actions until all required prerequisites are satisfied.

---

## 🔄 Workflow

```
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
│ 1.         │──▶│ 2.         │──▶│ 3.         │──▶│ 4.         │──▶│ 5.         │
│ Preflight  │   │ Mode       │   │ Codebase   │   │ Review     │   │ Propose    │
│ Checks     │   │ Routing    │   │ Enrichment │   │ Quality    │   │ Story      │
└────────────┘   └────────────┘   └────────────┘   └────────────┘   └────────────┘
                                                                                 │
                                                                                 ▼
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
│ 10.        │◀──│ 9.         │◀──│ 8.         │◀──│ 7.         │◀──│ 6.         │
│ Zephyr     │   │ Zephyr     │   │ Generate   │   │ Jira       │   │ Jira       │
│ Publish    │   │ Review     │   │ Test Cases │   │ Update     │   │ Review     │
└────────────┘   └────────────┘   └────────────┘   └────────────┘   └────────────┘
```

### 🧠 Workflow Intent

```text
Modes 1-2 focus on story quality.
Mode 3 extends the story into publishable tests.
Mode 4 branches into standalone user documentation.
```

### 1️⃣ Preflight

- Run all required checks with terminal tool calls and MCP tool calls
- For each failed check, execute the corrective action before returning a failure code
- Log every verification and corrective action outcome
- Stop with `MCP_SESSION_RESTART_REQUIRED` if MCP servers were started but tools are still unavailable

### 2️⃣ Mode Routing

| Mode | Action |
| --- | --- |
| 1 | Create new story after Jira project key is confirmed |
| 2 | Improve story and update Jira after approval |
| 3 | **COMPLETE FLOW:** Improve story → Jira approval → Generate test cases → Zephyr approval → Publish (all steps always executed) |
| 4 | Generate help documentation using code context and optional Jira context |

### 3️⃣ Read, Normalize, and Enrich From Codebase

- Extract role, goal, benefit, constraints, dependencies, and non-functional expectations
- Inspect endpoints, DTOs, validators, domain entities, and error models
- Inspect any existing help or release documentation for the feature
- If a Jira key is provided, read the issue after Atlassian MCP readiness is confirmed
- Use codebase findings to improve validation rules, edge cases, and error outcomes
- Translate technical findings into business language
- Log each relevant file or module inspected

### 4️⃣ Review Story Quality

Evaluate the draft for: clarity, completeness, testability, measurable acceptance criteria, edge and error path coverage, dependency visibility

### 5️⃣ Propose Story Improvements

Provide:
- Improved story using the required 6-section format
- Refined Given/When/Then acceptance criteria
- Validation rules, edge cases, and error scenarios grounded in codebase
- Assumptions and open questions
- Suggested Jira field updates

For Mode 4, also provide: audience, source context, target output paths, and generated documentation content

❌ Do not write to Jira at this stage.

### 6️⃣ Jira Review Gate

Present improved story for review. Accept only:

```
APPROVED_FOR_JIRA_UPDATE
CHANGES_REQUIRED: <comments>
```

If approval is not granted, stop with a pending Jira review state.

### 7️⃣ Jira Create/Update

- Create or update only after Jira approval is received
- Note: Atlassian MCP is read-only — Jira updates must be performed manually
- Provide complete update payload and a field-level summary of proposed changes

### 8️⃣ Generate Test Cases

**Mode 3 Requirement:** This step is ALWAYS executed for Mode 3. Regardless of whether the user says "generate" or "generate and publish", test case generation proceeds immediately and automatically continues to step 9️⃣ (Zephyr Review Gate).

For Mode 3 only, include: positive, negative, boundary, and integration/failure scenarios.

Required fields per test case:

| Field | Description |
| --- | --- |
| `TestCaseId` | Unique identifier |
| `Title` | Descriptive name |
| `Preconditions` | State required before the test |
| `Steps` | Numbered action steps |
| `ExpectedResult` | Observable outcome |
| `Priority` | High / Medium / Low |
| `Type` | Positive / Negative / Boundary / Integration |
| `AcceptanceCriteriaReference` | Linked AC |

Output must be aligned to `atm-exporter.xlsx` — publishable without reformatting.

**After generation is complete, proceed immediately to step 9️⃣ for review.**

### 9️⃣ Zephyr Review Gate

**Mode 3 Requirement:** For ALL Mode 3 requests, test cases MUST be reviewed and approved before publishing. This gate is mandatory and cannot be skipped.

Present: approved story summary, full test set, coverage map, and risks or gaps. Accept only:

```
APPROVED_FOR_ZEPHYR_PUBLISH
CHANGES_REQUIRED: <comments>
```

**Do not proceed to step 🔟 (Zephyr Publish) until `APPROVED_FOR_ZEPHYR_PUBLISH` token is provided.**

### 🔟 Zephyr Publish

**Mode 3 Requirement:** Publish execution is MANDATORY after Zephyr approval is granted. There is no "approval only" state in Mode 3.

- Publish only after Zephyr approval (`APPROVED_FOR_ZEPHYR_PUBLISH`) is received
- Preserve traceability between test cases and acceptance criteria
- Return a summary of created, updated, skipped, and failed items with destination identifiers

**All Mode 3 workflows conclude with published test cases in Zephyr. Generation without publishing is not a valid Mode 3 outcome.**

---

## 📋 Required Output Order

Every response presents sections in this order — omit sections not applicable to the selected mode:

| # | Section |
| --- | --- |
| 1 | Preflight Check Result |
| 2 | Operation Mode |
| 3 | User Story |
| 4 | Story Improvement Proposal |
| 5 | Documentation Output |
| 6 | Jira Review Request |
| 7 | Jira Approval Status |
| 8 | Jira Update Result |
| 9 | Test Cases |
| 10 | Coverage and Gaps |
| 11 | Zephyr Review Request |
| 12 | Zephyr Approval Status |
| 13 | Zephyr Publish Result |
| 14 | Execution Log |

---

## 📊 Logging Standard

Every response must include an **Execution Log** at the bottom.

> **⚠️ Logging is mandatory.** Work must stay visible while preflight, review gates, Jira preparation, and Zephyr preparation are happening.

### Log Prefixes

```text
 Prefix        Used For
 ───────────   ─────────────────────────────────────────────
 [Preflight]   Checks, readiness validation, corrective action
 [Mode]        Selected mode and routing decisions
 [Codebase]    Files, modules, validators, and docs inspected
 [Story]       Story drafting and improvement steps
 [Docs]        Documentation generation and validation steps
 [Jira Gate]   Approval wait states and token checks
 [Jira]        Jira update payload preparation or result
 [Zephyr]      Test generation and publish results
 [Execution]   General workflow checkpoints
```

**Format:** `[<timestamp>] [<stage>] <action> → <outcome>`

```
[2026-03-23T15:12:05Z] [Preflight]    Atlassian MCP readiness check → Ready (Read-Only)
[2026-03-23T15:12:07Z] [Codebase]     Inspected app/customer.go     → Extracted 4 validation rules
[2026-03-23T15:12:11Z] [Story Review] Parsed user story              → Completed
[2026-03-23T15:12:18Z] [Jira Gate]    Approval token check           → Blocked (Pending Jira Review)
```

Log: workflow stage, action performed, outcome, gate status changes, and all Jira/Zephyr write attempts.

---

## ✅ Quality Standards

| Standard | Requirement |
| --- | --- |
| Acceptance Criteria | Specific, measurable, verifiable, Given/When/Then format |
| Test Steps | Executable without interpretation |
| Negative Coverage | Required for high-risk requirements |
| Open Questions | Explicit and clearly marked |
| Story Sections | All 6 required: User Story, Description, AC, Validation Rules, Edge Cases, Errors |
| Business Language | No class names, method names, routes, or HTTP mechanics |
| Code Grounding | Codebase-derived details must be evidenced, not inferred |
| BA/PO Readability | Final story must be useful without technical translation |

### Documentation Quality Standards (Mode 4)

| Standard | Requirement |
| --- | --- |
| Format Compliance | Must pass Documentation Format Validation Sequence before output |
| Document Structure | Correct heading, required sections, exact column counts in tables |
| No Embedded Story | ❌ Never embed User Story, AC, Validation Rules into documentation files |
| Audience Adherence | Internal = all fields + admin; External = no hidden/admin fields |
| Code Grounding | Primary source is codebase; Jira used only for scope/terminology |
| Output Path | `docs/internal/[module]/[feature].md` or `docs/external/[module]/[feature].md` |
| User Language | Written for non-technical users performing daily tasks |

---

## 🚫 Safety Rules

- ❌ Do not invent business requirements
- ❌ Do not write to Jira before `APPROVED_FOR_JIRA_UPDATE`
- ❌ Do not publish to Zephyr before `APPROVED_FOR_ZEPHYR_PUBLISH`
- ❌ Do not proceed when prerequisites fail
- ❌ Do not bypass Atlassian MCP or Zephyr MCP readiness checks
- ❌ Do not use Atlassian MCP write operations — server must be read-only
- ❌ Do not invoke `createJiraIssue`, `editJiraIssue`, or `addCommentToJiraIssue` before Jira approval token is present in the current conversation

### Mode 3 Safety Rules (Zephyr Workflow)

- ❌ **Do NOT generate test cases and stop without requesting Zephyr review** — test case generation ALWAYS continues to approval gate
- ❌ **Do NOT request approval only and skip publishing** — Mode 3 always completes with published test cases in Zephyr
- ❌ **Do NOT allow partial execution of Mode 3** — whether user says "generate" or "generate and publish", the complete flow is mandatory: generate → review → publish
- ❌ Do not stop at test case generation and wait for a separate "publish" command — Zephyr review gate comes immediately after generation
- ❌ If user provides `APPROVED_FOR_ZEPHYR_PUBLISH`, proceed immediately to publish without further prompts
- ❌ Do not ask "Would you like me to publish now?" — publishing is automatic after approval

### Documentation Safety Rules (Mode 4)

- ❌ Do not generate documentation without confirmed, sufficient code context
- ❌ Do not generate documentation if Format Validation Sequence has not passed
- ❌ Do not present documentation without first validating against required format
- ❌ Do not embed story sections into documentation files
- ❌ Do not generate external docs without confirming hidden/admin-only fields are excluded
- ❌ Do not override observable code behavior with Jira text — call out discrepancies explicitly
- ❌ Do not save documentation files until format validation is complete
- ❌ Do not mix internal and external content in a single document

---

## ⚠️ Failure Handling

- If a Jira update fails: report the exact failure and retain the manual update payload
- If Zephyr publication fails: report case-level failures and retain the manual upload payload
- If user responds with `CHANGES_REQUIRED`: revise output and restart from the appropriate review gate

---

## 📄 Template Reference

Use the template file `templates/review-request.md`.
