# User Story Format Guide

## Required Story Format
All created or improved stories must use the exact section structure below.

### 1. User Story
As a \<role\>, I want \<capability\>, so that \<business value\>.

### 2. Description
A concise paragraph describing the business intent, scope, and expected outcome.

### 3. Acceptance Criteria
- Use Given/When/Then for every criterion.
- Include normal flow and alternate outcomes where applicable.

### 4. Validation Rules
List user-visible field and input validation constraints.

### 5. Edge Cases
List unusual, boundary, and exception scenarios the system must handle.

### 6. Error Handling Scenarios
Describe expected user-facing behavior and messages for failure conditions.

## Story Writing Rules
- Do not omit any section.
- Do not merge sections.
- Keep section titles exactly as written.
- Keep all acceptance criteria testable, specific, and measurable.

## Business Audience Standard
Stories are written for business stakeholders, especially BAs and POs. The story must describe what the system should do, not how it is implemented.

### What to Include vs Exclude

| Include | Exclude |
| --- | --- |
| "The user can submit a lienholder registration." | "The API sends an HTTP POST to a lienholder endpoint." |
| "The system rejects a duplicate provider name." | "The command handler throws a conflict exception." |
| "A confirmation number is returned after successful creation." | "The response DTO returns a string property." |
| "The service provider name is required." | "A FluentValidation `NotEmpty()` rule is applied." |
| "The system shows a validation message when the address is missing." | "The response contains a 422 status with `invalid-params`." |

**Enforcement rule:** Rewrite any sentence that introduces implementation detail.

## Quality Standards
- Acceptance criteria must be specific, measurable, and verifiable.
- The story must contain only what the system should do, not how it is implemented.
- Codebase-derived details must be grounded in actual code, not inferred without evidence.
- The final story must be readable and useful to a BA or PO without technical translation.
- High-risk requirements must include negative-path coverage.
- Open questions must be explicit and clearly marked.
