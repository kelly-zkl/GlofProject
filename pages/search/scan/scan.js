// pages/search/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.scan();
  },
  //扫一扫
  scan:function(e) {
    wx.scanCode({
      success: (res) => {
        console.log("扫码结果" + res);
        
      },
      fail: (res) => {
        console.log("扫码失败" +res);
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})