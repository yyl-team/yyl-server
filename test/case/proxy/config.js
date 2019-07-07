const PROJECT_NAME = '1';
const PLATFORM = 'pc';
const config = {
  homePage: 'http://www.yy.com/web/1/',
  server: {
    port: 5000,
    root: './root'
  },
  proxy: {
    port: 8887,
    localRemote: {
      'http://web.yy.com/': 'http://127.0.0.1:5000/',
      'http://www.yy.com/api/mock': 'http://127.0.0.1:5000/api/mock',
      'http://web.yystatic.com/': 'http://127.0.0.1:5000/'
    }
  }
};
config.proxy.localRemote[`http://www.yy.com/web/${PROJECT_NAME}`] = `http://127.0.0.1:5000/project/${PROJECT_NAME}/${PLATFORM}/html`;

module.exports = config;