var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    tabs: ["进行中", "即将开始"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    inputShowed: false,
    inputVal: "",
    stat:2,
    stat: 2,
    refresh: true,
    page: 1
  },
  onLoad: function (options) {
    this.setData({
      activeIndex: options.tab
    });
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
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.getGames();
      },
      fail: function () {
        wx.showToast({ title: '定位失败', icon: 'info', duration: 1500 });
        that.getGames();
      }
    })
  },
  //tab切换
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//进行中stat;//状态 1、即将开始 2、进行中 3、约球 4、已结束
      this.setData({
        stat:2
      })
    }else{//即将开始
      this.setData({
        stat: 1
      })
    }
    this.getGames();
  },
  //输入框 --关键字查询
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    if (e.detail.value.length > 0) {
      this.getGames();
    }
  },
  //新建比赛
  createGame:function(e){
    wx.navigateTo({
      url: '/pages/game/createGame/createGame?id=1',
    })
  },
  //获取赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "match/query",
      params: {
        lng: that.data.longitude, lat: that.data.latitude, page: 1, size: 10, uid: app.globalData.userInfo.id,
        keyworld: that.data.inputVal, stat: that.data.stat
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
        })
        if (that.data.page <= 1) {
          that.setData({
            games: res.data.content
          })
        } else {
          that.setData({
            games: that.data.games.concat(res.data.content)
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
    this.getGames();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getGames();
  }
});