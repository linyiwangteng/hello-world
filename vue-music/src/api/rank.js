import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'
export function getToplist() {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: '1082258551',
    format: 'jsonp',
    platform: 'h5',
    uin: '853556568',
    needNewCode: '1',
    _: '1524042231363'
  })
  return jsonp(url, data, options)
}

export function getMusicList(topid) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    uin: '853556568',
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid,
    _: 1528939629078
  })
  return jsonp(url, data, options)
}