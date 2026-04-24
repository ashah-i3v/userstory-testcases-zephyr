# Zephyr Excel Import Format

## Overview
Mode 3 test cases must be generated in the Zephyr Excel import format using `atm-exporter.xlsx` as the canonical template.

## Canonical Template Schema
- **Template file:** `.github/skills/userstory-testcases-zephyr/templates/atm-exporter.xlsx`
- **Worksheet name:** `Sheet0`
- **Header row:** `1`

## Required Columns (in exact order)

1. `Key`
2. `Name`
3. `Status`
4. `Precondition`
5. `Objective`
6. `Folder`
7. `Priority`
8. `Component`
9. `Labels`
10. `Owner`
11. `Estimated Time`
12. `Coverage (Issues)`
13. `Coverage (Pages)`
14. `Test Script (Step-by-Step) - Step`
15. `Test Script (Step-by-Step) - Test Data`
16. `Test Script (Step-by-Step) - Expected Result`
17. `Test Script (Plain Text)`
18. `Test Script (BDD)`

## Import Format Rules
- Use worksheet `Sheet0` only.
- Use the exact header names above in the exact column order.
- Populate only values compatible with the template's expected value formats.
- Do not invent or rename columns when template mapping is required.
- If both JSON test case output and Excel import output are requested, provide both and keep content semantically consistent.

## Template Mapping Rules
- Read header row 1 and map generated test case data into those columns.
- Validate worksheet name and full header sequence before mapping.
- If required template columns are empty after mapping, stop with `PRECONDITION_FAILED`.
- If `atm-exporter.xlsx` is missing, unreadable, or incompatible, stop with `ZEPHYR_TEMPLATE_INVALID`.

## Test Case Fields
Include the following fields in every generated test case:
- `TestCaseId` - Unique identifier for the test case
- `Title` - Descriptive name of the test case
- `Preconditions` - Setup requirements before test execution
- `Steps` - Step-by-step test instructions
- `ExpectedResult` - Expected outcome after execution
- `Priority` - Test case priority (e.g., High, Medium, Low)
- `Type` - Test type (e.g., Functional, Integration, Regression)
- `AcceptanceCriteriaReference` - Link back to the acceptance criteria being tested

## Test Coverage Requirements
For mode 3, include:
- Positive test cases (happy path scenarios)
- Negative test cases (error conditions and invalid inputs)
- Boundary test cases (edge values and limits)
- Integration or failure scenarios (as relevant)

Map each test case back to one or more acceptance criteria to ensure full coverage.

## Quality Standards
- Test steps and expected results must be executable without interpretation.
- High-risk requirements must include negative-path coverage.
- Produce an import-ready dataset aligned to `atm-exporter.xlsx` so output can be published to Zephyr without reformatting.
