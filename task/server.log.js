const print = require('yyl-print');

function log (type, argv) {
  let iArgv = [];
  if (typeof argv === 'string') {
    iArgv.push(argv);
  } else {
    iArgv = argv;
  }
  print.log[type](...iArgv);
}

module.exports = log;
