const constraints = {
  video: true,
  audio: false,
  width: {
    min: 320,
    ideal: 320
  },
  height: {
    min: 240,
    ideal: 240
  }
}

var streamStarted = false

export default {
  initData () {
    this.vars = {
      torchAvailable: false,
      isTorchOn: true,
      isStarted: false,
      hist: [],
      dataLength: 300,
      sampledBrightness: [],
      medianValues: [],
      movingAverageValues: [],
      medianAverageValues: [],
      bpmValues: [],
      dps: [],
      brightnessValues: [],
      xVal: 0,
      video: null,
      context: null,
      width: 100,
      height: 100,
      timer: null
    }
  },
  initialize (video, context, readyCallback, errorCallback) {
    this.initData()
    this.vars.video = video
    this.vars.context = context
    this.readyCallback = readyCallback
    this.errorCallback = errorCallback
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.errorCallback('This browser is currently not supported')
      return
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          console.log(
            device.kind + ': ' + device.label + ' id = ' + device.deviceId
          )
          if (device.kind === 'videoinput') {
            constraints.video = {
              optional: [
                {
                  sourceId: device.deviceId
                },
                {
                  fillLightMode: 'on'
                }
              ]
            }
          }
        })

        this.vars.width = this.vars.video.width
        this.vars.height = this.vars.video.height

        // Get the webcam's stream.
        if (!streamStarted) navigator.mediaDevices.getUserMedia(constraints).then((stream) => this.startStream(stream))
      })
      .catch((err) => {
        console.log(err.name + ': ' + err.message)
        this.errorCallback(err.name + ': ' + err.message)
      })
  },

  startStream (stream) {
    streamStarted = true
    const track = stream.getVideoTracks()[0]
    setTimeout(() => {
      const capabilities = track.getCapabilities()
      if (capabilities.torch) {
        this.vars.torchAvailable = true
        track.applyConstraints({
          advanced: [
            {
              torch: this.vars.isTorchOn
            }
          ]
        })
      }

      this.readyCallback({ torchAvailable: this.vars.torchAvailable })
    }, 500)
    this.vars.video.srcObject = stream
    this.vars.video.play()
    requestAnimationFrame(() => this.draw())
  },

  toggleTorch (isTorchOn) {
    this.vars.isTorchOn = isTorchOn
    this.vars.video.srcObject.getVideoTracks()[0].applyConstraints({
      advanced: [
        {
          torch: this.vars.isTorchOn
        }
      ]
    })
  },

  stopStream () {
    this.stop()
    this.readyCallback = null
    this.errorCallback = null
    this.dataUpdateCallback = null
    this.bpmUpdateCallback = null
    streamStarted = false
    if (this.vars.video.srcObject) {
      this.vars.video.srcObject.getTracks().forEach(function (track) {
        track.stop()
      })
    }
    this.vars.video.pause()
  },

  start (dataUpdateCallback, bpmUpdateCallback) {
    if (!streamStarted) {
      this.errorCallback('Stream not ready')
    }
    this.dataUpdateCallback = dataUpdateCallback
    this.bpmUpdateCallback = bpmUpdateCallback
    this.vars.isStarted = true
    clearInterval(this.vars.timer)
    this.vars.timer = setInterval(() => this.calculateBPM(), 500)
  },

  stop () {
    this.vars.isStarted = false
    // this.calculateFinalBPM()
    clearInterval(this.vars.timer)
    this.resetValues()
  },

  draw () {
    var frame = this.readFrame()
    if (frame) {
      this.getBrightness(frame.data)
    }
    if (streamStarted) requestAnimationFrame(() => this.draw())
  },

  readFrame () {
    try {
      this.vars.context.drawImage(this.vars.video, 0, 0, this.vars.width, this.vars.height)
    } catch (e) {
      return null
    }
    return streamStarted ? this.vars.context.getImageData(0, 0, this.vars.width, this.vars.height) : null
  },

  getBrightness (data) {
    var midpointVariation = 30
    var midpointX = [
      Math.floor(this.vars.width / 2) - midpointVariation,
      Math.ceil(this.vars.width / 2) + midpointVariation
    ]
    var midpointY = [
      Math.floor(this.vars.height / 2) - midpointVariation,
      Math.ceil(this.vars.height / 2) + midpointVariation
    ]
    var brightnessSum = 0
    var brightnessCount = 0
    // var redSum = 0;

    for (var x = midpointX[0]; x <= midpointX[1]; x++) {
      for (var y = midpointY[0]; y <= midpointY[1]; y++) {
        var point = (y * this.vars.width + x) * 4
        brightnessSum += data[point] + data[point + 1] + data[point + 2]
        brightnessCount++
      }
    }

    var brightness = brightnessSum / 3 / brightnessCount
    // var redAvg = redSum / brightnessCount;
    // var redAvgMedian = findMedian(redAvg);
    var birghtnessFiltered = this.findMovingAverage(
      this.findMovingAverage(this.findMovingAverage(brightness))
    )
    // hist.push(brightness);

    if (this.vars.isStarted) this.updateChart(brightness, birghtnessFiltered)
    this.vars.medianAverageValues.push(birghtnessFiltered)
    if (this.vars.medianAverageValues.length > 25) this.vars.medianAverageValues.shift()

    this.calculateMedianLine()
    this.vars.hist.push({
      v: birghtnessFiltered,
      t: Date.now()
    })
    // eslint-disable-next-line no-unused-vars
    var removed = this.vars.hist.length >= this.vars.dataLength ? this.vars.hist.shift() : 0
  },

  findMovingAverage (point, len = 3) {
    // eslint-disable-next-line no-unused-vars
    var removed =
    this.vars.movingAverageValues.length === len ? this.vars.movingAverageValues.shift() : 0

    var currentSum = this.vars.movingAverageValues.reduce(
      (previous, current) => (current += previous), 0
    )
    const currentAvg = (currentSum + point) / (this.vars.movingAverageValues.length + 1)

    this.vars.movingAverageValues.push(currentAvg)
    return currentAvg
  },

  updateChart (val, o) {
    this.vars.brightnessValues.push({
      x: this.vars.xVal,
      y: o
    })

    if (this.vars.brightnessValues.length > this.vars.dataLength) {
      this.vars.brightnessValues.shift()
    }

    var sampleRate = this.vars.dataLength / 30

    if (this.vars.xVal % sampleRate === 0) {
      this.vars.sampledBrightness.push({
        x: this.vars.xVal,
        y:
          o -
          (this.vars.medianValues[this.vars.medianValues.length - 1] ? this.vars.medianValues[this.vars.medianValues.length - 1].y
            : 0)
      })

      if (this.vars.sampledBrightness.length > 10) {
        this.vars.sampledBrightness.shift()
      }

      var modifiedSampledBrightness = this.vars.sampledBrightness.map((el) => el.y)
      if (modifiedSampledBrightness.length > 0) {
        var min = Math.min(...modifiedSampledBrightness)
        var max = Math.max(...modifiedSampledBrightness)
        var lastSample = this.vars.sampledBrightness[this.vars.sampledBrightness.length - 1]
        var obj = {
          y: Math.floor(((lastSample.y - min) / (max - min)) * 8),
          x: lastSample.x
        }

        this.dataUpdateCallback(obj)
      }
    }

    this.vars.xVal++
  },

  calculateMedianLine () {
    const sortedLastValues = [...this.vars.medianAverageValues]
    sortedLastValues.sort(function (a, b) {
      return a - b
    })

    this.vars.medianValues.push({
      y: sortedLastValues[Math.floor(sortedLastValues.length / 2)],
      x: this.vars.xVal
    })
    if (this.vars.medianValues.length > this.vars.dataLength) this.vars.medianValues.shift()
  },

  resetValues () {
    this.vars.hist = []
    this.vars.sampledBrightness = []
    this.vars.medianValues = []
    this.vars.movingAverageValues = [0]
    this.vars.medianAverageValues = [0]
    this.vars.bpmValues = []
    this.vars.dps = [] // dataPoints
    this.vars.brightnessValues = []
    this.vars.xVal = 0
    this.vars.timer = null
    this.dataUpdateCallback = null
    this.bpmUpdateCallback = null
  },

  calculateFinalBPM () {
    var subArr = this.vars.bpmValues.slice(Math.max(this.vars.bpmValues.length - 8, 1))
    var currentBPM = subArr.reduce((a, b) => a + b, 0) / subArr.length
    var avgBPM = this.vars.bpmValues.reduce((a, b) => a + b, 0) / this.vars.bpmValues.length
    if (!isNaN(avgBPM)) this.bpmUpdateCallback({ currentBPM, avgBPM: avgBPM.toFixed(0) })
    // return { currentBPM, avgBPM: avgBPM.toFixed(0) }
  },

  calculateBPM (value) {
    var isHi
    var lastHi
    var lastLo
    var pulseAvg = 0
    var pulseCount = 0

    this.vars.hist.forEach((el, x) => {
      var threshold = this.vars.medianValues[x].y
      if (!isHi && el.v > threshold) {
        isHi = true
        lastLo = x
      }
      if (isHi && el.v < threshold) {
        if (lastHi !== undefined && lastLo !== undefined) {
          pulseAvg += this.vars.hist[x].t - this.vars.hist[lastHi].t
          pulseCount++
        }
        isHi = false
        lastHi = x
      }
    })

    if (this.vars.isStarted) {
      if (pulseCount) {
        var pulseRate = 60000 / (pulseAvg / pulseCount)
        if (pulseRate <= 220 && pulseRate >= 40) this.vars.bpmValues.push(pulseRate)
        if (this.vars.bpmValues.length > this.vars.dataLength * 1.2) this.vars.bpmValues.shift()
        // var subArr = this.vars.bpmValues.slice(Math.max(this.vars.bpmValues.length - 8, 1))
        // var bpmAvg = subArr.reduce((a, b) => a + b, 0) / subArr.length
        return this.calculateFinalBPM()
      } else {
        return '--'
      }
    } else return '--'
  }
}
