const path = require('path')
const CASE_PATH = path.join(__dirname, '../case')
const { Server, Proxy } = require('../../index')
const request = require('yyl-request')
const extOs = require('yyl-os')
const util = require('yyl-util')
const { expect } = require('chai')

describe('Proxy test', () => {
  it('usage', async () => {
    const pjPath = path.join(CASE_PATH, 'proxy')
    const configPath = path.join(pjPath, 'config.js')
    const config = require(configPath)
    const log = () => undefined
    const env = { silent: true }

    const server = new Server({
      config: config.localserver,
      log,
      env,
      cwd: pjPath
    })
    await server.start()

    const proxy = new Proxy({
      config: config.proxy,
      log,
      env,
      cwd: pjPath
    })
    await proxy.start()
    const url = proxy.config.homePage
    const [, res] = await request({
      url,
      proxy: `http://${extOs.LOCAL_IP}:${proxy.config.port}`
    })
    expect(res.statusCode).to.equal(200)
    await util.waitFor(1000)
    await server.abort()
    await proxy.abort()
  })
})
