---
name: userstory-testcases-zephyr
description: "Create, improve, test, and publish user stories with Zephyr integration and audience-specific documentation generation."
---

# 🚀 User Story & Zephyr Test Management — Complete Workflow

Manage the complete lifecycle of user stories from creation through Zephyr test publication. Generate business-focused stories, create testable requirements, produce audience-specific user documentation with format validation, and enforce approval gates at every stage.

---

## ✨ What This Skill Does

Create engaging, testable user stories grounded in codebase context. Automatically generate Zephyr test cases with traceability. Produce separate, format-validated user documentation for internal (admin) and external (carrier) audiences.

| Capability | What It Does |
| --- | --- |
| 📖 Story Creation | Build 6-section stories with Given/When/Then acceptance criteria |
| 🔍 Story Improvement | Enrich existing Jira stories with codebase context and validations |
| 🧪 Test Generation | Create positive, negative, boundary, and integration test cases |
| 📤 Test Publishing | Publish directly to Zephyr Scale Cloud after approval |
| 📚 Documentation | Generate format-validated user docs (internal + external) |

---

## 🎯 Quick Start — Four Ways to Use

Choose the mode that fits your task:

### Mode 1️⃣  — Create a New Story

**When:** You have a feature request and need a business-ready story

```
Create a new user story for [feature description]
```

**What happens:**
1. You confirm the Jira project key
2. Skill inspects codebase for context
3. Story generated with all 6 sections
4. You review and approve
5. Jira issue created automatically

**Output:** Jira issue with complete story

---

### Mode 2️⃣  — Update an Existing Story

**When:** You want to improve a Jira story with codebase insights

```
Improve user story ELT-123
```

**What happens:**
1. Atlassian MCP fetches the story from Jira
2. Codebase is inspected for domain context
3. Story is enriched: better criteria, validation rules, edge cases
4. You review improvements
5. Jira issue updated automatically

**Output:** Enhanced Jira issue with improved content

---

### Mode 3️⃣  — Generate & Publish Zephyr Tests

**When:** You have an approved story and need test cases for execution

```
Create test cases for ELT-123 and publish to Zephyr
```

**What happens:**
```
┌─────────────────────────────────────────────────────────┐
│ 1. Story → Improved & Approved                         │
│ 2. Test Cases Generated (positive/negative/boundary)   │
│ 3. Mapped to Acceptance Criteria for traceability      │
│ 4. You review test set                                 │
│ 5. Published to Zephyr Scale Cloud                     │
│                                                         │
│ Result: Ready-to-execute test cases linked to story   │
└─────────────────────────────────────────────────────────┘
```

**Requires:** Atlassian MCP + Zephyr MCP

---

### Mode 4️⃣  — Generate User Documentation

**When:** You need help documentation (internal admin or external carrier guides)

```
Generate help document for ELT-123
```
or
```
Generate internal and external help documentation for [feature name]
```

**What happens:**
```
┌──────────────────────────────────────────────────────────┐
│ Step 1: Code Context Validation                         │
│ ✅ Codebase accessible and sufficient                   │
│                                                          │
│ Step 2: Domain Inspection                               │
│ • Endpoints, DTOs, validators, error messages           │
│ • Business rules from code analysis                     │
│                                                          │
│ Step 3: Generate Documentation                          │
│ • Internal: admin fields, back-office procedures        │
│ • External: carrier perspective, hidden fields excluded │
│                                                          │
│ Step 4: Format Validation (NEW!)                        │
│ ✅ Heading ✅ Sections ✅ Tables ✅ Audience Rules     │
│                                                          │
│ Step 5: Save to docs/ Folder                            │
│ docs/internal/[module]/[feature].md                     │
│ docs/external/[module]/[feature].md                     │
└──────────────────────────────────────────────────────────┘
```

**Output:** Format-validated markdown files in `docs/` folder

---

## 🎯 Mode Selection Decision Matrix

