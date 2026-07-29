/**
 * Zephyr Scale API v2 Client - Direct API Implementation
 * No dependencies required - uses Node.js 18+ built-in fetch
 * 
 * Environment Variables:
 *   ZEPHYR_API_TOKEN - Bearer token from Zephyr Scale (required)
 *   JIRA_API_TOKEN - Jira API token for automatic issue key → ID resolution (optional)
 *   JIRA_EMAIL - Your Jira email address (required if using JIRA_API_TOKEN)
 *   JIRA_BASE_URL - Optional Jira base URL (defaults to https://i3verticals.atlassian.net)
 * 
 * Project key is automatically extracted from Jira issue key (e.g., "MVS-3370" → "MVS")
 */

class ZephyrClient {
  constructor(baseUrl = 'https://api.zephyrscale.smartbear.com/v2', apiToken, jiraConfig = {}) {
    if (!apiToken) {
      throw new Error('ZEPHYR_API_TOKEN is required');
    }
    this.baseUrl = baseUrl;
    this.headers = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    };
    
    // Optional Jira API integration for issue key resolution
    this.jiraBaseUrl = jiraConfig.baseUrl || process.env.JIRA_BASE_URL || 'https://i3verticals.atlassian.net';
    this.jiraToken = jiraConfig.token || process.env.JIRA_API_TOKEN;
    this.jiraEmail = jiraConfig.email || process.env.JIRA_EMAIL;
    
    // Jira Cloud uses Basic Auth: base64(email:token)
    if (this.jiraToken && this.jiraEmail) {
      const basicAuth = Buffer.from(`${this.jiraEmail}:${this.jiraToken}`).toString('base64');
      this.jiraHeaders = {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    } else {
      this.jiraHeaders = null;
    }
  }

  /**
   * Resolve Jira issue key to numeric issue ID
   * @param {string} issueKey - Issue key (e.g., "MVS-3370")
   * @returns {Promise<string|null>} Numeric issue ID or null if not found/no Jira token
   */
  async resolveIssueId(issueKey) {
    if (!this.jiraHeaders) {
      return null; // No Jira token available
    }

    try {
      const response = await fetch(
        `${this.jiraBaseUrl}/rest/api/3/issue/${issueKey}?fields=id`,
        {
          method: 'GET',
          headers: this.jiraHeaders
        }
      );

      if (!response.ok) {
        console.log(`⚠️  Could not resolve ${issueKey} to numeric ID (Jira API returned ${response.status})`);
        return null;
      }

      const issue = await response.json();
      return issue.id; // Numeric ID
    } catch (error) {
      console.log(`⚠️  Could not resolve ${issueKey}: ${error.message}`);
      return null;
    }
  }

