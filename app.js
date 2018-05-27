
var http = require("http.js");

//app.js
App({
  onLaunch: function () {
    var that = this;
    //获取用户信息
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.globalData.userInfo = JSON.parse(res.data);
        console.log(that.globalData.userInfo);
      },
      fail: function (res) {//登录
        console.log(res);
        // that.login();
        // wx.navigateTo({
        //   url: '/pages/login/login',
        // })
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

                            wx.navigateTo({
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
  },
  globalData: {
    userInfo: {}
  }
})