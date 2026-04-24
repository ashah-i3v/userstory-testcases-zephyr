---
name: userstory-testcases-zephyr
description: "Use when a user story must be created or improved, reviewed before Jira update, converted into Zephyr test cases, and reviewed again before Zephyr publish. Supports Atlassian MCP Server (read-only), Zephyr MCP setup, gated approvals, BA/PO-friendly story output, and separate internal or external documentation generation."
---

# User Story Improvement And Zephyr Test Management

## Overview
Use this skill to create or improve user stories, prepare them for Jira, generate Zephyr test cases, and enforce approval gates before any external write occurs.

This workflow is designed for business-facing story output with traceable, testable requirements and controlled Jira/Zephyr updates.

## When To Use This Skill
- Create a new user story from a feature request or business need.
- Improve an existing Jira story before updating it.
- Generate Zephyr test cases from an approved story and publish them after review.
- Generate internal or external user documentation as a separate deliverable when requested.

## Trigger Phrases

### 1. Create A New Story
```text
Create a new user story for [feature description]
```
The skill must confirm the Jira project key with the user before proceeding.

### 2. Update An Existing Jira Story
```text
Improve user story ELT-123
```
```text
Review and improve this user story: [paste story text]
```

### 3. Generate Zephyr Tests And Publish
```text
Create test cases for ELT-123 and publish to Zephyr
```
```text
Generate Zephyr test cases for user story: [paste story text]
```

### 4. Generate Help Document
```text
Generate help document for [feature name]
```
```text
Create internal and external help documentation for [feature name]
```
```text
Generate help document for ELT-123
```

## Approval Tokens
Use the following tokens exactly as written:

| Gate | Token |
| --- | --- |
| Jira review approval | `APPROVED_FOR_JIRA_UPDATE` |
| Zephyr publish approval | `APPROVED_FOR_ZEPHYR_PUBLISH` |
| Revision request | `CHANGES_REQUIRED: <comments>` |

Approval tokens are case-sensitive.

## Operating Modes

| Mode | Purpose | Atlassian MCP Required | Zephyr MCP Required |
| --- | --- | --- | --- |
| 1 | Create a new story | No | No |
| 2 | Update an existing Jira story | Yes (read-only) | No |
| 3 | Generate Zephyr tests and publish | Yes (read-only) | Yes |
| 4 | Generate help document | Conditional, when Jira context is requested or required | No |

## Required Inputs
- Operation mode: `1`, `2`, `3`, or `4`
- Story source:
  - Jira issue key, or
  - Raw user story text
- Optional context:
  - Priority or risk
  - Feature or module name
  - Environment constraints
  - Release or sprint context
  - Zephyr Excel template file (`atm-exporter.xlsx`) used as the canonical import format for mode 3
  - Documentation output request: `internal`, `external`, or `both`
  - Documentation module name and feature name for output file naming

### Mode 4 Input Rules
- Mode 4 may use a Jira issue key as the primary source when documentation should be generated from an existing story or requirement.
- If a Jira issue key is provided for mode 4, Jira issue details must be used together with codebase context and any existing documentation.
- If no Jira issue key is provided for mode 4, the feature name, module name, and enough functional context must be provided to generate documentation accurately.

## Codebase Context Requirements
Before writing or improving any story, inspect the current codebase to gather domain context. Use that context to improve accuracy, but translate technical findings into business language.

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
- Use findings to improve Acceptance Criteria, Validation Rules, Edge Cases, and Error Handling Scenarios.
- For documentation generation, codebase context is required. Do not generate help documentation from Jira text alone.
- For mode 3, use the Zephyr Excel template structure exactly (sheet, columns, ordering, and expected field formats).
- Prefer business concepts and user-observable outcomes over implementation details.
- Do not expose class names, method names, framework names, routes, database terminology, or HTTP mechanics in the story.
- If the codebase is incomplete or the feature is new, record assumptions explicitly.
- Log each meaningful codebase inspection in the Execution Log.

## Required Story Format
**See:** [Story Format Guide](references/story-format.md) for complete requirements.

**Summary:**
- Use 6 required sections: User Story, Description, Acceptance Criteria, Validation Rules, Edge Cases, Error Handling Scenarios
- Write Given/When/Then acceptance criteria
- Focus on business outcomes, not implementation details
- Keep all criteria testable, specific, and measurable

## Documentation Output Option
**See:** [Documentation Format Guide](references/documentation-format.md) for complete requirements.

**Summary:**
- Documentation is a separate output from the story
- Generate markdown files for internal, external, or both audiences
- Use current codebase as primary source; Jira as secondary context
- Output paths: `docs/internal/[module]/[feature].md` and `docs/external/[module]/[feature].md`

