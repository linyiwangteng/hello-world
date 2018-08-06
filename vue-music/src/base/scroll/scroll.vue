<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    props: {
      probeType: {
        type:Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullUp: {
        type: Boolean,
        default: false
      },
      pullDown: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout( () => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if(!this.$refs.wrapper){
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if(this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
              me.$emit('scroll', pos)
          })
        }
        // 上拉加载
        if(this.pullUp){
          this.scroll.on('scrollEnd', ()=>{
  
            if(this.scroll.y<=(this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        // 下拉刷新
        if(this.pullDown){
          this.scroll.on('scrollEnd', ()=>{
               console.log(this.scroll.y)
            if(this.scroll.y>=0){
              this.$emit('scrollToTop')
            }
          })
        }

        if(this.beforeScroll) {
          this.scroll.on('beforeScrollStart',()=>{
            this.$emit('beforeScroll')
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },

    watch: {
      data(i) {
        setTimeout( () => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
