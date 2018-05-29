// pages/userMsg/myMsg/myMsg.js
var model = require('../../../template/model/model.js')
var http = require("../../../http.js");

var show = false;
var item = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexItems: [
      { name: '未知', value: 0 },
      { name: '男', value: 1 },
      { name: '女', value: 2, checked: true }],
    showSexPopup:false,
    showInput:false,
    item: {
      show: show
    },
    tags:[]
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
  //获取用户信息
  getUserInfo: function () {
    var that = this;
    http.postRequest({
      url: "user/detail",
      params: { uid: that.data.uid, id: that.data.uid},
      msg:'加载中...',
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'success', duration: 1500 });
        var sexItems = this.data.sexItems;
        for (var i = 0, len = sexItems.length; i < len; ++i) {
          sexItems[i].checked = sexItems[i].value == res.data.gender;
        }

        this.setData({
          userInfo: res.data,
          name: res.data.name,
          gender: res.data.gender,
          phone: res.data.phone,
          golfAge: res.data.golfAge,
          golfHandicap: res.data.golfHandicap,
          selfIntroduce: res.data.selfIntroduce,
          province: res.data.province,
          city: res.data.city,
          sexItems: sexItems,
          showSexPopup: false,
          tags: res.data.tags
        });
      }
    }, true);
  },
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  showArea: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },
  //确定选择
  chooseCity:function(e){
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    // console.log(e)
    model.updateAreaData(this, 1, e);
    item = this.data.item;
  },
  //性别选择
  toggleSexPopup(){
    this.setData({
      showSexPopup: !this.data.showSexPopup
    });
  },
  sexChange: function (e) {
    var sexItems = this.data.sexItems;
    for (var i = 0, len = sexItems.length; i < len; ++i) {
      sexItems[i].checked = sexItems[i].value == e.detail.value;
      if (sexItems[i].value == e.detail.value){
        this.setData({
          gender: sexItems[i].value
        });
      }
    }

    this.setData({
      sexItems: sexItems,
      showSexPopup:false
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onShow:function(e){
    this.getUserInfo();
  },
  //修改昵称/用户名
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  //修改手机号
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  //修改球龄
  inputAge: function (e) {
    this.setData({
      golfAge: e.detail.value
    });
  },
  //修改差点
  inputCap: function (e) {
    this.setData({
      golfHandicap: e.detail.value
    });
  }, 
  //个人简介
  inputIntroduce: function(e) {
    this.setData({
      selfIntroduce: e.detail.value
    });
  }, 
  //添加标签
  inputTag:function(e){
    var arr = this.data.tags || [];
    if (e.detail.value.length > 0){
      arr.push(e.detail.value);
      this.setData({
        tags: arr
      });
    }
    this.setData({
      showInput: false
    });
  },
  showInput:function(e){
    this.setData({
      showInput: true
    });
  },
  //保存修改的用户信息
  saveUserInfo:function(e){
    var that = this;
    if (!that.data.name || !that.data.phone || !that.data.golfAge || !that.data.golfHandicap || 
      !that.data.tags || !that.data.selfIntroduce || !that.data.province || !that.data.city ||
      !that.data.gender){
      wx.showToast({ title: '请完善用户信息', icon: 'none', duration: 1500 });
      return;
    }
    http.postRequest({
      url: "user/update",
      params: {
        name: that.data.name, phone: that.data.phone, golfAge: that.data.golfAge, 
        golfHandicap: that.data.golfHandicap, tags: that.data.tags, selfIntroduce: that.data.selfIntroduce,
        province: that.data.province, city: that.data.city, gender: that.data.gender,uid: that.data.uid },
      msg: '修改中...',
      success: res => {
        wx.showToast({ title: '修改成功', icon: 'info', duration: 1500 })
        wx.navigateBack({
          delta: 1
        })
      }
    }, true);
  }
})