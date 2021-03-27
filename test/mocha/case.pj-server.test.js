const path = require('path')
const CASE_PATH = path.join(__dirname, '../case')
const { Runner } = require('../../')
const { expect } = require('chai')
const request = require('yyl-request')

const dirname = 'pj-server'

describe(`case ${dirname} test`, () => {
  it('usage', async () => {
    const pjPath = path.join(CASE_PATH, dirname)
    const configPath = path.join(pjPath, 'config.js')
    let config = require(configPath)
    const log = () => undefined
    const env = {}

    const mountArr = []
    const runner = new Runner({
      yylConfig: config,
      log,
      env,
      cwd: pjPath,
      serverOption: {
        appWillMount() {
          console.log('11111')
          mountArr.push('will')
          return Promise.resolve()
        },
        appDidMount() {
          mountArr.push('did')
          return Promise.resolve()
        }
      }
    })

    await runner.start()
    const { homePage } = runner

    if (homePage) {
      const param = {
        url: homePage
      }
      const [, res] = await request(param)
      expect(res.statusCode).to.equal(200)
    }
    expect(mountArr).to.deep.equal(['will', 'did'])
    await runner.abort()
  })
})
