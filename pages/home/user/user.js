const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");

Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
    this.setData({
      male: '../../../images/icon_male.png',
      female: '../../../images/icon_female.png'
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