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
| 2 | Verify Node.js 18+ installed | Run `node --version` |
| 3 | Verify `ZEPHYR_API_TOKEN` env var set | Check `$env:ZEPHYR_API_TOKEN` |
| 4 | Validate `atm-exporter.xlsx` is available | Must be readable and structure-mappable |
| 5 | Confirm feature name for output file naming | Ask if not provided |
| 6 | Complete Atlassian MCP Readiness Sequence (optional) | Only if Jira key provided for story fetch |

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

### Zephyr Publishing via Direct Script

**See:** [references/installation-zephyr.md](../references/installation-zephyr.md) for complete setup.

| Property | Value |
| --- | --- |
| Approach | Direct Zephyr Scale API v2 via Node.js scripts |
| Why not MCP | Remote MCP servers cannot access private Jira instances |
| Required for | Mode 3 (mandatory) |
| Purpose | Publish test cases with steps directly to Zephyr Scale |
| Prerequisites | Node.js 18+, Zephyr API token |

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

```
1. Preflight → 2. Parse → 3. Codebase → 4. Generate → 5. Review → 6. Publish
   Checks       Story      Enrichment    Tests        Gate       Zephyr
```

> **Critical:** Mode 3 is **atomic and complete**. All six steps always execute. There is no "generate only" outcome.

---

### 1️⃣ Preflight Checks

- Validate story source (Jira key or text)
- Verify Node.js 18+ installed
- Verify `ZEPHYR_API_TOKEN` environment variable is set
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

**Exit Criteria:** Story content acquired and ready for codebase enrichment.

---

### 3️⃣ Codebase Enrichment (Test-Focused)

**Purpose:** Inspect codebase to enrich test cases with code-grounded validation, edge cases, and error scenarios.

**What to Inspect:**

| Source | Extract for Test Cases |
| --- | --- |
| Validators | Field-level constraints for **boundary tests** (min/max, regex, length limits) |
| Error models and problem details | Actual error messages and codes for **error scenario tests** |
| Domain enums and states | Valid/invalid values for **negative tests** |
| API endpoints | Input validation rules for **positive and negative tests** |
| Request/response DTOs | Required vs optional fields, data types for **edge case tests** |
| Integration points | External dependencies, failure modes for **integration tests** |

**Rules for Using Codebase Context:**

| Rule | Expectation |
| --- | --- |
| Ground tests in code evidence | Use actual validators, not assumed constraints |
| Extract real error messages | Copy exact error text from code for expected results |
| Identify actual boundaries | Find min/max from validators, not from story |
| Surface missing coverage | Note where code has validators but story lacks acceptance criteria |
| Translate to test language | Convert technical constraints to user-facing test steps |
| Keep audit trail | Log each file inspected and what was extracted |

**Examples:**

**Before enrichment (story-only):**
```
Test: Submit form with invalid email
Expected: Error message displayed
```

**After enrichment (code-grounded):**
```
Test: Submit form with email "invalid@"
Expected: "Email must be a valid email address" (from EmailValidator.cs line 45)
Boundary: Max length 254 chars (from EmailAttribute maxLength)
```

**Exit Criteria:** 
- Validators inspected and constraints extracted
- Error models reviewed and messages documented
- Domain constraints identified for negative tests
- Integration points mapped for failure scenarios
- Codebase enrichment logged

---

### 4️⃣ Generate Test Cases

**Mode 3 Requirement:** This step is ALWAYS executed. Regardless of whether the user says "generate" or "generate and publish", test case generation proceeds immediately and automatically continues to step 5️⃣ (Zephyr Review Gate).

**Use Codebase Enrichment:** Apply findings from step 3️⃣ to generate code-grounded test cases:
- Use actual validator constraints for boundary tests
- Use actual error messages for expected results
- Use domain enums for negative test values
- Use integration points for failure scenario tests

**MANDATORY CSV FILE GENERATION (for review):**

> **Why CSV, not XLSX:** The `create_file` tool writes text content — it cannot produce a valid binary Excel file. A CSV with the same 18 Zephyr columns opens directly in Excel or Google Sheets for easy tabular review, and the same data is used for Zephyr MCP publish in step 6️⃣.

1. ✅ **MUST use `create_file` tool** to generate a CSV file
2. ✅ **MUST read** [references/excel-template-format.md](../references/excel-template-format.md) to get the exact 18-column order
3. ✅ **MUST include all 18 columns as the header row**, in exact order from the template
4. ✅ **MUST create file at:** `.github/skills/userstory-testcases-zephyr/output/test-cases-[feature-name]-[YYYYMMDD].csv`
5. ✅ **MUST present a human-readable summary table** (markdown) alongside the CSV path so the user can review inline without opening a file
6. ❌ **DO NOT name the file `.xlsx`** — it would not be a valid Excel file
7. ❌ **DO NOT deviate from the 18-column header order** — it must match `atm-exporter.xlsx` so the CSV can be manually imported if needed

