
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

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
    
    if (options.type == 'yue'){//约球关联
      this.getGames();
    }
  },
  //赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "match/list",
      params: {creatorId: app.globalData.userInfo.id, uid: app.globalData.userInfo.id},
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
        })
        that.setData({
          games: res.data
        })
      }
    }, true);
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
  }
})