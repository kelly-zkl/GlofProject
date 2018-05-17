// pages/game/createGroup/createGroup.js
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

  //比赛名称
  inputName: function (e) {
    this.setData({
      groupName: e.detail.value
    });
  },

  //选择球场
  selectCourt: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
  //创建小组
  createGroup:function(e){

  }
})