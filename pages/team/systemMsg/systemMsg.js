
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    refresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMsgList();
  },
  //获取消息列表
  getMsgList: function (e) {
    var that = this;
    http.postRequest({
      url: "message/query",
      params: {
        page: that.data.page, size: 10, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.senderTime), '-', true)
        })
        if (that.data.page <= 1) {
          that.setData({
            msg: res.data.content
          })
        } else {
          that.setData({
            msg: that.data.msg.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  //拒绝
  refuse:function(){

  },
  //同意
  confirm:function(){

  },
  //删除消息
  deleteMsg:function(e){
    var that = this;
    var msgId = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该消息？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "message/delete",
            params: {
              messageId: msgId, uid: app.globalData.userInfo.id
            },
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 });
              that.setData({
                page: 1
              });
              that.getMsgList();
            }
          }, true);
        }
      }
    })
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
    this.getMsgList();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getMsgList();
  }
})