## Zephyr Excel Import Format (Mode 3)
**See:** [Excel Template Format Guide](references/excel-template-format.md) for complete requirements.

**Summary:**
- Template file: `.github/skills/userstory-testcases-zephyr/templates/atm-exporter.xlsx`
- Worksheet: `Sheet0` with header row 1
- 18 required columns in exact order (Key, Name, Status, Precondition, Objective, etc.)
- Generate positive, negative, boundary, and integration test cases
- Map each test case to acceptance criteria for traceability

## External Dependencies

### Atlassian MCP Server
**See:** [Atlassian MCP Installation Guide](references/installation-atlassian.md) for complete setup instructions.

**Summary:**
- **Options:** HTTP (Rovo - Recommended) or stdio (Local)
- **Required for:** Modes 2, 3, and 4 (when Jira context needed)
- **Purpose:** Read-only access to Jira for inspecting stories and requirements
- **HTTP Config:** `{"type": "http", "url": "https://mcp.atlassian.com/v1/mcp"}`
- **stdio Config:** `{"type": "stdio", "command": "npx", "args": ["-y", "@atlassianlabs/mcp-server-atlassian"]}`
- **Available Tools:** `getJiraIssue`, `searchJiraIssues`, `listJiraProjects`, `getJiraProject`

### Zephyr MCP Server
**See:** [Zephyr MCP Installation Guide](references/installation-zephyr.md) for complete setup instructions.

**Summary:**
- **Server:** `jira-zephyr-mcp`
- **Source:** https://github.com/leorosignoli/jira-zephyr-mcp
- **Required for:** Mode 3 only
- **Purpose:** Manage Zephyr test plans, cycles, and test publication workflows
- **Prerequisites:** Node.js 18+, Jira API token, Zephyr API token
- **Config Location:** `.vscode/mcp.json` with environment values for JIRA_BASE_URL, JIRA_USERNAME, JIRA_API_TOKEN, ZEPHYR_API_TOKEN

## Preflight Policy
Run preflight before any story generation, Jira update, or Zephyr action.

All preflight checks are active, not passive. Use terminal tool calls to run verification commands. Do not assume an MCP server is available, installed, or running without executing the commands. Before returning any failure code, attempt the corrective action described for that step. Only return a failure code after the corrective action has been tried and failed.

### Base Checks
1. Validate the selected mode.
2. Validate the story identifier format when a Jira issue key is provided.
3. For mode 1, ask the user to confirm the Jira project key and do not proceed until it is explicitly confirmed.
4. For mode 2, complete the Atlassian MCP Server Readiness Sequence before any further action.
5. For mode 3, complete the Atlassian MCP Server Readiness Sequence and then the Zephyr MCP Readiness Sequence before any further action.
6. For mode 3, validate that `atm-exporter.xlsx` is available, readable, and mappable before generating any test cases.
7. For mode 4, validate that the requested documentation audience and output naming inputs are present before any further action.
8. For mode 4, require either a Jira issue key or sufficient feature context to identify the correct screens, sections, and business workflow.
9. For mode 4, if a Jira issue key is provided, complete the Atlassian MCP Server Readiness Sequence before reading Jira context.
10. For mode 4, confirm that relevant code context is available before generating documentation. If code context is insufficient, stop with `PRECONDITION_FAILED`.
11. If required MCP servers (Atlassian or Zephyr) are not available to the current chat session, do not continue. Instruct the user to install and configure the required MCP servers following the installation steps, then ask them to start a new session and stop with `MCP_SESSION_RESTART_REQUIRED`.

### Atlassian MCP Server Readiness Sequence
Stop immediately if any step fails. Do not attempt automatic installation or configuration.

#### Step 1: Verify MCP Server Installation
- Check the MCP configuration file (`.vscode/mcp.json` or user MCP config) for an `atlassian` server entry.
- Verify the server type is either:
  - `"type": "http"` with URL `https://mcp.atlassian.com/v1/mcp` (Atlassian Rovo), OR
  - `"type": "stdio"` with command `npx` and args containing `@atlassianlabs/mcp-server-atlassian`
- Search for Atlassian MCP tools by attempting to use tool_search_tool_regex with pattern `atlassian.*jira|jira.*issue`.
- If Atlassian MCP tools are not available in the current session or configuration is missing:
  - Display the installation steps from the External Dependencies section.
  - Instruct the user to:
    1. Install the Atlassian MCP Server (HTTP Rovo or stdio from npm `@atlassianlabs/mcp-server-atlassian`)
    2. Add to VS Code MCP configuration or Copilot CLI configuration
    3. Configure OAuth sign-in for Jira (and optionally Confluence) with read-only scopes
    4. For stdio servers: Restrict the server to read-only operations (deny create*/update*/delete*/add*/edit*)
    5. Start a new chat session after installation
  - Reference: https://github.com/atlassian/atlassian-mcp-server or https://mcp.atlassian.com
  - Stop immediately with `ATLASSIAN_MCP_NOT_INSTALLED`.

