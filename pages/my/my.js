const app = getApp()

Page({
  data: {
    colorList: app.globalData.colorList,
    showIntro: false,
    showSetting: false,
    showAbout: false,

    isKeepScreen: false,
    isForwardTiming: false,
    isResetTask: false,

    modalName: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  toggleIntro() {
    this.setData({
      showIntro: !this.data.showIntro
    })
  },
  toggleSetting() {
    this.setData({
      showSetting: !this.data.showSetting
    })
  },
  toggleAbout() {
    this.setData({
      showAbout: !this.data.showAbout
    })
  },
  onSwitchScreen(e) {
    this.setData({
      isKeepScreen: e.detail.value
    })
    let config = app.globalData.config
    config.isKeepScreen = this.data.isKeepScreen
    getApp().globalData.config = config
    wx.setStorage({
      data: JSON.stringify(config),
      key: "config",
    })
  },
  onSwitchTiming(e) {
    this.setData({
      isForwardTiming: e.detail.value
    })
    let config = app.globalData.config
    config.isForwardTiming = this.data.isForwardTiming
    getApp().globalData.config = config
    wx.setStorage({
      data: JSON.stringify(config),
      key: "config",
    })
  },
  onSwitchReset(e) {
    this.setData({
      isResetTask: e.detail.value
    })
    this.setData({
      modalName: "resetModal"
    })
  },
  onShareAppMessage() {
    return {
      title: "要来点番茄嘛？",
      imageUrl: "../../images/share.png",
      success: (res) => {
        console.log(res)
        wx.showShareMenu({
          withShareTicker: true,
          complete: (res) => {
            console.log(res)
          },
        })
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    }
  },
  onShow() {
    wx.getStorage({
      key: 'config',
      success: (res) => {
        let config = JSON.parse(res.data)
        this.setData({
          isKeepScreen: config.isKeepScreen,
          isForwardTiming: config.isForwardTiming
        })
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.showToast({
          title: '登录成功 !',
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.showToast({
            title: '登录成功 !',
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      isResetTask: false
    })
    this.setData({
      modalName: null
    })
  },
  cancel() {
    this.hideModal()
  },
  resetTask(e) {
    wx.setStorage({
      data: JSON.stringify(app.globalData.iconList),
      key: 'list',
    })
    wx.showToast({
      title: '重置成功 !',
    })
    this.hideModal()
  },
})