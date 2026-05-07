# 🔍 Mode 2: Improve Existing User Story

> **Purpose:** Enrich an existing Jira story with validators, edge cases, and errors from codebase.
>
> **Prerequisites:** Atlassian MCP Server (read-only) must be available.
>
> **Approval Gate:** `APPROVED_FOR_JIRA_UPDATE` before updating Jira issue.

---

## 🎯 When To Use Mode 2

- Existing Jira story is thin, vague, or missing validation detail
- Story lacks testable acceptance criteria
- Edge cases and error scenarios are not documented
- Need to ground story in actual codebase behavior

---

## 💬 Trigger Phrases

```text
Improve user story ELT-123
```

```text
Review and improve this user story: [paste story text]
```

```text
Mode 2: Improve user story MVS-2607 before Jira update
```

---

## 📥 Required Inputs

| Input | Required? | Notes |
| --- | --- | --- |
| Jira issue key | ✅ Yes (Option 1) | Must be valid and accessible |
| Raw story text | ✅ Yes (Option 2) | If Jira key not available |
| Priority / risk | Optional | Helps refine improvement depth |
| Module name | Optional | Strongly recommended for context |

---

## 🛡️ Preflight Checks (Mode 2)

Run preflight before story improvement:

| # | Check | Action |
| --- | --- | --- |
| 1 | Validate Jira issue key format (if provided) | Must match pattern `[A-Z]+-[0-9]+` |
| 2 | Complete Atlassian MCP Server Readiness Sequence | See [shared/preflight.md](../shared/preflight.md) |
| 3 | Fetch existing Jira issue content | Use `getJiraIssue` tool |
| 4 | Parse story sections | Extract existing AC, validation rules, etc. |

**Reference:** See [shared/preflight.md](../shared/preflight.md) for Atlassian MCP readiness sequence and anti-rationalization tables.

---

## 🔧 External Dependencies

### Atlassian MCP Server

**See:** [references/installation-atlassian.md](../references/installation-atlassian.md) for complete setup.

| Property | Value |
| --- | --- |
| Options | HTTP (Rovo — Recommended) or stdio (Local) |
| Required for | Mode 2 |
| Purpose | Read-only access to Jira for fetching story content |
| HTTP Config | `{"type": "http", "url": "https://mcp.atlassian.com/v1/mcp"}` |
| Available Tools | `getJiraIssue`, `searchJiraIssues`, `listJiraProjects` |

---

## 🔍 Codebase Context Requirements

Before improving the story, inspect the codebase for domain context. Translate findings into business language.

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
| Translate to business language | Prefer user outcomes over technical implementation terms |
| Hide implementation detail | ❌ No class names, method names, routes, DB terms, or HTTP mechanics |
| Surface uncertainty explicitly | Record assumptions when codebase coverage is incomplete |
| Keep an audit trail | Log each meaningful inspection in the Execution Log |

> **Critical translation rule:** extract from code, then rewrite for business readers. Do not paste engineering language straight into the story.

---

## 📖 Required Story Format

**See:** [references/story-format.md](../references/story-format.md) for complete requirements.

Ensure all **6 required sections** are present and complete:

| # | Section | Contains |
| --- | --- | --- |
| 1 | **User Story** | Role, goal, benefit |
| 2 | **Description** | Context, scope, constraints, dependencies |
| 3 | **Acceptance Criteria** | Given/When/Then format, 3+ criteria, testable |
| 4 | **Validation Rules** | Field-level constraints grounded in codebase |
| 5 | **Edge Cases** | Boundary conditions, special scenarios |
| 6 | **Error Handling Scenarios** | User-facing error messages from code |

---

## 🔄 Workflow (Mode 2)

```
1. Preflight → 2. Fetch → 3. Codebase → 4. Improve → 5. Review → 6. Gate → 7. Prepare
   Checks        Jira      Enrichment    Story        Quality     Jira      Payload
```

### 1️⃣ Preflight Checks

