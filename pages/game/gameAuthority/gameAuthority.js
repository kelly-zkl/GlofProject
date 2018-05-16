// pages/game/gameAuthority/gameAuthority.js
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
  }
})