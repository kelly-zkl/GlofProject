var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({
  data: {
    tabs: ["我参与的", "我关注的"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow:function(){
    if (this.data.activeIndex == 0) {//我参与的
      this.getMyGames();
    } else if (this.data.activeIndex == 1) {//我关注的
      this.getFollowGames();
    }
  },
  //标签页
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//我参与的
      this.getMyGames();
    } else if (e.currentTarget.id == 1) {//我关注的
      this.getFollowGames();
    }
  },
  //我参加的赛事列表
  getMyGames: function () {
    var that = this;
    http.postRequest({
      url: "match/user/joined",
      params: {
        page: 1, size: 10, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
        })
        that.setData({
          myGames: res.data.content
        })
      }
    }, false);
  },
  //我关注的赛事列表
  getFollowGames: function () {
    var that = this;
    http.postRequest({
      url: "match/user/following",
      params: {
        page: 1, size: 10, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
        })
        that.setData({
          myGames: res.data.content
        })
      }
    }, false);
  }
});