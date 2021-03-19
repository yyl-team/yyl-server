import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import util from 'yyl-util'
import extOs from 'yyl-os'
import { URL } from 'url'
import AnyProxy from 'anyproxy'
import request from 'request'

import { LANG, PROXY_CACHE_PATH, PROXY_CRET_PATH } from './const'

const hideProtocol = function (str: string) {
  if (typeof str === 'string') {
    return str.replace(/^http[s]?:/, '')
  } else {
    return str
  }
}

export interface LocalRemote {
  [remoteUrl: string]: string
}

export interface YProxyOption {
  port?: number
  webPort?: number
  localRemote?: LocalRemote
  https?: boolean
  homePage?: string
  ignores?: string[]
}

export type YProxyProperty = Required<YProxyOption>

// export class YProxy {
// }
