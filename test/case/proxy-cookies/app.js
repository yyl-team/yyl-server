const http = require('http')
http.createServer((req, res) => {
  res.writeHead(200, {'Context-Type': 'text/plain'})
  res.end(`the cookies:[${req.headers.cookie}]`)
}).listen(5000)