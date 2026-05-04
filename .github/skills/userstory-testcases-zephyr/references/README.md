# Reference Documentation

This directory contains detailed reference documentation for the User Story and Zephyr Test Management skill.

## Skill Files

### [SKILL.md](../SKILL.md)
Complete skill definition and workflow logic. Includes:
- Operating modes (1–4: create, improve, test, document)
- Preflight checks with readiness sequences
- Atlassian and Zephyr MCP requirements
- **Documentation Format Validation Sequence** (new)
- Workflow stages and output order
- Quality standards and safety rules

### User Prompts
Mode-specific prompts are located in [`.github/prompts/`](../../prompts/). Each mode has a dedicated prompt:
- [`mode1-create-new-story.prompt.md`](../../prompts/mode1-create-new-story.prompt.md) — Mode 1 (create new story from scratch)
- [`mode2-update-story.prompt.md`](../../prompts/mode2-update-story.prompt.md) — Mode 2 (improve and update existing story)
- [`mode3-create-testcases-and-publish.prompt.md`](../../prompts/mode3-create-testcases-and-publish.prompt.md) — Mode 3 (generate Zephyr test cases and publish)
- [`mode4-generate-documentation.prompt.md`](../../prompts/mode4-generate-documentation.prompt.md) — Mode 4 (generate user documentation with format validation)

## Reference Files

### [story-format.md](story-format.md)
Complete guide to user story structure and business audience standards. Includes:
- Required story sections (User Story, Description, Acceptance Criteria, etc.)
- Story writing rules
- Business vs technical language guidelines
- Quality standards

### [documentation-format.md](documentation-format.md)
Guide for generating user documentation. Includes:
- Documentation structure and format
- Audience-specific rules (internal vs external)
- Field guide templates
- Output path conventions
- **Format validation requirements** (enforced by skill before output)

### [excel-template-format.md](excel-template-format.md)
Zephyr Excel import format specification. Includes:
- Template schema and column definitions
- Import format rules
- Test case field requirements
- Coverage requirements

### [installation-atlassian.md](installation-atlassian.md)
Atlassian MCP Server installation and configuration. Includes:
- HTTP (Rovo) and stdio setup options
- Prerequisites for each option
- Step-by-step installation guides for VS Code and Copilot CLI
- OAuth configuration and read-only restrictions
- Available tools and troubleshooting

### [installation-zephyr.md](installation-zephyr.md)
Zephyr MCP Server installation and configuration. Includes:
- Prerequisites and environment values
- Clone, build, and configuration steps
- MCP configuration file setup
- Runtime verification
- Troubleshooting guide

## Usage

These reference files are linked from the main [SKILL.md](../SKILL.md) file. When the skill needs detailed information, it will reference the appropriate file instead of duplicating content.

This modular structure makes it easier to:
- Maintain and update specific sections independently
- Find relevant information quickly
- Keep the main skill file focused on workflow and logic

## Documentation Format Validation (Mode 4)

When generating user documentation (Mode 4), the skill enforces a mandatory validation sequence to ensure all documentation conforms to the required format:

### Validation Steps
1. **Output Path Structure** — Confirms that `docs/`, `docs/internal/`, and `docs/external/` folders exist (creates if needed)
2. **Document Structure** — Validates heading, section order, table column counts against the specification
3. **Audience Rules** — Confirms that internal docs include all admin fields and external docs exclude them
4. **Content Sources** — Verifies codebase grounding (primary) and Jira context (secondary only)
5. **Format Compliance** — Records validation success in the execution log

### Failure Codes
If validation fails, the skill stops and returns one of these codes:
- `DOCS_PATH_CREATION_FAILED` — Required folders could not be created
- `DOCUMENTATION_FORMAT_VIOLATION` — Structure doesn't match specification
- `DOCUMENTATION_AUDIENCE_MISMATCH` — Audience rules violated
- `DOCUMENTATION_SOURCE_INVALID` — Not grounded in codebase

### Docs Folder Structure

Generated documentation follows this structure:

```
docs/
  internal/
    [module]/
      [feature].md          ← Internal user guide (admin + back-office fields)
  external/
    [module]/
      [feature].md          ← External user guide (carrier/lienholder perspective)
```

**Example:**
```
docs/
  internal/
    customer/
      lienholder_signup_elt_id.md
  external/
    customer/
      lienholder_signup_elt_id.md
```

### Quality Standards

All generated documentation must:
- ✅ Have correct heading format: `# [Feature Name] — [Internal User Guide | External User Guide]`
- ✅ Include all required sections: Overview, When to Use This, How to Access, [Feature Sections], Business Rules
- ✅ Use exact table formats (Field Guide: 4 columns; Buttons: 2 columns)
- ✅ Be based on codebase behavior (observable fields, validations, errors, workflows)
- ✅ Exclude embedded story content (no User Story, Acceptance Criteria, etc.)
- ✅ Follow audience-specific visibility rules (internal shows all; external hides admin content)
- ❌ No technical details (class names, method names, framework names, routes, DB terminology)
- ❌ No Jira-only content without code backing
- ❌ No mixed internal/external in one file

See [documentation-format.md](documentation-format.md) for the complete format specification.
