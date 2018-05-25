
var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

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
    this.getTeams();
  },

  //获取我的球队列表
  getTeams: function (e) {
    var that = this;
    http.postRequest({
      url: "group/mine",
      params: {
        page: 1, size: 10, uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          myteams: res.data.minesGroup,
          joinsteams: res.data.joinsGroup
        })
      }
    }, true);
  },
})