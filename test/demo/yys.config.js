const PROJECT_NAME = '1';
const PLATFORM = 'pc';
const config = {
  localserver: {
    root: './dist',
    port: 5000
  },
  proxy: {
    port: 8887,
    localRemote: {
      'http://web.yy.com/': 'http://127.0.0.1:5000/'
    },
    homePage: `http://www.yy.com/web/${PROJECT_NAME}/`
  }
};

config.proxy.localRemote[
  `http://www.yy.com/web/${PROJECT_NAME}`
] = `http://127.0.0.1:5000/project/${PROJECT_NAME}/${PLATFORM}/html`;

module.exports = config;
