const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    iconList: [{
      icon: 'file',
      color: 'red',
      badge: 0,
      name: '工作'
    }, {
      icon: 'read',
      color: 'orange',
      badge: 0,
      name: '学习'
    }, {
      icon: 'creative',
      color: 'yellow',
      badge: 0,
      name: '思考'
    }, {
      icon: 'write',
      color: 'olive',
      badge: 0,
      name: '写作'
    }, {
      icon: 'hot',
      color: 'cyan',
      badge: 0,
      name: '运动'
    }, {
      icon: 'text',
      color: 'blue',
      badge: 0,
      name: '阅读'
    }],
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
    deleteIndex: -1
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
        taskDetail: e.currentTarget.dataset.taskDetail,
        taskColor: e.currentTarget.dataset.taskColor
      })
    })
  },
  onShow() {
    wx.getStorage({
      key: 'myTask',
      success: (res) => {
        this.setData({
          taskList: JSON.parse(res.data)
        })
      },
      fail: (res) => {}
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
    this.setData({
      taskName: "",
      taskDetail: "",
      taskColor: "red",
      taskTomato: 0
    })
    this.hideModal()
  },
  ok(e) {
    console.log(e.detail.value)
    if (e.detail.value.taskName == "") {
      wx.showToast({
        icon: "none",
        title: '请填写任务名称 !',
        duration: 1500
      })
      return
    }
    this.setData({
      taskName: e.detail.value.taskName,
      taskDetail: e.detail.value.taskDetail
    })
    let newTaskArr = [{
      taskName: this.data.taskName,
      taskDetail: this.data.taskDetail,
      taskColor: "red",
      taskTomato: this.data.taskTomato,
      finished: false,
      finishTime: ""
    }]
    this.setData({
      taskList: this.data.taskList.concat(newTaskArr)
    })
    wx.setStorage({
      data: JSON.stringify(this.data.taskList),
      key: "myTask",
    })
    this.hideModal()
  },
  showDeleteModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      deleteIndex: e.currentTarget.dataset.deleteIndex
    })
  },
  deleteTask() {
    let taskList = this.data.taskList
    let deleteIndex = this.data.deleteIndex
    for (let i in taskList) {
      if (i == deleteIndex) {
        taskList.splice(i, 1)
        this.setData({
          taskList: taskList
        })
      }
    }
    wx.setStorage({
      data: JSON.stringify(this.data.taskList),
      key: "myTask",
    })
    this.hideModal()
  },
  taskNameInput(e) {
    this.setData({
      taskName: e.detail.value
    })
  },
  taskDetailInput(e) {
    this.setData({
      taskDetail: e.detail.value
    })
  }
})