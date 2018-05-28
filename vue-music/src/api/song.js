import {commonParams, options} from './config'
import axios from 'axios'

export function getLyricApi(url, mid) {
  const params = Object.assign({}, commonParams, {
    callback: 'MusicJsonCallback_lrc',
    pcachetime: Date.now(),
    songmid: mid,
    g_tk: 69806428,
    jsonpCallback: 'MusicJsonCallback_lrc',
    loginUin: 853556568,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {params}).then(res => {
    let ret = res.data
    if (typeof ret === 'string') {
      let reg = /^\w+\(({[^()]+})\)$/
      let mathes = ret.match(reg)
      if (mathes) {
        ret = JSON.parse(mathes[1])
      }
    }
    return Promise.resolve(ret)
  })
}