| Your Situation | Best Mode | Why | Output |
| --- | --- | --- | --- |
| You have a feature request | **Mode 1** | Create story from scratch | Jira issue |
| You want to improve a Jira story | **Mode 2** | Enrich with codebase context | Updated Jira issue |
| You need Zephyr test cases | **Mode 3** | Tests from story + publish | Zephyr Scale Cloud |
| You need user help documentation | **Mode 4** | Generate audience-specific docs | Markdown files in docs/ |
| You want one complete workflow | **Mode 1 + 2 + 3** | Create, improve, test, publish | Jira + Zephyr |
| You want docs + tests | **Mode 3 + 4** | Tests + documentation | Zephyr + docs/ |

---

## 📋 What You'll Need

### For All Modes
- ✅ Access to workspace codebase

### For Mode 1 (Story Creation)
- ✅ Jira project key (we'll ask you to confirm)

### For Mode 2 (Story Update)
- ✅ Atlassian MCP Server (read-only)
- ✅ Existing Jira issue key

### For Mode 3 (Zephyr Publishing)
- ✅ Atlassian MCP Server (read-only)
- ✅ Zephyr MCP Server
- ✅ JIRA_API_TOKEN
- ✅ ZEPHYR_API_TOKEN

### For Mode 4 (Documentation)
- ✅ Codebase context (required)
- ✅ Atlassian MCP (optional, for Jira context)
- ✅ Write permission to `docs/` folder

---

## 🎓 The 6-Section Story Format

Every story includes these required sections:

| Section | What It Contains | Example |
| --- | --- | --- |
| **User Story** | Role, goal, benefit | "As a lienholder, I want to provide my ELT ID so that my account can be verified..." |
| **Description** | Context, scope, constraints, dependencies | Business context, data flow, external systems involved |
| **Acceptance Criteria** | Given/When/Then format, testable | Given a Lienholder account / When registering / Then ELT ID is required |
| **Validation Rules** | Field-level constraints from code | ELT ID max 20 chars, must be alphanumeric, immutable after creation |
| **Edge Cases** | Boundary conditions, special scenarios | Duplicate ELT ID, special characters, Unicode handling |
| **Error Handling** | User-facing error messages | "Invalid ELT ID format. Please enter..." |

---

## ✅ Approval Gates — Three Checkpoints

Before any external write (Jira, Zephyr, docs/), you must approve:

| Gate | Trigger | When | Action |
| --- | --- | --- | --- |
| 🔴 **Jira Review** | After story improvement/creation | Mode 1/2 | Review story → `APPROVED_FOR_JIRA_UPDATE` |
| 🟡 **Zephyr Review** | After test case generation | Mode 3 | Review tests → `APPROVED_FOR_ZEPHYR_PUBLISH` |
| 🟢 **Changes Needed** | Anytime | Any mode | Respond with `CHANGES_REQUIRED: <comments>` |

> **Tokens are case-sensitive!** Copy-paste them exactly.

---

## 📚 Documentation Format (Mode 4)

Generated documentation MUST follow the required format:

### ✅ Mandatory Structure

```markdown
# [Feature Name] — [Internal User Guide | External User Guide]

## Overview
Plain-language description of what the feature does

## When to Use This
Business scenario that leads to this feature

## How to Access
Navigation path to reach this feature

## [Feature Section]
Brief description of what this section covers

### Field Guide
| Field | Description | Required? | Notes |
| --- | --- | --- | --- |

## Buttons
| Button | What It Does |
| --- | --- |

## Business Rules
- List of rules and validations enforced by the system
```

### ✅ Audience Rules

| Internal Documentation | External Documentation |
| --- | --- |
| ✅ ALL fields (admin + user-visible) | ❌ Hidden/admin-only fields EXCLUDED |
| ✅ Back-office procedures | ❌ Internal-only workflows |
| ✅ Admin overrides & exceptions | ❌ Supervisor-level procedures |
| ✅ Operational notes | ✅ Carrier/lienholder perspective |

### ❌ Never Include

- Embedded story sections (User Story, Acceptance Criteria, etc.)
- Class names, method names, technical implementation details
- Database terminology or HTTP mechanics
- Jira text without code grounding

---

## 🌿 Approval Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│ START: Mode Selection                                        │
└──────────────────────────────────────────────────────────────┘
                              ⬇️
                    ┌─────────┴─────────┐
                    │                   │
            Mode 1/2 Story?      Mode 3/4 Other?
                    │                   │
                    ⬇️                   ⬇️
        ┌─────────────────────┐  ┌──────────────────┐
        │ Create/Update Story │  │ Generate Tests   │
        │ (Review)            │  │ or Docs          │
        └──────────┬──────────┘  │ (Review)         │
                   │             └────────┬─────────┘
                   ⬇️                     ⬇️
        ┌─────────────────────────────────────────────┐
        │ 🔴 JIRA REVIEW GATE                         │
        │ Respond: APPROVED_FOR_JIRA_UPDATE           │
        │ or: CHANGES_REQUIRED: <comments>            │
        └────────────┬────────────────────────────────┘
                     ⬇️
            ┌─────────────────────────────────┐
            │ ✅ JIRA UPDATE (write operation) │
            └─────────────────────────────────┘
                            │
                   ┌────────┴────────┐
                   │                 │
              Mode 1/2        Mode 3/4
              (Stop)      (Continue)
                   │            ⬇️
                   │    ┌──────────────────┐
                   │    │ Zephyr/Doc Gate  │
                   │    │ (if applicable)  │
                   │    └────────┬─────────┘
                   │             ⬇️
                   │    ┌──────────────────┐
                   │    │ ✅ PUBLISH/SAVE  │
                   │    └──────────────────┘
                   ⬇️
        ┌─────────────────────────────────┐
        │ ✨ COMPLETE                     │
        │ Story + Tests + Docs ready!     │
        └─────────────────────────────────┘
```

---

## 🚀 Example Workflows

### Scenario 1: Create Story → Test → Publish

```
1. Create story: Create a new user story for ELT ID validation
2. Confirm Jira project: MVS
3. Review story → APPROVED_FOR_JIRA_UPDATE
4. Jira issue created: MVS-2607
5. Generate tests: Create test cases for MVS-2607 and publish
6. Review tests → APPROVED_FOR_ZEPHYR_PUBLISH
7. Tests published: MVS-T1391 through MVS-T1406
✅ DONE: Story + 16 test cases ready
```

### Scenario 2: Just Documentation

```
1. Generate help document for MVS-2607
2. Select audience: Internal (admin + back-office)
3. Skill inspects codebase
4. Validates format (heading, sections, tables, audience rules)
5. Saves: docs/internal/customer/lienholder_signup_elt_id.md
✅ DONE: Internal help document ready for team
```

### Scenario 3: Improve Story Without Publishing

```
1. Improve user story MVS-2607
2. Atlassian MCP fetches story from Jira
3. Codebase inspected for context
4. Review improvements → APPROVED_FOR_JIRA_UPDATE
5. Jira issue updated (no Zephyr publish)
✅ DONE: Story enhanced, no tests generated
```

---

## 🛠️ Preflight Checks

The skill runs automatic readiness checks:

```
MODE 1 (Story Creation)
  ✅ Jira project key confirmation

MODE 2 (Story Update)
  ✅ Atlassian MCP Server readiness
  ✅ Jira connectivity test

MODE 3 (Zephyr Publishing)
  ✅ Atlassian MCP Server readiness
  ✅ Zephyr MCP Server readiness
  ✅ Excel template validation
  ✅ API credentials test

MODE 4 (Documentation)
  ✅ Code context availability
  ✅ Atlassian MCP (if Jira context requested)
  ✅ Documentation Format Validation Sequence
  ✅ docs/ folder structure creation
```

If a check fails, the skill attempts automatic correction before stopping.

---

## 📊 Quick Reference Card

```
┌───────────────────────────────────────────────────────────────┐
│ USER STORY & ZEPHYR — QUICK REFERENCE                        │
├───────────────────────────────────────────────────────────────┤
│ COMMAND PATTERNS                                              │
│                                                               │
│ MODE 1: Create a new user story for [description]           │
│ MODE 2: Improve user story [ELT-123]                        │
│ MODE 3: Create test cases for [ELT-123] and publish         │
│ MODE 4: Generate help document for [ELT-123]                │
├───────────────────────────────────────────────────────────────┤
│ APPROVAL TOKENS (Case-Sensitive!)                            │
│                                                               │
│ ✅ APPROVED_FOR_JIRA_UPDATE                                 │
│ ✅ APPROVED_FOR_ZEPHYR_PUBLISH                              │
│ ❌ CHANGES_REQUIRED: <your comments>                        │
├───────────────────────────────────────────────────────────────┤
│ STORY STRUCTURE (6 Sections)                                 │
│                                                               │
│ 1. User Story (role, goal, benefit)                         │
│ 2. Description (context, scope)                             │
│ 3. Acceptance Criteria (Given/When/Then)                    │
│ 4. Validation Rules (field-level constraints)               │
│ 5. Edge Cases (boundary conditions)                         │
│ 6. Error Handling (user-facing messages)                    │
├───────────────────────────────────────────────────────────────┤
│ OUTPUT LOCATIONS                                              │
│                                                               │
│ Story: Jira issue (created or updated)                       │
│ Tests: Zephyr Scale Cloud                                    │
│ Docs: docs/internal/[module]/[feature].md                    │
│       docs/external/[module]/[feature].md                    │
├───────────────────────────────────────────────────────────────┤
│ 🎯 PRO TIPS                                                  │
│                                                               │
│ • Use Mode 4 to generate docs AFTER tests are published     │
│ • Format validation is MANDATORY for Mode 4                 │
│ • Codebase is PRIMARY source; Jira is secondary             │
│ • Always review before approving (no auto-publish)          │
│ • Test coverage includes positive/negative/boundary cases   │
└───────────────────────────────────────────────────────────────┘
```

---

## 🎓 Learning Path

### 1️⃣  First Time (20 minutes)

- Create a simple story: `Create a new user story for [small feature]`
- Choose Jira project when prompted
- Review the generated story
- Approve with `APPROVED_FOR_JIRA_UPDATE`
- See your first Jira issue created

### 2️⃣  Getting Comfortable (Next few uses)

- Try Mode 2: Improve an existing Jira story
- Generate test cases: `Create test cases for [your story]`
- Experiment with different audience docs: internal vs external

### 3️⃣  Advanced Usage

- Run full workflow: Create → Improve → Test → Publish
- Generate both internal and external documentation
- Contribute custom validation patterns

---

## 📞 Support & References

| Need | Resource |
| --- | --- |
| Story format details | [story-format.md](references/story-format.md) |
| Documentation format | [documentation-format.md](references/documentation-format.md) |
| Zephyr import schema | [excel-template-format.md](references/excel-template-format.md) |
| Atlassian MCP setup | [installation-atlassian.md](references/installation-atlassian.md) |
| Zephyr MCP setup | [installation-zephyr.md](references/installation-zephyr.md) |
| Mode-specific prompts | [.github/prompts/](../../prompts/) |

---

## ✨ Ready to Start?

Pick your first task and the corresponding mode:

```
🎯 I want to create a new story
   → Create a new user story for [feature description]

🎯 I want to improve a Jira story  
   → Improve user story [ELT-123]

🎯 I want to generate Zephyr tests
   → Create test cases for [ELT-123] and publish

🎯 I want to generate user documentation
   → Generate help document for [ELT-123]
```

Happy building! 🚀
