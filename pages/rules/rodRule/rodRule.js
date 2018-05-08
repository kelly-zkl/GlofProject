
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 1,
    handicap: true,
    avoid:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //保存设置
  saveSet: function () {

  },
  //让分
  handicapSet: function (e) {
    this.setData({
      handicap: e.detail.value
    })
  },
  //避开地雷
  avoidSet:function(e){
    this.setData({
      avoid: e.detail.value
    })
  }
})