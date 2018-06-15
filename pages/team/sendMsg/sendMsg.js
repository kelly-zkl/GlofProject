
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.id
    });
  },
  //输入框
  bindChange:function(e){
    console.log(e);
    this.setData({
      inputVail:e.detail.value
    })
  },
  //发送
  postMsg:function(e){
    var that = this;
    if (that.data.inputVail.length == 0){
      wx.showToast({ title: '请填写消息内容', icon: 'none', duration: 1500 });
      return;
    }
    var timeStap = new Date().getTime();
    http.postRequest({
      url: "message/send",
      params: {
        content: that.data.inputVail, uid: app.globalData.userInfo.id, groupId: that.data.groupId, senderTime: timeStap
      },
      msg: "发送中....",
      success: res => {
        wx.showToast({ title: '发送成功', icon: 'info', duration: 1500 });
        wx.navigateBack()
      }
    }, true);
  }
})