#### Step 2: Verify Read-Only Configuration
- **For HTTP (Rovo) Configuration:**
  - Read-only access is enforced through OAuth scopes at the Atlassian server level.
  - No local verification is needed; proceed to Step 3.
  
- **For stdio Configuration:**
  - Verify that only read operations are available.
  - Check that write operations are not accessible:
    - `createJiraIssue` - must be disabled
    - `updateJiraIssue` - must be disabled
    - `addJiraComment` - must be disabled
    - `createConfluencePage` - must be disabled
    - `updateConfluencePage` - must be disabled
    - `deleteJiraIssue` - must be disabled
  - If any write operations are available:
    - Warn the user that the MCP server is not properly restricted.
    - Instruct them to update the server configuration with tool restrictions:
      - `"allow": ["get*", "fetch*", "search*", "list*"]`
      - `"deny": ["create*", "update*", "delete*", "add*", "edit*"]`
  - If any write operations are available:
    - Warn the user that the MCP server is not properly restricted.
    - Instruct them to update the server configuration with tool restrictions:
      - `"allow": ["get*", "fetch*", "search*", "list*"]`
      - `"deny": ["create*", "update*", "delete*", "add*", "edit*"]`
    - Stop with `ATLASSIAN_MCP_NOT_READONLY`.

#### Step 3: Verify Jira Site Access
- Search for available Atlassian/Jira MCP tools using tool_search_tool_regex with pattern `atlassian|jira`.
- If tools are found, attempt to use a read operation to verify connectivity.
- If no Atlassian MCP tools are found or the read operation fails:
  - Ask the user to verify their Atlassian OAuth authentication is active.
  - Ask them to verify network connectivity to Jira.
  - For HTTP servers: Verify the OAuth token hasn't expired and re-authenticate if needed.
  - For stdio servers: Verify npm/npx can reach the package registry.
  - Stop with `ATLASSIAN_MCP_CONNECTIVITY_FAILED`.

#### Step 4: Confirm Readiness
- Record `[Atlassian MCP Server] Ready (Read-Only)` in the Execution Log.
- Proceed only after all previous steps pass.

### Zephyr MCP Readiness Sequence
Stop immediately if any step fails after its corrective action was attempted. Attempt the corrective action for each step before returning a failure code.

#### Step 1: Verify Installation
- Run `node --version` to confirm Node.js 18 or later is available.
- Check whether a `jira-zephyr-mcp` directory exists locally with a `dist/` build output.
- If the directory does not exist or `dist/` is missing:
  - Run `git clone https://github.com/leorosignoli/jira-zephyr-mcp.git` into a local directory.
  - Run `cd jira-zephyr-mcp && npm install` to install dependencies.
  - Run `npm run build` to produce the build output.
  - Verify that `dist/index.js` exists after the build.
- If Node.js is not available, prompt the user to install Node.js 18 or later and stop with `MCP_INSTALL_FAILED`.
- If the clone, install, or build fails, return `MCP_INSTALL_FAILED`.

#### Step 2: Verify Configuration
- Check each of the following locations in order for Zephyr MCP environment values:
  - `.env` file in the `jira-zephyr-mcp` directory
  - `.vscode/mcp.json` in the workspace
  - VS Code user settings under the `github.copilot.mcp.servers` key
- Confirm that `JIRA_BASE_URL`, `JIRA_USERNAME`, `JIRA_API_TOKEN`, and `ZEPHYR_API_TOKEN` are present and non-empty in at least one location.
- Confirm that MCP config includes a `jira-zephyr-mcp` server entry.
- If any required value is missing:
  - List each missing value explicitly.
  - Ask the user to supply the missing values. Do not proceed until they respond.
  - Write the supplied values to `.env` in the `jira-zephyr-mcp` directory.
  - Re-read the file to confirm the write succeeded.
- If the `jira-zephyr-mcp` server entry is missing from MCP config:
  - Create or update `.vscode/mcp.json` with a `jira-zephyr-mcp` entry using the example schema above.
  - If workspace config cannot be written, create or update the user MCP config file instead.
  - Preserve all existing `servers` entries and update only the `jira-zephyr-mcp` node.
  - Re-read the config file to confirm the server entry exists.
