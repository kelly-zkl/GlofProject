
const app = getApp();
var http = require("../../../http.js");
var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["附近", "经常"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    page: 1,
    size: 10,
    latitude: '',
    longitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.myLocation();
  },
  tabClick: function (e) {
    var that = this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0){
      that.myLocation();
    }
  },
  //获取地址位置
  myLocation:function(e){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.getCourts();
      },
      fail: function () {
        wx.showToast({ title: '定位失败', icon: 'info', duration: 1500 });
        that.getCourts();
      }
    })
  },
  //球场列表
  getCourts: function (e) {
    var that = this;
    http.postRequest({
      url: "court/query",
      params: {
        page: that.data.page, size: that.data.size,
        keyword: '', lng: that.data.longitude, lat: that.data.latitude
      },
      msg: "加载中....",
      success: res => {
        that.data.show ? wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 }) : ''
        this.setData({
          courts: res.data.content
        })
      }
    }, that.data.show);
  }
})