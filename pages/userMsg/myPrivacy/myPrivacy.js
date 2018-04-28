// pages/userMsg/myPrivacy/myPrivacy.js

var http = require("../../../http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    gradePublic:true,
    phonePublic:true,
    wxNamePublic:true,
    namePublic:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      uid: options.id
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
  },
  //获取用户信息
  getUserInfo:function(){
    var that = this;
    http.postRequest({
      url: "user/detail",
      params: { uid: that.data.uid, id: that.data.uid},
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        this.setData({
          userInfo: res.data
        })
      }
    }, false);
  },
  //手机号公开设置
  phoneSet: function (e) {
    var that = this;
    that.setData({
      phonePublic: e.detail.value
    });
    this.setPrivacy();
  },
  //成绩公开设置
  scoreSet: function (e) {
    var that = this;
    that.setData({
      gradePublic: e.detail.value
    });
    this.setPrivacy();
  },
  //微信名公开设置
  wxnameSet: function (e) {
    var that = this;
    that.setData({
      wxNamePublic: e.detail.value
    });
    this.setPrivacy();
  },
  //昵称公开设置
  nicknameSet: function (e) {
    var that = this;
    that.setData({
      namePublic: e.detail.value
    });
    this.setPrivacy();
  },
  //隐私设置
  setPrivacy:function(e){
    var that = this;
    http.postRequest({
      url: "user/update",
      params: {
        phonePublic: that.data.phonePublic, wxNamePublic: that.data.wxNamePublic,
        namePublic: that.data.namePublic, gradePublic: that.data.gradePublic, uid: that.data.uid},
      msg:"设置中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 })
      }
    }, true);
  }
})