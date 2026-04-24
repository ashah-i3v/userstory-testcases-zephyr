---
mode: ask
description: "Create a new story or improve an existing story with review and approval, without test-case or Zephyr steps."
---

Use the skill userstory-testcases-zephyr.

Inputs:
- Operation mode: ${input:operationMode:Select mode - 1 Create a new story, 2 Update an existing story}
- Story source: ${input:storySource:Enter existing Jira key for mode 2 or paste story details for mode 1}
- Optional module: ${input:moduleName:Feature or module name}
- Optional risk: ${input:riskLevel:Risk level (High/Medium/Low)}

Execution rules:
1. Validate selected operation mode (must be 1 or 2).
2. Run story quality analysis and produce improvement proposal.
3. Output story review package in chat.
4. Ask for explicit approval token APPROVED_FOR_JIRA_UPDATE.
5. Only after approval, perform Jira update/create action and return field-level summary.
6. Include an Execution Log section with stage, action, and outcome.

Scope limitations:
- Do not generate Zephyr test cases.
- Do not perform Zephyr publish actions.
- Do not require Jira-Zephyr MCP preflight for this prompt.

If Jira approval is not provided, stop with status: Pending Jira Review.

Log format:
- [<timestamp>] [<stage>] <action> -> <outcome>
