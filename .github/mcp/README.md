# MCP Configuration Files

This directory contains Model Context Protocol (MCP) configuration files for the VTRS ELT project.

## Files

### `plugin.json`
Main plugin manifest that describes the VTRS ELT MCP plugin. This file:
- Defines plugin metadata (name, version, author)
- References the MCP server configuration (`mcp-config.json`)
- References tool configurations (`bitbucket-tools.json`)
- Points to skills directory for reusable workflows

### `mcp-config.json`
MCP server configuration that defines available servers:
- **bitbucket**: Bitbucket MCP for repository and PR operations
- **atlassian**: Atlassian Rovo MCP for Jira/Confluence (OAuth/API token)
- **jira-zephyr**: Jira Zephyr Scale MCP for test case management

### `bitbucket-tools.json`
Tool configuration for the Bitbucket MCP server. Controls which Bitbucket API operations are enabled/disabled for safety and governance.

## Usage

### For VS Code / GitHub Copilot

**Quick Setup:** See [.vscode/README.md](../../.vscode/README.md) for detailed step-by-step instructions.

Reference in your `.vscode/mcp.json` (local, not committed):

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "npx",
      "args": ["-y", "bitbucket-mcp"],
      "env": {
        "BITBUCKET_URL": "https://api.bitbucket.org/2.0",
        "BITBUCKET_WORKSPACE": "YOUR_WORKSPACE",
        "BITBUCKET_USERNAME": "YOUR_USERNAME",
        "BITBUCKET_PASSWORD": "YOUR_APP_PASSWORD",
        "BITBUCKET_TOOLS_CONFIG": "${workspaceFolder}/.github/mcp/bitbucket-tools.json"
      }
    }
  }
}
```

### For Cursor

Reference in `.cursor/mcp.json` (local, not committed):

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "npx",
      "args": ["-y", "bitbucket-mcp"],
      "env": {
        "BITBUCKET_URL": "https://api.bitbucket.org/2.0",
        "BITBUCKET_WORKSPACE": "YOUR_WORKSPACE",
        "BITBUCKET_USERNAME": "YOUR_USERNAME",
        "BITBUCKET_PASSWORD": "YOUR_APP_PASSWORD",
        "BITBUCKET_TOOLS_CONFIG": "${workspaceFolder}/.github/mcp/bitbucket-tools.json"
      }
    }
  }
}
```

## Security

⚠️ **NEVER commit credentials** to version control. Use:
- User Secrets for local development
- Environment variables for CI/CD

## References

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Bitbucket MCP Documentation](../docs/MCP_BITBUCKET.md)
- [Atlassian MCP Server](https://github.com/atlassian/atlassian-mcp-server)
