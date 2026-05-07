# 🧪 Mode 3: Generate Zephyr Tests And Publish

> **Purpose:** Generate Zephyr-ready test cases from approved story and publish. **ALWAYS** completes full flow.
>
> **Prerequisites:** Story source (Jira key or text), Zephyr MCP, and atm-exporter.xlsx template.
>
> **Approval Gate:** `APPROVED_FOR_ZEPHYR_PUBLISH` (tests only).

---

## 🎯 When To Use Mode 3

- Have story content (from Jira or as text)
- Need to turn story into traceable Zephyr test cases
- Need Zephyr-ready test data in Excel format
- Full workflow required: tests → Zephyr gate → publish

> **Important:** Mode 3 **ALWAYS** executes the complete flow. Whether you say "generate" or "generate and publish", the full sequence runs: generate → review → publish.

---

## 💬 Trigger Phrases

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

```text
Mode 3: Generate Zephyr test cases for CI-317
        (Will always: generate tests → request approval → publish to Zephyr)
```

---

## 📥 Required Inputs

| Input | Required? | Notes |
| --- | --- | --- |
| Story source | ✅ Yes | Jira issue key **or** raw story text |
| Feature / module name | Optional | Strongly recommended for output file naming |
| Priority / risk | Optional | Helps refine test depth and coverage |
| Zephyr template file | ✅ Yes | `atm-exporter.xlsx` is the canonical import format |

---

## 🛡️ Preflight Checks (Mode 3)

Run preflight before test generation:

| # | Check | Notes |
| --- | --- | --- |
| 1 | Validate story source provided | Jira key **or** story text |
| 2 | Complete Zephyr MCP Readiness Sequence | See [shared/preflight.md](../shared/preflight.md) |
| 3 | Validate `atm-exporter.xlsx` is available | Must be readable and structure-mappable |
| 4 | Confirm feature name for output file naming | Ask if not provided |
| 5 | Complete Atlassian MCP Readiness Sequence (optional) | Only if Jira key provided for story fetch |

**Reference:** See [shared/preflight.md](../shared/preflight.md) for MCP readiness sequences and anti-rationalization tables.

---

## 🔧 External Dependencies

### Atlassian MCP Server (Optional)

**See:** [references/installation-atlassian.md](../references/installation-atlassian.md) for complete setup.

| Property | Value |
| --- | --- |
| Required for | Mode 3 (only when Jira key provided for story fetch) |
| Purpose | Read-only access to Jira for fetching approved story content |
| Available Tools | `getJiraIssue`, `searchJiraIssues` |
| **Note** | Not required if story text is provided directly |

### Zephyr MCP Server

**See:** [references/installation-zephyr.md](../references/installation-zephyr.md) for complete setup.

| Property | Value |
| --- | --- |
| Server | `jira-zephyr-mcp` |
| Source | https://github.com/leorosignoli/jira-zephyr-mcp |
| Required for | Mode 3 (mandatory) |
| Purpose | Manage Zephyr test plans, cycles, and test publication |
| Prerequisites | Node.js 18+, Jira API token, Zephyr API token |

---

## 🧪 Zephyr Excel Import Format

**See:** [references/excel-template-format.md](../references/excel-template-format.md) for complete requirements.

| Property | Value |
| --- | --- |
| Template file | `.github/skills/userstory-testcases-zephyr/templates/atm-exporter.xlsx` |
| Worksheet | `Sheet0` with header row 1 |
| Required columns | 18 in exact order (Key, Name, Status, Precondition, Objective, …) |
| Test categories | Positive, negative, boundary, integration/failure |
| Traceability | Map every test case to one or more acceptance criteria |

---

## 🔄 Workflow (Mode 3)

```Parse → 3. Generate → 4. Review → 5. Publish
   Checks        Story      Tests        Gate       Zephyr
```

> **Critical:** Mode 3 is **atomic and complete**. All five steps always execute. There is no "generate only" outcome.

---

### 1️⃣ Preflight Checks

- Validate story source (Jira key or text)
- Run Zephyr MCP Readiness Sequence
- Validate `atm-exporter.xlsx` template availability
- Confirm feature name for output file
- Run Atlassian MCP Readiness Sequence (only if Jira key provided)
- Log preflight results

**Exit Criteria:** All checks pass, or stop with explicit failure code.

---

### 2️⃣ Parse Story

- If Jira key provided: fetch story using `getJiraIssue`
- If story text provided: use as-is for test generation
- Extract acceptance criteria for traceability mapping (if present)
- Log story parsing results

**Exit Criteria:** Story content acquired and ready for test generation.

---

### 3
### 4️⃣ Generate Test Cases

**Mode 3 Requirement:** This step is ALWAYS executed. Regardless of whether the user says "generate" or "generate and publish", test case generation proceeds immediately and automatically continues to step 5️⃣ (Zephyr Review Gate).

**MANDATORY EXCEL FILE GENERATION:**

1. ✅ **MUST use `create_file` tool** to generate an actual Excel file (`.xlsx` format)
2. ✅ **MUST read template file** `.github/skills/userstory-testcases-zephyr/templates/atm-exporter.xlsx` to understand exact structure
3. ✅ **MUST preserve exact column order and sheet structure** from template
4. ✅ **MUST create file at:** `.github/skills/userstory-testcases-zephyr/output/test-cases-[feature-name]-[timestamp].xlsx`
5. ❌ **DO NOT present test cases in markdown/text format only** — Excel file generation is mandatory
6. ❌ **DO NOT deviate from template structure** — column order, headers, and sheet name must match exactly

