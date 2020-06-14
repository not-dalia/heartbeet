<template lang="pug">
  .splash(ref="splashcontainer")
    .logo-container
      transition(name="move")
        img.logo-img(src="../assets/beet.svg" v-if="!hideLogo" ref="logoimg" :style="{top: `${top}px`}")
      transition(name="fade")
        .logo(v-if="!loaded")
          span.beet-color heart
          span.green-color beet
      transition(name="fade")
        .slogan(v-if="!loaded")
          span listen with your heart

    transition(name="fade")
      .loader(v-if="!loaded")
        Loader
</template>

<script>
import Loader from '@/components/Loader.vue'

export default {
  name: 'Splash',
  components: {
    Loader
  },
  data () {
    return {
      top: '200px',
      hideLogo: false
    }
  },
  watch: {
    loaded: function (newVal, oldVal) {
      this.startTransition()
    }
  },
  props: ['loaded'],
  methods: {
    startTransition () {
      this.top = this.$refs.logoimg.getBoundingClientRect().top - this.$refs.splashcontainer.getBoundingClientRect().top
      // this.$nextTick(() => {
      //   this.hideLogo = this.loaded
      // })
      setTimeout(() => {
        this.hideLogo = this.loaded
      }, 200)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.splash
  padding 20px
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  flex 1
  padding-top 4rem
  position relative

.logo-container
  flex 1
  display flex
  flex-direction column
  justify-content center
  align-items center

.logo-img
  height: 250px;

.logo
  font-family 'Dosis', sans-serif
  font-size 3.2rem
  font-weight 500
  letter-spacing 0.06em
  text-align center

.slogan
  font-size 1.25rem
  color $text_lt_grey

.move-enter-active, .move-leave-active {
  transition: all .5s cubic-bezier(0.37, 0, 0.63, 1);
  position: absolute;
}
.move-enter, .move-leave-to /* .fade-leave-active below version 2.1.8 */ {
  top: 20px !important;
  height 80px
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
