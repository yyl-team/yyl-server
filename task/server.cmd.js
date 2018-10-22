const util = require('yyl-util');
const chalk = require('chalk');

const pkg = require('../package.json');
const main = require('./server.main.js');

const cmd = {
  help(iEnv) {
    const h = {
      usage: 'yys',
      commands: {
        'start': 'start proxy server',
        'abort': 'start proxy server'
      },
      options: {
        '-h, --help': 'print usage information',
        '-v, --version': 'print version'
      }
    };
    if (!iEnv || !iEnv.silent) {
      util.help(h);
    }
    return Promise.resolve(h);
  },
  version(iEnv) {
    if (!iEnv || !iEnv.silent) {
      console.log([
        '',
        ` yys ${chalk.yellow(pkg.version)}`,
        ''
      ].join('\n'));
    }
    return Promise.resolve(pkg.version);
  },
  async start(iEnv) {
    await main.start(iEnv);
  },
  async abort(iEnv) {
    await main.abort(iEnv);
  }
};

module.exports = cmd;
