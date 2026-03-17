# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-17

### Added
- Web UI for browser-based SEO validation (`public/index.html`)
- REST API endpoint `POST /api/validate` for programmatic access
- Vercel deployment support (`vercel.json`)
- Express server with `npm start` / `npm run dev` commands
- `CONTRIBUTING.md` with guidelines for adding new rules
- `CHANGELOG.md`
- GitHub Topics for discoverability
- README badges (CI, License, Node.js, Last Commit)
- README sections: Features, Built-in Rules table, Architecture, Quick Example with output

### Changed
- Default branch renamed from `master` to `main`
- LICENSE updated from BSD-3-Clause to MIT (matching package.json)
- README fully rewritten with badges, feature list, and deploy button
- CI workflow updated to target `main` branch
- `app.js` rewritten as Express web server (was placeholder)

### Removed
- `.gitlab-ci.yml` (legacy GitLab CI config)

## [0.1.0] - 2019-01-01

### Added
- Initial release
- SEO validation engine with cheerio-based HTML DOM parsing
- 5 built-in rules: `<img alt>`, `<a rel>`, `<head>` meta tags, `<strong>` limit, `<H1>` uniqueness
- Custom rule support (rule 101+) via JSON config
- Pattern system: `existsTag`, `existsAttr`, `existsNoAttr`, `existsAttrVal`, `tagCountLessThan`
- Flexible I/O: `FileReader`, `StreamReader`, `FileWriter`, `StreamWriter`, `ConsoleWriter`
- `SEOValidator` with `includeRules()` / `excludeRules()` API
- Mocha test suite (57 tests)
- ESLint + Husky + lint-staged
- GitHub Actions CI (Node 20, 22)
