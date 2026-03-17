'use strict'

const { Readable } = require('stream')
const { SEOValidator } = require('../lib/seo/seo_validator')
const { AppUtil } = require('../lib/app_util')
const { RuleInputEnum } = require('../lib/models/app_enum')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { html, rules } = req.body || {}

  if (!html || typeof html !== 'string') {
    res.status(400).json({ error: 'Missing or invalid "html" field' })
    return
  }

  const ruleIds = Array.isArray(rules) ? rules : [1, 2, 3, 4, 5, 101]

  try {
    const stream = Readable.from([html])
    const writerProxy = {
      setData() {},
      write() { return Promise.resolve() }
    }

    const validator = new SEOValidator()
      .includeRules(ruleIds)
      .setReader(AppUtil.createReader({ kind: RuleInputEnum.stream, stream }))

    validator.writer = writerProxy

    const result = await validator.validate()

    res.status(200).json({
      success: true,
      warnings: result.data || [],
      count: result.count || 0,
      rules: ruleIds
    })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Validation failed' })
  }
}
