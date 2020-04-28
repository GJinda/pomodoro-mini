const app = getApp()
Page({
  data: {
    maxTime: 10800,
    time: 0,
    timeStr: "",
    timer: null,

    leftDeg: 45,
    rightDeg: 45,

    taskName: "",
    taskDetail: "",
    taskColor: "",
    finishTime: "",

    modalName: null,
    hintText: "",
    hintText2: ""
  },
  onLoad(options) {
    wx.hideHomeButton({
      complete: (res) => {},
    })
    console.log(options)
    let params = JSON.parse(options.params)
    this.setData({
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
  setTaskDetail(time) {
    let taskDetail = "正向消耗时长："
    let hour = parseInt(time / 3600)
    let minute = parseInt(time % 3600 / 60)
    let second = parseInt(time % 60)
    let maxTime = this.data.maxTime
    if (time >= maxTime) {
      taskDetail = taskDetail + "超过3小时"
    } else if (time >= 3600) {
      taskDetail = minute ? taskDetail + hour + "小时" + minute + "分钟" : taskDetail + hour + "小时"
    } else if (time >= 600 && time < 3600) {
      taskDetail = taskDetail + minute + "分钟"
    } else if (time >= 60 && time < 600) {
      taskDetail = second ? taskDetail + minute + "分钟" + second + "秒" : taskDetail + minute + "分钟"
    } else if (time < 60) {
      taskDetail = taskDetail + "不到1分钟"
    }
    this.setData({
      taskDetail: taskDetail
    })
  },
  addFinishTask(obj) {
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
    let maxTime = this.data.maxTime

    this.formatTimeStr()
    this.data.timer = setInterval(() => {
      time += 1
      this.setData({
        time: time,
      })
      let halfTick = 1800
      if (time === halfTick * 2) {
        this.setData({
          hintText: "你已连续专注 1 个小时, 休息一下喝杯茶吧 !"
        })
        this.showHintModal()
      }
      if (time === halfTick * 4) {
        this.setData({
          hintText: "2 个小时咯, 注意保护你的小心肝 !"
        })
        this.showHintModal()
      }
      if (time === halfTick * 6) {
        this.setData({
          hintText: "本小程序已运行 3 个小时 > <, 不陪你玩啦 ! ",
          hintText2: "(感谢你坚持使用, 系统已终止本次计时)"
        })
        this.showHintModal()
      }

      if (time >= maxTime) {
        wx.vibrateShort({
          complete: (res) => {
            console.log(res)
          },
        })
        this.setDeg(225, 225)
        this.setTaskDetail(time)
        let finishTaskObj = {
          taskName: this.data.taskName,
          taskDetail: this.data.taskDetail,
          taskColor: this.data.taskColor,
          finishTime: this.getDateObj(),
        }
        this.addFinishTask(finishTaskObj)
        return this.clearTimer()
      }

      let timeTick = time % (halfTick * 4)
      if (timeTick && timeTick <= halfTick) {
        leftDeg += 180 / halfTick;
        this.setDeg(leftDeg, 45)
      } else if (timeTick > halfTick && timeTick <= halfTick * 2) {
        rightDeg += 180 / halfTick;
        this.setDeg(225, rightDeg)
      } else if (timeTick > halfTick * 2 && timeTick <= halfTick * 3) {
        leftDeg += 180 / halfTick;
        this.setDeg(leftDeg, 225)
      } else {
        rightDeg += 180 / halfTick;
        this.setDeg(45, rightDeg)
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
      time: 0,
      leftDeg: 45,
      rightDeg: 45,
    })
    this.startTimer()
  },
  formatTimeStr() {
    let h = Math.floor(this.data.time / 3600)
    let m = Math.floor(this.data.time % 3600 / 60)
    let s = Math.floor(this.data.time % 60)
    if ((s + "").length === 1) {
      s = "0" + s
    }
    if ((m + "").length === 1) {
      m = "0" + m
    }
    if ((h + "").length === 1) {
      h = "0" + h
    }
    this.setData({
      timeStr: `${h}:${m}:${s}`
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
  showHintModal() {
    this.setData({
      modalName: "hintModal"
    })
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
  giveup() {
    this.hideModal()
    this.clearTimer()
    this.toStart()
  },
  finish() {
    this.setTaskDetail(this.data.time)
    let finishTaskObj = {
      taskName: this.data.taskName,
      taskDetail: this.data.taskDetail,
      taskColor: this.data.taskColor,
      finishTime: this.getDateObj(),
    }
    this.addFinishTask(finishTaskObj)
    this.clearTimer()
    this.toStart()
  }
})