  /**
   * Create a test case with metadata only (no steps yet)
   * @param {Object} testCase - { name, objective, precondition, projectKey, folder, priority, component, labels, status }
   * @returns {Promise<Object>} Created test case with key
   */
  async createTestCase(testCase) {
    const payload = {
      projectKey: testCase.projectKey,
      name: testCase.name,
      objective: testCase.objective || '',
      precondition: testCase.precondition || '',
      status: testCase.status || 'Draft',
      priority: testCase.priority || 'Normal',
      folder: testCase.folder || null,
      component: testCase.component || null,
      labels: Array.isArray(testCase.labels) ? testCase.labels : []
    };

    const response = await fetch(`${this.baseUrl}/testcases`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Create test case failed (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Add test steps to an existing test case
   * @param {string} testCaseKey - Test case key (e.g., "MVS-T123")
   * @param {Array} steps - Array of { description, testData, expectedResult }
   * @returns {Promise<Object>} Added steps response
   */
  async addTestSteps(testCaseKey, steps) {
    const payload = {
      mode: 'OVERWRITE',
      items: steps.map((step, idx) => ({
        inline: {
          description: step.description || step.step || '',
          testData: step.testData || '',
          expectedResult: step.expectedResult || ''
        }
      }))
    };

    const response = await fetch(
      `${this.baseUrl}/testcases/${testCaseKey}/teststeps`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Add test steps failed (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Link test case to Jira issue
   * @param {string} testCaseKey - Test case key (e.g., "MVS-T123")
   * @param {string} issueKeyOrId - Jira issue key (e.g., "MVS-3370") or numeric ID
   * @returns {Promise<Object>} Link result
   */
  async linkToIssue(testCaseKey, issueKeyOrId) {
    // Resolve issue key to ID if it looks like a key (contains hyphen)
    let issueId = issueKeyOrId;
    if (typeof issueKeyOrId === 'string' && issueKeyOrId.includes('-')) {
      // This is an issue key, try to resolve to numeric ID
      const resolvedId = await this.resolveIssueId(issueKeyOrId);
      if (!resolvedId) {
        throw new Error(`Could not resolve issue key ${issueKeyOrId} to numeric ID. Set JIRA_API_TOKEN to enable automatic resolution.`);
      }
      issueId = resolvedId;
    }
    
    const payload = { issueId };

    const response = await fetch(
      `${this.baseUrl}/testcases/${testCaseKey}/links/issues`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Link to issue failed (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Create test case with steps and link to issue (complete workflow)
   * @param {Object} testCase - Test case metadata
   * @param {Array} steps - Test steps array
   * @param {string} projectKeyOrIssue - Project key (e.g., "MVS") or full issue key (e.g., "MVS-3370")
   * @returns {Promise<Object>} Complete result
   */
  async createTestCaseWithSteps(testCase, steps, projectKeyOrIssue) {
    try {
      // Extract project key and determine if we should link to issue
      let projectKey;
      let issueKey = null;
      
      if (projectKeyOrIssue) {
        if (projectKeyOrIssue.includes('-')) {
          // Full issue key like "MVS-3370"
          projectKey = projectKeyOrIssue.split('-')[0];
          issueKey = projectKeyOrIssue;
        } else {
          // Just project key like "MVS"
          projectKey = projectKeyOrIssue;
        }
      } else {
        throw new Error('Project key or issue key is required');
      }
      
      // Step 1: Create test case metadata
      const payload = {
        ...testCase,
        projectKey: projectKey
      };
      
      const created = await this.createTestCase(payload);
      console.log(`✅ Created test case: ${created.key} in project ${projectKey}`);

      // Step 2: Add test steps (if any)
      if (steps && steps.length > 0) {
        await this.addTestSteps(created.key, steps);
        console.log(`✅ Added ${steps.length} steps to ${created.key}`);
      }

      // Step 3: Link to Jira issue (optional - best effort)
      if (issueKey) {
        try {
          await this.linkToIssue(created.key, issueKey);
          console.log(`✅ Linked ${created.key} to ${issueKey}`);
        } catch (linkError) {
          console.log(`⚠️  Could not auto-link to ${issueKey} (link manually in Zephyr UI)`);
          // Don't fail the entire operation just because linking failed
        }
      }

      return { 
        success: true, 
        testCaseKey: created.key, 
        projectKey, 
        created 
      };
    } catch (error) {
      console.error(`❌ Failed to create test case:`, error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Parse step-by-step text format into structured steps
   * Format example:
   *   1. Do something
   *   Expected: Result happens
   *   
   *   2. Do another thing
   *   Expected: Another result
   * @param {string} stepText - Multi-line step text
   * @returns {Array} Array of step objects
   */
  parseStepByStepText(stepText) {
    if (!stepText || !stepText.trim()) return [];
    
    const steps = [];
    const lines = stepText.split('\n');
    let currentStep = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check if line starts a new step (e.g., "1. ", "2. ")
      const stepMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (stepMatch) {
        // Save previous step if exists
        if (currentStep) {
          steps.push(currentStep);
        }
        // Start new step
        currentStep = {
          description: stepMatch[2],
          testData: '',
          expectedResult: ''
        };
      } else if (trimmed.startsWith('Expected:')) {
        // Expected result line
        if (currentStep) {
          currentStep.expectedResult = trimmed.substring(9).trim();
        }
      } else if (trimmed && currentStep && !currentStep.expectedResult) {
        // Continuation of description
        currentStep.description += ' ' + trimmed;
      }
    }
    
    // Add last step
    if (currentStep) {
      steps.push(currentStep);
    }
    
    return steps;
  }

  /**
   * Create multiple test cases from CSV data
   * @param {Array} csvRows - Parsed CSV rows with all test data
   * @param {string} projectKeyOrIssue - Project key (e.g., "MVS") or full issue key (e.g., "MVS-3370")
   * @returns {Promise<Array>} Array of results
   */
  async createMultipleTestCases(csvRows, projectKeyOrIssue) {
    if (!projectKeyOrIssue) {
      throw new Error('Project key or issue key is required');
    }
    
    const isFullIssueKey = projectKeyOrIssue.includes('-');
    const projectKey = isFullIssueKey ? projectKeyOrIssue.split('-')[0] : projectKeyOrIssue;
    
    console.log(`\n📋 Publishing to project: ${projectKey}`);
    if (isFullIssueKey) {
      console.log(`🔗 Attempting to link all tests to: ${projectKeyOrIssue}\n`);
    } else {
      console.log(`📝 Creating test cases without Jira linking\n`);
    }
    
    const results = [];
    
    // Group CSV rows by test case (same Key)
    const testCaseGroups = {};
    for (const row of csvRows) {
      const key = row.Key || row.key;
      if (!testCaseGroups[key]) {
        testCaseGroups[key] = {
          metadata: row,
          steps: []
        };
        
        // Parse step-by-step text if present (single column format)
        const stepByStepText = row['Test Script (Step-By-Step)'] || row['Test Script (Step-by-Step)'];
        if (stepByStepText && stepByStepText.trim()) {
          testCaseGroups[key].steps = this.parseStepByStepText(stepByStepText);
        }
      }
      
      // Also handle separate step columns (multi-row format)
      const stepText = row['Test Script (Step-by-Step) - Step'] || row['Test Script (Step-By-Step) - Step'];
      if (stepText && stepText.trim()) {
        testCaseGroups[key].steps.push({
          description: stepText,
          testData: row['Test Script (Step-by-Step) - Test Data'] || row['Test Script (Step-By-Step) - Test Data'] || '',
          expectedResult: row['Test Script (Step-by-Step) - Expected Result'] || row['Test Script (Step-By-Step) - Expected Result'] || ''
        });
      }
    }

    console.log(`📊 Found ${Object.keys(testCaseGroups).length} unique test cases\n`);

    // Create each test case
    let successCount = 0;
    let failCount = 0;
    
    for (const [tcKey, data] of Object.entries(testCaseGroups)) {
      const testCase = {
        name: data.metadata.Name || data.metadata.name,
        objective: data.metadata.Objective || data.metadata.objective,
        precondition: data.metadata.Precondition || data.metadata.precondition,
        status: data.metadata.Status || 'Draft',
        priority: data.metadata.Priority || 'Normal',
        component: data.metadata.Component,
        labels: (data.metadata.Labels || '').split(';').filter(l => l.trim()),
        folder: data.metadata.Folder
      };

      console.log(`🔄 Creating ${tcKey}: ${testCase.name}`);
      
      const result = await this.createTestCaseWithSteps(
        testCase,
        data.steps,
        projectKeyOrIssue
      );
      
      results.push({
        originalKey: tcKey,
        ...result
      });

      if (result.success) {
        successCount++;
        console.log(`   ✅ ${tcKey} → ${result.testCaseKey} (${data.steps.length} steps)\n`);
      } else {
        failCount++;
        console.log(`   ❌ ${tcKey}: ${result.error}\n`);
      }

      // Rate limiting: small delay between creates
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📝 Total: ${results.length}\n`);

    return results;
  }
}

// Export for use in skills
module.exports = { ZephyrClient };

/**
 * Factory function for easy instantiation
 * @param {string} apiToken - Zephyr API token (required)
 * @param {Object} jiraConfig - Optional Jira config { token, email, baseUrl }
 * @returns {ZephyrClient} Configured client instance
 */
module.exports.createZephyrClient = function(apiToken, jiraConfig = null) {
  if (!apiToken) {
    throw new Error('ZEPHYR_API_TOKEN environment variable is required');
  }
  
  // Use provided jiraConfig or auto-detect from environment
  const config = jiraConfig || {
    token: process.env.JIRA_API_TOKEN,
    email: process.env.JIRA_EMAIL,
    baseUrl: process.env.JIRA_BASE_URL
  };
  
  return new ZephyrClient(undefined, apiToken, config);
};
