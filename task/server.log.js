const util = require('yyl-util');

function log (type, argv) {
  util.msg[type](...argv);
}

module.exports = log;
