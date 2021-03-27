const http = require('http')
const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Context-Type': 'text/plain' })
  res.end(`the cookies:[${req.headers.cookie}]`)
})
app.listen(5000)
module.exports = app