**Test Case Coverage Requirements:**

Include: positive, negative, boundary, and integration/failure scenarios **grounded in codebase findings from step 3️⃣**.

Required fields per test case (must match template exactly):

| Field | Description | Code-Grounding |
| --- | --- | --- |
| `TestCaseId` | Unique identifier | N/A |
| `Title` | Descriptive name | Use actual feature/field names from code |
| `Preconditions` | State required before the test | Reference actual system states from domain enums |
| `Steps` | Numbered action steps | Use actual field names and constraints from DTOs |
| `ExpectedResult` | Observable outcome | **Use exact error messages from code** |
| `Priority` | High / Medium / Low | Based on validator criticality (required fields = High) |
| `Type` | Positive / Negative / Boundary / Integration | Boundary tests use actual min/max from validators |
| `AcceptanceCriteriaReference` | Linked AC | Map to story AC + note code-grounded additions |

**Format Compliance:**
- CSV header row MUST contain all 18 columns in exact order from `atm-exporter.xlsx` template
- Each test case is one row; multi-step tests use one row per step with repeated `Key` and `Name`
- Enclose values containing commas in double quotes
- Present a markdown summary table alongside the CSV for inline review

**After CSV file generation is complete, proceed immediately to step 5️⃣ for review.**

**Exit Criteria:**
- CSV file created at output path
- All 18 columns present in exact order
- Inline markdown summary table presented for review
- Test cases cover positive, negative, boundary, and integration scenarios
- File path reported to user

---

### 5️⃣ Zephyr Review Gate

**Mandatory Step:** After test case CSV generation completes in step 4️⃣, present the generated test cases for Zephyr approval.

**Present to User:**
- Path to generated CSV file
- Inline markdown summary table showing all test cases
- Test coverage summary (positive, negative, boundary, integration)
- Request explicit approval token: `APPROVED_FOR_ZEPHYR_PUBLISH`

**Important:** Do not proceed to step 6️⃣ (Zephyr Publish) until `APPROVED_FOR_ZEPHYR_PUBLISH` token is provided.

**Exit Criteria:** `APPROVED_FOR_ZEPHYR_PUBLISH` token received, or workflow stops in pending review state.

---

### 6️⃣ Zephyr Publish

**Mode 3 Requirement:** Publish execution is MANDATORY after Zephyr approval is granted. There is no "approval only" state in Mode 3.

**Implementation:** Use direct Zephyr Scale API v2 via Node.js terminal commands.

**Process:**
1. Read the generated CSV file from `.github/skills/userstory-testcases-zephyr/output/`
2. Use `run_in_terminal` to execute Node.js script with Zephyr client
3. Script parses CSV, creates test cases via API, and links to Jira issue
4. Report results with created test case keys

**Terminal Command Pattern:**

```javascript
const fs = require('fs');
const { createZephyrClient } = require('./.github/skills/userstory-testcases-zephyr/lib/zephyr-client');
const { parseCSV } = require('./.github/skills/userstory-testcases-zephyr/lib/csv-parser');

// Read CSV
const csvPath = '.github/skills/userstory-testcases-zephyr/output/test-cases-gl-post-continue-fix-20260728.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const testCases = parseCSV(csvContent);

// Create client (project key auto-extracted from issue key)
const client = createZephyrClient(process.env.ZEPHYR_API_TOKEN);

// Publish all tests
const results = await client.createMultipleTestCases(testCases, 'MVS-3370');

// Report results
console.log(`\n✅ Published ${results.filter(r => r.success).length} test cases`);
results.forEach(r => {
  if (r.success) {
    console.log(`  ✅ ${r.originalKey} → ${r.testCaseKey}`);
  } else {
    console.log(`  ❌ ${r.originalKey}: ${r.error}`);
  }
});
```

**Or use convenience script:**

```powershell
cd .github/skills/userstory-testcases-zephyr
node scripts/publish-to-zephyr.js ./output/test-cases-gl-post-continue-fix-20260728.csv MVS-3370
```

**Required Environment Variable:**
- `ZEPHYR_API_TOKEN` - Bearer token from Zephyr Scale

**Exit Criteria:**
- All test cases created in Zephyr with assigned keys
- All test steps persisted (verified via Zephyr UI or API)
- All test cases linked to the source Jira issue
- Summary report presented with success/failure counts
- Project key automatically extracted from issue key (e.g., "MVS-3370" → project "MVS")

---

## ✅ Quality Standards (Mode 3)

### Zephyr Test Case Quality Standards

