# 📚 Mode 4: Generate Documentation

> **Purpose:** Format-validated internal and external user guides saved to `docs/`.
>
> **Prerequisites:** Code context is mandatory. Atlassian MCP conditional (if Jira key provided).
>
> **Validation:** Documentation Format Validation Sequence must pass before file creation.

---

## 🎯 When To Use Mode 4

- Feature needs internal or external user guidance in `docs/`
- Need to generate help documentation grounded in codebase behavior
- Require separate internal (admin) and external (end-user) versions

---

## 💬 Trigger Phrases

```text
Generate help document for [feature name]
```

```text
Create internal and external help documentation for [feature name]
```

```text
Generate help document for ELT-123
```

```text
Mode 4: Create internal and external help docs for lienholder signup with ELT ID
```

---

## 📥 Required Inputs

| Input | Required? | Notes |
| --- | --- | --- |
| Feature name | ✅ Yes | Used for output file naming |
| Module name | ✅ Yes | Used for docs path generation |
| Documentation audience | ✅ Yes | `internal`, `external`, or `both` |
| Jira key | Optional | If provided, supplements codebase context |
| Story source | Optional | Raw story text if Jira key not available |

### Mode 4️⃣ Input Rules

```text
Jira key provided?      Yes ──▶ Use Jira + codebase + existing docs
Jira key provided?      No  ──▶ Require feature name + module + enough functional detail
Codebase missing?       Yes ──▶ Stop; do not generate documentation from Jira alone
```

---

## 🛡️ Preflight Checks (Mode 4)

Run preflight before documentation generation:

| # | Check | Action |
| --- | --- | --- |
| 1 | Validate documentation audience input | Must be `internal`, `external`, or `both` |
| 2 | Validate feature name and module name | Required for output path |
| 3 | Complete Atlassian MCP Readiness Sequence | Only if Jira key provided |
| 4 | Confirm code context is available | Stop with `PRECONDITION_FAILED` if not |
| 5 | Run Documentation Format Validation Sequence | After generation, before file creation |

**Reference:** See [shared/preflight.md](../shared/preflight.md) for validation sequences and anti-rationalization tables.

---

## 🔧 External Dependencies

### Atlassian MCP Server (Conditional)

**See:** [references/installation-atlassian.md](../references/installation-atlassian.md) for complete setup.

| Property | Value |
| --- | --- |
| Required for | Mode 4 (only when Jira key provided) |
| Purpose | Read-only access to Jira for supplementary context |
| Available Tools | `getJiraIssue`, `searchJiraIssues` |

---

## 🔍 Codebase Context Requirements

**Code context is MANDATORY for Mode 4.** Documentation cannot be generated from Jira alone.

### Inspect These Sources

| Source | Extract |
| --- | --- |
| API endpoints | User-facing actions, inputs, and outcomes |
| Request and response DTOs | Field names, optionality, constraints, defaults |
| Domain entities and enums | Business concepts, states, allowed values |
| Validators | Field-level rules, limits, conditional constraints |
| Error models | User-facing error messages and recovery actions |
| Existing help or support documentation | Current user guidance to revise or extend |
| UI components (if applicable) | Field labels, button text, workflow steps |

### Rules For Using Codebase Context

| Rule | Expectation |
| --- | --- |
| Docs require code grounding | ❌ Never generate documentation from Jira alone |
| Translate to user language | Write for non-technical users performing daily tasks |
| Hide implementation detail | ❌ No class names, method names, routes, DB terms, or HTTP mechanics |
| Jira is supplementary only | Use Jira for scope/terminology, not overriding code behavior |
| Surface uncertainty explicitly | Record assumptions when codebase coverage is incomplete |
| Keep an audit trail | Log each meaningful inspection in the Execution Log |

> **Critical:** Documentation must describe **actual** system behavior from code, not **intended** behavior from Jira stories.

---

## 📚 Documentation Output — Mandatory Format

**See:** [references/documentation-format.md](../references/documentation-format.md) for complete requirements.

ALL generated documentation **MUST** conform to the required format.

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

## 🔄 Workflow (Mode 4)

```
1. Preflight → 2. Codebase → 3. Generate → 4. Validate → 5. Create → 6. Present
   Checks        Enrichment    Docs        Format       Files       Paths
```

### 1️⃣ Preflight Checks

- Validate audience input (`internal`, `external`, or `both`)
- Validate feature name and module name
- Run Atlassian MCP Readiness Sequence (if Jira key provided)
- Confirm code context is available
- Log preflight results

**Exit Criteria:** All checks pass, or stop with explicit failure code.

