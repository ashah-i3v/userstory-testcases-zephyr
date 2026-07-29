#!/usr/bin/env node

/**
 * Publish test cases from CSV to Zephyr Scale
 * 
 * Usage:
 *   node publish-to-zephyr.js <csv-file-path> <project-key-or-issue-key>
 * 
 * Examples:
 *   node publish-to-zephyr.js ./output/test-cases.csv MVS-3370  # Link to issue
 *   node publish-to-zephyr.js ./output/test-cases.csv MVS       # Just create in project
 * 
 * Environment Variables Required:
 *   ZEPHYR_API_TOKEN - Bearer token from Zephyr Scale (get from: https://support.smartbear.com/zephyr-scale-cloud/docs/rest-api/generating-api-access-tokens.html)
 */

const fs = require('fs');
const path = require('path');
const { createZephyrClient } = require('../lib/zephyr-client');
const { parseCSV } = require('../lib/csv-parser');

// Parse command line arguments
const csvFilePath = process.argv[2];
const projectKeyOrIssue = process.argv[3];

if (!csvFilePath || !projectKeyOrIssue) {
  console.error('❌ Usage: node publish-to-zephyr.js <csv-file-path> <project-key-or-issue-key>');
  console.error('   Examples:');
  console.error('     node publish-to-zephyr.js ./output/test-cases.csv MVS-3370  # Link to issue');
  console.error('     node publish-to-zephyr.js ./output/test-cases.csv MVS       # Just create in project');
  process.exit(1);
}

// Check environment variable
if (!process.env.ZEPHYR_API_TOKEN) {
  console.error('❌ ZEPHYR_API_TOKEN environment variable is required');
  console.error('   Get your token from: https://support.smartbear.com/zephyr-scale-cloud/docs/rest-api/generating-api-access-tokens.html');
  process.exit(1);
}

// Optional: Check for Jira API token (enables automatic issue linking)
if (projectKeyOrIssue && projectKeyOrIssue.includes('-')) {
  if (!process.env.JIRA_API_TOKEN || !process.env.JIRA_EMAIL) {
    console.log('ℹ️  JIRA_API_TOKEN and JIRA_EMAIL not set - test cases will be created but not linked to Jira issues');
    console.log('   To enable automatic linking:');
    console.log('   1. Set JIRA_EMAIL to your Jira login email');
    console.log('   2. Set JIRA_API_TOKEN from: https://id.atlassian.com/manage-profile/security/api-tokens\n');
  }
}

// Validate CSV file exists
const resolvedPath = path.resolve(csvFilePath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`❌ CSV file not found: ${resolvedPath}`);
  process.exit(1);
}

// Main execution
(async function main() {
  try {
    console.log(`\n📄 Reading CSV: ${resolvedPath}`);
    const csvContent = fs.readFileSync(resolvedPath, 'utf-8');
    
    console.log(`📊 Parsing test cases...`);
    const testCases = parseCSV(csvContent);
    
    console.log(`🔐 Authenticating with Zephyr Scale...`);
    const client = createZephyrClient(process.env.ZEPHYR_API_TOKEN);
    
    console.log(`🚀 Publishing test cases to Zephyr...`);
    const results = await client.createMultipleTestCases(testCases, projectKeyOrIssue);
    
    // Summary
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 FINAL SUMMARY`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Successfully published: ${successCount}`);
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount}`);
    }
    console.log(`📝 Total test cases: ${results.length}`);
    console.log(`${'='.repeat(60)}\n`);
    
    // Detailed results
    if (successCount > 0) {
      console.log(`✅ Created Test Cases:`);
      results.filter(r => r.success).forEach(r => {
        console.log(`   ${r.testCaseKey} (originally ${r.originalKey})`);
      });
      console.log();
    }
    
    if (failCount > 0) {
      console.log(`❌ Failed Test Cases:`);
      results.filter(r => !r.success).forEach(r => {
        console.log(`   ${r.originalKey}: ${r.error}`);
      });
      console.log();
    }
    
    process.exit(failCount > 0 ? 1 : 0);
    
  } catch (error) {
    console.error(`\n❌ Fatal Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
})();
