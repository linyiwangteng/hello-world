import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import {ERR_OK} from '@/api/config'
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 853556568,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

export function getSingerDetail(id, num) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: id,
    order: 'listen',
    begin: 0,
    num: num,
    songstatus: 1
  })
  return jsonp(url, data, options)
}

export function getSongUrlVkey(songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 715661088,
    jsonpCallback: 'MusicJsonCallback9124799390864222',
    loginUin: 853556568,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 853556568,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: 4125224356
  })
  return jsonp(url, data, {params: 'callback'}).then(res => {
    if (res.code === ERR_OK) {
      const detail = res.data.items[0]
      const url = `http://dl.stream.qqmusic.qq.com/${detail.filename}?vkey=${detail.vkey}&guid=4125224356&uin=853556568&fromtag=66`

      return url
    }
  })
}
