const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    isForwardTiming: false,
    iconList: [],
    gridCol: 3,
    skin: false,

    tomatoTime: "25分钟",
    tomatoTimeIndex: 2,
    tomatoTimeList: ["10分钟", "15分钟", "25分钟", "30分钟", "45分钟", "60分钟"],

    taskName: "",
    taskDetail: "",
    taskColor: "red",
    taskTomato: 1,
    taskList: [],
    taskIndex: 0,

    modalName: null,
  },
  tomatoTimePickerChange(e) {
    this.setData({
      tomatoTimeIndex: e.detail.value,
      tomatoTime: this.data.tomatoTimeList[e.detail.value]
    })
  },
  toTimer(e) {
    wx.navigateTo({
      url: '../timer/timer?params=' + JSON.stringify({
        tomatoTime: this.data.tomatoTime,
        taskName: e.currentTarget.dataset.taskName,
        taskColor: e.currentTarget.dataset.taskColor
      })
    })
  },
  toCounter(e) {
    wx.navigateTo({
      url: '../counter/counter?params=' + JSON.stringify({
        taskName: e.currentTarget.dataset.taskName,
        taskColor: e.currentTarget.dataset.taskColor
      })
    })
  },
  onShow() {
    wx.getStorage({
      key: 'config',
      success: (res) => {
        let config = JSON.parse(res.data)
        this.setData({
          isForwardTiming: config.isForwardTiming
        })
      },
      fail: (res) => {
        this.setData({
          isForwardTiming: app.globalData.config.isForwardTiming
        })
      }
    })
    wx.getStorage({
      key: 'list',
      success: (res) => {
        let iconList = JSON.parse(res.data)
        this.setData({
          iconList: iconList
        })
      },
      fail: (res) => {
        this.setData({
          iconList: app.globalData.iconList
        })
      }
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      taskIndex: e.currentTarget.dataset.taskIndex
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
  edit(e) {
    console.log(e.detail.value)
    if (e.detail.value.taskName == "") {
      wx.showToast({
        icon: "none",
        title: '请填写任务名称 !',
        duration: 1000
      })
      return
    }
    if (e.detail.value.taskName.length > 10) {
      wx.showToast({
        icon: "none",
        title: '仅限十个字，不能再多啦!',
        duration: 1000
      })
      return
    }
    let iconList = this.data.iconList
    let taskIndex = this.data.taskIndex
    iconList[taskIndex].name = e.detail.value.taskName
    this.setData({
      iconList: iconList,
      taskName: ""
    })
    wx.setStorage({
      data: JSON.stringify(iconList),
      key: 'list',
    })
    wx.showToast({
      title: '修改成功 !',
    })
    this.hideModal()
  },
  taskNameInput(e) {
    this.setData({
      taskName: e.detail.value
    })
  },
  // dealTaskItem() {
  //   console.log(this.data.iconList)
  //   let taskList = this.data.iconList
  //   for (let i in taskList) {
  //     if (taskList[i].name.length > 5) {
  //       taskList[i].name = taskList[i].name.slice(0, 5) + "..."
  //     }
  //   }
  //   this.setData({
  //     taskList: taskList
  //   })
  // }
})