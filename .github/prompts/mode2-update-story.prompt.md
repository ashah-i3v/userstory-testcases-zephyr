---
mode: ask
description: "Mode 2 — Improve an existing user story with codebase context, request Jira approval, and update fields."
---

# 🔍 Mode 2 — Improve an Existing Story

Use the skill `userstory-testcases-zephyr`.

> **What this does:** Fetch an existing Jira story, enrich it with codebase context, propose improvements across all 6 sections, and update Jira after your approval.

---

## 📥 Inputs

- Operation mode: `2` (Update an existing story)
- Story source: ${input:storySource:Enter Jira issue key (e.g., ELT-123) or paste existing story text}
- Optional module: ${input:moduleName:Feature or module name}
- Optional risk: ${input:riskLevel:Risk level (High/Medium/Low)}

### Example Inputs

```text
Operation mode: 2 (Update an existing story)
Story source: MVS-2607
Optional module: customer
Optional risk: High
```

### Example Skill Invocation

```text
Reference file: mode2-update-story.prompt.md (improve and update existing story)
Invoke skill: userstory-testcases-zephyr
Run using this mode prompt and follow its Jira approval gate.
```


---

## 🔄 Workflow

```
1. ✅ Atlassian MCP Server Readiness Sequence
2. 📥 Fetch existing story from Jira
3. 🔍 Inspect codebase for domain context
4. 🧠 Analyze story gaps (clarity, testability, coverage)
5. ✍️  Generate improved story — all 6 sections
6. 📋 Present original vs improved comparison
7. 🔴 Wait for: APPROVED_FOR_JIRA_UPDATE
8. ✅ Update Jira issue and return field summary
9. 📝 Output Execution Log
```

---

## 🔧 Preflight — Atlassian MCP

Complete Atlassian MCP Server Readiness Sequence before any Jira access.

```
If MCP unavailable → offer:
  A. Configure and start MCP now
  B. Continue without Jira context (codebase only)
  C. Fail immediately
```

> ⚠️ Atlassian MCP must be configured as **read-only**.

---

## 🔍 Story Analysis Criteria

Evaluate the existing story against:

| Dimension | What to Check |
| --- | --- |
| **Clarity** | Role, goal, and benefit clearly stated |
| **Testability** | Acceptance criteria are Given/When/Then and executable |
| **Specificity** | Requirements are measurable, not vague |
| **Edge Cases** | Boundary conditions and failure paths covered |
| **Error Coverage** | User-facing error messages defined |
| **Code Grounding** | Validation rules match actual code behavior |

---

## 📖 Improved Story Structure

Generate all 6 sections with improvements:

| # | Section | Improvement Source |
| --- | --- | --- |
| 1 | **User Story** | Refined role, goal, benefit |
| 2 | **Description** | Enriched with constraints, dependencies |
| 3 | **Acceptance Criteria** | Expanded Given/When/Then from code validators |
| 4 | **Validation Rules** | Grounded in codebase field-level rules |
| 5 | **Edge Cases** | Boundary conditions from validators |
| 6 | **Error Handling** | User-facing errors from code error models |

---

## 📋 Review Package Output

Present:
- Original story vs improved story (side-by-side comparison)
- Codebase findings and what changed
- Suggested Jira field updates

### Example Review Delta

```text
Original AC:
- System validates ELT ID.

Improved AC:
- Given a user enters an ELT ID containing non-alphanumeric characters,
  When they submit the signup form,
  Then the system blocks submission and displays "Enter a valid ELT ID".
```

---

## 🔴 Approval Gate

Wait for one of:

```
APPROVED_FOR_JIRA_UPDATE        ← Proceed to update Jira
CHANGES_REQUIRED: <comments>    ← Revise and re-present
```

> ⚠️ Tokens are case-sensitive. Do NOT update Jira before approval.

### Example Approval Responses

```text
CHANGES_REQUIRED: Add one edge case for maximum ELT ID length.
```

```text
APPROVED_FOR_JIRA_UPDATE
```

---

## ✅ After Approval

Update Jira issue and return:
- Updated fields summary
- Jira issue link
- Confirmation of all changes applied
- Execution Log with all stages

### Example Final Output

```text
Updated Issue: MVS-2607
Link: https://i3verticals.atlassian.net/browse/MVS-2607

Updated Fields:
- Summary: Validate lienholder ELT ID on customer signup
- Description: Expanded with constraints and dependencies
- Acceptance Criteria: 5 Given/When/Then criteria
```

---

## 🚫 Scope Limitations

- ❌ Do not generate Zephyr test cases (use Mode 3 for that)
- ❌ Do not update Jira before approval is granted
- ❌ Atlassian MCP must be read-only (no write operations)

---

## 📊 Execution Log Format

```
[<timestamp>] [<stage>] <action> -> <outcome>

Example:
[2026-05-01T10:00:00Z] [Preflight]         Atlassian MCP readiness -> Ready (Read-Only)
[2026-05-01T10:00:05Z] [Jira Read]         Fetched MVS-2607 -> Success
[2026-05-01T10:00:10Z] [Codebase]          Inspected customer.go, app/customer.go -> 12 rules found
[2026-05-01T10:00:45Z] [Story Analysis]    Gap analysis complete -> 4 improvements identified
[2026-05-01T10:01:00Z] [Story Generation]  Improved story generated -> 6 sections
[2026-05-01T10:01:01Z] [Jira Gate]         Waiting for approval -> Pending Jira Review
[2026-05-01T10:01:30Z] [Jira Gate]         APPROVED_FOR_JIRA_UPDATE received -> Approved
[2026-05-01T10:01:40Z] [Jira Update]       MVS-2607 updated -> Success
```
