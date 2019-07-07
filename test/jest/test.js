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
