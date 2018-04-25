
var http = require("http.js");

//app.js
App({
  onLaunch: function () {
    // 登录
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
                          params: { encryptedData: encryptedData, iv: iv, sessionId: res.data},
                          success: res => {
                            this.globalData.userInfo = res.data

                            if (this.userInfoReadyCallback) {
                              this.userInfoReadyCallback(res)
                            }
                          }
                        }, true);
                      }
                    },false);
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
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  },
  onShow:function(){
    wx.checkSession({
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})