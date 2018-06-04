
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gameId: options.id
    });

    this.getList();
  },

  //获取填写记录
  getList:function(){
    var that = this;
    http.postRequest({
      url: "match/uRecord",
      params: {
        matchId: that.data.gameId, uid: app.globalData.userInfo.id, page:that.data.page,size:10
      },
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatDateTime(new Date(item.createTime), '-', 'time')
        })
        if (that.data.page <= 1) {
          that.setData({
            records: res.data.content
          })
        } else {
          that.setData({
            records: that.data.records.concat(res.data.content)
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
      page: 1
    });

    this.getList();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getList();
  }
})