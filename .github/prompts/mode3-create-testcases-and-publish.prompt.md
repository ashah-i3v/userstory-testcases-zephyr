---
mode: ask
description: "Mode 3 only: generate Zephyr test cases from a story, enforce MCP preflight, review, and publish after approval."
---

Use the skill userstory-testcases-zephyr.

Inputs:
- Operation mode: 3 (Create test cases)
- Story source: ${input:storySource:Enter Jira key or paste user story text}
- Optional module: ${input:moduleName:Feature or module name}
- Optional risk: ${input:riskLevel:Risk level (High/Medium/Low)}
- If MCP is unavailable, setup choice: ${input:mcpSetupChoice:Choose - Configure and start MCP now / Continue without publish capability / Fail immediately}
- If setup is selected, prompt for credentials required by MCP (username and password, or username and API token).

Execution rules:
1. Force operation mode to 3.
2. Run preflight checks first:
   - Validate Jira-Zephyr MCP availability
   - Validate Jira-Zephyr MCP authentication
   - Validate story identifier
   - Validate Zephyr target context
3. If MCP preflight fails, follow setup choice:
   - Configure and start MCP now, then retry preflight
   - Continue without publish capability
   - Fail immediately with PRECONDITION_FAILED
4. Read and improve story quality.
5. Output story review package in chat.
6. Ask for explicit approval token APPROVED_FOR_JIRA_UPDATE.
7. Only after Jira approval, update Jira story fields.
8. Generate comprehensive Zephyr-ready test cases.
9. Output test case review package in chat.
10. Ask for explicit approval token APPROVED_FOR_ZEPHYR_PUBLISH.
11. Only after Zephyr approval, publish test cases to Zephyr project TNSD.
12. Include an Execution Log section that records each stage, gate check, and next action.

If Jira approval is not provided, stop with status: Pending Jira Review.
If Zephyr approval is not provided, stop with status: Pending Zephyr Review.

Log format:
- [<timestamp>] [<stage>] <action> -> <outcome>
