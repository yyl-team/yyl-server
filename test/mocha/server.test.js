const path = require('path');
const CASE_PATH = path.join(__dirname, '../case');
const { Server } = require('../../index');
const request = require('yyl-request');
const { expect } = require('chai');

describe('Server test', () => {
  it('usage', async () => {
    const pjPath = path.join(CASE_PATH, 'base');
    const configPath = path.join(pjPath, 'config.js');
    const config = require(configPath);
    const log = () => undefined;
    const env = { silent: true };

    const server = new Server({
      config: config.localserver,
      log,
      env,
      cwd: pjPath
    });
    await server.start();
    const localserver = server.config;
    const url = `${localserver.serverAddress}/html/`;
    const [, res] = await request(url);
    expect([url, res.statusCode]).to.deep.equal([url, 200]);
    await server.abort();
  });

  it('Server --config usage', async () => {
    const pjPath = path.join(CASE_PATH, 'config');
    const configPath = path.join(pjPath, 'config.js');
    const cwd = process.cwd();
    const config = require(configPath);
    const log = () => undefined;
    const env = { silent: true };

    const server = new Server({
      config: config.localserver,
      log,
      env,
      cwd: path.relative(cwd, pjPath)
    });

    await server.start();
    const localserver = server.config;
    const url = `${localserver.serverAddress}/project/test/pc/html/`;
    const [, res] = await request(url);
    expect(res.statusCode).to.equal(200);
    await server.abort();
  });
});
