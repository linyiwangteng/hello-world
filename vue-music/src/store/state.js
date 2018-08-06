import {mode} from 'common/js/config'
import {localSearch} from 'common/js/cache'
const state = {
  singer: {},

  /**
  * 歌曲的信息
  * playing: 是否开始播放
  * fullScreen: 全屏、mini
  **/
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: mode.sequence,
  currentIndex: -1,
  currentSongUrl: '',

  disc: {},
  toplist: {},

  searchHistory: localSearch()
}

export default state