- Validate Jira issue key format
- Run Atlassian MCP Server Readiness Sequence
- Log preflight results

**Exit Criteria:** All checks pass, or stop with explicit failure code.

### 2️⃣ Fetch Jira Story

- Use `getJiraIssue` tool to fetch existing story
- Parse story sections (User Story, Description, AC, etc.)
- Identify gaps: missing validation rules, incomplete AC, no edge cases
- Log fetch results

**Exit Criteria:** Existing story content parsed and gaps identified.

### 3️⃣ Codebase Enrichment

- Inspect endpoints, DTOs, validators, domain entities, error models
- Extract validation rules, business concepts, states, allowed values
- Translate technical findings into business language
- Log each relevant file or module inspected

**Exit Criteria:** Sufficient codebase context gathered and logged.

### 4️⃣ Improve Story

- Fill gaps in 6-section story format
- Add/refine Given/When/Then acceptance criteria
- Document validation rules grounded in codebase
- Add edge cases and error scenarios
- Surface assumptions and open questions

**Exit Criteria:** Complete improved story with all 6 sections enhanced.

### 5️⃣ Review Story Quality

Evaluate the improved story for:
- Clarity and completeness
- Testable, measurable acceptance criteria
- Edge and error path coverage
- Dependency visibility
- BA/PO readability (no technical jargon)

**Exit Criteria:** Quality evaluation complete and logged.

### 6️⃣ Jira Review Gate

Present improved story for review. Accept only:

```
APPROVED_FOR_JIRA_UPDATE
CHANGES_REQUIRED: <comments>
```

❌ Do not proceed to step 7 without `APPROVED_FOR_JIRA_UPDATE` token.

**Exit Criteria:** Approval token received, or workflow stops in pending review state.

### 7️⃣ Prepare Jira Update Payload

- Note: Atlassian MCP is read-only — Jira updates must be performed manually
- Provide complete update payload with all fields
- Include field-level change summary (what was added/modified)

**Exit Criteria:** Jira update payload prepared and presented to user.

---

## ✅ Quality Standards (Mode 2)

| Standard | Requirement |
| --- | --- |
| Acceptance Criteria | Specific, measurable, verifiable, Given/When/Then format |
| Story Sections | All 6 required: User Story, Description, AC, Validation Rules, Edge Cases, Errors |
| Business Language | No class names, method names, routes, or HTTP mechanics |
| Code Grounding | Codebase-derived details must be evidenced, not inferred |
| BA/PO Readability | Final story must be useful without technical translation |
| Improvement Evidence | Clearly show what was added/enhanced vs. original |
| Open Questions | Explicit and clearly marked |

---

## 🚫 Safety Rules (Mode 2)

- ❌ Do not invent business requirements
- ❌ Do not proceed without Atlassian MCP readiness confirmation
- ❌ Do not update Jira issue before `APPROVED_FOR_JIRA_UPDATE`
- ❌ Do not use Atlassian MCP write operations — server must be read-only
- ❌ Do not expand scope beyond the existing story's feature
- ❌ Do not skip codebase inspection, even if story "looks complete"
- ❌ Do not remove existing content without explicit justification

---

## 📋 Output Order (Mode 2)

Present sections in this order:

1. **Preflight Check Result**
2. **Operation Mode** (Mode 2: Improve Existing Story)
3. **Original Story Summary** (gaps identified)
4. **Improved Story** (6 sections with enhancements highlighted)
5. **Assumptions and Open Questions**
6. **Jira Review Request**
7. **Jira Approval Status**
8. **Jira Update Payload** (after approval)
9. **Execution Log**

---

## ⚠️ Failure Handling

- If Atlassian MCP unavailable: stop with `ATLASSIAN_MCP_NOT_INSTALLED` or `MCP_SESSION_RESTART_REQUIRED`
- If Jira issue not found: verify issue key and retry
- If codebase context insufficient: surface explicitly and request clarification
- If user responds with `CHANGES_REQUIRED`: revise story and re-request approval
