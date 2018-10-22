const util = require('yyl-util');

function log (type, argv) {
  let iArgv = [];
  if (typeof argv === 'string') {
    iArgv.push(argv);
  } else {
    iArgv = argv;
  }
  util.msg[type](...iArgv);
}

module.exports = log;
