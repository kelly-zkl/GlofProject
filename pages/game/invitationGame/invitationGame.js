
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({
  data: {
    
  },
  onLoad: function (options) {
    
  },
  //费用
  inputFee:function(e){
    this.setData({
      fee: e.detail.value
    });
  },
  //奖项
  inputReward:function(e){
    this.setData({
      reward: e.detail.value
    });
  },
  //赛事规则
  inputRule:function(e){
    this.setData({
      rule: e.detail.value
    });
  },
  //pk规则
  inputPkRule:function(e){
    this.setData({
      pkrule: e.detail.value
    });
  },
  //联系人
  inputUser:function(e){
    this.setData({
      user: e.detail.value
    });
  },
  //备注
  inputDec:function(e){
    this.setData({
      desc: e.detail.value
    });
  },
  //发起约球
  inviteGame:function(e){
    var that = this;
    if (!that.data.chooseGames) {
      wx.showToast({ title: '请选择关联的比赛', icon: 'none', duration: 1500 });
      return;
    }
    http.postRequest({
      url: "match/promise",
      params: {
        matchId: that.data.chooseGames.matchId, promise: {charge: that.data.fee, awards: that.data.reward,
          matchRule: that.data.rule, pkRule: that.data.pkrule, contact: that.data.user,
          remark: that.data.desc}, uid: app.globalData.userInfo.id
      },
      msg: '创建中...',
      success: res => {
        wx.showToast({ title: '创建成功', icon: 'none', duration: 1500 })
        wx.navigateBack()
      }
    }, true);
  }
});