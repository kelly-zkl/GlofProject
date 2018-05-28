
const app = getApp();
var http = require("../../../http.js");
var base64 = require("../../../images/base64");

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
  
  },
  //赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "court/query",
      params: {
        page: that.data.page, size: that.data.size,
        keyword: '', lng: that.data.longitude, lat: that.data.latitude
      },
      msg: "加载中....",
      success: res => {
        that.data.show ? wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 }) : ''
        this.setData({
          games: res.data.content
        })
      }
    }, that.data.show);
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
    var prevPage = pages[pages.length - 2];  //上2个页面

    //直接调用上2个页面的setData()方法，把数据存到上2个页面中去
    prevPage.setData({
      chooseGames: item
    })
    wx.navigateBack()
  }
})