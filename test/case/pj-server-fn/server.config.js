const express = require('express')
const path = require('path')
module.exports = {
  root: './dist',
  port: 5000,
  entry() {
    const app = express()
    app.use('/', express.static(path.join(__dirname, './site')))
    app.close = () => {
      server.close()
    }

    const server = app.listen(5000)
    return app
  }
}