- If any required value remains missing after the prompt and write attempt, return `MCP_ENV_MISSING`.

#### Step 3: Verify Runtime
- Start or restart MCP servers after configuration changes.
- Call a Zephyr MCP tool to check whether the server is responding.
- If the call fails because the server is not running:
  - Attempt to start it by running `node dist/index.js` from the `jira-zephyr-mcp` directory with the validated environment values loaded.
  - Wait for the server to respond before continuing.
- If startup fails or the server does not respond after the start attempt, return `MCP_START_FAILED`.
- If the server is running but Zephyr MCP tools are still unavailable in the current session:
  - Ask the user to start a new chat session so MCP tool availability can refresh.
  - Stop immediately with `MCP_SESSION_RESTART_REQUIRED`.

#### Step 4: Verify Connectivity
- Execute a test call to confirm Zephyr connectivity and Jira API access, such as listing test cycles for a known project.
- If authentication fails, ask the user to verify the `ZEPHYR_API_TOKEN` and `JIRA_API_TOKEN` values and retry once.
- If the retry also fails, return `MCP_AUTH_FAILED`.

#### Step 5: Confirm Readiness
- Record `[Zephyr MCP] Ready` in the Execution Log.
- Proceed only after all previous steps pass.

### Preflight Failure Codes
| Error Code | Scope | Meaning |
| --- | --- | --- |
| `ATLASSIAN_MCP_NOT_INSTALLED` | Atlassian MCP | Atlassian MCP Server is not installed or not available in current session |
| `ATLASSIAN_MCP_NOT_READONLY` | Atlassian MCP | Atlassian MCP Server has write permissions enabled; must be restricted to read-only |
| `ATLASSIAN_MCP_CONNECTIVITY_FAILED` | Atlassian MCP | Cannot connect to Jira via Atlassian MCP Server |
| `MCP_INSTALL_FAILED` | Zephyr MCP | Zephyr MCP could not be cloned, installed, or built |
| `MCP_ENV_MISSING` | Zephyr MCP | One or more required Zephyr MCP values are missing |
| `MCP_START_FAILED` | Zephyr MCP | Zephyr MCP failed to start |
| `MCP_AUTH_FAILED` | Zephyr MCP | Zephyr MCP authentication failed (Jira API or Zephyr API credentials invalid) |
| `MCP_SESSION_RESTART_REQUIRED` | Session | MCP servers were installed or configured; user must start a new chat session |
| `ZEPHYR_TEMPLATE_INVALID` | Zephyr Import | Template file is missing, unreadable, or incompatible with expected import format |
| `PRECONDITION_FAILED` | General | Another preflight requirement failed |

> Fail fast: do not continue to story work, Jira updates, or Zephyr actions until all required prerequisites are satisfied.

## Workflow

### 1. Preflight
- Run all required checks using terminal tool calls and MCP tool calls.
- For each failed check, execute the corrective action defined in the readiness sequence before returning a failure code.
- Log the outcome of every verification and corrective action in the Execution Log.
- If MCP servers were started or restarted during preflight and tools are still unavailable in this session, instruct the user to start a new session and stop with `MCP_SESSION_RESTART_REQUIRED`.
- Stop immediately if any prerequisite fails after the corrective action was attempted.

### 2. Mode Routing
- Mode 1: create a new story after the Jira project key is confirmed.
- Mode 2: improve the story and update Jira after approval.
- Mode 3: improve the story, generate test cases, and publish to Zephyr after approvals.
- Mode 4: generate help documentation as a separate markdown deliverable for the requested audience, using code context and optional Jira context.

### 3. Read, Normalize, And Enrich From Codebase
- Extract role, goal, benefit, constraints, dependencies, and non-functional expectations.
- Inspect the codebase for relevant endpoints, DTOs, validators, domain entities, and error models.
- Inspect any existing help, support, or release documentation relevant to the feature when available.
- If a Jira issue key is provided, inspect the Jira issue for business context, scope, and terminology after Atlassian MCP Server readiness is confirmed.
- Use codebase findings to improve validation rules, allowed values, edge cases, and error outcomes.
- Use documentation findings to determine whether a separate documentation output should be generated and what guidance must change.
- Inspect audience-specific visibility rules when present so internal and external documents reflect the actual user experience.
- Translate technical findings into business language before including them in the story.
- Log each relevant file or module inspected.

### 4. Review Story Quality
Evaluate the draft for:
- clarity and completeness
- testability
- measurable acceptance criteria
- edge and error path coverage
- dependency visibility

