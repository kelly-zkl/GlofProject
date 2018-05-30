
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    cards: [{ name: '今日比赛' }, { name: '总杆排名' }, { name: '赛事人气' }]
  },
  onLoad: function () {
    
  },
  onShow: function (e) {
    var that = this;

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.getGames();
        that.getYueGames();
      },
      fail: function () {
        wx.showToast({ title: '定位失败', icon: 'info', duration: 1500 });
        that.getGames();
        that.getYueGames();
      }
    })
  },
  //发起约球
  orderBall:function(){
    wx.navigateTo({
      url: '/pages/game/invitationGame/invitationGame',
    })
  },
  //获取附近赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "match/query",
      params: {
        lng: that.data.longitude, lat: that.data.latitude, page: 1, size: 10, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
        })
        that.setData({
          games: res.data.content
        })
      }
    }, false);
  },
  getYueGames:function(){
    var that = this;
    http.postRequest({
      url: "match/query",
      params: {
        lng: that.data.longitude, lat: that.data.latitude, page: 1, size: 5, uid: app.globalData.userInfo.id, hasPromise:true
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
        })
        that.setData({
          matchs: res.data.content
        })
      }
    }, false);
  }
});
