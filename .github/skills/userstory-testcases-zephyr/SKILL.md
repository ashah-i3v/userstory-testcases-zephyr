---
name: userstory-testcases-zephyr
description: "Use when a user story must be created or improved, reviewed before Jira update, converted into Zephyr test cases, and reviewed again before Zephyr publish. Supports Atlassian MCP Server (read-only), direct Zephyr Scale API publishing via Node.js scripts (for private Jira instances), gated approvals, BA/PO-friendly story output, and separate internal or external documentation generation."
---

# 🚀 User Story & Zephyr Test Management Router

> **Router Skill — Progressive Disclosure Architecture**
>
> This skill acts as a router that selects the appropriate mode-specific workflow based on your request. Only the relevant mode's instructions are loaded into context, reducing token usage and improving focus.

Manage the complete lifecycle of user stories: from scratch creation through Jira, Zephyr test publication, and audience-specific user documentation — with approval gates at every stage.

> **Built for:** BA/PO-ready user stories, review-gated Jira updates, Zephyr publication, and format-validated end-user documentation.
>
> `Mode 1` Create Story  ·  `Mode 2` Improve Story  ·  `Mode 3` Generate Tests  ·  `Mode 4` Generate Docs
>
> **Approval gates:** `APPROVED_FOR_JIRA_UPDATE`  ·  `APPROVED_FOR_ZEPHYR_PUBLISH`  ·  `CHANGES_REQUIRED: <comments>`

---

## 📐 Progressive Disclosure Architecture

This skill uses **progressive disclosure** to load only the relevant workflow into context:

- **Router (this file)**: Mode selection logic (~150 lines)
- **Shared rules**: [shared/preflight.md](shared/preflight.md) — Common checks, anti-rationalization, Google DNA
- **Mode 1**: [modes/mode1-create.md](modes/mode1-create.md) — Create new story workflow
- **Mode 2**: [modes/mode2-improve.md](modes/mode2-improve.md) — Improve existing story workflow
- **Mode 3**: [modes/mode3-zephyr.md](modes/mode3-zephyr.md) — Generate and publish Zephyr tests workflow
- **Mode 4**: [modes/mode4-docs.md](modes/mode4-docs.md) — Generate documentation workflow

**Why this matters:** Loading only the active mode reduces context pollution by ~80%, improving accuracy and reducing token costs.

---

## ✨ What This Skill Does

| Capability | Mode | What It Does | File |
| --- | --- | --- | --- |
| 📖 Create Story | 1 | Build a 6-section story grounded in codebase context; after approval deliver payload or publish via MCP | [mode1-create.md](modes/mode1-create.md) |
| 🔍 Improve Story | 2 | Enrich an existing Jira story with validators, edge cases, errors | [mode2-improve.md](modes/mode2-improve.md) |
| 🧪 Generate & Publish Tests | 3 | Inspect codebase (validators, errors, constraints), convert story into code-grounded Zephyr test cases (CSV + inline table), then publish via Zephyr API | [mode3-zephyr.md](modes/mode3-zephyr.md) |
| 📚 Generate Documentation | 4 | Format-validated internal and external user guides saved to `docs/` | [mode4-docs.md](modes/mode4-docs.md) |

### 🧭 Quick Reference

```text
┌──────┬─────────────────────────────┬─────────────────────────────────┬────────────────────────┐
│ Mode │ Primary Outcome             │ Approval Gate                   │ File                   │
├──────┼─────────────────────────────┼─────────────────────────────────┼────────────────────────┤
│ 1    │ New 6-section story         │ Jira gate before create/update  │ modes/mode1-create.md  │
│ 2    │ Improved existing story     │ Jira gate before create/update  │ modes/mode2-improve.md │
│ 3    │ Zephyr-ready tests (from approved story) │ Zephyr gate only       │ modes/mode3-zephyr.md  │
│ 4    │ Internal/external help docs │ Format validation mandatory     │ modes/mode4-docs.md    │
└──────┴─────────────────────────────┴─────────────────────────────────┴────────────────────────┘
```

---

## 🔐 Five Non-Negotiables (Shared Across All Modes)

> These principles apply to every mode and cannot be skipped or rationalized away.
> 
> **See:** [shared/preflight.md](shared/preflight.md) for complete rules, anti-rationalization tables, and Google DNA mappings.

