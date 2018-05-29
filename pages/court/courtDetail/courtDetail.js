
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    showPopu:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      courtId: options.id
    });
    this.getCourtDetail();
  },

  //获取球场详情
  getCourtDetail:function(){
    var that = this;
    http.postRequest({
      url: "/court/detail",
      params: {
        courtId: that.data.courtId, uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        res.data.createTime = util.formatTime(new Date(res.data.createTime*1000), '-');
        that.setData({
          court: res.data
        })
      }
    }, true);
  },
  //跳转到创建比赛页面
  createGame:function(){
    wx.navigateTo({
      url: '/pages/game/createGame/createGame'
    })
  },
  //一周天气
  togglePopu:function(){
    this.setData({
      showPopu: !this.data.showPopu
    })
  }
})