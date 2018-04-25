const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dynamics: [],
    page: 1,
    size: 10
  },
  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        icon20: base64.icon20,
        icon60: base64.icon60,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  onShow: function (e) {
    this.getDynamics();
  },
  getDynamics: function (e) {
    var that = this;
    http.postRequest({
      url: "userPost/watchPage",
      params: {
        page: that.data.page, size: that.data.size,
        belongType: "user", uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        this.setData({
          dynamics: res.data.content
        })
      }
    }, true);
  },
  getUserInfo: function (e) {
    
  },
  gotoPost: function () {
    wx.navigateTo({
      url: '/pages/userMsg/sendDynamic/sendDynamic?type=user',
    })
  }
})