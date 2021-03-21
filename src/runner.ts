import { URL } from 'url'
import extOs from 'yyl-os'
import { Env, YylConfig } from 'yyl-config-types'

import { LANG, Logger } from './const'
import { YServer, YServerSetting } from './server'
import { YProxy, StaticFnOption } from './proxy'

export interface RunnerOption {
  yylConfig?: YylConfig
  env: Env
  logger: Logger
  cwd: string
  serverOption: YServerSetting
  ignoreServer: boolean
}

export class Runner {
  static async clean(op: StaticFnOption) {
    await YProxy.clean(op)
    await YProxy.certClean(op)
  }

  constructor(op: RunnerOption) {
    const { yylConfig, env, logger, cwd, serverOption, ignoreServer } = op
    // TODO:
  }
}
