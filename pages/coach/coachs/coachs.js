// pages/court/courts/courts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    page:1,
    size:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  /**
 * 下拉刷新
 */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true,
      page: 1
    });
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
  }
})