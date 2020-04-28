//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              wx.showToast({
                title: '登录成功 !',
              })
            }
          })
        }
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    //获取设置信息
    wx.getStorage({
      key: 'config',
      success: (res) => {
        this.globalData.config = JSON.parse(res.data)
        console.log("global",this.globalData.config)
      },
      fail: (res) => {
        wx.setStorage({
          data: JSON.stringify(this.globalData.config),
          key: 'config',
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    config: {
      isKeepScreen: false,
      isForwardTiming: false,
    },
    iconList: [{
      icon: 'file',
      color: 'red',
      name: '工作'
    }, {
      icon: 'read',
      color: 'orange',
      name: '学习'
    }, {
      icon: 'write',
      color: 'yellow',
      name: '写作'
    }, {
      icon: 'magic',
      color: 'olive',
      name: '背词'
    }, {
      icon: 'text',
      color: 'green',
      name: '阅读'
    }, {
      icon: 'comment',
      color: 'cyan',
      name: '讨论'
    }, {
      icon: 'hot',
      color: 'blue',
      name: '运动'
    }, {
      icon: 'creative',
      color: 'mauve',
      name: '思考'
    }, {
      icon: 'light',
      color: 'purple',
      name: '脑暴'
    }],
    colorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ]
  }
})