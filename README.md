# node-seo-for-fun

Node.js application to parse HTML DOM document, validate its SEO scores, and show alerting messages for recommendations.

*Series of code_for_fun*

## Prerequisites

- Node.js 14.0 or higher

## Installation

After cloning, install all dependencies:
```sh
npm install
```

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

Test static AppUtil class usage. Most default SEO rules are predefined in config file (**default**: `conf/config.json`).

- `setCfgVal()`: set a key-value property to config file
- `getCfgVal()`: load a key-value property from config file

```sh
npm test ./test/AppUtil_test.js
```

Reader and writer classes usage:

- Super classes: `ReaderBase`, `WriterBase`
- Derived from `ReaderBase`: `FileReader`, `StreamReader`
- Derived from `WriterBase`: `FileWriter`, `StreamWriter`, `ConsoleWriter`

```sh
npm test ./test/app_fs_test.js
```

To unit test each rule's settings and syntax. We create a `SingleRuleParser` class, then call `checkConfigSyntax()`. Returns `true` if the syntax is valid.
```sh
npm test ./test/SingleRuleParser_test.js
```

The high-level SEO validator class: `SEOValidator`. Test portfolio includes:

- Rules 1, 2, 3, 4, 5, 101 — you can `includeRules()` or `excludeRules()` on demand
- Input/output channels with necessary properties (such as path or data)
- HTML examples under `test/input/` folder

```sh
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

## License

MIT

*Enjoy this **node-seo-for-fun** project!*
