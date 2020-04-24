const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
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
  onShow() {
    this.setData({
      iconList: app.globalData.iconList
    })
  }
})