**Test Case Coverage Requirements:**4

Include: positive, negative, boundary, and integration/failure scenarios.

Required fields per test case (must match template exactly):

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

**Format Compliance:**
- Output MUST be aligned to `atm-exporter.xlsx` template — publishable to Zephyr without manual reformatting
- All 18 required columns must be present in exact order
- Worksheet must be named `Sheet0` with header row 1

**After Excel file generation is complete, proceed immediately to step 5️⃣ for review.**

**Exit Criteria:** 
- Excel file created at output path
- Template structure preserved exactly
- Test cases cover positive, negative, boundary, and integration scenarios
- Ready for review presentation with file path provided

---

### 5️⃣ Zephyr Review Gate
4️⃣ for review.**

**Exit Criteria:** 
- Excel file created at output path
- Template structure preserved exactly
- Test cases cover positive, negative, boundary, and integration scenarios
- Ready for review presentation with file path provided

---

### 4not proceed to step 6️⃣ (Zephyr Publish) until `APPROVED_FOR_ZEPHYR_PUBLISH` token is provided.**

**Exit Criteria:** `APPROVED_FOR_ZEPHYR_PUBLISH` token received, or workflow stops in pending review state.

---

### 6️⃣ Zephyr Publish

**Mode 3 Requirement:** Publish execution is MANDATORY after Zephyr approval is granted. There is no "approval only" state in Mode 3.

- Publish only after Zephyr approval (`APPROVED_FOR_ZEPHYR_PUBLISH`) is received
- Preserve traceability between test cases and acceptance criteria
- Return a summary of cre5️⃣ (Zephyr Publish) until `APPROVED_FOR_ZEPHYR_PUBLISH` token is provided.**

**Exit Criteria:** `APPROVED_FOR_ZEPHYR_PUBLISH` token received, or workflow stops in pending review state.

---

### 5

## ✅ Quality Standards (Mode 3)

### Zephyr Test Case Quality Standards

| Standard | Requirement |
| --- | --- |
| File Generation | **MANDATORY** — Must create Excel file using `create_file` tool |
| Template Fidelity | Exact column order, sheet structure, and naming from `atm-exporter.xlsx` |
| Output Path | `.github/skills/userstory-testcases-zephyr/output/test-cases-[feature-name]-[timestamp].xlsx` |
| Test Coverage | Positive, negative, boundary, and integration/failure scenarios |
| Traceability | Every test case linked to one or more acceptance criteria |
| Format Compliance | Publishable to Zephyr without manual reformatting |
| Test Steps | Executable without interpretation |
| Negative Coverage | Required for high-risk requirements |

---

## 🚫 Safety Rules (Mode 3)

- ❌ **Do NOT generate test cases and stop without requesting Zephyr review** — test case generation ALWAYS continues to approval gate
- ❌ **Do NOT request approval only and skip publishing** — Mode 3 always completes with published test cases in Zephyr
- ❌ **Do NOT allow partial execution of Mode 3** — whether user says "generate" or "generate and publish", the complete flow is mandatory: generate → review → publish
- ❌ **Do NOT present test cases without creating the Excel file first** — file generation using `create_file` tool is mandatory
- ❌ **Do NOT deviate from template structure** — `atm-exporter.xlsx` format must be preserved exactly
- ❌ **Do NOT generate test cases in markdown/text only** — Excel file must always be created
- ❌ Do not stop at test case generation and wait for a separate "publish" command — Zephyr review gate comes immediately after generation
- ❌ If user provides `APPROVED_FOR_ZEPHYR_PUBLISH`, proceed immediately to publish without further prompts
- ❌ Do not ask "Would you like me to publish now?" — publishing is automatic after approval
- ❌ Do not proceed without Zephyr MCP readiness confirmation
- ❌ Do not publish to Zephyr before `APPROVED_FOR_ZEPHYR_PUBLISH`

---

## 📋 Output Order (Mode 3)

Present sections in this order:

1. **Preflight Check Result**
2. **Operation Mode** (Mode 3: Generate and Publish Zephyr Tests)
3. **Story Summary** (from Jira or provided text)
4. **Test Cases** (with Excel file path)
5. **Coverage and Gaps**
6. **Zephyr Review Request**
7. **Zephyr Approval Status**
8. **Zephyr Publish Result**
9. **Execution Log**

---

## ⚠️ Failure Handling (Mode 3)

- If no story source provided: stop with `PRECONDITION_FAILED`
- If Atlassian MCP unavailable (when Jira key provided): stop with `ATLASSIAN_MCP_NOT_INSTALLED` or `MCP_SESSION_RESTART_REQUIRED`
- If Zephyr MCP unavailable: stop with `MCP_INSTALL_FAILED`, `MCP_START_FAILED`, or `MCP_SESSION_RESTART_REQUIRED`
- If template file invalid: stop with `ZEPHYR_TEMPLATE_INVALID`
- If Zephyr publication fails: report case-level failures and retain the manual upload payload