# Zephyr MCP Server Installation Guide

## Overview
- **Server:** `jira-zephyr-mcp`
- **Source:** https://github.com/leorosignoli/jira-zephyr-mcp
- **Required for:** Mode 3 only (Generate Zephyr tests and publish)
- **Purpose:** Manage Zephyr test plans, cycles, and test publication workflows

## Prerequisites
- Node.js 18 or later
- Jira instance with Zephyr Scale or Zephyr Squad
- Jira API token
- Zephyr API token

## Required Environment Values

| Variable | Description |
| --- | --- |
| `JIRA_BASE_URL` | Jira base URL, for example `https://your-domain.atlassian.net` |
| `JIRA_USERNAME` | Atlassian account email |
| `JIRA_API_TOKEN` | Jira API token (used by Zephyr MCP for Jira API access) |
| `ZEPHYR_API_TOKEN` | Zephyr API token |

## MCP Configuration Requirement
- MCP server configuration must exist in a config file before any Zephyr MCP tool call.
- **Preferred location:** `.vscode/mcp.json` in the workspace.
- **Fallback location:** VS Code user MCP config file when workspace config is unavailable.
- **Required server name:** `jira-zephyr-mcp`.
- **Required command pattern:** Run through `node` with the built Zephyr MCP entry point.

## Example Configuration

Add this entry to your `mcp.json` file:

```json
{
  "servers": {
    "jira-zephyr-mcp": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "<absolute-path-to-jira-zephyr-mcp>",
      "env": {
        "JIRA_BASE_URL": "https://your-domain.atlassian.net",
        "JIRA_USERNAME": "your-email@company.com",
        "JIRA_API_TOKEN": "<jira_api_token>",
        "ZEPHYR_API_TOKEN": "<zephyr_api_token>"
      }
    }
  }
}
```

**Important:** When writing this entry, merge into existing `servers` without removing other MCP servers.

## Installation Steps

### Step 1: Verify Node.js Installation
Run `node --version` to confirm Node.js 18 or later is available.

If Node.js is not available:
- Install Node.js 18 or later from https://nodejs.org/
- Restart your terminal after installation

### Step 2: Clone and Build Zephyr MCP
Check whether a `jira-zephyr-mcp` directory exists locally with a `dist/` build output.

If the directory does not exist or `dist/` is missing:
```bash
# Clone the repository
git clone https://github.com/leorosignoli/jira-zephyr-mcp.git

# Navigate to the directory
cd jira-zephyr-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Verify dist/index.js exists
ls dist/index.js
```

### Step 3: Configure Environment Values
Check each of the following locations in order for Zephyr MCP environment values:
- `.env` file in the `jira-zephyr-mcp` directory
- `.vscode/mcp.json` in the workspace
- VS Code user settings under the `github.copilot.mcp.servers` key

Confirm that `JIRA_BASE_URL`, `JIRA_USERNAME`, `JIRA_API_TOKEN`, and `ZEPHYR_API_TOKEN` are present and non-empty in at least one location.

#### Option 1: Use `.env` file (Recommended for local development)
Create a `.env` file in the `jira-zephyr-mcp` directory:
```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token
ZEPHYR_API_TOKEN=your_zephyr_api_token
```

#### Option 2: Use MCP config file
Add environment values directly to your `.vscode/mcp.json` (see example configuration above).

### Step 4: Add MCP Server Entry
If the `jira-zephyr-mcp` server entry is missing from MCP config:
- Create or update `.vscode/mcp.json` with a `jira-zephyr-mcp` entry using the example schema above.
- If workspace config cannot be written, create or update the user MCP config file instead.
- Preserve all existing `servers` entries and update only the `jira-zephyr-mcp` node.

### Step 5: Start or Restart MCP Servers
After configuration changes:
- If using VS Code, reload the window or restart VS Code
- The MCP server will start automatically when needed

### Step 6: Verify Connectivity
Execute a test call to confirm Zephyr connectivity and Jira API access:
- Use the Zephyr MCP to list test cycles for a known project
- If authentication fails, verify the `ZEPHYR_API_TOKEN` and `JIRA_API_TOKEN` values

## Troubleshooting

### MCP Server Not Running
If the server is not responding:
- Restart VS Code or your MCP client
- Check that `dist/index.js` exists in the `jira-zephyr-mcp` directory
- Verify Node.js version is 18 or later

### Authentication Errors
If authentication fails:
- Verify the `ZEPHYR_API_TOKEN` is valid and not expired
- Verify the `JIRA_API_TOKEN` is valid and not expired
- Ensure the tokens have the correct permissions for your Jira instance

### Tools Not Available
If Zephyr MCP tools are not available in your session:
- Restart your chat session after installing or configuring the MCP server
- Check that the server name is exactly `jira-zephyr-mcp` in your config
- Verify the `cwd` path points to the correct directory

## Session Restart Requirement
After installing or configuring the Zephyr MCP server for the first time, you must start a new chat session for the tools to become available.
