
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
    handicap: true,
    avoid:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      gameId: options.id
    });
  },
  onShow: function () {
    this.gameDetail();
  },
  //保存设置
  saveSet: function () {

  },
  //基本单位
  numberChange:function(e){
    this.setData({
      number1: e.detail.value
    })
  },
  //让分
  handicapSet: function (e) {
    this.setData({
      handicap: e.detail.value
    })
  },
  //避开地雷
  avoidSet:function(e){
    this.setData({
      avoid: e.detail.value
    })
  },
  //让总分
  scoreChange:function(e){
    console.log(e.detail.value);
  },
  //比赛详情
  gameDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "match/detail",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        that.setData({
          gameDetail: res.data
        });
      }
    }, false);
  }
})