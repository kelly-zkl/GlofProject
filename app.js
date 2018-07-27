
var http = require("http.js");

//app.js
App({
  onLaunch: function () {
    wx.clearStorage();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.sliderLeft = ((res.windowWidth / 2 - 96) / 2);
      }
    });
    //获取用户信息
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.globalData.userInfo = JSON.parse(res.data);
        console.log(that.globalData.userInfo);
      },
      fail: function (res) {//登录
        console.log(res);
      }
    })
  },
  globalData: {
    userInfo: {},
    sliderLeft:0
  }
})