### 5. Propose Story Improvements
Provide:
- an improved story using the required section format
- refined Given/When/Then acceptance criteria
- validation rules, edge cases, and error handling scenarios grounded in the codebase
- assumptions and open questions
- suggested Jira field updates

Do not write to Jira at this stage.

If documentation output was requested or clearly needed, also provide:
- the documentation audience requested: internal, external, or both
- the source context used: codebase only, or codebase plus Jira
- the target output path for each markdown file
- the generated documentation content using the Documentation Output Format

### 6. Jira Review Gate
- Present the improved story for review.
- Accept only:
  - `APPROVED_FOR_JIRA_UPDATE`
  - `CHANGES_REQUIRED: <comments>`
- If approval is not granted, stop with a pending Jira review state.

### 7. Jira Update
- Update Jira only after Jira approval is received.
- Note: With Atlassian MCP Server configured as read-only, Jira updates must be performed manually.
- Provide the complete update payload in a format that can be manually applied to the Jira issue.
- Return a field-level summary of proposed changes.

### 8. Generate Test Cases
For mode 3 only:
- include positive, negative, boundary, and integration or failure scenarios as relevant
- map each case back to one or more acceptance criteria
- include the following fields in every case:
  - `TestCaseId`
  - `Title`
  - `Preconditions`
  - `Steps`
  - `ExpectedResult`
  - `Priority`
  - `Type`
  - `AcceptanceCriteriaReference`
- produce an import-ready dataset aligned to `atm-exporter.xlsx` so output can be published to Zephyr without reformatting.

### 9. Zephyr Review Gate
- Present the approved story summary, full test set, coverage map, and risks or gaps.
- Accept only:
  - `APPROVED_FOR_ZEPHYR_PUBLISH`
  - `CHANGES_REQUIRED: <comments>`
- If approval is not granted, stop with a pending Zephyr review state.

### 10. Zephyr Publish
- Publish only after Zephyr approval is received.
- Preserve traceability between test cases and acceptance criteria.
- Return a summary of created, updated, skipped, and failed items, including destination identifiers where available.

## Required Output Order
Every response must present sections in the following order:

1. Preflight Check Result
2. Operation Mode
3. User Story
4. Story Improvement Proposal
5. Documentation Output
6. Jira Review Request
7. Jira Approval Status
8. Jira Update Result
9. Test Cases
10. Coverage and Gaps
11. Zephyr Review Request
12. Zephyr Approval Status
13. Zephyr Publish Result
14. Execution Log

Omit mode-specific sections only when the selected mode does not require them.

## Logging Standard
Every response must include an Execution Log.

### Required Logging Content
- workflow stage
- action performed
- outcome
- gate status changes
- external write attempts to Jira or Zephyr

### Log Format
- `[<timestamp>] [<stage>] <action> -> <outcome>`

### Example
- `[2026-03-23T15:12:05Z] [Story Review] Parsed user story -> Completed`
- `[2026-03-23T15:12:11Z] [Jira Gate] Approval token check -> Blocked (Pending Jira Review)`

## Quality Standards
- Acceptance criteria must be specific, measurable, and verifiable.
- Test steps and expected results must be executable without interpretation.
- High-risk requirements must include negative-path coverage.
- Open questions must be explicit and clearly marked.
- Every story must include User Story, Description, Acceptance Criteria, Validation Rules, Edge Cases, and Error Handling Scenarios.
- Acceptance Criteria must use Given/When/Then.
- The story must contain only what the system should do, not how it is implemented.
- Codebase-derived details must be grounded in actual code, not inferred without evidence.
- The final story must be readable and useful to a BA or PO without technical translation.
- Documentation output, when requested, must be produced as a separate markdown deliverable using the required audience-specific format.
- Internal and external documentation must accurately reflect audience-specific field visibility and workflow differences.
- Documentation output must be based on current code context and, when provided, Jira context; do not generate documentation from Jira alone.
- Zephyr mode 3 output must always match the `atm-exporter.xlsx` schema and ordering exactly.

## Safety Rules
- Do not invent business requirements.
- Do not write to Jira before Jira approval.
- Do not publish to Zephyr before Zephyr approval.
- Do not proceed when prerequisites fail.
- Do not bypass Atlassian MCP Server or Zephyr MCP readiness checks for modes that require them.
- Do not attempt to use Atlassian MCP write operations; the server must be configured as read-only.

## Failure Handling
- If a Jira update fails, report the exact failure and retain the manual update payload.
- If Zephyr publication fails, report case-level failures and retain the manual upload payload.
- If the user responds with `CHANGES_REQUIRED`, revise the output and restart from the appropriate review gate.

## Template Reference
Use the template file `templates/review-request.md`.
