'use strict'

const path = require('path')
const express = require('express')
const validateHandler = require('./api/validate')
const { AppUtil } = require('./lib/app_util.js')

const app = express()
const PORT = process.env.PORT || AppUtil.getCfgVal('app:port') || 3000

app.use(express.json({ limit: '1mb' }))
app.use(express.static(path.join(__dirname, 'public')))

app.post('/api/validate', validateHandler)

app.listen(PORT, () => {
  console.log(`SEO Validator running at http://localhost:${PORT}`)
})
