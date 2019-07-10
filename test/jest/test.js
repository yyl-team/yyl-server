const fs = require('fs');
const path = require('path');
const request = require('yyl-request');
const CASE_PATH = path.join(__dirname, '../case');
const util = require('yyl-util');
const { Server, Runner, Proxy } = require('../../index');
const extOs = require('yyl-os');
const TEST_CTRL = {
  SERVER: true,
  PROXY: true,
  RUNNER: true,
  CLEAN: true,
  MOCK: true,
  CASE: true
};

if (TEST_CTRL.SERVER) {
  test('Server usage', async() => {
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
    expect(res.statusCode).toEqual(200);
    await server.abort();
  });
}
if (TEST_CTRL.PROXY) {
  test('Proxy usage', async() => {
    const pjPath = path.join(CASE_PATH, 'proxy');
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

    const proxy = new Proxy({
      config: config.proxy,
      log,
      env,
      cwd: pjPath
    });
    await proxy.start();
    const url = proxy.config.homePage;
    const [, res] = await request({
      url,
      proxy: `http://${extOs.LOCAL_IP}:${proxy.config.port}`
    });
    expect(res.statusCode).toEqual(200);
    await util.waitFor(1000);
    await server.abort();
    await proxy.abort();
  });
}

if (TEST_CTRL.CLEAN) {
  test('Runner.clean()', async() => {
    await Runner.clean();
  });
}

if (TEST_CTRL.MOCK) {
  test('mock test', async() => {
    const pjPath = path.join(CASE_PATH, 'mock');
    const configPath = path.join(pjPath, 'config.js');
    const config = require(configPath);
    const log = () => undefined;
    const env = { silent: true };

    const runner = new Runner({
      config: config,
      log,
      env,
      cwd: pjPath
    });
    await runner.start();
    const { serverAddress } = runner.config.localserver;

    const checkingArr = [{
      href: '/db'
    }, {
      href: '/mockapi',
      check({ data }) {
        expect(data.length).not.toEqual(0);
      }
    }, {
      href: '/mockapi/1'
    }, {
      href: '/mockapi?_sort=id',
      check({ data }) {
        expect(data[0].id).toEqual(1);
      }
    }, {
      href: '/mockapi?_sort=id&_order=desc',
      check({ data }) {
        expect(data[0].id).toEqual(5);
      }
    }, {
      href: '/mockapi?_start=1',
      check({ data }) {
        expect(data.length).toEqual(4);
      }
    }, {
      href: '/mockapi?_end=3',
      check({ data }) {
        expect(data.length).toEqual(4);
      }
    }, {
      href: '/mockapi?_limit=3',
      check({ data }) {
        expect(data.length).toEqual(3);
      }
    }, {
      href: '/mockapi?_limit=-1',
      check({ data }) {
        expect(data.length).toEqual(0);
      }
    }, {
      href: '/mockapi?_start=1&_end=3',
      check({ data }) {
        expect(data.length).toEqual(3);
      }
    }, {
      href: '/mockapi?_start=1&_end=3&_limit=2',
      check({ data }) {
        expect(data.length).toEqual(2);
      }
    }, {
      href: '/mockapi?id_gte=2',
      check({ data }) {
        expect(data.length).toEqual(4);
      }
    }, {
      href: '/mockapi?id_lte=2',
      check({ data }) {
        expect(data.length).toEqual(2);
      }
    }, {
      href: '/mockapi?id_ne=2',
      check({ data }) {
        expect(data.length).toEqual(4);
      }
    }, {
      href: `/mockapi?title_like=${encodeURIComponent('又')}`,
      check({ data }) {
        expect(data.length).toEqual(1);
      }
    }, {
      href: '/mockapi?uid=1369446333',
      check({ data }) {
        expect(data.length).toEqual(1);
      }
    }, {
      href: '/justObject'
    }, {
      href: '/api',
      check({ data }) {
        expect(data.length).not.toEqual(0);
      }
    }, {
      href: '/mapi/1'
    }, {
      href: '/mapi/1?callback=aa',
      jsonp: 'aa',
      check({ data }) {
        expect(data.length).not.toEqual(0);
      }
    }, {
      href: '/mapi/1?jsonp=bb&bb=aa',
      jsonp: 'aa',
      check({ data }) {
        expect(data.length).not.toEqual(0);
      }
    }];

    await util.forEach(checkingArr, async(item) => {
      const url = `${serverAddress}${item.href}`;
      const [, res, data] = await request(url);
      expect(res.statusCode).toEqual(200);
      let iData;
      if (item.jsonp) {
        const jsonpMatch = new RegExp(`^${item.jsonp}\\((.+)\\);$`);
        const iMatch = data.match(jsonpMatch);
        expect(iMatch).not.toEqual(null);
        iData = JSON.parse(iMatch[1]);
      } else {
        iData = JSON.parse(data);
      }
      expect(typeof iData).toEqual('object');
      if (item.check) {
        item.check({ data: iData });
      }
    });

    await runner.abort();
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
}
