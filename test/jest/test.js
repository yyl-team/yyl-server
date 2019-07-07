const fs = require('fs');
const path = require('path');
const request = require('yyl-request');
const CASE_PATH = path.join(__dirname, '../case');
const util = require('yyl-util');
const { Server } = require('../../index');
const TEST_CTRL = {
  MOCK: true,
  CASE: true
};

if (TEST_CTRL.MOCK) {
  test('mock test', async() => {
    const pjPath = path.join(CASE_PATH, 'mock');
    const configPath = path.join(pjPath, 'config.js');
    const config = require(configPath);
    const log = () => undefined;
    const env = {};

    const server = new Server({
      config: config.server,
      log,
      env,
      cwd: pjPath
    });
    await server.start();
    const { serverAddress } = server.config;

    const checkingArr = [{
      href: `${serverAddress}/db`,
      check({ res, data }) {
        expect(res.statusCode).toEqual(200);
        const iData = JSON.parse(data);
        expect(typeof iData).toEqual('object');
      }
    }];

    await util.forEach(checkingArr, async(item) => {
      const [, res, data] = await request(item.href);
      item.check({res, data});
    });

    await server.abort();
  });
}

if (TEST_CTRL.CASE) {
  const caseArr = fs.readdirSync(CASE_PATH).filter((name) => {
    return !(/^\./.test(name));
  });

  caseArr.forEach((dirname) => {
    test(`case test ${dirname}`, async() => {
      const pjPath = path.join(CASE_PATH, dirname);
      const configPath = path.join(pjPath, 'config.js');
      const config = require(configPath);
      const log = () => undefined;
      const env = {};

      const server = new Server({ config: config.server, log, env });
      await server.start();

      if (config.homePage) {
        const [, res] = await request(path.resove(server.config.serverAddress, config.homePage));
        expect(res.status).toEqual(200);
      }
      await server.abort();
    });
  });
}
