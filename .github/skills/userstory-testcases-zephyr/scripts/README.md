# Scripts

This directory contains executable CLI scripts for the userstory-testcases-zephyr skill.

## Available Scripts

### `publish-to-zephyr.js`

Publishes test cases from CSV to Zephyr Scale.

**Usage:**
```bash
node scripts/publish-to-zephyr.js <csv-file-path> <jira-issue-key>
```

**Example:**
```bash
cd .github/skills/userstory-testcases-zephyr
node scripts/publish-to-zephyr.js ./output/test-cases-feature-20260728.csv MVS-3370
```

**Environment Variables:**
- `ZEPHYR_API_TOKEN` - Required. Bearer token from Zephyr Scale.

**See Also:**
- [Installation Guide](../references/installation-zephyr.md)
- [Mode 3 Workflow](../modes/mode3-zephyr.md)
- [Why Direct Script?](../WHY-DIRECT-SCRIPT.md)

---

## Directory Structure

```
.github/skills/userstory-testcases-zephyr/
├── lib/                    (Library code - imported by scripts)
│   ├── zephyr-client.js
│   └── csv-parser.js
├── scripts/                (Executable CLI tools)
│   └── publish-to-zephyr.js
├── output/                 (Generated CSV files)
└── ...
```
