const app = getApp()

Page({
  data: {
    tomatoTime: 25,
    time: 25,
    halfTime: 0,
    timeStr: "",
    timer: null,

    leftDeg: 45,
    rightDeg: 45,

    taskName: "",
    taskDetail: "",
    taskColor: "",
    finishTime: "",

    modalName: null,
  },
  onLoad(options) {
    wx.hideHomeButton({
      complete: (res) => {},
    })
    console.log(options)
    let params = JSON.parse(options.params)
    this.setData({
      tomatoTime: parseInt(params.tomatoTime),
      time: parseInt(params.tomatoTime) * 60,
      halfTime: parseInt(params.tomatoTime) * 60 / 2,
      taskName: params.taskName || "",
      taskDetail: params.taskDetail || "",
      taskColor: params.taskColor || "red"
    })
  },
  onShow() {
    this.startTimer()
    if(app.globalData.config.isKeepScreen){
      this.keepOnScreen()
    }
  },
  onHide() {
    this.keepOffScreen()
  },
  onUnload() {
    this.keepOffScreen()
  },
  keepOffScreen() {
    console.log("keepoff")
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },
  keepOnScreen() {
    console.log("keepon")
    if (wx.setScreenBrightness) {
      wx.setKeepScreenOn({
        keepScreenOn: true
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  setDeg(left, right) {
    this.setData({
      leftDeg: left,
      rightDeg: right,
    })
  },
  finishTask(obj) {
    wx.getStorage({
      key: 'finishTask',
      success: (res) => {
        let finishTaskList = JSON.parse(res.data)
        let newTaskList = [obj]
        wx.setStorage({
          data: JSON.stringify(finishTaskList.concat(newTaskList)),
          key: "finishTask",
        })
      },
      fail: (res) => {
        let newTaskList = [obj]
        wx.setStorage({
          data: JSON.stringify([].concat(newTaskList)),
          key: "finishTask",
        })
      }
    })
  },
  getDateObj() {
    let date = new Date()
    let dateObj = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    }
    return dateObj
  },
  startTimer() {
    let time = this.data.time
    let leftDeg = this.data.leftDeg
    let rightDeg = this.data.rightDeg
    let halfTime = this.data.halfTime

    this.formatTimeStr()
    this.data.timer = setInterval(() => {
      time -= 1
      this.setData({
        time: time,
      })

      if (time <= 0) {
        this.setDeg(225, 225)
        wx.vibrateShort({
          complete: (res) => {
            console.log(res)
          },
        })
        let finishTaskObj = {
          taskName: this.data.taskName,
          taskDetail: this.data.taskDetail,
          taskColor: this.data.taskColor,
          finishTime: this.getDateObj(),
        }
        this.finishTask(finishTaskObj)
        return this.clearTimer()
      } else if (time >= halfTime) {
        leftDeg += 180 / halfTime;
        this.setDeg(leftDeg, 45)
      } else {
        rightDeg += 180 / halfTime;
        this.setDeg(225, rightDeg)
      }

      this.formatTimeStr()
    }, 1000)

    this.setData({
      timer: this.data.timer
    })
  },
  clearTimer() {
    clearInterval(this.data.timer)
    this.data.timer = null
    this.setData({
      timer: this.data.timer,
    })
  },
  startNewTimer() {
    this.setData({
      time: this.data.tomatoTime,
      leftDeg: 45,
      rightDeg: 45,
    })
    this.startTimer()
  },
  formatTimeStr() {
    let m = Math.floor(this.data.time / 60)
    let s = Math.floor(this.data.time % 60)
    if (s === 0) {
      s = "00"
    }
    if ((s + "").length === 1) {
      s = "0" + s
    }
    if ((m + "").length === 1) {
      m = "0" + m
    }
    this.setData({
      timeStr: `${m}:${s}`
    })
  },
  toStart() {
    wx.navigateBack({
      complete: (res) => {},
    })
    // wx.navigateTo({
    //   url: "../start/start",
    // })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  cancel() {
    this.hideModal()
  },
  ok() {
    this.hideModal()
    this.clearTimer()
    this.toStart()
  },
})