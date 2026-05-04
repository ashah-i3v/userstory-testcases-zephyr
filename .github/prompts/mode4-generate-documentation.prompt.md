---
mode: ask
description: "Mode 4 — Generate audience-specific user documentation with mandatory format validation, grounded in codebase context."
---

# 📚 Mode 4 — Generate User Documentation

Use the skill `userstory-testcases-zephyr`.

> **What this does:** Inspect the codebase (primary source) and optionally Jira (secondary source) to generate format-validated user documentation for internal (admin) and/or external (carrier) audiences. Saved to `docs/` folder automatically.

---

## 📥 Inputs

- Operation mode: `4` (Generate documentation)
- Feature source: ${input:featureSource:Enter Jira key (e.g., MVS-2607) or feature name}
- Audience: ${input:audience:Internal (admin + back-office) / External (carrier/lienholder) / Both}
- Optional module name: ${input:moduleName:Module name for output path (e.g., customer, irp, batch)}
- Optional feature name: ${input:featureName:Feature name for output file (e.g., lienholder_signup_elt_id)}

### Example Inputs

```text
Operation mode: 4
Feature source: MVS-2607
Audience: Both
Optional module name: customer
Optional feature name: lienholder_signup_elt_id
```

### Example Skill Invocation

```text
Reference file: mode4-generate-documentation.prompt.md (generate user documentation with format validation)
Invoke skill: userstory-testcases-zephyr
Run using this mode prompt and enforce format validation before save.
```

---

## 🔄 Workflow

```
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: PREFLIGHT                                    │
│  ✅ Code context availability check                    │
│  ✅ Atlassian MCP (optional, if Jira key provided)     │
│  ✅ docs/ folder structure created if missing          │
└────────────────────┬────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: CONTEXT GATHERING                            │
│  🔍 Inspect codebase (primary source)                  │
│     • Endpoints, DTOs, validators, errors              │
│  📥 Read Jira issue (secondary, scope/terminology)     │
└────────────────────┬────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────────────┐
│  STAGE 3: GENERATE DOCUMENTATION                       │
│  📄 Internal: all fields + admin procedures            │
│  📄 External: hidden fields excluded, user language    │
│  📄 Separate files per audience                        │
└────────────────────┬────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────────────┐
│  STAGE 4: FORMAT VALIDATION (MANDATORY)                │
│  ✅ Step 1: docs/ folder structure exists              │
│  ✅ Step 2: Document structure (heading, sections)     │
│  ✅ Step 3: Audience rules applied correctly           │
│  ✅ Step 4: Content grounded in codebase               │
│  ✅ Step 5: Compliance confirmed                       │
└────────────────────┬────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────────────┐
│  STAGE 5: SAVE + OUTPUT                                │
│  💾 docs/internal/[module]/[feature].md                │
│  💾 docs/external/[module]/[feature].md                │
│  📋 Output paths, sources, validation status           │
└─────────────────────────────────────────────────────────┘
```

---

## 📖 Required Document Structure

All generated documents must use this exact format:

```markdown
# [Feature Name] — [Internal User Guide | External User Guide]

## Overview
## When to Use This
## How to Access
## [Feature Section Name]
### Field Guide
| Field | Description | Required? | Notes |
## Buttons
| Button | What It Does |
## Business Rules
```

---

## 👥 Audience Rules

| Rule | Internal Document | External Document |
| --- | --- | --- |
| Admin-only fields | ✅ Include | ❌ Exclude |
| Back-office procedures | ✅ Include | ❌ Exclude |
| Supervisor overrides | ✅ Include | ❌ Exclude |
| Operational notes | ✅ Include | ❌ Exclude |
| Carrier/user perspective | ✅ Include | ✅ Only this |
| Document Tracking section | ✅ Include | ❌ Exclude |

---

## ✅ Format Validation Sequence

Validation runs automatically before saving. All steps must pass:

