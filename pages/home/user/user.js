const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");

Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
    this.getUserInfo();
  },
  getUserInfo: function (e) {
    var that = this;
    http.postRequest({
      url: "user/detail",
      params: { uid: app.globalData.userInfo.id, id: app.globalData.userInfo.id },
      success: res => {
        that.setData({
          userInfo: res.data
        });
      }
    }, false);
  }
})