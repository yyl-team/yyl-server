import fs from 'fs'
import { URL } from 'url'
import { IncomingMessage, OutgoingMessage } from 'http'
import util from 'yyl-util'

export interface MockOption {
  dbPath: string
  routesPath: string
}

export function mock(op: MockOption) {
  const DB_PATH = op.dbPath
  const ROUTES_PATH = op.routesPath

  let db: any = null
  let routes: any = null

  if (fs.existsSync(DB_PATH)) {
    db = util.requireJs(DB_PATH)
  }

  if (fs.existsSync(ROUTES_PATH)) {
    routes = util.requireJs(ROUTES_PATH)
  }

  const REG = {
    KEY: /:([^/&?]+)/g,
    ANY: /\*+$/,
    OPERATOR: /^(.+)_(gte|lte|ne|like)$/
  }

  // url db 匹配
  const db2data = function (remoteUrl: string) {
    if (!db) {
      return
    }
    // 路径匹配
    if (remoteUrl === '/db') {
      return JSON.stringify(db)
    }

    if (remoteUrl === '/') {
      return
    }

    const urlObj = new URL(remoteUrl)

    const { pathname } = urlObj
    const paths = pathname.split(/[\\/]+/)

    if (paths[paths.length - 1] === '') {
      return null
    }

    if (paths[0] === '') {
      paths.splice(0, 1)
    }

    // url to data
    let rData = util.extend(true, {}, db)
    paths.some((key, index) => {
      if (index === paths.length - 1) {
        if (util.type(rData) === 'array') {
          let isMatch: any = null
          rData.some((item: any) => {
            if (typeof item === 'object' && `${item.id}` === `${key}`) {
              isMatch = item
              return true
            }
          })
          rData = isMatch
        } else {
          rData = rData[key]
        }
      } else {
        rData = rData[key]
      }

      if (!rData) {
        return true
      }
    })

    let sParam: any
    if (urlObj.search) {
      const searchStr = urlObj.search.replace(/^\?/, '')
      if (searchStr) {
        sParam = {}
        searchStr.split(/[&]+/).forEach((ctx) => {
          const ctxObj = ctx.split('=')
          sParam[ctxObj[0]] = ctxObj[1]
        })
      }
    }

    // jsonp
    let jsonp = null
    if (sParam && sParam.callback) {
      jsonp = sParam.callback
      delete sParam.callback
    }

    if (sParam && sParam.jsonp) {
      jsonp = sParam[sParam.jsonp]
      delete sParam.jsonp
      delete sParam[sParam.jsonp]
    }

    if (rData && sParam && Object.keys(sParam).length) {
      // filter
      if (util.type(rData) !== 'array') {
        rData = {}
      } else {
        // sort: _sort, _order
        if (sParam._sort) {
          const sortKeys: any = sParam._sort.split(/\s*,\s*/)
          let order = 'desc'
          if (sParam._order !== 'desc') {
            order = 'asc'
          }

          rData.sort((item1: any, item2: any) => {
            let str1 = ''
            let str2 = ''
            sortKeys.some((key: any) => {
              if (item1[key]) {
                str1 += item1[key]
              }

              if (item2[key]) {
                str2 += item2[key]
              }
            })

            if (order !== 'asc') {
              return str2.localeCompare(str1)
            } else {
              return str1.localeCompare(str2)
            }
          })

          delete sParam._sort
          delete sParam._order
        }

        // slice: _start, _end, _limit
        if (sParam._start) {
          const iStart: any = +sParam._start
          if (isNaN(iStart) || iStart < 0) {
            rData = []
          } else {
            rData.splice(0, iStart)
          }
          if (sParam._end) {
            sParam._end = sParam._end - sParam._start
          }
          delete sParam._start
        }

        if (sParam._end) {
          const iEnd: any = +sParam._end + 1
          if (isNaN(iEnd) || iEnd < 0) {
            rData = []
          } else {
            rData.splice(iEnd)
          }
          delete sParam._end
        }

        if (sParam._limit) {
          const iLimit: any = +sParam._limit
          if (isNaN(iLimit) || iLimit < 0) {
            rData = []
          } else {
            if (rData.length > iLimit) {
              rData.splice(iLimit)
            }
          }

          delete sParam._limit
        }

        // 暂时不做 获取子资源
        if (sParam._embed) {
          delete sParam._embed
        }

        // 暂时不做 获取父资源
        if (sParam._expand) {
          delete sParam._expand
        }

        Object.keys(sParam).forEach((key) => {
          if (key === 'callback' || key === 'jsonp') {
            // jsonp 用参数 忽略
            return
          }

          // operator
          const iMatchs: any = key.match(REG.OPERATOR)
          if (iMatchs) {
            const oKey: any = iMatchs[1]
            const oCtrl: any = iMatchs[2]
            const iVal: any = decodeURIComponent(sParam[key])
            const nVal: any = +iVal
            let filterHandle
            switch (oCtrl) {
              case 'gte':
                if (isNaN(nVal)) {
                  rData = []
                } else {
                  filterHandle = (item: any) => {
                    if (item[oKey] >= nVal) {
                      return true
                    }
                    return false
                  }
                }
                break

              case 'lte':
                if (isNaN(nVal)) {
                  rData = []
                } else {
                  filterHandle = (item: any) => {
                    if (item[oKey] <= nVal) {
                      return true
                    }
                    return false
                  }
                }
                break

              case 'ne':
                filterHandle = (item: any) => {
                  if (item[oKey] !== iVal) {
                    return true
                  }
                  return false
                }
                break

              case 'like':
                filterHandle = (item: any) => {
                  if (`${item[oKey]}`.match(new RegExp(iVal))) {
                    return true
                  }
                  return false
                }
                break
            }

            if (rData.length && filterHandle) {
              rData = rData.filter(filterHandle)
            }
          } else {
            rData = rData.filter((item: any) => {
              if (item[key] === sParam[key]) {
                return true
              }
              return false
            })
          }
        })
      }
    }

    // jsonp
    if (jsonp && rData) {
      return `${jsonp}(${JSON.stringify(rData)});`
      // normal
    } else if (rData) {
      return JSON.stringify(rData)
    } else {
      return null
    }
  }

  // url 路由匹配
  const routes2db = function (remoteUrl: string) {
    let tUrl = remoteUrl
    if (routes) {
      Object.keys(routes).some((key) => {
        if (typeof routes[key] !== 'string') {
          return
        }

        const dataKeys: any = []
        const data: any = {}
        const urlRegStr = key
          .replace(REG.KEY, (str, $1) => {
            dataKeys.push($1)
            return '([^/&?]+)'
          })
          .replace(REG.ANY, (str) => {
            dataKeys.push(str)
            return '(.*)'
          })

        const urlReg = new RegExp(`^${urlRegStr}$`, '')
        const resultMatch = tUrl.match(urlReg)
        if (resultMatch && resultMatch.length) {
          resultMatch.shift()
          resultMatch.some((val, i) => {
            data[dataKeys[i]] = val
          })
          tUrl = routes[key].replace(REG.KEY, (str: string, key: string) => {
            if (data[key]) {
              return data[key]
            } else {
              return str
            }
          })

          if ('*' in data) {
            tUrl = tUrl.replace(/\$1/g, () => {
              return data['*']
            })
          }

          return true
        }
      })
    }
    return tUrl
  }

  const url2Data = function (remoteUrl: string) {
    return db2data(routes2db(remoteUrl))
  }

  const mocku = function (req: IncomingMessage, res: OutgoingMessage, next: () => void) {
    const r = url2Data(`${req.url}`)
    if (r) {
      res.setHeader('Content-Type', 'application/json;charset=UTF-8')
      res.write(r)
      res.end()
    } else {
      next()
    }
  }

  return mocku
}