| Step | Check | Failure Code |
| --- | --- | --- |
| 1 | `docs/` folder structure exists (create if needed) | `DOCS_PATH_CREATION_FAILED` |
| 2 | Heading, section order, table columns match spec | `DOCUMENTATION_FORMAT_VIOLATION` |
| 3 | Audience rules applied (internal ≠ external) | `DOCUMENTATION_AUDIENCE_MISMATCH` |
| 4 | Content grounded in codebase (not Jira-only) | `DOCUMENTATION_SOURCE_INVALID` |
| 5 | Compliance confirmed → record in Execution Log | — |

> ⚠️ If any step fails, files are NOT saved. Stop with the failure code.

### Example Validation Failure

```text
Failure Code: DOCUMENTATION_AUDIENCE_MISMATCH
Reason: External guide contains internal-only field "Supervisor Override Reason".
Action: Remove internal-only section from external document and re-run validation.
```

---

## 🚫 Scope Limitations

- ❌ Do NOT generate docs without codebase context
- ❌ Do NOT embed story sections (User Story, AC, etc.) in documentation
- ❌ Do NOT mix internal and external content in one file
- ❌ Do NOT use Jira as primary source (codebase first)
- ❌ Do NOT save files if format validation fails
- ❌ Do NOT include class names, method names, routes, DB terminology

---

## 📊 Execution Log Format

```
[<timestamp>] [<stage>] <action> -> <outcome>

Example:
[2026-05-01T10:00:00Z] [Preflight]        Code context check -> Sufficient
[2026-05-01T10:00:05Z] [Preflight]        Atlassian MCP readiness -> Ready (Read-Only)
[2026-05-01T10:00:10Z] [Codebase]         Inspected app/customer.go, http/customer.go -> 12 rules found
[2026-05-01T10:00:20Z] [Jira Read]        Fetched MVS-2607 -> Business scope clarified
[2026-05-01T10:00:45Z] [Doc Generation]   Internal audience -> 8 sections generated
[2026-05-01T10:01:00Z] [Validation]       Step 1: docs/internal/customer/ created -> OK
[2026-05-01T10:01:01Z] [Validation]       Step 2: Document structure -> PASSED
[2026-05-01T10:01:02Z] [Validation]       Step 3: Audience rules -> PASSED
[2026-05-01T10:01:03Z] [Validation]       Step 4: Code grounding -> PASSED
[2026-05-01T10:01:04Z] [Validation]       Format compliance -> PASSED
[2026-05-01T10:01:05Z] [Output]           Saved to docs/internal/customer/lienholder_signup_elt_id.md -> Success
```

Log format:
- [<timestamp>] [<stage>] <action> -> <outcome>

Example stages:
- [2026-05-01T15:12:05Z] [Preflight] Code context validation -> Completed
- [2026-05-01T15:12:15Z] [Codebase Inspection] Inspected app/customer.go, http/customer.go -> Found 12 business rules
- [2026-05-01T15:12:45Z] [Documentation Generation] Internal audience -> 8 sections generated
- [2026-05-01T15:13:05Z] [Format Validation] Step 1: Folder structure -> Created docs/internal/customer/
- [2026-05-01T15:13:10Z] [Format Validation] Step 2: Document structure -> PASSED
- [2026-05-01T15:13:15Z] [Format Validation] Step 3: Audience rules -> PASSED
- [2026-05-01T15:13:20Z] [Format Validation] Step 4: Code grounding -> PASSED
- [2026-05-01T15:13:21Z] [Format Validation] Sequence complete -> PASSED
- [2026-05-01T15:13:22Z] [Output] Saved to docs/internal/customer/lienholder_signup_elt_id.md -> Success

### Example Final Output

```text
Generated Files:
- docs/internal/customer/lienholder_signup_elt_id.md
- docs/external/customer/lienholder_signup_elt_id.md

Source Summary:
- Primary: Codebase inspection (app/customer.go, http/customer.go)
- Secondary: Jira story MVS-2607

Validation Status:
- Step 1: PASSED
- Step 2: PASSED
- Step 3: PASSED
- Step 4: PASSED
- Step 5: PASSED
```
