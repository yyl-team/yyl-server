const path = require('path');
const CASE_PATH = path.join(__dirname, '../case');
const { Runner } = require('../../index');
const { expect } = require('chai');
const request = require('yyl-request');

exports.handleCase = function (dirname) {
  describe(`case ${dirname} test`, () => {
    it('usage', async() => {
      const pjPath = path.join(CASE_PATH, dirname);
      const configPath = path.join(pjPath, 'config.js');
      let config = require(configPath);
      const log = () => undefined;
      const env = {};

      const runner = new Runner({
        config: config.localserver,
        log,
        env,
        cwd: pjPath
      });

      await runner.start();
      const { homePage } = runner;

      if (homePage) {
        const param = {
          url: homePage
        };
        const [, res] = await request(param);
        expect(res.statusCode).toEqual(200);
      }
      await runner.abort();
    });
  });
};
