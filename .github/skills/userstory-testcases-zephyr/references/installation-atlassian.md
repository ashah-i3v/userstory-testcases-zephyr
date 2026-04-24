# Atlassian MCP Server Installation Guide

## Overview
- **Server:** Atlassian MCP Server (Official) or Atlassian Rovo MCP Server (HTTP)
- **Sources:** 
  - stdio: https://github.com/atlassian/atlassian-mcp-server
  - HTTP: https://mcp.atlassian.com/v1/mcp
- **Registry:** https://mcp.so/servers/atlassian
- **Purpose:** Read-only access to Jira for inspecting stories, requirements, and context.
- **Configuration:** Restricted to view/fetch operations only (no write permissions).
- **Supports:** VS Code, GitHub Copilot CLI, and other MCP clients

## Prerequisites

### For HTTP (Rovo) Configuration:
- VS Code with MCP support OR GitHub Copilot CLI
- Atlassian account with access to target Jira instance
- Network access to Atlassian Cloud (https://mcp.atlassian.com)

### For stdio Configuration:
- Node.js 18 or later
- npm or npx available
- VS Code with MCP support OR GitHub Copilot CLI
- Atlassian account with access to target Jira instance
- Network access to Atlassian Cloud

## Installation Options

The Atlassian MCP Server must be installed and configured manually before using this skill. Two options are available:

**Option 1: Atlassian Rovo MCP Server (HTTP) - Recommended**
This is a hosted MCP server provided by Atlassian that connects via HTTP.

**Option 2: Local stdio MCP Server**
This is a local Node.js-based MCP server that runs on your machine.

## Installation Steps for VS Code Users

### 1. Install the Atlassian MCP Server
- Open VS Code settings (Ctrl+, or Cmd+,)
- Search for "MCP" or open the MCP Server configuration (gear icon → Configure Tools)
- Search for "Atlassian" in the MCP Registry
- Click "Install" on the Atlassian MCP Server

#### Option 1: HTTP Configuration (Atlassian Rovo)
Add to `.vscode/mcp.json` or workspace MCP config:
```json
{
  "servers": {
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/mcp",
      "description": "Atlassian Rovo MCP Server for Jira and Confluence (OAuth or API token)"
    }
  }
}
```

#### Option 2: stdio Configuration (Local)
Add to `.vscode/mcp.json` manually:
```json
{
  "servers": {
    "atlassian": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@atlassianlabs/mcp-server-atlassian"]
    }
  }
}
```

**Reference:** [Atlassian MCP Server](https://github.com/atlassian/atlassian-mcp-server)

### 2. Configure OAuth Sign-In
- During the OAuth sign-in process, allow only **Jira** access (read permissions)
- If you use Confluence to store story information, you may also enable Confluence (read permissions)
- Complete the authentication flow
- The server will store credentials securely
- **For HTTP (Rovo) servers:** OAuth scopes are managed through the Atlassian authentication flow
- **For stdio servers:** Additional tool restrictions can be configured in the next step

### 3. Restrict to Read-Only Operations

#### For HTTP (Rovo) Configuration:
- Read-only access is enforced through OAuth scopes during authentication
- No additional configuration is needed in mcp.json
- The HTTP endpoint handles permission restrictions server-side

#### For stdio Configuration:
- After installation, configure the MCP server to allow only read operations
- Edit the server configuration to restrict available tools:
  ```json
  {
    "servers": {
      "atlassian": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@atlassianlabs/mcp-server-atlassian"],
        "tools": {
          "allow": ["get*", "fetch*", "search*", "list*"],
          "deny": ["create*", "update*", "delete*", "add*", "edit*"]
        }
      }
    }
  }
  ```
- Explicitly disable write operations:
  - `createJiraIssue`
  - `updateJiraIssue`
  - `addJiraComment`
  - `createConfluencePage`
  - `updateConfluencePage`
  - Any other mutation operations

### 4. Create a New Chat Session
- After installation and configuration, close the current chat session
- Start a new chat session to ensure MCP tools are available

## Installation Steps for GitHub Copilot CLI Users

### 1. Install the Atlassian MCP Server
- Ensure Node.js is installed (version 18 or later)
- Install the server globally:
  ```bash
  npm install -g @atlassianlabs/mcp-server-atlassian
  ```
- Or run via npx without installation:
  ```bash
  npx @atlassianlabs/mcp-server-atlassian
  ```

### 2. Configure in Copilot CLI
- Add to your Copilot CLI MCP configuration file
- Location varies by platform:
  - macOS: `~/Library/Application Support/github-copilot-cli/mcp.json`
  - Windows: `%APPDATA%\github-copilot-cli\mcp.json`
  - Linux: `~/.config/github-copilot-cli/mcp.json`
- Add the server configuration:
  ```json
  {
    "mcpServers": {
      "atlassian": {
        "command": "npx",
        "args": ["-y", "@atlassianlabs/mcp-server-atlassian"]
      }
    }
  }
  ```

### 3. Authenticate and Restrict
- Run the Copilot CLI with the MCP server enabled
- Complete OAuth authentication when prompted
- Configure read-only restrictions in the config file as shown above

### 4. Restart Copilot CLI
- Restart the CLI session to load the new MCP server configuration

## Available Read-Only Tools

When properly configured (either HTTP or stdio), the following read operations are available through the Atlassian MCP server:
- `getJiraIssue` - Retrieve a Jira issue by key
- `searchJiraIssues` - Search for Jira issues using JQL
- `listJiraProjects` - List accessible Jira projects
- `getJiraProject` - Get details of a specific project
- `getConfluencePage` - Retrieve a Confluence page (if enabled)
- `searchConfluencePages` - Search Confluence content (if enabled)

## Write Operation Restrictions
- **HTTP (Rovo) servers:** Write operations are restricted through OAuth scopes at the Atlassian server level.
- **stdio servers:** Write operations must be explicitly disabled in the local MCP configuration file.
