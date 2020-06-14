<template lang="pug">
  .loader
    .preloader
      .preloader-dots
        .dot-container(v-for="i in 4" :key="i")
          .dot
            img(src='../assets/note-green.svg' style="width: 22px;")
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.loader
  padding 3rem 1rem 2rem 1rem

.preloader-dots
  display flex
  flex-direction row
  align-items center
  justify-content center
  margin 0 auto
  .dot
    display inline-block

.dot-container
  animation moveit 1.8s infinite
  display inline-block
  margin 0 3px
  &:nth-child(2)
    -webkit-animation-delay .2s
    animation-delay .2s
  &:nth-child(3)
    -webkit-animation-delay .4s
    animation-delay .4s
  &:nth-child(4)
    -webkit-animation-delay .6s
    animation-delay .6s
  &:nth-child(5)
    -webkit-animation-delay .8s
    animation-delay .8s
@keyframes moveit
  0%
    -webkit-transform translateY(0px)
    transform translateY(0px)

  35%
    -webkit-transform translateY(0px)
    transform translateY(0px)
    opacity 0.3

  50%
    -webkit-transform translateY(-20px)
    transform translateY(-20px)
    opacity 0.8

  70%
    -webkit-transform translateY(3px)
    transform translateY(3px)
    opacity 0.8

  85%
    -webkit-transform translateY(-3px)
    transform translateY(-3px)
</style>
