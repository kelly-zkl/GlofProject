const app = getApp();
var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    tabs: ["动态", "相册","视频"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    userInfo: {},
    person:0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      person:options.tab
    });
    wx.setNavigationBarTitle({
      title: that.data.person == 0 ? "我的主页" :"球友主页"
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    if (app.globalData.userInfo) {
      this.setData({
        icon20: base64.icon20,
        icon60: base64.icon60,
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
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})