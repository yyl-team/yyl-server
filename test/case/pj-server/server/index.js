const express = require('express');
const path = require('path');
const config = require('../server.config');
const app = express();

app.use('/assets', express.static(
  path.join(__dirname, '../dist/assets')
));
app.use('/', express.static(
  path.join(__dirname, '../dist/html')
));

const server = app.listen(config.port);

app.close = () => {
  server.close();
};

module.exports = app;
