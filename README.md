# node-seo-for-fun

[![CI](https://github.com/osisdie/node-seo-for-fun/actions/workflows/ci.yml/badge.svg)](https://github.com/osisdie/node-seo-for-fun/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Last Commit](https://img.shields.io/github/last-commit/osisdie/node-seo-for-fun)](https://github.com/osisdie/node-seo-for-fun/commits/main)

A configurable Node.js SEO validator that parses HTML DOM, checks against customizable rules, and reports actionable recommendations. Supports file and stream I/O with flexible output options.

*Series of code_for_fun*

## Features

- **5 built-in SEO rules** — covers `<img alt>`, `<a rel>`, `<head>` meta tags, `<strong>` overuse, `<H1>` uniqueness
- **Custom rules** — define your own rules via JSON config (no code changes needed)
- **Flexible I/O** — read from files or streams, output to files, streams, or console
- **Pattern-based** — extensible pattern system (`existsTag`, `existsAttr`, `existsNoAttr`, `existsAttrVal`, `tagCountLessThan`)
- **Selective validation** — include or exclude specific rules per run
- **Web UI included** — paste HTML and get instant results via browser
- **Vercel-ready** — one-click deploy to Vercel

**[Live Demo](https://node-seo-for-fun.vercel.app)** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fosisdie%2Fnode-seo-for-fun)

## Quick Example

```
$ node -e "
const fs = require('fs');
const { SEOValidator } = require('./lib/seo/seo_validator');
const { AppUtil } = require('./lib/app_util');
const { RuleInputEnum, RuleOutputEnum } = require('./lib/models/app_enum');

let readStream = fs.createReadStream('test/input/https___google_com_tw');
let validator = new SEOValidator()
  .includeRules([1, 2, 3, 4, 5])
  .setReader(AppUtil.createReader({ kind: RuleInputEnum.stream, stream: readStream }))
  .setWriter(AppUtil.createWriter({ kind: RuleOutputEnum.console }));

validator.validate().then(result => console.log(result.data));
"
```

**Output:**

```
This HTML without <a rel> tag
This HTML without <meta name="description"> tag
This HTML without <meta name="keywords"> tag
```

## Built-in Rules

| Rule | Checks | Severity |
|------|--------|----------|
| **Rule 1** | `<img>` tags must have `alt` attribute | Accessibility + SEO |
| **Rule 2** | `<a>` tags must have `rel` attribute | SEO link signals |
| **Rule 3** | `<head>` must contain `<title>`, `<meta name="description">`, `<meta name="keywords">` | Critical SEO |
| **Rule 4** | No more than 15 `<strong>` tags | Content quality |
| **Rule 5** | Only one `<H1>` tag allowed | SEO heading structure |
| **Rule 101** | `<meta name="robots">` must exist (custom example) | Crawl control |

## Prerequisites

- Node.js 20.0 or higher

## Installation

```sh
git clone https://github.com/osisdie/node-seo-for-fun.git
cd node-seo-for-fun
npm install
```

### Run Locally (Web UI)

```sh
npm start          # http://localhost:3000
# or with hot-reload:
npm run dev
```

Open `http://localhost:3000` to use the web-based SEO validator.

### Deploy to Vercel

```sh
npx vercel
```

Or click the **Deploy with Vercel** button above for one-click deployment.

## Config Your Rules

SEO rules are defined in the config file (**default**: `conf/config.json`)

### Default SEO syntax patterns
```json
"seo": {
    "pattern": {
      "existsTag": {
        "xpath": "{{root}} {{tag}}",
        "msg": "This HTML without <{{tag}}> tag"
      },
      "existsAttr": {
        "xpath": "{{root}} {{tag}}[{{attr}}]",
        "msg": "This HTML without <{{tag}} {{attr}}> tag"
      },
      "existsNoAttr": {
        "xpath": "{{root}} {{tag}}:not([{{attr}}])",
        "msg": "This HTML without <{{tag}} {{attr}}> tag"
      },
      "existsAttrVal": {
        "xpath": "{{root}} {{tag}}[{{attr}}*={{value}}]",
        "msg": "This HTML without <{{tag}} {{attr}}=\"{{value}}\"> tag"
      },
      "tagCountLessThan": {
        "xpath": "{{root}} {{tag}}",
        "msg": "This HTML have more than {{max}} <{{tag}}> tag"
      }
    }
}
```

### Predefined SEO rules 1~5 and custom rule 101

```json
"seo": {
    "rules": {
      "rule1": {
        "ruleFor": [
          {
            "pattern": "seo:pattern:existsNoAttr",
            "fn": "checkShouldNotExist",
            "root": "html",
            "tag": "img",
            "attr": "alt"
          }
        ]
      },
      "rule2": {
        "ruleFor": [
          {
            "pattern": "seo:pattern:existsNoAttr",
            "fn": "checkShouldNotExist",
            "root": "html",
            "tag": "a",
            "attr": "rel"
          }
        ]
      },
      "rule3": {
        "ruleFor": [
          {
            "pattern": "seo:pattern:existsTag",
            "fn": "checkShouldExist",
            "root": "head",
            "tag": "title",
            "min": 1,
            "max": 1
          },
          {
            "pattern": "seo:pattern:existsAttrVal",
            "fn": "checkShouldExist",
            "root": "head",
            "tag": "meta",
            "attr": "name",
            "value": "description",
            "min": 1,
            "max": 1
          },
          {
            "pattern": "seo:pattern:existsAttrVal",
            "fn": "checkShouldExist",
            "root": "head",
            "tag": "meta",
            "attr": "name",
            "value": "keywords",
            "min": 1,
            "max": 1
          }
        ]
      },
      "rule4": {
        "ruleFor": [
          {
            "pattern": "seo:pattern:tagCountLessThan",
            "fn": "checkMaxOccurrence",
            "root": "html",
            "tag": "strong",
            "max": 15,
            "min": 0
          }
        ]
      },
      "rule5": {
        "ruleFor": [
          {
            "pattern": "seo:pattern:tagCountLessThan",
            "fn": "checkMaxOccurrence",
            "root": "html",
            "tag": "h1",
            "max": 1,
            "min": 0
          }
        ]
      },
      "rule101": {
        "ruleFor": [
          {
            "pattern": "seo:pattern:existsAttrVal",
            "fn": "checkShouldExist",
            "root": "head",
            "tag": "meta",
            "attr": "name",
            "value": "robots",
            "min": 1,
            "max": 1
          }
        ]
      }
    }
}
```

## Unit Test

Run all tests:
```sh
npm test
```

**Sample output** (57 tests):
```
  AppUtil() requires(/lib/app_util.js)
    config
      ✔ path conf/config.json should exist
    Function getCfgVal()
      version
        ✔ app:version should be 0.1.0

  SEOValidator() requires(/lib/seo/seo_validator.js)
    Function validate()
      pass, input:file, output:file
        ✔ rule1 should have 0 warning(s)
        ✔ rule2 should have 0 warning(s)
        ...
      NOT pass, input:stream, output:console
        ✔ https://google.com.tw returns 3 warning(s)

  SingleRuleParser() requires(/lib/seo/seo_validator.js)
    Function checkConfigSyntax()
      ✔ correctly syntax (×11)
    Function analysis()
      ✔ should return isSuccess with/without warnings (×14)

  57 passing (2s)
```

### Test individual modules

```sh
# AppUtil config tests
npm test ./test/AppUtil_test.js

# Reader/Writer I/O tests
npm test ./test/app_fs_test.js

# Single rule syntax validation
npm test ./test/SingleRuleParser_test.js

# Full SEO validator integration tests
npm test ./test/SEOValidator_test.js
```

## Usage Example

```js
const fs = require('fs')
const { SEOValidator } = require('./lib/seo/seo_validator')
const { AppUtil } = require('./lib/app_util')
const { RuleInputEnum, RuleOutputEnum } = require('./lib/models/app_enum')

let readStream = fs.createReadStream('test/input/https___google_com_tw')
let validator = new SEOValidator()
  .includeRules([1, 2, 3, 4, 5])
  .setReader(AppUtil.createReader({ kind: RuleInputEnum.stream, stream: readStream }))
  .setWriter(AppUtil.createWriter({ kind: RuleOutputEnum.file, path: 'test/output/result.out' }))

validator.validate()
  .then(result => {
    console.log(result.data)
    // ['This HTML without <a rel> tag',
    //  'This HTML without <meta name="description"> tag',
    //  'This HTML without <meta name="keywords"> tag']
  })
```

## Architecture

```
node-seo-for-fun/
├── conf/config.json          # SEO rules & patterns configuration
├── lib/
│   ├── app_util.js           # Config loader & utility factory
│   ├── core/app_fs.js        # ReaderBase / WriterBase (File, Stream, Console)
│   ├── models/app_enum.js    # RuleInputEnum, RuleOutputEnum
│   └── seo/
│       ├── seo_validator.js  # SEOValidator (high-level orchestrator)
│       └── seo_rule.js       # SingleRuleParser / SingleRuleParserBase
├── test/
│   ├── input/                # Test HTML files (pass / not_pass per rule)
│   └── *.js                  # Mocha test suites
└── .github/workflows/ci.yml  # CI: Node 20 + 22
```

## Create Your Own Custom Rule

You can easily create a new rule:

- Rule number should start after 101 (1~100 are reserved for system default rules). Prefix with `rule`, e.g. `rule101`.
- Combine your **tag**, **attribute**, **value**, or even **occurrences** as your new rule content.
- The **pattern** property is a config path, e.g. `"seo:pattern:existsAttrVal"` points to the DOM selector and alert message template.
- The **fn** property specifies the validation method in `SingleRuleParser` / `SingleRuleParserBase` (you can create custom validation functions if needed).

```json
"seo": {
    "rules": {
      "rule101": {
        "ruleFor": [
          {
            "pattern": "seo:pattern:existsAttrVal",
            "fn": "checkShouldExist",
            "root": "head",
            "tag": "meta",
            "attr": "name",
            "value": "robots",
            "min": 1,
            "max": 1
          }
        ]
      }
    }
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new rules and submitting PRs.

## License

[MIT](LICENSE)

*Enjoy this **node-seo-for-fun** project!*
