# 🛡️ Shared Preflight and Anti-Rationalization Rules

> **Scope:** Common checks, sequences, and anti-rationalization tables used across all modes.
>
> **Purpose:** Prevent shortcuts, enforce gates, and verify prerequisites before work begins.

---

## 🔐 Five Non-Negotiables

> These principles apply to every mode and cannot be skipped or rationalized away.

| # | Principle | What It Means | Google DNA |
| --- | --- | --- | --- |
| 1 | **Surface assumptions before building** | Wrong assumptions held silently are the most common failure mode. Explicitly state what you believe to be true and verify before proceeding. | **Shift Left** — Catch problems as early as possible |
| 2 | **Stop and ask when requirements conflict** | Do not guess. Do not pick the "most likely" interpretation. Surface the conflict and wait for clarification. | **Code Review Norms** — Blockers for ambiguity |
| 3 | **Push back when warranted** | You are not a yes-machine. If a request bypasses a gate, violates a safety rule, or lacks sufficient context, refuse and explain why. | **Bar Raiser** — Quality gate enforcement |
| 4 | **Prefer the boring, obvious solution** | Cleverness is expensive. Choose the predictable, maintainable path over the novel one. | **Code Simplification** — Reduce surface area |
| 5 | **Touch only what you're asked to touch** | Do not refactor adjacent code. Do not modernize unrelated files. Do not expand scope. Scope discipline is the single biggest determinant of mergeable output. | **~100-line PR sizing** — Reviewable chunks |

> **Why this matters:** These five rules separate reliable, reviewable work from clever solutions that break in production. They are load-bearing.

---

## 🗺️ Google Engineering Practices Encoded

This skill embeds published engineering practices from *Software Engineering at Google* and Google's public engineering culture:

