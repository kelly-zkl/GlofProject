
var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    gamePage: 1,
    refresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userInfo.id
    });
    this.getGameMembers();
  },

  //获取我的同组同赛列表
  getGameMembers: function (e) {
    var that = this;
    http.postRequest({
      url: "user/historyRival",
      params: {
        page: that.data.gamePage, uid: app.globalData.userInfo.id, size: 10
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.gamePage <= 1) {
          that.setData({
            teamMembers: res.data.content
          })
        } else {
          that.setData({
            teamMembers: that.data.teamMembers.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  /**
  * 下拉刷新
  */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true,
      gamePage: 1
    });
    
    this.getGameMembers();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
   
    this.setData({
      gamePage: this.data.gamePage + 1
    })
    this.getGameMembers();
  }
})