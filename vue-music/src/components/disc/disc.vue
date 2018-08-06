<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getDisc} from '@/api/recommend.js'
  import {createSong} from 'common/js/song.js'
  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        "disc"
      ])
    },
    created() {
      this._getDisc()
    },
    methods:{
      _getDisc() {
        if(!this.disc.dissid){
          this.$router.push('/recommend')
          return
        }
        getDisc('/disc', this.disc.dissid).then(res => {
          console.log(res.cdlist[0].songlist)
          this.songs = this.normalizeSong(res.cdlist[0].songlist)
        })
      },
      normalizeSong(list) {
        let ret =[]
        list.forEach(musicItem=>{
          if(musicItem.songid && musicItem.albummid){
            ret.push(createSong(musicItem))
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
