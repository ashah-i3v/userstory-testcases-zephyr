# Documentation Format Guide

## Overview
Documentation is a separate output from the story. Do not embed documentation content inside the story sections.

Generate one markdown file per audience requested: internal, external, or both.

Documentation generation must use the current codebase as a primary source. When a Jira issue key is provided, use Jira context as a secondary source to clarify scope, business intent, and terminology.

## Required Documentation Structure

Use this exact structure for each generated document:

```markdown
# [Feature Name] — [Internal User Guide | External User Guide]

## Overview
Describe what the feature does in plain business terms.

## When to Use This
Explain the business scenario that leads a user to this screen.

## How to Access
Provide the full navigation path.
Example: Menu -> IRP -> Accounts -> New Account

## [Section Name]
Brief description of the section's purpose.

### Field Guide
| Field | Description | Required? | Notes |
| --- | --- | --- | --- |

## Buttons
| Button | What It Does |
| --- | --- |

## Business Rules
- List the rules and validations enforced by the system in plain language.
```

**Note:** Repeat the section block for each page section represented in the feature.

## Audience Rules

### Internal Documentation
- Include all fields, including admin-only and back-office fields.
- Include all buttons, supervisor-level rules, and back-out or cancel procedures.
- Include internal workflow guidance, operational notes, and exception handling as appropriate.

### External Documentation
- Exclude any field hidden by external-user logic, including fields controlled by `SetDisabledFieldsForExternal` or `SetDisabledFieldsForServiceProvider` when identified in the codebase.
- Exclude the Document Tracking section.
- Exclude internal-only workflow steps, overrides, and administrative procedures.
- Write from the carrier or external user perspective using simpler language.

## Documentation Guidelines
- Write for non-technical users performing daily tasks.
- Keep explanations clear, concise, and practical.
- Focus on user actions and outcomes, not code details.
- Base the documentation on actual code behavior, visible fields, enabled actions, and documented business rules found in the current codebase.
- When a Jira issue key is provided, use Jira to clarify business scope, but do not let Jira override observable code behavior without calling out the discrepancy.
- If the code reveals validations or restrictions, include them under Business Rules.
- Explain required fields and multi-step workflows clearly.
- Mark internal-only fields in the internal document.
- Omit fields that external users cannot see from the external document.

## Output Paths
- Internal documentation: `docs/internal/[module]/[feature].md`
- External documentation: `docs/external/[module]/[feature].md`

### Examples:
- `docs/internal/irp/new_account.md`
- `docs/external/irp/new_account.md`

**Note:** Create any missing subfolders under `docs/` when documentation files are generated.
