
var http = require("../../http.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取用户信息
    wx.getStorage({
      key: 'user',
      success: function (res) {
        app.globalData.userInfo = JSON.parse(res.data);
        wx.reLaunch({
          url: '/pages/home/glof/glof',
        })
      },
      fail: function (res) {//登录
        that.login();
      }
    })
  },
  //登录
  login: function (e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log(res);
              if (res.code) {
                //发起网络请求
                var code = res.code;
                wx.getUserInfo({
                  success: res => {
                    // console.log(res);
                    var encryptedData = res.encryptedData;
                    var iv = res.iv;

                    http.postRequest({
                      url: "user/wxJscode2session",
                      params: { wxLoginCode: code },
                      success: res => {
                        http.postRequest({
                          url: "user/wxLogin",
                          msg: "登录中....",
                          params: { encryptedData: encryptedData, iv: iv, sessionId: res.data },
                          success: res => {
                            app.globalData.userInfo = res.data;

                            wx.setStorageSync('user', JSON.stringify(res.data))

                            if (this.userInfoReadyCallback) {
                              this.userInfoReadyCallback(res)
                            }
                           
                            wx.reLaunch({
                              url: '/pages/home/glof/glof',
                            })
                          }
                        }, true);
                      }
                    }, false);
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      }
    })
  }
})