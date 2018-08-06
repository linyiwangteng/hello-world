<template>
    <div class="search">
        <div class="search-box-wrapper">
          <search-box ref="searchbox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcurWrapper">
          <scroll :data="shortcut" class="shortcut" ref="shortcut">
            <div >
              <div class="hot-key">
                <h1 class="title">热门搜索</h1>
                <ul>
                  <li class="item" v-for="(item, index) in hotKey" @click="addQuery(item.k)">{{item.k}}</li>
                </ul>
              </div>
              <div class="search-history" v-show="searchHistory.length">
                <h1 class="title">
                  <span class="text">搜索历史</span>
                  <span class="clear" @click="showConfirm">
                    <i class="icon-clear"></i>
                  </span>
                </h1>
                <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne" ref="searchResult"></search-list>
              </div>
            </div>
          </scroll>
          
        </div>
        <div class="search-result" v-show="query" ref="searchResultWrapper">
          <suggest :query="query" @listScroll="listScroll" @select="saveSearch" ref="searchResult"></suggest>
        </div>
        <confirm ref="confirm" text="是否清空所有记录" @confirm="clearSearchHistory"></confirm>
        <router-view></router-view>
    </div>
</template>

<script>
  import SearchBox from '@/base/search-box/search-box'
  import {getHotKey} from '@/api/search'
  import {ERR_OK} from '@/api/config'
  import Suggest from '@/base/suggest/suggest'
  import {mapActions, mapGetters} from 'vuex'
  import SearchList from '@/base/search-list/search-list'
  import Confirm from '@/base/confirm/confirm'
  import Scroll from '@/base/scroll/scroll'
  import {playlistMixin} from '@/common/js/mixin'
  export default {
    mixins: [playlistMixin],
    created() {
      this._getHotKey()
    },
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length>0? '60px': ''
        this.$refs.shortcurWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()

        this.$refs.searchResultWrapper.style.bottom=bottom
        this.$refs.searchResult.refresh()
      },
      // 列表滚动失去聚焦
      listScroll() {
        this.$refs.searchbox.blur()
      },
      onQueryChange(query) {
        this.query = query
      },
      addQuery(item) {
        this.$refs.searchbox.setQuery(item)
      },
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      deleteOne(item) {
        this.deleteSearchHistory(item)
      },
      deleteAll() {
        this.clearSearchHistory()
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      _getHotKey(){
        getHotKey().then(res=>{
          if(res.code === ERR_OK){
            this.hotKey = res.data.hotkey.slice(0,10)
          }
        })
      },
      ...mapActions({
        'saveSearchHistory': 'saveSearchHistory',
        'deleteSearchHistory': 'deleteSearchHistory',
        'clearSearchHistory': 'clearSearchHistory'
      })
    },
    computed:{
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    watch:{
      query(newQuery) {
        if(!newQuery){
          setTimeout( ()=>{
            this.$refs.shortcut.refresh()
          },20)
        }
      }
    },
    components:{
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .search
        .search-box-wrapper
            margin: 20px
        .shortcut-wrapper
          position: fixed
          top: 178px
          bottom: 0
          width: 100%
          .shortcut
            height: 100%
            overflow: hidden
            .hot-key
              margin: 0 20px 20px 20px
              .title
                margin-bottom: 20px
                font-size: $font-size-medium
                color: $color-text-l
              .item
                display: inline-block
                padding: 5px 10px
                margin: 0 20px 10px 0
                border-radius: 6px
                background: $color-highlight-background
                font-size: $font-size-medium
                color: $color-text-d
            .search-history
              position: relative
              margin: 0 20px
              .title
                display: flex
                align-items: center
                height: 40px
                font-size: $font-size-medium
                color: $color-text-l
                .text
                  flex: 1
                .clear
                  extend-click()
                  .icon-clear
                    font-size: $font-size-medium
                    color: $color-text-d
        .search-result
          position: fixed
          width: 100%
          top: 178px
          bottom: 0
</style>