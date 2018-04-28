<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" class="item">
        <!-- <div class="rank" v-show="rank">
          <span :class="getRankCls(index)"  v-text="getRankText(index)"></span>
        </div> -->
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>  
  </div>  
</template>
<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type:Boolean,
        default: false
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer}.${song.album}`
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-heihgt: 20px
        overflow hidden
        .name
          no-wrap()
          color:$color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