| Practice | Where Encoded | Description |
| --- | --- | --- |
| **Hyrum's Law** | Codebase inspection rules | Every observable behavior will be depended on — design with that in mind |
| **Test Pyramid** | Mode 3 test coverage | ~80/15/5 distribution (unit/integration/e2e) |
| **Beyoncé Rule** | Zephyr mandatory gates | "If you liked it, you should have put a test on it" |
| **DAMP over DRY** | Test case format | Tests read like specifications, even with some duplication |
| **~100-line PR sizing** | Scope discipline (Non-Negotiable #5) | Big PRs don't get reviewed; they get rubber-stamped |
| **Chesterton's Fence** | Anti-rationalization tables | Don't remove until you understand why it exists |
| **Trunk-based development** | Jira/Zephyr approval gates | Atomic commits with clear traceability |
| **Shift Left** | Preflight checks | Catch problems as early as possible in the workflow |
| **Code-as-liability** | Story format requirements | Every line you keep is one you maintain forever |
| **Launch Checklist** | Approval tokens (`APPROVED_FOR_*`) | Gated progression through quality checkpoints |

---

## 🚧 Anti-Rationalization Tables

> LLMs (and tired engineers) are excellent at generating plausible-sounding reasons to skip the workflow. These tables are pre-written rebuttals to shortcuts you haven't yet proposed.

### General Workflow Shortcuts

| Excuse | Rebuttal |
| --- | --- |
| "This task is too simple to need preflight checks" | Preflight is non-negotiable. Simple tasks fail when assumptions are wrong. Run the checks. |
| "I can skip codebase inspection for a small story" | Small stories still need evidence. A 5-line validation rule is better than a guess. Zero inspection is not acceptable. |
| "The story is already good enough — no need to improve it" | "Good enough" is not a quality bar. Six sections, grounded validation rules, and testable ACs are the bar. Meet it. |
| "I'll write test cases after the story is approved" | Mode 3 is atomic: story → approval → tests → approval → publish. There is no "after." Execute the full flow or don't start. |
| "This change is too small for a review gate" | Review gates exist to catch what you missed, not to validate what you know is right. No bypass. |

### Scope Discipline Shortcuts

| Excuse | Rebuttal |
| --- | --- |
| "While I'm here, I should also improve [adjacent feature]" | You were asked for X. Improving Y is scope creep. Touch only X. |
| "This related code looks outdated — I'll modernize it" | Modernization was not requested. Scope is frozen. Do not expand. |
| "I noticed this TODO — I'll fix it quickly" | TODO resolution is not in scope. Do not touch unrelated code. |
| "The adjacent file needs the same fix — I'll apply it there too" | One fix, one scope. File the issue for the other file. Do not expand. |
| "This refactor will make the feature easier" | Refactoring outside the requested scope is forbidden. Ship the feature as scoped. |

### Jira Workflow Shortcuts

| Excuse | Rebuttal |
| --- | --- |
| "The story draft looks good — let's update Jira now" | Draft quality is not approval. Wait for `APPROVED_FOR_JIRA_UPDATE` token. No exceptions. |
| "The user said 'yes' informally — that counts as approval" | Approval tokens are exact and case-sensitive. `APPROVED_FOR_JIRA_UPDATE` is the only valid Jira gate token. |
| "I'll create the Jira issue first, then get approval" | Approval precedes action. Reversing the order defeats the gate. Stop and wait. |
| "Atlassian MCP has write permissions — I should use them automatically" | Write operations require explicit user opt-in. In Mode 1, the user must select Option B after `APPROVED_FOR_JIRA_UPDATE`. Do not publish without that choice. |

### Zephyr Workflow Shortcuts (Mode 3)

| Excuse | Rebuttal |
| --- | --- |
| "I should improve the story before generating tests" | Mode 3 focuses on test generation. For story work, use Mode 1 or Mode 2. Stay in scope. |
| "Test cases are generated — I'll wait for the user to say 'publish'" | Mode 3 is not partial. Generation always proceeds to review gate. Stopping early is incomplete execution. |
| "The user only asked to generate tests, not publish them" | Mode 3 always completes the full flow: generate → review → publish. "Generate only" is not a valid Mode 3 outcome. |
| "I'll publish without approval if the tests look good" | `APPROVED_FOR_ZEPHYR_PUBLISH` is mandatory. Your judgment of "looks good" does not override the gate. |
| "Mode 3 takes too long — let's skip the review gate" | Review gates are load-bearing. They catch gaps you did not see. No bypass. |
| "The story has some gaps but I can generate tests anyway" | Mode 3 requires a complete story. If story is incomplete, stop with `PRECONDITION_FAILED` and recommend Mode 1/2. |

### Documentation Shortcuts (Mode 4)

| Excuse | Rebuttal |
| --- | --- |
| "I can generate docs from the Jira story alone" | Code context is mandatory. Jira is supplementary. No code = no documentation. Stop. |
| "Format validation can happen after I present the output" | Validation is a precondition for output. Do not present documentation that has not passed format validation. |
| "Internal and external docs are similar — I'll combine them" | Audience rules are strict. Internal includes admin/hidden fields; external excludes them. Mixing is a violation. |
| "The user will understand if the format is slightly off" | Format compliance is non-negotiable. Tables, headings, and section order must match exactly. Fix before output. |

> **How to use this:** When you are tempted to skip a step, check this table first. If your reasoning appears here, the rebuttal applies. Do not proceed.

---

## 🔴 Approval Tokens

Use the following tokens **exactly as written** — they are case-sensitive:

| Gate | Token | When |
| --- | --- | --- |
| Jira review | `APPROVED_FOR_JIRA_UPDATE` | After story review (Modes 1/2/3) |
| Zephyr publish | `APPROVED_FOR_ZEPHYR_PUBLISH` | After test review (Mode 3) |
| Request revision | `CHANGES_REQUIRED: <comments>` | Any mode, any stage |

> ❌ Never write to Jira or Zephyr before receiving the corresponding approval token.

---

## 🔵 Atlassian MCP Server Readiness Sequence

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

---

## 🟢 Zephyr MCP Readiness Sequence

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

---

## 📋 Documentation Format Validation Sequence (Mode 4 Only)

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

---

## ⛔ Preflight Failure Codes

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
[2026-05-06T22:12:05Z] [Preflight]    Atlassian MCP readiness check → Ready (Read-Only)
[2026-05-06T22:12:07Z] [Codebase]     Inspected app/customer.go     → Extracted 4 validation rules
[2026-05-06T22:12:11Z] [Story Review] Parsed user story              → Completed
[2026-05-06T22:12:18Z] [Jira Gate]    Approval token check           → Blocked (Pending Jira Review)
```

Log: workflow stage, action performed, outcome, gate status changes, and all Jira/Zephyr write attempts.
