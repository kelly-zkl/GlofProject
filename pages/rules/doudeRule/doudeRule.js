
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1:1,
    radioType:0,
    radioDing:0,
    radioShou:0,
    radioBao:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //保存设置
  saveSet: function () {

  },
  douChange:function(e){
    this.setData({
      radioType: e.currentTarget.dataset.id
    }) 
  },
  dingChange: function (e) {
    this.setData({
      radioDing: e.currentTarget.dataset.id
    }) 
  },
  shouChange: function (e) {
    this.setData({
      radioShou: e.currentTarget.dataset.id
    })
  },
  baoChange: function (e) {
    this.setData({
      radioBao: e.currentTarget.dataset.id
    })
  }
})