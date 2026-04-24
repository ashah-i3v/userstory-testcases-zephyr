# Review Request

## Overview
- Story: {{story_key}} - {{story_title}}
- Module: {{module_name}}
- Prepared by: {{author_or_agent}}
- Date: {{review_date}}

## Goal
Approve story quality updates first, then approve Zephyr test publishing.

## Step 1: Jira Story Approval 🟡
### Checklist
- Business intent is preserved and clear.
- Acceptance criteria are specific, measurable, and testable.
- Assumptions and dependencies are accurate.
- Proposed Jira field changes are appropriate.

### Response
- Approve: APPROVED_FOR_JIRA_UPDATE
- Request changes: CHANGES_REQUIRED: <comments>

## Step 2: Zephyr Publish Approval 🟣
### Checklist
- Test set includes positive, negative, boundary, and integration scenarios.
- Test steps and expected results are clear and executable.
- Every test case maps to acceptance criteria.
- Priority and risk alignment are correct.

### Response
- Approve: APPROVED_FOR_ZEPHYR_PUBLISH
- Request changes: CHANGES_REQUIRED: <comments>

## Rules
- Jira updates are blocked until Step 1 is approved.
- Zephyr publish is blocked until Step 2 is approved.

## Execution Trace (Optional)
- [{{timestamp_1}}] [Story Review] Assessment completed -> Ready for Jira approval
- [{{timestamp_2}}] [Jira Gate] Approval check -> {{jira_gate_status}}
- [{{timestamp_3}}] [Test Design] Test case generation -> {{test_generation_status}}
- [{{timestamp_4}}] [Zephyr Gate] Approval check -> {{zephyr_gate_status}}
