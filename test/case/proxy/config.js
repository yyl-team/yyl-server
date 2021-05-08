const PROJECT_NAME = '1'
const PLATFORM = 'pc'
const config = {
  localserver: {
    port: 5000,
    root: './root'
  },
  proxy: {
    port: 8887,
    localRemote: {
      'http://www.testhost.com/': 'http://127.0.0.1:5000/',
      'http://www.testhost.com/api/mock': 'http://127.0.0.1:5000/api/mock',
      'http://web.yystatic.com/': 'http://127.0.0.1:5000/'
    },
    homePage: 'http://www.testhost.com/web/1/'
  },
  commit: {
    hostname: '//www.testhost.com',
    staticHost: '//www.testhost.com',
    mainHost: '//www.testhost.com/web'
  }
}
config.proxy.localRemote[
  `http://www.testhost.com/web/${PROJECT_NAME}`
] = `http://127.0.0.1:5000/project/${PROJECT_NAME}/${PLATFORM}/html`

module.exports = config
