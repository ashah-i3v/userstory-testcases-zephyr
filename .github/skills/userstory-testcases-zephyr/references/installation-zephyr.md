# Zephyr Scale Direct API Client Installation Guide

## Overview
- **Approach:** Direct Zephyr Scale API v2 calls via Node.js scripts
- **Why not remote MCP:** Remote servers cannot access private/internal Jira instances
- **Required for:** Mode 3 only (Generate Zephyr tests and publish)
- **Purpose:** Publish test cases with steps directly to Zephyr Scale API

## Prerequisites
- Node.js 18 or later
- Jira instance with Zephyr Scale installed
- Jira project with Zephyr Scale enabled
- **Two separate API tokens:**
  1. **Zephyr Scale API token** (required for test case creation)
  2. **Jira Cloud API token** (optional for automatic issue linking)

## Required Environment Variables

### Required for Test Case Creation

| Variable | Description | How to Obtain |
| --- | --- | --- |
| `ZEPHYR_API_TOKEN` | Zephyr Scale API access token | Generate in Zephyr Scale → Settings → API Access Tokens |

### Optional for Automatic Issue Linking

| Variable | Description | How to Obtain |
| --- | --- | --- |
| `JIRA_API_TOKEN` | **Jira Cloud API token** (NOT the same as Zephyr token) | Generate at https://id.atlassian.com/manage-profile/security/api-tokens |
| `JIRA_EMAIL` | Your Jira account email address | Your login email (e.g., `your.email@i3verticals.com`) |

**Important:** `JIRA_API_TOKEN` must be a **Jira Cloud API token**, not the Zephyr Scale token. These are two different authentication systems:
- **Zephyr token** (`ZEPHYR_API_TOKEN`): Used to create test cases in Zephyr Scale
- **Jira token** (`JIRA_API_TOKEN`): Used to resolve issue keys to IDs for automatic linking

**Without Jira credentials:** Test cases will be created successfully but won't automatically link to Jira issues. You can link them manually in the Zephyr UI.

## Environment Variable Setup

Set `ZEPHYR_API_TOKEN` in your system environment:

**Windows PowerShell:**
```powershell
[System.Environment]::SetEnvironmentVariable('ZEPHYR_API_TOKEN', 'your-token-here', 'User')
# Restart terminal after setting
```

**macOS/Linux:**
```bash
echo 'export ZEPHYR_API_TOKEN="your-token-here"' >> ~/.bashrc
source ~/.bashrc
```

**Workspace .env file (alternative):**
Create `.env` in workspace root:
```env
ZEPHYR_API_TOKEN=your-token-here
```

**Verify configuration:**
```powershell
# Windows PowerShell
$env:ZEPHYR_API_TOKEN

# macOS/Linux
echo $ZEPHYR_API_TOKEN
```

## Installation Steps

### Step 1: Verify Node.js Installation

Run `node --version` to confirm Node.js 18 or later is available.

If Node.js is not available:
- Install Node.js 18 or later from https://nodejs.org/
- Restart your terminal after installation

### Step 2: Verify Scripts Are Available

The publishing scripts are located in `.github/skills/userstory-testcases-zephyr/`:

| File | Purpose |
| --- | --- |
| `lib/zephyr-client.js` | Complete Zephyr Scale API v2 client |
| `lib/csv-parser.js` | CSV parser for test case files |
| `scripts/publish-to-zephyr.js` | Convenience script for publishing |

These files are part of the skill and require no additional installation.

### Step 3: Generate Zephyr API Token

