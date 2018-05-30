
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 1,
    radioDing: 0,
    radioShou: 0,
    handicap: true,
    avoid: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var arr = JSON.parse(options.player);
    (arr).map(function (item) {
      item.score = 0;
      item.three = 0;
      item.four = 0;
      item.five = 0;
    })
    that.setData({
      gameId: options.id,
      players: arr
    })
  },
  //顶洞
  dingChange: function (e) {
    this.setData({
      radioDing: e.currentTarget.dataset.id
    })
  },
  //收顶洞
  shouChange: function (e) {
    this.setData({
      radioShou: e.currentTarget.dataset.id
    })
  },
  //让分
  handicapSet: function (e) {
    this.setData({
      handicap: e.detail.value
    })
  },
  //避开地雷
  avoidSet: function (e) {
    this.setData({
      avoid: e.detail.value
    })
  },
  //让总分
  scoreChange: function (e) {
    var arr = this.data.players;
    arr[e.currentTarget.id].score = e.detail.value;
    this.setData({
      players: arr
    })
  },
  //三杆洞
  threeChange: function (e) {
    var arr = this.data.players;
    arr[e.currentTarget.id].three = e.detail.value;
    this.setData({
      players: arr
    })
  },
  //四杆洞
  fourChange: function (e) {
    var arr = this.data.players;
    arr[e.currentTarget.id].four = e.detail.value;
    this.setData({
      players: arr
    })
  },
  //五杆洞
  fiveChange: function (e) {
    var arr = this.data.players;
    arr[e.currentTarget.id].five = e.detail.value;
    this.setData({
      players: arr
    })
  },
  //保存设置
  saveSet: function () {
    var that = this;
    var spread = {};
    var handicap3 = {};
    var handicap4 = {};
    var handicap5 = {};
    var pkPlayers = [];
    (that.data.players).map(function (item,idx) {
      spread[item.userId] = item.score;
      handicap3[item.userId] = item.three;
      handicap4[item.userId] = item.four;
      handicap5[item.userId] = item.five;
      pkPlayers[idx] = item.userId;
    })
    
    if (!that.data.number1) {
      wx.showToast({ title: '请输入基本单位', icon: 'none', duration: 1500 });
      return;
    }
    http.postRequest({
      url: "match/pkRuleAdd",
      params: {
        matchId: that.data.gameId, uid: app.globalData.userInfo.id, pkRuleDTL: {modeName: '比洞',
          mode: 11, graUnit: that.data.number1, ups: that.data.avoid, hasSpread: that.data.handicap, spread: spread,
          handicap3: handicap3, handicap4: handicap4, handicap5: handicap5, thMode: that.data.radioDing, 
          bhMode: that.data.radioShou, pkPlayers: pkPlayers
        }
      },
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1000 })
        setTimeout(function () {
          wx.navigateBack()
        }, 1000)
      }
    }, true);
  }
})