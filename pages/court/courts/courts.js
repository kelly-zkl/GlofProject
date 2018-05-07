// pages/court/courts/courts.js

const app = getApp();
var http = require("../../../http.js");
var base64 = require("../../../images/base64");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    page:1,
    size:10,
    latitude:'',
    longitude:'',
    show:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      fail:function(){
        wx.showToast({ title: '定位失败', icon: 'info', duration: 1500 });
        that.getCourts();
      }
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      show: false
    });
    this.getCourts();
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      show: false
    });
    this.getCourts();
  },
  inputTyping: function (e) {
    console.log(e.detail.value);
    this.setData({
      inputVal: e.detail.value,
      show:false
    });
    if (e.detail.value.length > 0){
      this.getCourts();
    }
  },
  getCourts:function(e){
    var that = this;
    http.postRequest({
      url: "court/query",
      params: {
        page: that.data.page, size: that.data.size,
        keyword: that.data.inputVal, lng: that.data.longitude, lat: that.data.latitude
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