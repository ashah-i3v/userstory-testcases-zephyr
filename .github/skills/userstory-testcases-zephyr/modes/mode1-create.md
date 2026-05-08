# 📖 Mode 1: Create New User Story

> **Purpose:** Build a brand-new 6-section story grounded in codebase context.
>
> **Prerequisites:** Jira project key must be confirmed before proceeding.
>
> **Approval Gate:** `APPROVED_FOR_JIRA_UPDATE` before creating Jira issue.
>
> **After approval**, the user chooses: receive the Jira create payload for manual entry, or have the skill publish directly via Atlassian MCP.

---

## 🎯 When To Use Mode 1

- Feature request needs a brand-new story
- No existing Jira issue to improve
- Starting from user requirements or feature description

---

## 💬 Trigger Phrases

```text
Create a new user story for [feature description]
```

```text
Mode 1: Create a new user story for lienholder signup with ELT ID
```

> ⚠️ The skill must confirm the Jira project key before proceeding.

---

## 📥 Required Inputs

| Input | Required? | Notes |
| --- | --- | --- |
| Feature description | ✅ Yes | User requirements, feature name, or functional detail |
| Jira project key | ✅ Yes | Must be confirmed with user before work begins |
| Priority / risk | Optional | Helps refine scope and validation depth |
| Module name | Optional | Strongly recommended for context |
| Environment constraints | Optional | Release, sprint, policy, or dependency limits |

---

## 🛡️ Preflight Checks (Mode 1)

Run preflight before story generation:

| # | Check | Action |
| --- | --- | --- |
| 1 | Validate feature description is sufficient | If unclear, ask clarifying questions |
| 2 | Confirm Jira project key with user | Do not proceed until confirmed |
| 3 | Validate Jira project key format | Must match pattern `[A-Z]+-[0-9]+` |
| 4 | Check for similar existing stories | Avoid duplicates |

**Reference:** See [shared/preflight.md](../shared/preflight.md) for common checks and anti-rationalization tables.

---

## 🔍 Codebase Context Requirements

Before writing the story, inspect the codebase for domain context. Translate findings into business language.

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

## 🔄 Workflow (Mode 1)

```
1. Preflight → 2. Codebase → 3. Generate → 4. Review → 5. Gate → 6. Prepare
   Checks        Enrichment    Story        Quality     Jira      Payload
```

### 1️⃣ Preflight Checks

- Validate feature description
- Confirm Jira project key with user
- Check for duplicate stories
- Log preflight results

**Exit Criteria:** All checks pass, or stop with explicit failure code.

### 2️⃣ Codebase Enrichment

- Inspect endpoints, DTOs, validators, domain entities, error models
- Extract validation rules, business concepts, states, allowed values
- Translate technical findings into business language
- Log each relevant file or module inspected

**Exit Criteria:** Sufficient codebase context gathered and logged.

### 3️⃣ Generate Story

- Create 6-section story using required format
- Write Given/When/Then acceptance criteria (3+ criteria, testable)
- Document validation rules grounded in codebase
- Identify edge cases and error scenarios
- Surface assumptions and open questions

**Exit Criteria:** Complete story draft created with all 6 sections.

### 4️⃣ Review Story Quality

Evaluate the draft for:
- Clarity and completeness
- Testable, measurable acceptance criteria
- Edge and error path coverage
- Dependency visibility
- BA/PO readability (no technical jargon)

**Exit Criteria:** Quality evaluation complete and logged.

### 5️⃣ Jira Review Gate

Present story for review. Accept only:

```
APPROVED_FOR_JIRA_UPDATE
CHANGES_REQUIRED: <comments>
```

❌ Do not proceed to step 6 without `APPROVED_FOR_JIRA_UPDATE` token.

**Exit Criteria:** Approval token received, or workflow stops in pending review state.

### 6️⃣ Deliver Story to Jira

After receiving `APPROVED_FOR_JIRA_UPDATE`, present both options and wait for the user to choose:

```
Option A: Show me the Jira create payload (I will create it manually)
Option B: Publish to Jira for me via MCP
```

**Option A — Payload Only:**
- Produce a complete Jira create payload with all fields populated
- Include a field-level summary explaining each value
- User creates the issue manually in Jira

**Option B — Publish via MCP:**
- Confirm Atlassian MCP is available (run MCP readiness check from [shared/preflight.md](../shared/preflight.md))
- Call `mcp_atlassian-mcp_createJiraIssue` with the approved payload
- Report the created issue key and URL on success
- On failure, fall back to Option A and present the payload

❌ Do not proceed with Option B unless the user explicitly selects it.

**Exit Criteria:** Payload delivered (Option A) or Jira issue created and key confirmed (Option B).

---

## ✅ Quality Standards (Mode 1)

| Standard | Requirement |
| --- | --- |
| Acceptance Criteria | Specific, measurable, verifiable, Given/When/Then format |
| Story Sections | All 6 required: User Story, Description, AC, Validation Rules, Edge Cases, Errors |
| Business Language | No class names, method names, routes, or HTTP mechanics |
| Code Grounding | Codebase-derived details must be evidenced, not inferred |
| BA/PO Readability | Final story must be useful without technical translation |
| Open Questions | Explicit and clearly marked |

---

## 🚫 Safety Rules (Mode 1)

- ❌ Do not invent business requirements
- ❌ Do not proceed without confirmed Jira project key
- ❌ Do not create Jira issue before `APPROVED_FOR_JIRA_UPDATE`
- ❌ Do not publish to Jira via MCP unless user explicitly selects Option B after approval
- ❌ Do not expand scope beyond the requested feature
- ❌ Do not skip codebase inspection, even for "simple" stories

---

## 📋 Output Order (Mode 1)

Present sections in this order:

1. **Preflight Check Result**
2. **Operation Mode** (Mode 1: Create New Story)
3. **User Story** (6 sections)
4. **Assumptions and Open Questions**
5. **Jira Review Request**
6. **Jira Approval Status**
7. **Delivery Option Prompt** — Option A (payload) or Option B (publish via MCP)
8. **Jira Create Payload** (Option A) or **Jira Issue Key + URL** (Option B)
9. **Execution Log**

---

## ⚠️ Failure Handling

- If Jira project key is invalid: stop and request valid key
- If codebase context insufficient: surface explicitly and request clarification
- If user responds with `CHANGES_REQUIRED`: revise story and re-request approval
