var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
var app = getApp();

Page({
  data: {
    tabs: ["找人", "找球队"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    inputShowed: false,
    inputVal: "",
    users:[],
    teams:[]
  },
  onLoad: function (options) {
    this.setData({
      activeIndex:options.tab,
      userName: app.globalData.userInfo.name,
      userId: app.globalData.userInfo.id
    });
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
    if (e.detail.value.length > 0){
      if (this.data.activeIndex == 0) {
        this.getUsers();
      } else {
        this.getTeams();
      }
    }
  },
  //用户搜索
  getUsers: function (e) {
    var that = this;
    http.postRequest({
      url: "user/query",
      params: {keyword: that.data.inputVal},
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        this.setData({
          users: res.data.content
        })
      }
    }, false);
  },
  //搜索球队
  getTeams: function (e) {
    var that = this;
    http.postRequest({
      url: "group/query",
      params: { keyword: that.data.inputVal, uid: app.globalData.userInfo.id },
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          teams: res.data.content
        })
      }
    }, false);
  },
  //扫一扫
  scan: function (e) {
    wx.scanCode({
      scanType: ['qrCode'],
      success: (res) => {
        console.log(res);
        wx.showToast({ title: '扫描成功', icon: 'info', duration: 1500 })
        if (res.result && res.result.indexOf('/pages/') == 0) {
          wx.navigateTo({ url: res.result })
        }
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({ title: '扫描失败', icon: 'info', duration: 1500 })
      }
    })
  },
  //分享页面
  onShareAppMessage: function () {
    return {
      title: 'GLOF',
      desc: this.data.userName + "的主页",
      path: '/pages/home/glof/glof?userId=' + this.data.userId,
      success: function (res) {// 转发成功
        wx.showToast({ title: '分享成功', icon: 'info', duration: 1500 })
      },
      fail: function (res) {// 转发失败
        wx.showToast({ title: '分享失败', icon: 'info', duration: 1500 })
      }
    }
  }
});