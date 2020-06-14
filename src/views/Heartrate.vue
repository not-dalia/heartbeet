<template lang="pug">
  .heartrate
    transition(name="fade")
      .camera-container(v-show="loaded0")
        .close-button
          a(@click="close") ×
        Timer(:is-started="isStarted" v-on:state-changed="timerStateChanged")
        .camera
          video(id="v" width="100" height="100" style="display:none" ref="video" muted)
          canvas(id="c" width="100" height="100" ref="canvas")
        img.camera-overlay(src="../assets/hollowbeat.svg")
        .pulse-container
          .pulse {{ pulse }}
            span.unit BPM
    transition(name="fade")
      .instructions-container
        .instructions Stay still and breath normally
        .chart
          LineChart(:chart-data="chartData" :options="chartOptions" :height="170" ref='chart')
    transition(name="fade")
      .bottom-container(v-show="loaded0")
        .instructions-container
          .flashlight(v-if="torchAvailable")
            .title Keep the flashlight
            Toggle(v-model="isFlashOn")
          .start-button
            a(@click="start" :class="{started: isStarted}" v-if="cameraReady")
              img(src="@/assets/play.svg" v-if="!isStarted")
              img(src="@/assets/stop.svg" v-if="isStarted")
    transition(name="fade")
      Instructions(v-if="!isDisclaimerRead" v-show="loaded1" :proceed-callback="proceed")

</template>

<script>
import Toggle from '@/components/ToggleButton.vue'
import Instructions from '@/components/Instructions.vue'
import Timer from '@/components/Timer.vue'
import LineChart from '@/components/LineChart.js'
import PulseAnalyzer from '@/utils/pulseAnalyzer.js'

export default {
  name: 'Heartrate',
  components: {
    Toggle, Instructions, Timer, LineChart
  },
  watch: {
    isFlashOn: function (newVal, oldVal) {
      PulseAnalyzer.toggleTorch(newVal)
    }
  },
  data () {
    return {
      loaded0: false,
      loaded1: false,
      chartData: {},
      chartOptions: {},
      isStarted: false,
      isFlashOn: true,
      isDisclaimerRead: false,
      pulse: '--',
      torchAvailable: false,
      cameraReady: false
    }
  },
  computed: {
  },
  methods: {
    start () {
      this.isStarted = !this.isStarted
      if (this.isStarted) {
        this.resetChart()
        PulseAnalyzer.start(this.onPulseDataUpdate, this.onBPMUpdate)
      } else {
        PulseAnalyzer.stop()
      }
    },
    timerStateChanged (event) {
      this.isStarted = event
      if (!this.isStarted) {
        PulseAnalyzer.stop()
      }
    },
    resetChart () {
      this.chartData.datasets[0].data = []
      this.chartData.labels = []
      this.$refs.chart.render()
    },
    updateChart (dataPoint) {
      this.chartData.datasets[0].data.push(dataPoint)
      this.chartData.labels.push(dataPoint.x)
      if (this.chartData.datasets[0].data.length > 10) {
        this.chartData.datasets[0].data.splice(0, 1)
        this.chartData.labels.splice(0, 1)
      }
      this.$refs.chart.render()
    },
    proceed () {
      this.isDisclaimerRead = true
      const context = this.$refs.canvas.getContext('2d')
      PulseAnalyzer.initialize(this.$refs.video, context, this.onPulseAnalyzerReady, this.onPulseAnalyzerError)
    },
    onPulseAnalyzerReady (settings) {
      this.cameraReady = true
      this.torchAvailable = settings.torchAvailable
    },
    onPulseDataUpdate (dataPoint) {
      this.updateChart(dataPoint)
    },
    onBPMUpdate (dataPoint) {
      this.pulse = dataPoint.avgBPM
      console.log(dataPoint)
    },
    onPulseAnalyzerError (error) {
      console.log(error)
    },
    close () {
      this.$router.replace('/select')
    },
    loadElements (element) {
      this[`loaded${element}`] = true
      element++
      if (element <= 1) setTimeout(() => this.loadElements(element), 200)
    },
    getRandomInt () {
      return Math.floor(Math.random() * 8)
    },
    initChart () {
      var noteImage = new Image()
      noteImage.src = require('../assets/note-beet.svg')
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 50,
            bottom: 50
          }
        },
        scales: {
          yAxes: [{
            display: true,
            gridLines: {
              color: '#D3D3C8',
              display: true,
              drawBorder: false,
              zeroLineColor: '#D3D3C8',
              // zeroLineColor: '#BDD544',
              zeroLineWidth: 1,
              lineWidth: 1
            },
            ticks: {
              beginAtZero: true,
              stepSize: 2,
              suggestedMax: 8,
              suggestedMin: 0,
              display: false,
              padding: 25
            }
          }],
          xAxes: [{
            display: false
          }]
        }
      }
      this.chartData = {
        labels: [],
        datasets: [
          {
            data: [],
            fill: false,
            pointStyle: noteImage,
            borderWidth: 0,
            // borderColor: '#E3CAD4'
            borderColor: 'transparent'
            // borderColor: '#de8db0'
          }
        ]
      }
      // this.fillData()
    }
  },
  mounted () {
    this.initChart()
    window.onbeforeunload = () => {
      clearInterval(this.timer)
      this.isStarted = false
      PulseAnalyzer.stopStream()
    }
    this.$nextTick(function () {
      this.loadElements(0)
    })
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.isStarted = false
    PulseAnalyzer.stopStream()
  }
}
</script>

<style scoped lang="stylus">
.heartrate
  flex 1
  display flex
  flex-direction column

  .camera-container
    flex 0.5
    min-height 320px
    background $beet
    border-radius 30px
    box-shadow 0px 3px 6px rgba(0, 0, 0, 0.16)
    position relative
    .camera, .camera-overlay, .pulse-container
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      margin auto
    .close-button
      a
        font-family 'Dosis', sans-serif
        font-size 64px
        line-height 1rem
        font-weight 500
        text-align right
        color white
        position absolute
        top 20px
        right 20px
        text-decoration none
        cursor pointer
    .camera
      background $beet_dk
      width 100px
      height 100px
    .camera-overlay
      // background url('../assets/hollowbeat.svg')
      display: block
      width 150px
      height 150px
    .pulse-container
      width 250px
      height 250px
    .pulse-container
      display: flex
      flex-direction column
      align-items center
      justify-content flex-end
      .pulse
        color white
        font-family 'Dosis', sans-serif
        font-size 3.6rem
        font-weight 600
        .unit
          font-size 1.4rem

  .bottom-container
    flex 0.5
    display flex
  .instructions-container
    flex 1
    padding 20px 0
    display flex
    flex-direction column
    align-items center
    justify-content space-between
    .instructions
      color $text_extra_lt_grey
      font-size 1.2rem
    .chart
      width 100%
      height 170px
      position relative
    a
      display block
      margin-top 5px
      border-radius 30px
      padding 18px 32px
      background $green_dk
      box-shadow 0px 3px 6px rgba(0, 0, 0, 0.16)
      border none
      color white
      font-weight bold
      font-size 1.25rem
      cursor pointer
      img
        height 20px
        display block
      &:hover
        background $beet
      &:active
        background $green_dk
      &.started
        background $beet
        &:hover
          background $green_dk
        &:active
          background $beet
    .flashlight
      display: flex
      flex-direction row
      justify-content center
      align-items center
      font-family 'Dosis', sans-serif
      .title
        margin-right 5px
        color: $text_grey
        font-size: 1rem
        line-height 1.6rem
        font-weight 600

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
