const server = require('./lib/server.js');

const cmd = {
  run: async (ctx, iEnv) => {
    if (!ctx || !server[ctx]) {
      await server.help();
    } else {
      await server[ctx](iEnv);
    }
  }
};

module.exports = cmd;
