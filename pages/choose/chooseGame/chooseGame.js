
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    refresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.type == 'yue'){//约球关联
      this.getGames();
    }
  },
  //赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "match/user/joined",
      params: {
        page: that.data.page, size: 10, uid: app.globalData.userInfo.id,notOver:true
      },
      msg: "加载中....",
      success: res => {
        // that.data.show ? wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 }) : ''
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
  //选择比赛
  bindCheckbox: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.chooseGame(this.data.games[index]);
  },
  
  //确定比赛
  chooseGame: function (item) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上1个页面

    //直接调用上2个页面的setData()方法，把数据存到上1个页面中去
    prevPage.setData({
      chooseGames: item
    })
    wx.navigateBack()
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
})