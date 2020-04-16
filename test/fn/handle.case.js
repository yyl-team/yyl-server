const path = require('path')
const CASE_PATH = path.join(__dirname, '../case')
const { Runner } = require('../../index')
const { expect } = require('chai')
const request = require('yyl-request')

module.exports.handleCase = function (dirname) {
  describe(`case ${dirname} test`, () => {
    it('usage', async () => {
      const pjPath = path.join(CASE_PATH, dirname)
      const configPath = path.join(pjPath, 'config.js')
      let config = require(configPath)
      const log = () => undefined
      const env = {}

      let hasTakeApp = false
      config.localserver.onInitMiddleWare = () => {
        hasTakeApp = true
      }

      const mountArr = []
      const runner = new Runner({
        config,
        log,
        env,
        cwd: pjPath,
        serverOption: {
          appWillMount() {
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
      expect(hasTakeApp).to.equal(true)
      expect(mountArr).to.deep.equal(['will', 'did'])
      await runner.abort()
    })
  })
}
