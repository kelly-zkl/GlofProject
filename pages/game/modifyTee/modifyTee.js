// pages/game/modifyTee/modifyTee.js
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

  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  }
})