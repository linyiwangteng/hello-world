<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal" @enter = 'enter' @after-enter = 'afterEnter' @leave = 'leave' @after-leave = 'afterLeave'>
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
            <div class="back" @click="back">
              <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" 
             @touchstart.prevent="middleStart"
             @touchmove.prevent="middleMove"
             @touchend="middleEnd"
        >
          <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="cdCls">
                  <img :src="currentSong.image" alt="" class="image">
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="player-lyric">{{playLyric}}</div>
              </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{current: currentLineNum === index}" v-for="(line,index) in currentLyric.lines">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow=='cd'}"></span>
            <span class="dot" :class="{'active': currentShow=='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent ='percent' @percentChange='progressBarChange'></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="selectMode">
              <i :class="iconMode"></i>
              <!-- <i class="icon-sequence"></i> -->
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <!-- 播放按钮 -->
            <div class="icon i-center" :class="disableCls">
              <i :class="IconPlay" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition>
      <div class="mini-player" v-show="!fullScreen" @click="open">
          <div class="icon">
            <img :class="cdCls" width="40" height="40" :src="currentSong.image">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
          </div>
          <div class="control">
            <!-- <progress-circle :radius="radius" :percent="percent">
              <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
            </progress-circle> -->
            <i @click.stop="togglePlaying" :class="IconMini"></i>
          </div>
          <!-- <div class="control" @click.stop="showPlaylist"> -->
          <div class="control">
            <i class="icon-playlist"></i>
          </div>      
      </div>
    </transition>
    <!-- <playlist ref="playlist"></playlist> -->
    <!-- <audio ref="audio" :src="songUrl" @play="ready" @error="error" @timeupdate="updateTime"
           @ended="end"></audio> -->
    <audio ref="audio" :src="songUrl" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script>
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import {mode as playmode} from 'common/js/config'
  import {shuffle} from 'common/js/utils.js'
  import {ERR_OK} from '@/api/config'
  import {getSongUrlVkey} from '@/api/singer'
  import {mapGetters,mapMutations} from 'vuex'

  import ProgressBar from 'base/progress-bar/progress-bar'

  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  
  export default {
    computed: {
      disableCls() {
        return this.songReady ? '' :'disable'
      },
      cdCls() {
        return this.playing ? 'play' :'pause'
      },
      iconMode() {
        return  this.mode === playmode.sequence ? 'icon-sequence' : this.mode === playmode.loop ? 'icon-loop': 'icon-random'
      },
      IconPlay() {
        return !this.playing ? 'icon-play': 'icon-pause'
      },
      IconMini() {
        return !this.playing ?'icon-play-mini' : 'icon-pause-mini'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'currentSong',
        'fullScreen',
        'playlist',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    data() {
      return {
        songUrl: '',
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playLyric:''  //当前播放的歌词
      }
    },
    created(){
      this.touches = {}
    },
    methods: {
      middleStart(e) {
        this.touches.initial = true;
        let touches = e.touches[0];
        this.touches.startX = touches.pageX;
        this.touches.startY = touches.pageY;
      },
      middleMove(e) {
        if(!this.touches.initial){
          return;
        }
        let touches = e.touches[0];
        let daltaX = touches.pageX - this.touches.startX;
        let daltaY = touches.pageY - this.touches.startY;
        if(Math.abs(daltaX)<Math.abs(daltaY)){
          return;
        }
        let left = this.currentShow === 'cd'? 0 : -window.innerWidth;
        let offsetWidth = Math.min(0,Math.max(-window.innerWidth, left+daltaX));
        this.touches.percent = Math.abs(offsetWidth/window.innerWidth);
        let opacity = 1 - this.touches.percent;
        this.$refs.lyricList.$el.style[transform] =  `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style[transitionDuration] = '300ms';
      },
      middleEnd() {
        let offsetWidth,opacity;
        if(this.currentShow === 'cd') {
          if(this.touches.percent > 0.1){
            offsetWidth = - window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          }else{
            offsetWidth = 0
            opacity = 1
          }
        }else{
          if(this.touches.percent < 0.9){
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          }else{
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = '300ms';

         this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style[transitionDuration] = 0;
      },
      // 获取歌词
      getLyric() {

        this.currentSong.getLyric().then( lyric => {
          this.currentLyric = new Lyric(lyric,this.handleLyric)
          // 获取歌词
          if(this.playing) {
            this.currentLyric.play();
          }
          // 获取的歌词
          // console.log(this.currentLyric)
        }).catch(()=>{
          console.log('nononnoononnonono')
          this.currentLyric = null
          this.playLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum,txt}){
        this.$refs.lyricList
        if(lineNum > 5){
          let lineEl = this.$refs.lyricLine[lineNum-5];
          this.$refs.lyricList.scrollToElement(lineEl,1000);
        }else{
          this.$refs.lyricList.scrollToElement(0,1000)
        }
        this.currentLineNum = lineNum
        this.playLyric = txt
      },
      // 选择模式
      selectMode() {
        const mode = (this.mode+1)%3
        this.setMode(mode)
        let list = null
        if(mode == playmode.random){
          list = shuffle(this.sequenceList)
          //  console.log(list)
        }else{
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlaylist(list)
      },
      // 打乱歌曲后需要重新获取当前歌曲再新数组的索引
      resetCurrentIndex(list){
        let index = list.findIndex( item => {
          return item.id == this.currentSong.id
        })
        return this.setCurrentIndex(index)
      },
      progressBarChange(val){
        let currentTime = this.currentSong.duration *val;
        this.$refs.audio.currentTime = currentTime
        if(!this.playing){this.togglePlaying()}
        if(this.currentLyric){
          this.currentLyric.seek(currentTime*1000)
        }
      },
      enter(el, done) {
        const {x,y,scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: 'translate3d(0,0,0,) scale(1)'
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(ele,done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x,y,scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done) //动画接收后调用done方法
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      togglePlaying() {
        if(!this.songReady){ return}
        this.setPlayState(!this.playing)
        if(this.currentLyric){
          this.currentLyric.togglePlay();
        }
      },
      next() {
        if(!this.songReady){ return}
        if(this.playlist.length == 1){
          this.loop()
        }else{
          let index = this.currentIndex + 1
          console.log(index);
          if(index >= this.playlist.length){
            index = 0
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      prev() {
        if(!this.songReady){ return}
        if(this.playlist.length == 1){
          this.loop()
        }else{
          let index = this.currentIndex - 1
          if(index < 0){
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      end(){
        // 如果播放模式为loop则循环播放，否则顺序播放
        if(this.mode == playmode.loop){
          this.loop()
        }else{
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if(this.currentLyric){
          this.currentTime.seek(0);
        }
      },
      ready() {
        this.songReady = true
      },
      error() {
        this.songReady = true
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      format(interval) {
        interval = interval | 0
        const minute = this._dob(interval / 60 | 0)
        const second = this._dob(interval % 60 | 0)
        return `${minute}:${second}`
      },
      _dob(num, n = 2) {
        let len = num.toString().length
        while(len < n){
          num  = '0' + num
          len++
        }
        return num
      },
      // mini转盘调到大转盘
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth/2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

        return {
          x,
          y,
          scale
        }
      },
      _getSongUrl() {
        getSongUrlVkey(this.currentSong.mid).then(res=>{
          this.songUrl = encodeURI(res) //设置歌曲的地址
          this.setSongUrl(this.songUrl)
        })
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setSongUrl: 'SET_CURRENT_SONG_URL',
        setPlayState: 'SET_PLAY_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setMode: 'SET_PLAY_MODE',
        setPlaylist: 'SET_PLAYLIST'
      })
    },
    watch:{
      currentSong(newSong, oldSong){
        if(newSong.id == oldSong.id){return}
        if(this.currentLyric){this.currentLyric.stop()}
        this._getSongUrl()
      },
      songUrl() {
        // this.$nextTick( () => {
        //   this.$refs.audio.play()
        //   // this.currentSong.getLyric()
        //   this.getLyric()
        // })
        setTimeout(()=>{
          this.$refs.audio.play()
          this.getLyric()
        },1000)
      },
      playing(newPlaying) {
        const audio_el = this.$refs.audio
        if(!this.songReady) {return}
        this.$nextTick( () => {
          newPlaying ? audio_el.play() : audio_el.pause()
        })
      }
    },
    components:{
      ProgressBar,
      Scroll
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .player-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 34px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 34px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>