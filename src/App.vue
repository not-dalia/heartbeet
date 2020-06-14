<template>
  <div id="app">
    <div id="main-container">
      <!-- <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div> -->
      <router-view/>
    </div>
  </div>
</template>

<style lang="stylus">
* {
  box-sizing: border-box;
}

html, body
  height 100%
  box-sizing border-box
body
  background $primary
  margin 0

#app
  font-family 'Cabin', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  min-height 100%
  width 100%
  padding 20px
  display flex
  align-items center
  justify-content center
  flex-direction column

#main-container
  flex 1
  display: flex;
  flex-direction: column;
  max-width 375px
  min-width 300px
  width 100%
  max-height 700px
  border-radius $border-radius
  background white
  box-shadow 0px 3px 6px rgba(0, 0, 0, 0.16)

.beet-color
  color: $text_beet

.green-color
  color: $text_green
</style>