---

### 2️⃣ Codebase Enrichment

- Inspect endpoints, DTOs, validators, domain entities, error models, UI components
- Extract field names, optionality, constraints, button labels, workflow steps
- If Jira key provided: fetch issue for supplementary scope/terminology only
- Translate technical findings into user-facing language
- Log each relevant file or module inspected

**Exit Criteria:** Sufficient codebase context gathered and logged, or stop with `PRECONDITION_FAILED` if insufficient.

---

### 3️⃣ Generate Documentation

For each audience (`internal`, `external`, or both):
- Create markdown content using required format
- Write for non-technical users performing daily tasks
- Apply audience rules (include/exclude admin fields)
- Ensure all required sections present
- No embedded story content (no AC, Validation Rules, etc.)

**Exit Criteria:** Documentation content generated for requested audience(s).

---

### 4️⃣ Validate Format

Run **Documentation Format Validation Sequence** (see [shared/preflight.md](../shared/preflight.md)):

1. Verify output path structure
2. Validate document structure (heading, sections, tables)
3. Validate audience rules (admin fields included/excluded correctly)
4. Validate content sources (code-grounded, not Jira-only)
5. Confirm format compliance

❌ **DO NOT proceed to file creation if validation fails.**

**Exit Criteria:** Documentation Format Validation Sequence passes, or stop with format violation code.

---

### 5️⃣ Create Files

**MANDATORY FILE GENERATION:**

1. ✅ **MUST use `create_file` tool** to generate actual markdown files in `docs/` folder
2. ✅ **MUST create files at correct paths:** `docs/internal/[module]/[feature].md` or `docs/external/[module]/[feature].md`
3. ❌ **DO NOT present documentation without creating the actual files first**

**Exit Criteria:** Markdown files created in `docs/`, format validation passed.

---

### 6️⃣ Present File Paths

- Provide file paths to user
- Summarize what was generated (internal/external, module, feature)
- Confirm format validation passed

**Exit Criteria:** File paths presented to user.

---

## ✅ Quality Standards (Mode 4)

### Documentation Quality Standards

| Standard | Requirement |
| --- | --- |
| File Generation | **MANDATORY** — Must create markdown files using `create_file` tool in `docs/` folder |
| Format Compliance | Must pass Documentation Format Validation Sequence before file creation |
| Document Structure | Correct heading, required sections, exact column counts in tables |
| No Embedded Story | ❌ Never embed User Story, AC, Validation Rules into documentation files |
| Audience Adherence | Internal = all fields + admin; External = no hidden/admin fields |
| Code Grounding | Primary source is codebase; Jira used only for scope/terminology |
| Output Path | `docs/internal/[module]/[feature].md` or `docs/external/[module]/[feature].md` |
| User Language | Written for non-technical users performing daily tasks |

---

## 🚫 Safety Rules (Mode 4)

- ❌ **Do NOT present documentation without creating actual markdown files first** — use `create_file` tool to generate files in `docs/` folder
- ❌ **Do NOT skip Documentation Format Validation Sequence** — validation must pass before file creation
- ❌ **Do NOT create files before validation passes** — validate first, then create
- ❌ Do not generate documentation without confirmed, sufficient code context
- ❌ Do not generate documentation if Format Validation Sequence has not passed
- ❌ Do not present documentation without first validating against required format
- ❌ Do not embed story sections into documentation files
- ❌ Do not generate external docs without confirming hidden/admin-only fields are excluded
- ❌ Do not override observable code behavior with Jira text — call out discrepancies explicitly
- ❌ Do not save documentation files until format validation is complete
- ❌ Do not mix internal and external content in a single document

---

## 📋 Output Order (Mode 4)

Present sections in this order:

1. **Preflight Check Result**
2. **Operation Mode** (Mode 4: Generate Documentation)
3. **Codebase Context Summary**
4. **Documentation Format Validation Result**
5. **Generated File Paths**
6. **Execution Log**

---

## ⚠️ Failure Handling

- If code context insufficient: stop with `PRECONDITION_FAILED`
- If Atlassian MCP unavailable (when Jira key provided): stop with `ATLASSIAN_MCP_NOT_INSTALLED` or `MCP_SESSION_RESTART_REQUIRED`
- If format validation fails: stop with `DOCUMENTATION_FORMAT_VIOLATION`, `DOCUMENTATION_AUDIENCE_MISMATCH`, or `DOCUMENTATION_SOURCE_INVALID`
- If file creation fails: stop with `DOCS_PATH_CREATION_FAILED`
