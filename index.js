const server = require('./lib/server.js');

const cmd = {
  run: async (ctx, iEnv) => {
    console.log(ctx)
    switch (ctx) {
      case '-v':
      case '--version':
        await server.version(iEnv);
        break;

      case 'start':
        await server.start(iEnv);
        break;

      default:
        await server.help(iEnv);
        break;
    }
  }
};

module.exports = cmd;
