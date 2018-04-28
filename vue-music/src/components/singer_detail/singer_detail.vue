<template>
  <!-- <div class="singer-detail"></div> -->
  <!-- 给组件传递了名字，背景图，歌曲列表 -->
  <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  import {ERR_OK} from '@/api/config'
  import {getSingerDetail} from '@/api/singer'
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed:{
       title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatarUrl
      },
      ...mapGetters([
      'singer'
      ])
    },
    created() {
      this._getSingerDetail()
    },
    methods:{
      _getSingerDetail() {
        if(!this.singer.id){
          this.$router.push({path: '/singer'})
          return
        }
        getSingerDetail(this.singer.id,100).then(res => {
          if(res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          let {musicData} = item
          if(musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index 100
    background:$color-background
</style>
