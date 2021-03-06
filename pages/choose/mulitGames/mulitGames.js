
const app = getApp();
var http = require("../../../http.js");
var base64 = require("../../../images/base64");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    games: [],
    selectedAllStatus: false,
    isTeam:false,
    page: 1,
    refresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      isTeam: options.type ? options.type=='team'?true:false : false,
    })
    
    that.getGames();
  },
  //赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "match/user/joined",
      params: {
        page: that.data.page, size: 10, uid: app.globalData.userInfo.id
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
    var selected = this.data.games[index].selected;
    var games = this.data.games;
    if (!selected) {
      // this.setData({
      // });
    } else {
      // this.setData({
      // });
    }

    games[index].selected = !selected;

    this.setData({
      games: games
    });
    this.judgeSelect();
  },
  //判断是不是全选
  judgeSelect: function () {
    var select = true;
    (this.data.games).map(function (item) {
      if (!item.selected) {
        select = false;
        return;
      }
    })
    this.setData({
      selectedAllStatus: select
    });
  },
  //全选 全不选
  bindSelectAll: function (e) {
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    var games = this.data.games;
    (games).map(function (item) {
      item.selected = selectedAllStatus
    })

    this.setData({
      games: games,
      selectedAllStatus: selectedAllStatus
    });
  },
  //确定关联比赛
  chooseGame: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上2个页面

    var memArr = [];
    (this.data.games).map(function (item) {
      if (item.selected) {
        memArr.push(item)
      }
    })

    //直接调用上2个页面的setData()方法，把数据存到上2个页面中去
    prevPage.setData({
      chooseGames: prevPage.data.chooseGames.concat(memArr)
    })

    prevPage.addGames();
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