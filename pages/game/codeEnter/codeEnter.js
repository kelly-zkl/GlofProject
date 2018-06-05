
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  //输入比赛编码
  inputCode:function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  //进入比赛
  getGame:function(){
    var that = this;
    if (that.data.inputValue.length < 6) {
      wx.showToast({title: '请输入6位比赛编码', icon: 'none', duration: 1500});
      return;
    }
    http.postRequest({
      url: "match/detailBySerial",
      params: {serial: that.data.inputValue, uid: app.globalData.userInfo.id},
      msg: "操作中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 });
        wx.navigateTo({
          url: '/pages/game/gameDetail/gameDetail?id=' + res.data.matchId,
        })
      }
    }, true);
  }
})