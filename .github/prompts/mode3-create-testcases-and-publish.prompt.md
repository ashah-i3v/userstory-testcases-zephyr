---
mode: ask
description: "Mode 3 — Generate Zephyr test cases from a story, enforce MCP preflight, review, and publish after approval."
---

# 🧪 Mode 3 — Generate & Publish Zephyr Tests

Use the skill `userstory-testcases-zephyr`.

> **What this does:** Generate a comprehensive, traceable Zephyr test suite from a user story — covering positive, negative, boundary, and integration scenarios — and publish to Zephyr Scale Cloud after your approval.

---

## 📥 Inputs

- Operation mode: `3` (Generate and publish test cases)
- Story source: ${input:storySource:Enter Jira key or paste user story text}
- Optional module: ${input:moduleName:Feature or module name}
- Optional risk: ${input:riskLevel:Risk level (High/Medium/Low)}
- If MCP unavailable, setup choice: ${input:mcpSetupChoice:Configure and start MCP now / Continue without publish / Fail immediately}

### Example Inputs

```text
Operation mode: 3
Story source: MVS-2607
Optional module: customer
Optional risk: Medium
If MCP unavailable, setup choice: Configure and start MCP now
```

### Example Skill Invocation

```text
Reference file: mode3-create-testcases-and-publish.prompt.md (generate Zephyr test cases and publish)
Invoke skill: userstory-testcases-zephyr
Run using this mode prompt and follow both approval gates before publish.
```

---

## 🔄 Workflow

```
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: PREFLIGHT                                    │
│  ✅ Atlassian MCP Server readiness                     │
│  ✅ Zephyr MCP Server readiness                        │
│  ✅ Excel template validation                          │
│  ✅ API credentials test                               │
└────────────────────┬────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: STORY REVIEW                                 │
│  Read story → Improve quality → Present review package │
│  🔴 Gate: APPROVED_FOR_JIRA_UPDATE                     │
│  ✅ Update Jira story fields                           │
└────────────────────┬────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────────────┐
│  STAGE 3: TEST GENERATION                              │
│  ✅ Positive test cases                                │
│  ✅ Negative test cases                                │
│  ✅ Boundary test cases                                │
│  ✅ Integration / failure scenarios                    │
│  ✅ Mapped to Acceptance Criteria                      │
└────────────────────┬────────────────────────────────────┘
                     ⬇️
┌─────────────────────────────────────────────────────────┐
│  STAGE 4: ZEPHYR PUBLISH                               │
│  Present test review package                           │
│  🔴 Gate: APPROVED_FOR_ZEPHYR_PUBLISH                  │
│  ✅ Publish to Zephyr Scale Cloud                      │
│  ✅ Return test case keys + coverage summary           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Preflight — Two MCP Servers Required

| Server | Purpose | Failure Action |
| --- | --- | --- |
| **Atlassian MCP** (read-only) | Fetch story from Jira | Configure now / Continue / Fail |
| **Zephyr MCP** | Publish test cases | Configure now / Continue / Fail |

```
If MCP preflight fails:
  A. Configure and start MCP now, then retry preflight
  B. Continue without publish capability
  C. Fail immediately with PRECONDITION_FAILED
```

---

## 🧪 Test Case Coverage Requirements

Generate all four categories:

| Category | What It Tests | Example |
| --- | --- | --- |
| ✅ **Positive** | Happy path — all inputs valid | Valid ELT ID accepted, account created |
| ❌ **Negative** | Invalid inputs, missing required fields | Blank ELT ID, wrong format rejected |
| 📐 **Boundary** | Min/max values, edge lengths | ELT ID at max length, empty string |
| 🔗 **Integration** | System interactions, failure modes | ELT service down, duplicate ELT ID |

Map **every** test case to one or more Acceptance Criteria for traceability.

---

## 🔴 Two Approval Gates

### Gate 1 — Jira Review

```
APPROVED_FOR_JIRA_UPDATE        ← Update Jira story fields
CHANGES_REQUIRED: <comments>    ← Revise story and re-present
```

### Gate 2 — Zephyr Review

```
APPROVED_FOR_ZEPHYR_PUBLISH     ← Publish test cases to Zephyr
CHANGES_REQUIRED: <comments>    ← Revise test cases and re-present
```

> ⚠️ Tokens are case-sensitive. Do NOT publish before both approvals.

### Example Approval Sequence

```text
APPROVED_FOR_JIRA_UPDATE
```

```text
CHANGES_REQUIRED: Add one integration scenario for downstream service timeout.
```

```text
APPROVED_FOR_ZEPHYR_PUBLISH
```

---

## ✅ After Publish

Return:
- Test case keys (e.g., MVS-T1391 through MVS-T1406)
- Coverage map (test cases → acceptance criteria)
- Created / updated / skipped / failed summary
- Execution Log with all stages

### Example Final Output

```text
Published Test Cases:
- MVS-T1391
- MVS-T1392
- MVS-T1393
- ...
- MVS-T1406

Coverage Summary:
- AC-1: MVS-T1391, MVS-T1392, MVS-T1398
- AC-2: MVS-T1393, MVS-T1399
- AC-3: MVS-T1401, MVS-T1402, MVS-T1405

Publish Result:
- Created: 16
- Updated: 0
- Skipped: 0
- Failed: 0
```

---

## 📊 Execution Log Format

```
[<timestamp>] [<stage>] <action> -> <outcome>

Example:
[2026-05-01T10:00:00Z] [Preflight]       Atlassian MCP readiness -> Ready (Read-Only)
[2026-05-01T10:00:05Z] [Preflight]       Zephyr MCP readiness -> Ready
[2026-05-01T10:00:10Z] [Preflight]       Excel template validation -> Valid
[2026-05-01T10:00:20Z] [Story Review]    Improved story generated -> 6 sections
[2026-05-01T10:00:21Z] [Jira Gate]       Waiting for approval -> Pending Jira Review
[2026-05-01T10:01:00Z] [Jira Gate]       APPROVED_FOR_JIRA_UPDATE received -> Approved
[2026-05-01T10:01:10Z] [Test Generation] 16 test cases generated -> 4 positive, 6 negative, 4 boundary, 2 integration
[2026-05-01T10:01:11Z] [Zephyr Gate]     Waiting for approval -> Pending Zephyr Review
[2026-05-01T10:02:00Z] [Zephyr Gate]     APPROVED_FOR_ZEPHYR_PUBLISH received -> Approved
[2026-05-01T10:02:20Z] [Zephyr Publish]  Published 16 test cases -> MVS-T1391 to MVS-T1406
```
