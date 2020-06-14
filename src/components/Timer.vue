<template lang="pug">
  .timer
    svg(width="250" height="250")
      path(:d="bgTimerArc" stroke="white" fill="none" stroke-width="15")
      path(:d="fgTimerArc" stroke="#BDD544" fill="none" stroke-width="15")
</template>

<script>

export default {
  name: 'Timer',
  props: ['isStarted'],
  data () {
    return {
      bgTimerArc: '',
      fgTimerArc: '',
      timer: null,
      timerDuration: 25
    }
  },
  watch: {
    isStarted: function (newVal, oldVal) {
      if (newVal !== oldVal) this.start()
    }
  },
  computed: {
  },
  methods: {
    polarToCartesian (centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      }
    },

    describeArc (x, y, radius, startAngle, endAngle) {
      var start = this.polarToCartesian(x, y, radius, endAngle)
      var end = this.polarToCartesian(x, y, radius, startAngle)
      var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
      var d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(' ')
      return d
    },
    updateTimer () {
      this.timerDuration--
      this.fgTimerArc = this.describeArc(125, 125, 115, 225, 225 + 270 / 25 * (25 - this.timerDuration))
      if (this.timerDuration <= 0) {
        clearInterval(this.timer)
        // this.isStarted = false
        this.$emit('state-changed', false)
      }
    },
    start () {
      console.log('start action')
      clearInterval(this.timer)
      if (!this.isStarted) {
        this.fgTimerArc = this.describeArc(125, 125, 115, 225, 135 + 360)
        this.$emit('state-changed', false)
        // this.isStarted = false
      } else {
        this.fgTimerArc = ''
        this.timerDuration = 25
        this.$emit('state-changed', true)
        // this.isStarted = true
        this.timer = setInterval(this.updateTimer, 1000)
      }
    }
  },
  mounted () {
    this.bgTimerArc = this.describeArc(125, 125, 115, 225, 135 + 360)
    this.fgTimerArc = this.describeArc(125, 125, 115, 225, 135 + 360)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="stylus">
.timer
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  margin auto
.timer
  width 250px
  height 250px

</style>
