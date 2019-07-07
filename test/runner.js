const util = require('yyl-util');
const path = require('path');
const fs = require('fs');
const print = require('yyl-print');
const { Server, Proxy } = require('../index');

const log = (type, args) => {
  print.log[type](...args);
};

const runner = async () => {
  const { env } = util.cmdParse(process.argv, {
    env: { silent: Boolean}
  });
  const targetPath = path.join(process.cwd(), env.path);
  if (!fs.existsSync(targetPath)) {
    throw new Error(`path not exists, ${targetPath}`);
  }

  const configPath = path.resolve(targetPath, 'config.js');
  if (!fs.existsSync(configPath)) {
    if (!fs.existsSync(targetPath)) {
      throw new Error(`path not exists, ${configPath}`);
    }
  }
  delete env.path;

  const config = require(configPath);

  const server = new Server({
    log,
    env,
    config: config.server,
    cwd: targetPath
  });

  await server.start();

  if (config.proxy) {
    const proxyServer = new Proxy({
      log,
      env,
      config: config.proxy,
      cwd: targetPath
    });
    await proxyServer.start();
  }
};

runner();