| # | Principle |
| --- | --- |
| 1 | **Surface assumptions before building** — Wrong assumptions held silently are the most common failure mode |
| 2 | **Stop and ask when requirements conflict** — Do not guess; surface the conflict and wait for clarification |
| 3 | **Push back when warranted** — You are not a yes-machine; refuse requests that bypass gates or lack context |
| 4 | **Prefer the boring, obvious solution** — Cleverness is expensive; choose the predictable path |
| 5 | **Touch only what you're asked to touch** — Do not expand scope; scope discipline determines mergeable output |

---

## 🎯 Mode Selection Logic

**When a user request matches a trigger phrase below, load the corresponding mode file and follow its workflow.**

### 1️⃣ Mode 1 — Create A New Story

**Triggers:**
- "Create a new user story for [feature description]"
- "Mode 1" explicitly mentioned
- "New story for [feature]"

**Action:** Load [modes/mode1-create.md](modes/mode1-create.md) and execute Mode 1 workflow.

**Prerequisites:**
- Jira project key must be confirmed before proceeding
- No Atlassian MCP or Zephyr MCP required

---

### 2️⃣ Mode 2 — Update An Existing Story

**Triggers:**
- "Improve user story [JIRA-123]"
- "Review and improve this user story: [paste story text]"
- "Mode 2" explicitly mentioned
- "Update story [JIRA-123]"

**Action:** Load [modes/mode2-improve.md](modes/mode2-improve.md) and execute Mode 2 workflow.

**Prerequisites:**
- Atlassian MCP Server (read-only) must be available
- See [shared/preflight.md](shared/preflight.md) for Atlassian MCP readiness sequence

---

### 3️⃣ Mode 3 — Generate Zephyr Tests And Publish (Always Complete)

**Important:** All Mode 3 requests follow the complete workflow: generate → review → publish. Whether you say "generate" or "generate and publish", the full flow is always executed.

**Prerequisite:** Story must already be complete and approved. If story needs work, use Mode 1 or Mode 2 first.

**Triggers:**
- "Generate Zephyr test cases for [JIRA-123]"
- "Create test cases for [JIRA-123] and publish to Zephyr"
- "Generate Zephyr test cases for user story: [paste story text]"
- "Generate tests for [feature name]"
- "Mode 3" explicitly mentioned

**Action:** Load [modes/mode3-zephyr.md](modes/mode3-zephyr.md) and execute Mode 3 workflow.

**Prerequisites:**
- Story content provided (Jira key or text)
- Zephyr MCP Server (required)
- Template file `atm-exporter.xlsx` must be available
- Atlassian MCP Server (optional - only if fetching story from Jira)
- See [shared/preflight.md](shared/preflight.md) for MCP readiness sequences

---

### 4️⃣ Mode 4 — Generate Help Document

**Triggers:**
- "Generate help document for [feature name]"
- "Create internal and external help documentation for [feature name]"
- "Generate help document for [JIRA-123]"
- "Mode 4" explicitly mentioned
- "Create user documentation for [feature]"

**Action:** Load [modes/mode4-docs.md](modes/mode4-docs.md) and execute Mode 4 workflow.

**Prerequisites:**
- Code context is mandatory (do not generate docs from Jira alone)
- Atlassian MCP conditional (only if Jira key provided)
- Documentation Format Validation Sequence must pass before file creation
- See [shared/preflight.md](shared/preflight.md) for validation sequences

---

## 🎛️ Mode Selection Decision Tree

```text
Does request mention specific Jira key to improve?
  └─ Yes ──▶ Mode 2 (Improve Existing Story)
  
Does request ask to create/write a new story?
  └─ Yes ──▶ Mode 1 (Create New Story) - assumes story is ready
  
Does request mention "test cases", "Zephyr", or "generate tests"?
  └─ Yes ──▶ Mode 3 (Generate and Publish Tests)
  
Does request mention "documentation", "help", or "user guide"?
  └─ Yes ──▶ Mode 4 (Generate Documentation)
  
Still unclear?
  └─ Ask user to specify mode (1, 2, 3, or 4)
```

---

## ⚙️ Operating Mode Requirements

| Mode | Purpose | Atlassian MCP | Zephyr MCP | File |
| --- | --- | --- | --- | --- |from approved story and publish | ⚡ Optional
| **1** — Create Story | Build new story from scratch | ❌ Not required | ❌ Not required | [mode1-create.md](modes/mode1-create.md) |
| **2** — Update Story | Improve existing Jira story | ✅ Read-only | ❌ Not required | [mode2-improve.md](modes/mode2-improve.md) |
| **3** — Zephyr Tests | Generate tests and publish | ✅ Read-only | ✅ Required | [mode3-zephyr.md](modes/mode3-zephyr.md) |
| **4** — Documentation | Generate user docs with validation | ⚡ Conditional | ❌ Not required | [mode4-docs.md](modes/mode4-docs.md) |

