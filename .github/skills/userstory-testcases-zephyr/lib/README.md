# Zephyr Scale Direct API Client

This directory contains a complete implementation of Zephyr Scale API v2 for publishing test cases with steps.

**Why Direct API:** Remote MCP servers cannot access private/internal Jira instances. This approach runs locally with full network access.

## 📁 Files

- **`zephyr-client.js`** - Complete Zephyr Scale API v2 client
- **`csv-parser.js`** - Simple CSV parser (no dependencies)

## 🚀 Quick Start

### For QA/BA Teams

Use the convenience script from the parent directory:

```bash
cd .github/skills/userstory-testcases-zephyr

# Set your Zephyr API token
export ZEPHYR_API_TOKEN="your-token-here"

# Publish test cases
node scripts/publish-to-zephyr.js ./output/test-cases-file.csv MVS-3370
```

### For Claude/Copilot Agents

```javascript
const fs = require('fs');
const { createZephyrClient } = require('./.github/skills/userstory-testcases-zephyr/lib/zephyr-client');
const { parseCSV } = require('./.github/skills/userstory-testcases-zephyr/lib/csv-parser');

// Read and parse CSV
const csvContent = fs.readFileSync('./output/test-cases.csv', 'utf-8');
const testCases = parseCSV(csvContent);

// Create client (project key auto-extracted from issue key)
const client = createZephyrClient(process.env.ZEPHYR_API_TOKEN);

// Publish all test cases with steps
const results = await client.createMultipleTestCases(testCases, 'MVS-3370');
```

## 🔑 Authentication

Get your Zephyr API token from:
https://support.smartbear.com/zephyr-scale-cloud/docs/rest-api/generating-api-access-tokens.html

Set as environment variable:
```bash
export ZEPHYR_API_TOKEN="your-token-here"
```

## ✨ Key Features

### Automatic Project Key Extraction

No need to configure project keys! The client automatically extracts the project from the issue key:

```javascript
// Issue key: "MVS-3370" → Project key: "MVS"
await client.createMultipleTestCases(testCases, 'MVS-3370');
```

### Complete Test Case Creation

Each test case is created with:
1. **Metadata** - Name, objective, precondition, priority, labels, folder
2. **Test Steps** - All step rows from CSV with description, test data, expected result
3. **Issue Link** - Automatic traceability to source Jira issue

### CSV Format Support

Supports the 18-column CSV format from `atm-exporter.xlsx` template:
- Groups rows by `Key` column (same test case)
- Each row with `Test Script (Step-by-Step) - Step` becomes a test step
- Handles quoted fields, commas, and multi-line content

## 📋 API Methods

### ZephyrClient Class

```javascript
const client = new ZephyrClient(baseUrl, apiToken);
```

#### `createTestCase(testCase)`
Creates test case metadata (no steps yet).

```javascript
await client.createTestCase({
  projectKey: 'MVS',
  name: 'Verify GL Post button enabled',
  objective: 'Ensure button works correctly',
  precondition: 'User logged in',
  status: 'Draft',
  priority: 'High',
  labels: ['balance-report', 'gl-post']
});
// Returns: { key: 'MVS-T123', ... }
```

#### `addTestSteps(testCaseKey, steps)`
Adds test steps to existing test case.

```javascript
await client.addTestSteps('MVS-T123', [
  {
    description: 'Navigate to Balance Report',
    testData: 'Location: QA, Date: Today',
    expectedResult: 'Report displays'
  },
  {
    description: 'Click GL Post Continue button',
    testData: '',
    expectedResult: 'Button is enabled and processes'
  }
]);
```

#### `linkToIssue(testCaseKey, issueKey)`
Links test case to Jira issue.

```javascript
await client.linkToIssue('MVS-T123', 'MVS-3370');
```

#### `createTestCaseWithSteps(testCase, steps, issueKey)`
Complete workflow: create → add steps → link (recommended).

```javascript
await client.createTestCaseWithSteps(
  { name: 'Test name', objective: '...' },
  [ { description: 'Step 1', ... } ],
  'MVS-3370'  // Project key auto-extracted
);
```

#### `createMultipleTestCases(csvRows, issueKey)`
Batch process entire CSV file.

```javascript
const csvRows = parseCSV(csvContent);
const results = await client.createMultipleTestCases(csvRows, 'MVS-3370');
// Returns: [{ success: true, testCaseKey: 'MVS-T123', originalKey: 'TC-001' }, ...]
```

## 🔧 CSV Parser

### `parseCSV(csvContent)`
Parses CSV string into array of row objects.

```javascript
const { parseCSV } = require('./lib/csv-parser');
const rows = parseCSV(fs.readFileSync('test-cases.csv', 'utf-8'));
// Returns: [{ Key: 'TC-001', Name: '...', ... }, ...]
```

### `parseCSVLine(line)`
Parses single CSV line handling quotes and commas.

```javascript
const { parseCSVLine } = require('./lib/csv-parser');
const values = parseCSVLine('"Field 1","Field, with comma","Field 3"');
// Returns: ['Field 1', 'Field, with comma', 'Field 3']
```

## 🛠️ Technical Details

### API Endpoints Used

1. **POST** `/testcases` - Create test case metadata
2. **POST** `/testcases/{key}/teststeps` - Add test steps
3. **POST** `/testcases/{key}/links/issues` - Link to Jira issue

### Rate Limiting

- 500ms delay between test case creations
- Prevents API throttling
- Suitable for batches up to 50 test cases

### Error Handling

- Each test case creation is independent
- Failed creates don't stop batch processing
- Detailed error messages for troubleshooting
- Final summary shows success/failure counts

## 🎯 Why This Exists

The Zephyr MCP tool (`jira-zephyr-mcp`) only implements the first API call (POST `/testcases`), ignoring the `testScript.steps` parameter completely. Test steps require a separate API call to POST `/testcases/{key}/teststeps`.

This direct API client properly implements both required calls, ensuring test steps persist in Zephyr.

## 📚 Dependencies

**None!** Uses Node.js 18+ built-in `fetch` API.

## 🧪 Testing

To verify the client works:

1. Create a simple CSV with 1-2 test cases
2. Set `ZEPHYR_API_TOKEN` environment variable
3. Run: `node scripts/publish-to-zephyr.js <csv-path> <issue-key>`
4. Check Zephyr UI to verify test cases have steps

## 📄 License

Part of STARSClerk project. Internal use only.
