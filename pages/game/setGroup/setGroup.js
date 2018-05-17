// pages/game/setGroup/setGroup.js
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
  //红蓝游戏
  gameChange:function(e){
    this.setData({
      gameType: e.currentTarget.dataset.id
    })
  },
  //选择球场
  selectCourt: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
  //选择小组
  selectGroup: function (e) {
    this.setData({
      groupType: e.currentTarget.dataset.id
    })
  },
  //选择TEE台
  douChange: function (e) {
    this.setData({
      teeType: e.currentTarget.dataset.id
    })
  },
  //保存设置
  save:function(){
    
  }
})