<template lang="pug">
  .overlay
    .modal
      .instructions
        p Cover the camera with your index finger then press the
          span(style="font-weight: bold")  (▶)
          |  button.
        p Stay still for the next 25 seconds while your heart rate is being measured. Make sure your finger is not pressed too hard.
        p For the best results keep the flashlight on or place a light source behind your finger.
        p.beet-color This app is experimental and is meant for fun. The results won't be very accurate and are not to be used for any medical purposes.
      .proceed
        a(@click="proceedCallback") Proceed

</template>

<script>

export default {
  name: 'Instructions',
  components: {
  },
  props: ['proceedCallback'],
  data () {
    return {

    }
  },
  computed: {
  },
  methods: {
    proceed () {
      this.isDisclaimerRead = true
    }
  }
}
</script>

<style scoped lang="stylus">
.overlay
  background rgba(0, 0, 0, 0.7)
  position fixed
  top 0
  right 0
  left 0
  bottom 0
  z-index 100
  display flex
  justify-content center
  align-items center

  .modal
    background white
    border-radius 30px
    box-shadow 0px 3px 6px rgba(0, 0, 0, 0.16)
    height 460px
    width 85%
    max-width 320px
    padding: 10px
    display: flex
    flex-direction column

    .instructions
      color $text_grey
      padding 0 20px
      font-size 1rem
      line-height 1.6rem
      height 400px
      overflow-y auto
      text-align left
      p
        margin: 15px 0

    .proceed a
      display block
      margin-top 15px
      border-radius 30px
      padding 12px 32px
      background $green_dk
      box-shadow 0px 3px 6px rgba(0, 0, 0, 0.16)
      border none
      color white
      font-weight bold
      font-size 1rem
      cursor pointer
      &:hover
        background $beet
</style>
