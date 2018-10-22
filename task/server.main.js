const util = require('yyl-util');
const fs = require('fs');
const path = require('path');
const log = require('./server.log.js');
const CWD = process.cwd();

const main = {
  async start(iEnv) {
    if (!iEnv.debug) {
      util.cleanScreen();
      log('info', ['local server init start']);
    }

    const config = await main.parseConfig(iEnv.config);
  },
  stop(iEnv) {

  },
  parseConfig(configPath) {
    let iPath;
    let config = {};
    if (configPath) {
      if (fs.existsSync(configPath)) {
        iPath = configPath;
      } else {
        log('warn', `config path is not exists: ${configPath}`);
      }
    } else {
      [
        path.join(CWD, 'yys.config.js'),
        path.join(CWD, 'config.js')
      ].some((cPath) => {
        if (fs.existsSync(cPath)) {
          iPath = cPath;
          return true;
        }
      });
    }
    if (!iPath) {
      log('info', 'config path is not exists, use default config');
      return config;
    }

    try {
      config = require(iPath);
    } catch (er) {
      log('error', [`config parse error: ${iPath}`, er]);
    }

    return Promise.resolve(config);
  }
};

module.exports = main;
