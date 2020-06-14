<template lang="pug">
  .home
    Splash(:loaded="doneLoading" v-if="!doneTransitioning")
    //- Select(v-if="doneTransitioning")
</template>

<script>
// @ is an alias to /src
import Splash from '@/components/Splash.vue'
// import Select from '@/components/Select.vue'

export default {
  name: 'Home',
  components: {
    Splash
  },
  data () {
    return {
      timeout: null,
      isLoading: true,
      doneTransitioning: false
    }
  },
  computed: {
    doneLoading () {
      return !this.isLoading
    }
  },
  methods: {
    loaded () {
      this.isLoading = false
      setTimeout(() => {
        this.doneTransitioning = true
        this.$router.push('select')
      }, 695)
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.timeout = setTimeout(this.loaded, 3000)
    })
    const image = new Image()
    image.src = '../assets/hollowbeat.svg'
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
  }
}
</script>

<style lang="stylus">
.home
  flex 1
  display flex
  flex-direction column

</style>
