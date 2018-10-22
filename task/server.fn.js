const util = require('yyl-util');

const fn = {
  makeAwait(fn) {
    return new Promise(fn);
  },
  checkPortUseage(port) {
    return new Promise((next) => {
      util.checkPortUseage(port, (canUse) => {
        next(canUse);
      });
    });
  }
};

module.exports = fn;
