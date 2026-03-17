# Contributing to node-seo-for-fun

Thank you for considering contributing! Here's how you can help.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-username>/node-seo-for-fun.git`
3. Install dependencies: `npm install`
4. Run tests: `npm test`

## Adding a New SEO Rule

This is the most common contribution. Follow these steps:

### 1. Define the rule in `conf/config.json`

Add your rule under `seo.rules`. Use rule numbers starting from **102+** (1-100 are reserved for defaults, 101 is the first custom example).

```json
"rule102": {
  "ruleFor": [
    {
      "pattern": "seo:pattern:existsAttrVal",
      "fn": "checkShouldExist",
      "root": "head",
      "tag": "meta",
      "attr": "property",
      "value": "og:title",
      "min": 1,
      "max": 1
    }
  ]
}
```

### 2. Choose a pattern

Available patterns in `seo.pattern`:

| Pattern            | Use Case                                      |
|--------------------|-----------------------------------------------|
| `existsTag`        | Check if a tag exists (e.g., `<title>`)       |
| `existsAttr`       | Check if a tag has an attribute                |
| `existsNoAttr`     | Find tags missing an attribute (e.g., `<img>` without `alt`) |
| `existsAttrVal`    | Check for a tag with a specific attribute value |
| `tagCountLessThan` | Ensure a tag doesn't exceed a count limit     |

### 3. Choose a validation function

| Function              | Behavior                                    |
|-----------------------|---------------------------------------------|
| `checkShouldExist`    | Warns if the element is **missing**         |
| `checkShouldNotExist` | Warns if the element **is found**           |
| `checkMaxOccurrence`  | Warns if element count exceeds `max`        |

### 4. Add test files

- Create test HTML files under `test/input/`:
  - `rule102_pass` — HTML that should pass your rule
  - `rule102_not_pass` — HTML that should trigger a warning
- Add test cases in `test/SEOValidator_test.js`

### 5. Run tests and lint

```sh
npm test
npm run lint
```

## Code Style

- This project uses **ESLint** with the config in `eslint.config.mjs`
- Pre-commit hooks via **husky** + **lint-staged** will auto-lint staged `.js` files
- Follow existing patterns in the codebase

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/rule-og-title`
2. Make your changes and add tests
3. Ensure all tests pass: `npm test`
4. Push and open a Pull Request against `main`
5. Describe what rule you added and why it improves SEO validation

## Reporting Issues

- Use [GitHub Issues](https://github.com/osisdie/node-seo-for-fun/issues)
- Include: Node.js version, steps to reproduce, expected vs actual behavior
