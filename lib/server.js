const util = require('yyl-util');
const chalk = require('chalk');
const pkg = require('../package.json');
const server = {
  help(iEnv) {
    const h = {
      usage: 'yys',
      commands: {
        'start': 'start proxy server'
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
        ' +--------------------+',
        ` |`
        ' +--------------------+'
      ].join('\n'))
      console.log(`yys ${chalk.yellow(pkg.version)}`);
    }
    return Promise.resolve(pkg.version);
  }
};
module.exports = server;
