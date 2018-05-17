// pages/game/groupList/groupList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  //荣誉榜、红蓝游戏榜
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
})