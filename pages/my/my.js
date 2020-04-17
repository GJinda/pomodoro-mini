const app = getApp()

Page({
  data: {
    colorList: app.globalData.colorList,
    isShow: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  toggle() {
    this.setData({
      isShow: !this.data.isShow
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../start/start'
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
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})