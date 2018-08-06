<template>
  <scroll class="suggest" ref="suggest" :data="result" :pullUp="pullUp" @scrollToEnd="searchMore" :pullDown="pullDown" @scrollToTop="searchFresh" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <!-- <loading v-show="hasFresh" title="刷新"></loading> -->
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper">
        <no-result v-show="!hasMore && !result.length" title='抱歉,暂无搜索结果'></no-result>
      </div>
  </scroll>
</template>
<script>
  import  {search} from '@/api/search'
  import {ERR_OK} from '@/api/config'
  import {createSong} from '@/common/js/song'
  import Scroll from '@/base/scroll/scroll'
  import Loading from '@/base/loading/loading'
  import Singer from '@/common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from '@/base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const perpage = 20
  export default {
    props: {
      query: {
       type: String,
       default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result:[],
        pullUp: true,
        hasMore: true,
        pullDown: true, //无用
        hasFresh: false, //无用
        beforeScroll: true
      }
    },
    watch: {
      query() {
        this.search()
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      listScroll() {
        this.$emit('listScroll')
      },
      search() {
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0,0)
        search(this.query, this.page, this.showSinger, perpage).then(res=>{
          if(res.code === ERR_OK){
            this.result = this._getResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if(!this.hasMore) return
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then(res=>{
          if(res.code === ERR_OK){
            this.result = this.result.concat(this._getResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      searchFresh(){
        this.hasFresh = true
        setTimeout(()=>{
          this.hasFresh = false
        },2000);
        console.log('this is  pull down')
      },
      getDisplayName(item) {
        if (item.typeval === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      getIconCls(item) {
        if (item.typeval === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      selectItem(item) {
        if(item.typeval == TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.setSinger(singer)
          this.$router.push({
            path: `/search/${singer.id}`
          })
        }else{
          this.insertSong(item)
        }
        this.$emit('select')
      },
      _checkMore(data) {
        const song = data.song
        if(!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      _getResult(data) {
        let ret = []
        if(data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{typeval: TYPE_SINGER}})
        }
        if(data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(musicdata => {
          if(musicdata.songid && musicdata.albummid) {
            ret.push(createSong(musicdata))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions({
        insertSong:'insertSong'
      })
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
      height: 100%
      overflow: hidden
      .suggest-list
        padding: 0 30px
        .suggest-item
          display: flex
          align-items: center
          padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          [class^="icon-"]
            font-size: 14px
            color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
      .no-result-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
