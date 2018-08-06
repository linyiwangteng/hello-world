<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="true"></music-list>
  </transition>
</template>
<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from '@/api/rank'
  import {ERR_OK} from '@/api/config'
  import {createSong} from 'common/js/song.js'
  export default {
    data() {
      return{
        songs: []
      }
    },
    computed: {
      title() {
        return this.toplist.topTitle
      },
      bgImage() {
        if(this.songs.length) {
          return this.songs[0].image
        }
      },
      ...mapGetters(['toplist'])
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if(!this.toplist.id){
          this.$router.push('/ranking')
        }
        getMusicList(this.toplist.id).then( res => {
          console.log(res)
          if(ERR_OK == res.code){
            this.songs = this.normalizeSongs(res.songlist)
          }
        })
      },
      normalizeSongs(list){
        let ret = []
        console.log(list)
        list.forEach(music => {
          if(music.data.albumid && music.data.albummid) {
            ret.push(createSong(music.data))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>
<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active{
    transition : all 0.3s
  }
  .slide-enter,.slide-leave-to{
    transform : translate3d(100%,0,0)
  }
</style>