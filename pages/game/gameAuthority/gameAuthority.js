
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    privateSet:true,
    forbidJoin:false,
    forbidFollow:false,
    talk:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //私密模式
  privateSet:function(e){
    var that = this;
    that.setData({
      privateSet:e.detail.value
    })
  },
  //禁止他人进入比赛
  forbidJoinSet:function(e){
    var that = this;
    that.setData({
      forbidJoin: e.detail.value
    })
  },
  //禁止他人关注比赛
  forbidFollowSet:function(e){
    var that = this;
    that.setData({
      forbidFollow: e.detail.value
    })
  },
  //允许关注者发讨论区
  talkSet:function(e){
    var that = this;
    that.setData({
      talk: e.detail.value
    })
  },
  //获取设置详情
  getSetData:function(){
    var that = this;
    http.postRequest({
      url: "match/caddie/join",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "操作中...",
      success: res => {
        // wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 });
        this.setData({
          userInfo: res.data,
          gradePublic: res.data.gradePublic,
          phonePublic: res.data.phonePublic,
          wxNamePublic: res.data.wxNamePublic,
          namePublic: res.data.namePublic
        })
      }
    }, false);
  },
  //设置权限
  setGame:function(){
    var that = this;
    http.postRequest({
      url: "match/caddie/join",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "操作中...",
      success: res => {
        // wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 });
        that.gameDetail();
      }
    }, false);
  }
})