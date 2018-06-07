const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var drawQrcode = require('../../../utils/qrcode.js'); 

Page({
  data: {
    userInfo: {},
    showPage:false,
    text: ''
  },
  onLoad: function () {
    var that = this;
    this.setData({
      male: '../../../images/icon_male.png',
      female: '../../../images/icon_female.png'
    });
    
    this.setData({
      text: '/pages/userMsg/personalPage/personalPage?tab=1&id=' + app.globalData.userInfo.id
    })
    this.createQrCode(this.data.text);
  },
  onShow:function(){
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
  },
  togglePage: function () {
    this.setData({
      showPage: !this.data.showPage
    });
  },
  //获取页面二维码
  createQrCode: function (text) {
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: this.data.text
    })
  }
})