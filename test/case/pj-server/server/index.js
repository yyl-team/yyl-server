const express = require('express')
const path = require('path')
const config = require('../server.config')
const app = express()

app.use('/', express.static(path.join(__dirname, '../site')))

const server = app.listen(config.port)

app.close = () => {
  server.close()
}

module.exports = app
