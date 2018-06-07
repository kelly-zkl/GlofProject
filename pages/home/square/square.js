
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    cards: [{ name: '总\n杆\n排\n名' }, { name: '老\n鹰\n排\n名' }, { name: '小\n鸟\n排\n名' }],
    refresh:false
  },
  onLoad: function () {
    this.setData({
      one: '../../../images/icon_score_first.png',
      two: '../../../images/icon_score_second.png',
      three:'../../../images/icon_score_third.png',
    });
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
    this.getData();
    this.getRank();
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
        lng: that.data.longitude, lat: that.data.latitude, page: 1, size: 8, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
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
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
        })
        that.setData({
          matchs: res.data.content
        })
      }
    }, false);
  },
  //获取总杆排名
  getRank:function(){
    var that = this;
    http.postRequest({
      url: "ranking/pole",
      params: {uid: app.globalData.userInfo.id},
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        var arr = [];
        arr[0] = res.data.total ? res.data.total:[]
        arr[1] = res.data.eagle ? res.data.eagle:[]
        arr[2] = res.data.bird ? res.data.bird:[]
        that.setData({
          ranks: arr
        })
      }
    }, false);
  },
  //获取今日比赛情况
  getData:function(){
    var that = this;
    http.postRequest({
      url: "ranking/today",
      params: {uid: app.globalData.userInfo.id},
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        that.setData({
          rankCount: res.data
        })
      }
    }, false);
  },
  /**
   * 下拉刷新
   */
  // onPullDownRefresh() {
  //   wx.showNavigationBarLoading();
  //   this.setData({
  //     refresh: true
  //   });
  //   this.getData();
  //   this.getRank();
  //   this.getYueGames();
  //   this.getGames();
  // }
});
