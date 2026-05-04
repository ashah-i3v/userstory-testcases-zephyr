---
mode: ask
description: "Mode 1 — Create a new user story from scratch with codebase inspection and Jira approval gate."
---

# 📖 Mode 1 — Create a New User Story

Use the skill `userstory-testcases-zephyr`.

> **What this does:** Inspect the codebase, generate a business-ready user story with all 6 required sections, and create it in Jira after your approval.

---

## 📥 Inputs

- Operation mode: `1` (Create a new story)
- Feature description: ${input:featureDescription:Describe the feature or business requirement}
- Jira project key: ${input:jiraProjectKey:Confirm the Jira project key (e.g., ELT, MVS, TNSD)}
- Optional module: ${input:moduleName:Feature or module name}
- Optional risk: ${input:riskLevel:Risk level (High/Medium/Low)}

### Example Inputs

```text
Operation mode: 1
Feature description: Add validation for lienholder ELT ID during customer signup to prevent invalid submissions.
Jira project key: MVS
Optional module: customer
Optional risk: Medium
```

### Example Skill Invocation

```text
Reference file: mode1-create-new-story.prompt.md (create new story from scratch)
Invoke skill: userstory-testcases-zephyr
Run using this mode prompt and follow its approval gate.
```

---

## 🔄 Workflow

```
1. ✅ Confirm Jira project key (required before proceeding)
2. 🔍 Inspect codebase for domain context
3. ✍️  Generate story with all 6 required sections
4. 📋 Present story review package
5. 🔴 Wait for: APPROVED_FOR_JIRA_UPDATE
6. ✅ Create Jira issue and return key + link
7. 📝 Output Execution Log
```

---

## 🔍 Codebase Inspection

Inspect the following sources for domain context:

| Source | Extract |
| --- | --- |
| API endpoints and HTTP handlers | Supported actions, inputs, outcomes |
| Request/response DTOs | Business-relevant fields, optionality, constraints |
| Validators | Field-level rules, limits, conditional logic |
| Error models | Existing user-facing error outcomes |
| Existing docs | Current user guidance that may need revision |

Translate all findings into business language. Exclude class names, method names, routes, and DB terminology.

---

## 📖 Required Story Structure

Generate all 6 sections:

| # | Section | Contains |
| --- | --- | --- |
| 1 | **User Story** | Role, goal, benefit |
| 2 | **Description** | Context, scope, constraints, dependencies |
| 3 | **Acceptance Criteria** | Given/When/Then format, 3+ criteria |
| 4 | **Validation Rules** | Field-level constraints from codebase |
| 5 | **Edge Cases** | Boundary conditions, special scenarios |
| 6 | **Error Handling** | User-facing error messages from code |

---

## 🔴 Approval Gate

Present the complete story and wait for one of:

```
APPROVED_FOR_JIRA_UPDATE        ← Proceed to create Jira issue
CHANGES_REQUIRED: <comments>    ← Revise and re-present
```

> ⚠️ Tokens are case-sensitive. Do NOT create the Jira issue before approval.

### Example Approval Responses

```text
CHANGES_REQUIRED: Add one acceptance criterion for duplicate ELT ID behavior.
```

```text
APPROVED_FOR_JIRA_UPDATE
```

---

## ✅ After Approval

Create the Jira issue and return:
- Jira issue key and link
- Field-level summary of created values
- Execution Log with all stages

### Example Final Output

```text
Jira Issue: MVS-2607
Link: https://i3verticals.atlassian.net/browse/MVS-2607

Created Fields Summary:
- Project: MVS
- Issue Type: Story
- Summary: Validate lienholder ELT ID on customer signup
- Labels: customer, elt-id, validation
```

---

## 🚫 Scope Limitations

- ❌ Do not generate Zephyr test cases (use Mode 3 for that)
- ❌ Do not proceed without Jira project key confirmation
- ❌ MCP not required for this mode

---

## 📊 Execution Log Format

```
[<timestamp>] [<stage>] <action> -> <outcome>

Example:
[2026-05-01T10:00:00Z] [Preflight]        Jira project key confirmed -> MVS
[2026-05-01T10:00:05Z] [Codebase]         Inspected customer.go, app/customer.go -> 8 rules found
[2026-05-01T10:00:30Z] [Story Generation] 6 sections generated -> Complete
[2026-05-01T10:00:31Z] [Jira Gate]        Waiting for approval -> Pending Jira Review
[2026-05-01T10:01:00Z] [Jira Gate]        APPROVED_FOR_JIRA_UPDATE received -> Approved
[2026-05-01T10:01:10Z] [Jira Create]      Issue created -> MVS-2607
```
