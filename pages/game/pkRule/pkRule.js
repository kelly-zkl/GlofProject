// pages/game/pkRule/pkRule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pkPublic:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //pk规则是否公开
  pkSet:function(e){
    var that = this;
    that.setData({
      pkPublic: e.detail.value
    });
  },
  //添加PK规则
  gotoSet:function(){
    wx.navigateTo({
      url: '/pages/game/setRule/setRule',
    })
  }
})