1. Log in to Jira
2. Navigate to **Zephyr Scale** (from app switcher or side menu)
3. Go to **⚙️ Settings** → **API Access Tokens**
4. Click **Create API Access Token**
5. Enter a name (e.g., "Test Publishing Script")
6. Copy the generated token (save securely — it won't be shown again)

### Step 4: Configure Environment Variables

#### Required: ZEPHYR_API_TOKEN

Set `ZEPHYR_API_TOKEN` using one of the methods above.

**Verify:**
```powershell
$env:ZEPHYR_API_TOKEN  # Should print your token
```

#### Optional: JIRA_API_TOKEN and JIRA_EMAIL (for automatic issue linking)

If you want to automatically link test cases to Jira issues, you need **both** environment variables set. Without them, test cases will be created successfully but won't be automatically linked.

**Important:** The `JIRA_API_TOKEN` is **NOT** the same as `ZEPHYR_API_TOKEN`. You need two separate tokens:
- `ZEPHYR_API_TOKEN` = Zephyr Scale token (from Zephyr Scale settings)
- `JIRA_API_TOKEN` = Jira Cloud token (from Atlassian account settings)

**1. Set your Jira email:**
```powershell
# PowerShell (current session)
$env:JIRA_EMAIL = "your.email@i3verticals.com"

# PowerShell (permanent - user profile)
[System.Environment]::SetEnvironmentVariable('JIRA_EMAIL', 'your.email@i3verticals.com', 'User')
```

**2. Generate and set Jira Cloud API token:**

⚠️ **This is different from your Zephyr token!**

1. Go to: **https://id.atlassian.com/manage-profile/security/api-tokens**
2. Click **"Create API token"**
3. Name it "Jira API Access" or similar
4. Copy the token (it will look different from your Zephyr token)
5. Set the environment variable:

```powershell
# PowerShell (current session)
$env:JIRA_API_TOKEN = "your-jira-cloud-token-here"

# PowerShell (permanent - user profile)
[System.Environment]::SetEnvironmentVariable('JIRA_API_TOKEN', 'your-jira-cloud-token-here', 'User')
```

**Verify all tokens are set correctly:**
```powershell
Write-Host "Zephyr token: $($env:ZEPHYR_API_TOKEN)"
Write-Host "Jira email: $($env:JIRA_EMAIL)"
Write-Host "Jira token: $($env:JIRA_API_TOKEN)"
```

All three should print values (not empty strings).

**Optional: Set Jira Base URL** (defaults to `https://i3verticals.atlassian.net`):
```powershell
$env:JIRA_BASE_URL = "https://your-instance.atlassian.net"
```

**What happens without Jira credentials:**
- ✅ Test cases will be created successfully
- ✅ All test steps will be added correctly
- ⚠️ Test cases won't automatically link to Jira issues
- 💡 You can manually link them in the Zephyr UI later

### Step 5: Test Publishing (Optional)

Test with a sample CSV file:

```powershell
cd .github/skills/userstory-testcases-zephyr
node scripts/publish-to-zephyr.js ./output/test-cases-sample.csv MVS-1234
```

Expected output:
```
✅ Published 5 test cases
  ✅ TC-01 → MVS-T456
  ✅ TC-02 → MVS-T457
  ...
```

## Available Publishing Methods

### Method 1: Direct Script (Used by Mode 3)

Mode 3 workflow calls the publishing script directly via terminal:

```javascript
const fs = require('fs');
const { createZephyrClient } = require('./.github/skills/userstory-testcases-zephyr/lib/zephyr-client');
const { parseCSV } = require('./.github/skills/userstory-testcases-zephyr/lib/csv-parser');

// Read CSV
const csvPath = '.github/skills/userstory-testcases-zephyr/output/test-cases-feature-20260728.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const testCases = parseCSV(csvContent);

// Create client (project key auto-extracted from issue key)
const client = createZephyrClient(process.env.ZEPHYR_API_TOKEN);

// Publish all tests
const results = await client.createMultipleTestCases(testCases, 'MVS-3370');

// Report results
console.log(`\n✅ Published ${results.filter(r => r.success).length} test cases`);
results.forEach(r => {
  if (r.success) {
    console.log(`  ✅ ${r.originalKey} → ${r.testCaseKey}`);
  } else {
    console.log(`  ❌ ${r.originalKey}: ${r.error}`);
  }
});
```

### Method 2: Convenience Script (For Manual Publishing)

For manual publishing by QA/BA teams:

```bash
cd .github/skills/userstory-testcases-zephyr
node scripts/publish-to-zephyr.js ./output/test-cases-file.csv MVS-3370
```

## Troubleshooting

### Node.js Not Found
If `node --version` fails:
- Install Node.js 18 or later from https://nodejs.org/
- Restart your terminal after installation
- Verify with `node --version`

### Authentication Errors
If API calls fail with 401/403:
- Verify `ZEPHYR_API_TOKEN` is correct and not expired
- Regenerate token in Zephyr Scale settings if expired
- Ensure token has necessary permissions (read/write test cases)
- Check token is for the correct Jira instance

### Script Errors
If script fails to run:
- Verify working directory is correct
- Check CSV file path is correct
- Ensure `lib/zephyr-client.js` and `lib/csv-parser.js` exist
- Verify Jira issue key format (e.g., "MVS-3370" not "3370")

### CSV Format Errors
If test cases fail to parse:
- Verify CSV has correct 18-column header row
- Check for proper quote escaping in cells with commas
- Ensure file encoding is UTF-8

## Why Not Remote MCP Server?

The official SmartBear Zephyr MCP server is a remote service that cannot access private/internal Jira instances. For enterprise Jira deployments:

- ❌ Remote MCP servers cannot reach internal networks
- ❌ Firewall rules would block external API access
- ✅ Direct Node.js scripts run locally with full network access
- ✅ Scripts use your machine's environment and network context

**Decision:** Use direct script approach for all Mode 3 publishing workflows.

## Security Best Practices

- ❌ **Never commit `ZEPHYR_API_TOKEN` to version control**
- ✅ Use environment variables for token storage
- ✅ Add `.env` to `.gitignore` if using workspace .env file
- ✅ Rotate API tokens periodically
- ✅ Use separate tokens for different environments (dev/staging/prod)

## Dependencies

The Zephyr client uses Node.js 18+ built-in `fetch` API. No external npm packages required.