---

## 📚 Shared Resources

All modes reference these common files:

| Resource | Purpose | Location |
| --- | --- | --- |
| **Preflight & Anti-Rationalization** | Shared checks, sequences, approval gates, Google DNA | [shared/preflight.md](shared/preflight.md) |
| **Story Format Guide** | 6-section story requirements | [references/story-format.md](references/story-format.md) |
| **Documentation Format Guide** | Internal/external docs format | [references/documentation-format.md](references/documentation-format.md) |
| **Excel Template Format** | Zephyr import structure | [references/excel-template-format.md](references/excel-template-format.md) |
| **Atlassian MCP Installation** | HTTP/stdio setup for Jira read-only | [references/installation-atlassian.md](references/installation-atlassian.md) |
| **Zephyr Script Installation** | Direct API client setup (Node.js) | [references/installation-zephyr.md](references/installation-zephyr.md) |

---

## 🔄 Router Execution Flow

```text
1. Parse user request
   ↓
2. Match trigger phrase to mode (1, 2, 3, or 4)
   ↓
3. Load mode-specific file + shared/preflight.md
   ↓
4. Execute mode workflow
   ↓
5. Return to router (if needed for follow-up)
```

**Progressive disclosure in action:** Only the selected mode's content is loaded. Router remains lightweight (~170 lines).

---

## 💡 Example Routing

| User Request | Detected Mode | Loaded Files |
| --- | --- | --- |(assumes story is ready) 
| "Create a new user story for payment processing" | Mode 1 | SKILL.md (router) + mode1-create.md + shared/preflight.md |
| "Improve user story ELT-456" | Mode 2 | SKILL.md (router) + mode2-improve.md + shared/preflight.md |
| "Generate Zephyr test cases for CI-789" | Mode 3 | SKILL.md (router) + mode3-zephyr.md + shared/preflight.md |
| "Generate help document for carrier signup" | Mode 4 | SKILL.md (router) + mode4-docs.md + shared/preflight.md |

---

## 🚫 Router-Level Safety Rules

- ❌ Do not load all mode files at once — use progressive disclosure
- ❌ Do not proceed without clear mode identification — ask if unclear
- ❌ Do not mix workflows from multiple modes in a single execution
- ❌ Do not skip loading shared/preflight.md — it contains critical anti-rationalization tables

---

## 📦 Why Progressive Disclosure?

**Before (monolithic SKILL.md):**
- 900+ lines loaded into context every time
- Mode 1 work loads Mode 2/3/4 content unnecessarily
- Token waste, context pollution, degraded performance

**After (split architecture):**
- Router: ~170 lines
- Active mode: ~200-400 lines
- Shared: ~350 lines
- **Total context: ~720-920 lines vs. 900+ always**
- **Token savings: ~20-40% depending on mode**

> **Addy Osmani's principle:** "Do not load all twenty skills into context at session start. Activate them based on the phase."

---

## 📄 File Structure

```text
.github/skills/userstory-testcases-zephyr/
├── SKILL.md (router — this file)
├── shared/
│   └── preflight.md (anti-rationalization, Google DNA, MCP sequences)
├── modes/
│   ├── mode1-create.md (create new story workflow)
│   ├── mode2-improve.md (improve existing story workflow)
│   ├── mode3-zephyr.md (generate and publish Zephyr tests workflow)
│   └── mode4-docs.md (generate documentation workflow)
├── references/
│   ├── story-format.md
│   ├── documentation-format.md
│   ├── excel-template-format.md
│   ├── installation-atlassian.md
│   └── installation-zephyr.md
└── templates/
    ├── atm-exporter.xlsx (Zephyr import template)
    └── review-request.md
```

---

## ⚠️ Migration Note

**Original monolithic SKILL.md backed up as:** `SKILL.md.backup-[timestamp]`

If you need to revert, restore the backup file. The new split architecture is backward-compatible — all workflows remain identical, just progressively loaded.

---

## 🎓 Credits

This progressive disclosure architecture follows principles from [Addy Osmani's Agent Skills](https://addyosmani.com/blog/agent-skills/):

- **Process over prose** — Workflows with checkpoints, not essays
- **Anti-rationalization tables** — Pre-written rebuttals to shortcuts
- **Verification mandatory** — Concrete evidence terminates every workflow
- **Progressive disclosure** — Load only relevant content into context
- **Scope discipline** — Touch only what's requested

Google engineering practices encoded throughout (Hyrum's Law, Test Pyramid, ~100-line PR sizing, Shift Left, Launch Checklists).
