---
mode: ask
description: "Review and improve a user story, request approval before Jira update, then generate and review Zephyr test cases before publish."
---

Use the skill userstory-testcases-zephyr.

Inputs:
- Operation mode: ${input:operationMode:Select mode - 1 Create a new story, 2 Update an existing story, 3 Create test cases}
- Story source: ${input:storySource:Enter Jira key or paste user story text}
- Optional module: ${input:moduleName:Feature or module name}
- Optional risk: ${input:riskLevel:Risk level (High/Medium/Low)}
- If mode = 3 and MCP is unavailable, setup choice: ${input:mcpSetupChoice:Choose - Configure and start MCP now / Continue without publish capability / Fail immediately}
- If setup is selected, prompt for credentials required by MCP (username and password, or username and API token).

Execution rules:
1. Run preflight checks first:
	- Validate selected operation mode
	- Validate story identifier validity
	- If mode = 3, validate Jira-Zephyr MCP availability and authentication
2. If mode = 3 and MCP preflight fails, follow user setup choice:
	- Configure and start MCP now, then retry preflight
	- Continue without publish capability
	- Fail immediately with PRECONDITION_FAILED
3. Branch by mode:
	- Mode 1: create a new story output and review
	- Mode 2: update an existing story flow with APPROVED_FOR_JIRA_UPDATE gate
	- Mode 3: full story improvement, Jira approval/update, test generation, Zephyr approval/publish
4. Include an Execution Log section that records each stage, gate check, and next action.

If Jira approval is not provided, stop with status: Pending Jira Review.
If Zephyr approval is not provided, stop with status: Pending Zephyr Review.

Log format:
- [<timestamp>] [<stage>] <action> -> <outcome>
