// import {getSongUrlVkey} from '@/api/singer'
// import {ERR_OK} from '@/api/config'
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}
// 创建工厂函数
export function createSong(musicData) {
  // getSongUrlVkey(musicData.songmid, musicData.songmid).then(res => {
  //   if (res.code === ERR_OK) {}
  // })
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: ''
    // url: `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?vkey=${res.data.items[0].vkey}&guid=4125224356&uin=0&fromtag=66`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}