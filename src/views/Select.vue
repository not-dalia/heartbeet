<template lang="pug">
  .select
    .logo-container
      img.logo-img(src="../assets/beet.svg")

    transition(name="fade")
      .select-container(v-show="loaded0")
        .text I want to
        transition(name="fade")
          router-link.a(to="/heartrate/relax" v-show="loaded1") relax
        transition(name="fade")
          router-link.a(to="/heartrate/listen" v-show="loaded2") listen
        transition(name="fade")
          router-link.a(to="/heartrate/exercise" v-show="loaded3") exercise
        transition(name="fade")
          router-link.a(to="/" v-show="loaded4") understand

    transition(name="fade")
      .footer(v-show="loaded0")
        span.beet-color heart
        span.green-color beet

</template>

<script>
// @ is an alias to /src

export default {
  name: 'Select',
  components: {

  },
  data () {
    return {
      loaded0: false,
      loaded1: false,
      loaded2: false,
      loaded3: false,
      loaded4: false
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.loadElements(0)
    })
  },
  methods: {
    loadElements (element) {
      this[`loaded${element}`] = true
      element++
      if (element <= 4) setTimeout(() => this.loadElements(element), 200)
    }
  }
}
</script>

<style lang="stylus">
  .select
    padding 20px
    display flex
    flex-direction column
    align-items center
    flex 1

  .logo-container
    display flex
    flex-direction row
    justify-content center
    align-items center

  .logo-img
    height: 80px;

  .footer
    font-family 'Dosis', sans-serif
    font-size 1.8rem
    font-weight 500
    letter-spacing 0.06em
    text-align center

  .select-container
    flex 1
    padding 30px 30px
    font-weight 500
    display flex
    flex-direction column
    align-items center
    .text
      color $text_grey
      font-size 3.2rem
      margin: 15px 0
    .a
      color $text_green
      padding: 0 3px;
      font-size 2.7rem
      text-decoration none
      border none
      border-bottom 5px solid $beet_lt
      margin: 15px 0
      width: fit-content
      &.swapped
        color $beet_lt
        border-bottom 5px solid $text_green
      &:hover
        color: white
        background $beet_lt
        .small
          display: inline
      .small
        font-size 1rem
        margin-left: 5px;
        color white
        display none

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
