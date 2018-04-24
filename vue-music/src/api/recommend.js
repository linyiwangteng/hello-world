import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: '853556568&',
    needNewCode: '1',
    _: '1524042231363'
  })
  return jsonp(url, data, options)
}
// https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
export function getList(url) {
  const params = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    jsonpCallback: 'getPlaylist',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })
  return axios.get(url, {
    params
  }).then(res => {
    return Promise.resolve(res.data)
  })
}