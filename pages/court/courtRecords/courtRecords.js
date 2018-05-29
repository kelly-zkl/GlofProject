
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

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
  onShow:function(){
    this.getCourts();
  },
  //球场记录
  getCourts:function(){
    var that = this;
    http.postRequest({
      url: "court/user/record",
      params: {
        page: 1, size: 10, uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          courts: res.data.content
        })
      }
    }, true);
  }
})