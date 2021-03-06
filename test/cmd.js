const { Runner } = require('../')
const util = require('yyl-util')
const print = require('yyl-print')
const Hander = require('yyl-hander')
const fs = require('fs')
const path = require('path')
const extOs = require('yyl-os')
const cmder = async function () {
  const { env } = util.cmdParse(process.argv, {
    env: {
      silent: Boolean
    }
  })

  const hander = new Hander({
    log: function (type, status, args) {
      if (type === 'msg') {
        let type = 'info'
        if (print.log[status]) {
          type = status
        }
        print.log[type](...args)
      }
    }
  })

  if (!env.path) {
    throw new Error('--path is not set')
  }
  const configPath = path.resolve(process.cwd(), env.path)

  hander.setVars({
    PROJECT_PATH: path.dirname(configPath)
  })

  if (!fs.existsSync(configPath)) {
    throw new Error(`--path is not exists: ${configPath}`)
  }
  delete env.path

  const config = await hander.parseConfig(configPath, env, ['localserver', 'commit', 'proxy'])
  const cwd = path.dirname(configPath)

  const pkgPath = path.join(cwd, 'package.json')

  if (fs.existsSync(pkgPath)) {
    await extOs.runCMD('npm install', cwd)
  }

  const runner = new Runner({
    config,
    env,
    log(type, args) {
      let iType = 'info'
      if (print.log[type]) {
        iType = type
      }
      print.log[iType](...args)
    },
    cwd
  })

  await runner.start()
  if (!env.silent) {
    extOs.openBrowser(runner.homePage)
  }
}

cmder()
  .then(() => {})
  .catch((er) => {
    throw new Error(er)
  })
