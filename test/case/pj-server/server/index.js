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

app.listen(config.port);

module.exports = app;
