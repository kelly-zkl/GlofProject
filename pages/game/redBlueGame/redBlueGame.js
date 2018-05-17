// pages/game/redBlueGame/redBlueGame.js
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

  //选择游戏规则
  selectRule: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
  //红队名称
  redName:function(e){
    this.setData({
      redName: e.detail.value
    })
  },
  //蓝队名称
  blueName: function (e) {
    this.setData({
      blueName: e.detail.value
    })
  }
})