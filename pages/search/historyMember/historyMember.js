
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
const app = getApp();
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    page: 1,
    refresh:false,
    activeIndex:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userInfo.id
    });
    this.getGames();
  },

  //赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "match/user/joined",
      params: {
        page: that.data.page, size: 10, uid: app.globalData.userInfo.id
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
  //获取参赛选手
  getMembers: function () {
    var that = this;
    http.postRequest({
      url: "match/players",
      params: {
        uid: app.globalData.userInfo.id, matchId: that.data.matchId
      },
      // msg: "加载中....",
      success: res => {
        // that.data.show ? wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 }) : ''
        this.setData({
          members: res.data
        })
      }
    }, false);
  },
  //选择成员
  changeIndex: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
    wx.setNavigationBarTitle({
      title: e.currentTarget.id == 1 ? "选择比赛" : "选择球员"
    })
    if (e.currentTarget.id == 2) {
      this.setData({
        matchId: e.currentTarget.dataset.id
      });
      this.getMembers();
    }
  },
  /**
  * 下拉刷新
  */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    
    if (this.data.activeIndex == 1) {
      this.setData({
        refresh: true,
        page: 1
      });
      this.getGames();
    }else{
      this.getMembers();
    }
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    if (this.data.activeIndex == 1){
      this.setData({
        page: this.data.page + 1
      })
      this.getGames();
   }
  }
})