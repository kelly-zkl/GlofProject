
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pkPublic:false,
    showPopup:false,
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
  //选择起始洞
  togglePopup(e) {
    this.setData({
      showPopup: !this.data.showPopup,
      title: e.currentTarget.dataset.title
    });
  },
  selecHole:function(e){
    this.setData({
      hole: e.currentTarget.dataset.id
    });
  },
  confirmChoose:function(e){
    
  },
  //pk规则是否公开
  pkSet:function(e){
    var that = this;
    that.setData({
      pkPublic: e.detail.value
    });
    that.saveSet();
  },
  //添加PK规则
  gotoSet:function(){
    wx.navigateTo({
      url: '/pages/rules/setRule/setRule?id=' + this.data.gameId,
    })
  },
  //设置起始洞、地雷、让洞
  saveSet:function(e){
    var that = this;
    var pk = { open: that.data.pkPublic, joinHold: [], bomHold: [], startPos:0}
    http.postRequest({
      url: "/match/pkRule",
      params: {matchId: that.data.gameId, uid: app.globalData.userInfo.id,pk:pk },
      msg: "设置中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1500})
      }
    }, true);
  },
  //比赛详情
  gameDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "match/detail",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        this.setData({
          gameDetail: res.data
        });
      }
    }, false);
  },
  //虎丘规则列表
  getRuleList:function(){
    var that = this;
    http.postRequest({
      url: "match/pkRuleList",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        this.setData({
          rules: res.data.pk.pkMode
        });
      }
    }, false);
  }
})