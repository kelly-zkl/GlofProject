

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioType: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //PK规则、积分卡
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
})