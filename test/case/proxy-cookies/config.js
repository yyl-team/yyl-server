module.exports = {
  localserver: {
    entry: './app.js'
  },
  proxy: {
    localRemote: {
      'http://yylive-ssr.yy.com/': 'http://127.0.0.1:5000/'
    },
    homePage: 'http://yylive-ssr.yy.com/'
  }
}
