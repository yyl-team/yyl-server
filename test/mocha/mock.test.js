const path = require('path')
const CASE_PATH = path.join(__dirname, '../case')
const { Runner } = require('../../index')
const { expect } = require('chai')
const request = require('yyl-request')
const util = require('yyl-util')
describe('mock', () => {
  it('usage', async () => {
    const pjPath = path.join(CASE_PATH, 'mock')
    const configPath = path.join(pjPath, 'config.js')
    const config = require(configPath)
    const log = () => undefined
    const env = { silent: true }

    const runner = new Runner({
      config: config,
      log,
      env,
      cwd: pjPath
    })
    await runner.start()
    const { serverAddress } = runner.config.localserver

    const checkingArr = [
      {
        href: '/db'
      },
      {
        href: '/mockapi',
        check({ data }) {
          expect(data.length).not.to.equal(0)
        }
      },
      {
        href: '/mockapi/1'
      },
      {
        href: '/mockapi?_sort=id',
        check({ data }) {
          expect(data[0].id).to.equal(1)
        }
      },
      {
        href: '/mockapi?_sort=id&_order=desc',
        check({ data }) {
          expect(data[0].id).to.equal(5)
        }
      },
      {
        href: '/mockapi?_start=1',
        check({ data }) {
          expect(data.length).to.equal(4)
        }
      },
      {
        href: '/mockapi?_end=3',
        check({ data }) {
          expect(data.length).to.equal(4)
        }
      },
      {
        href: '/mockapi?_limit=3',
        check({ data }) {
          expect(data.length).to.equal(3)
        }
      },
      {
        href: '/mockapi?_limit=-1',
        check({ data }) {
          expect(data.length).to.equal(0)
        }
      },
      {
        href: '/mockapi?_start=1&_end=3',
        check({ data }) {
          expect(data.length).to.equal(3)
        }
      },
      {
        href: '/mockapi?_start=1&_end=3&_limit=2',
        check({ data }) {
          expect(data.length).to.equal(2)
        }
      },
      {
        href: '/mockapi?id_gte=2',
        check({ data }) {
          expect(data.length).to.equal(4)
        }
      },
      {
        href: '/mockapi?id_lte=2',
        check({ data }) {
          expect(data.length).to.equal(2)
        }
      },
      {
        href: '/mockapi?id_ne=2',
        check({ data }) {
          expect(data.length).to.equal(4)
        }
      },
      {
        href: `/mockapi?title_like=${encodeURIComponent('又')}`,
        check({ data }) {
          expect(data.length).to.equal(1)
        }
      },
      {
        href: '/mockapi?uid=1369446333',
        check({ data }) {
          expect(data.length).to.equal(1)
        }
      },
      {
        href: '/justObject'
      },
      {
        href: '/api',
        check({ data }) {
          expect(data.length).not.to.equal(0)
        }
      },
      {
        href: '/mapi/1'
      },
      {
        href: '/mapi/1?callback=aa',
        jsonp: 'aa',
        check({ data }) {
          expect(data.length).not.to.equal(0)
        }
      },
      {
        href: '/mapi/1?jsonp=bb&bb=aa',
        jsonp: 'aa',
        check({ data }) {
          expect(data.length).not.to.equal(0)
        }
      }
    ]

    await util.forEach(checkingArr, async (item) => {
      const url = `${serverAddress}${item.href}`
      const [, res, data] = await request(url)
      expect(res.statusCode).to.equal(200)
      let iData
      if (item.jsonp) {
        const jsonpMatch = new RegExp(`^${item.jsonp}\\((.+)\\);$`)
        const iMatch = data.match(jsonpMatch)
        expect(iMatch).not.to.equal(null)
        iData = JSON.parse(iMatch[1])
      } else {
        iData = JSON.parse(data)
      }
      expect(typeof iData).to.equal('object')
      if (item.check) {
        item.check({ data: iData })
      }
    })

    await runner.abort()
  })
})