| Standard | Requirement |
| --- | --- |
| **Codebase Enrichment** | **MANDATORY** — Must inspect validators, error models, domain constraints before generating tests |
| **Code-Grounded Boundaries** | Boundary tests must use actual min/max values from validators, not assumed values |
| **Exact Error Messages** | Expected results must use exact error text from code, with source file reference |
| **Domain-Validated Values** | Negative tests must use actual invalid values from domain enums/constraints |
| File Generation | **MANDATORY** — Must create CSV file using `create_file` tool |
| Template Fidelity | All 18 columns in exact order from `atm-exporter.xlsx`; compatible with manual import |
| Output Path | `.github/skills/userstory-testcases-zephyr/output/test-cases-[feature-name]-[YYYYMMDD].csv` |
| Inline Review | Markdown summary table always presented alongside CSV path |
| Test Coverage | Positive, negative, boundary, and integration/failure scenarios |
| Traceability | Every test case linked to one or more acceptance criteria |
| Format Compliance | Publishable to Zephyr without manual reformatting |
| Test Steps | Executable without interpretation |
| Negative Coverage | Required for high-risk requirements |
| **Code Audit Trail** | Log each file inspected and constraints extracted during enrichment step |

---

## 🚫 Safety Rules (Mode 3)

- ❌ **Do NOT skip codebase enrichment step** — validators, error models, and domain constraints MUST be inspected before generating tests
- ❌ **Do NOT assume validation constraints** — use actual min/max, regex, length limits from code validators
- ❌ **Do NOT paraphrase error messages** — copy exact error text from code for expected results
- ❌ **Do NOT generate tests from story alone** — tests must be grounded in code findings from step 3️⃣
- ❌ **Do NOT generate test cases and stop without requesting Zephyr review** — test case generation ALWAYS continues to approval gate
- ❌ **Do NOT request approval only and skip publishing** — Mode 3 always completes with published test cases in Zephyr
- ❌ **Do NOT allow partial execution of Mode 3** — whether user says "generate" or "generate and publish", the complete flow is mandatory: preflight → parse → **enrich** → generate → review → publish
- ❌ **Do NOT skip CSV file generation** — `create_file` must be called to produce the `.csv` output file
- ❌ **Do NOT name the output file `.xlsx`** — `create_file` produces text; a `.xlsx` extension would not be a valid Excel file
- ❌ **Do NOT generate test cases in markdown/text only** — both a CSV file and an inline markdown summary table are required
- ❌ **Do NOT deviate from the 18-column header order** — must match `atm-exporter.xlsx` for Zephyr compatibility
- ❌ Do not stop at test case generation and wait for a separate "publish" command — Zephyr review gate comes immediately after generation
- ❌ If user provides `APPROVED_FOR_ZEPHYR_PUBLISH`, proceed immediately to publish without further prompts
- ❌ Do not ask "Would you like me to publish now?" — publishing is automatic after approval
- ❌ Do not proceed without verifying Node.js 18+ and `ZEPHYR_API_TOKEN`
- ❌ Do not publish to Zephyr before `APPROVED_FOR_ZEPHYR_PUBLISH`

---

## 📋 Output Order (Mode 3)

Present sections in this order:

1. **Preflight Check Result**
2. **Story Parsing Summary** (if Jira key provided: issue key, title, acceptance criteria count)
3. **Codebase Enrichment Log** (files inspected, constraints extracted, error messages found)
4. **CSV File Path** (absolute path to generated `.csv` file)
5. **Inline Test Case Summary Table** (markdown table showing all test cases for review)
6. **Test Coverage Summary** (positive/negative/boundary/integration counts)
7. **Code-Grounding Summary** (validator constraints used, error messages extracted, domain enums referenced)
8. **Zephyr Review Gate Request** (`APPROVED_FOR_ZEPHYR_PUBLISH` token)
9. **Publishing Results** (after approval: test case keys created, Jira link status)
2. **Operation Mode** (Mode 3: Generate and Publish Zephyr Tests)
3. **Story Summary** (from Jira or provided text)
4. **Test Cases** — inline markdown summary table + CSV file path
5. **Coverage and Gaps**
6. **Zephyr Review Request**
7. **Zephyr Approval Status**
8. **Zephyr Publish Result**
9. **Execution Log**

---

## ⚠️ Failure Handling (Mode 3)

- If no story source provided: stop with `PRECONDITION_FAILED`
- If Atlassian MCP unavailable (when Jira key provided): stop with `ATLASSIAN_MCP_NOT_INSTALLED` or `MCP_SESSION_RESTART_REQUIRED`
- If Node.js not installed: stop with `NODEJS_NOT_INSTALLED`
- If `ZEPHYR_API_TOKEN` not set: stop with `ZEPHYR_TOKEN_MISSING`
- If template file invalid: stop with `ZEPHYR_TEMPLATE_INVALID`
- If Zephyr publication fails: report case-level failures and retain the manual upload payload