// pages/userMsg/myMsg/myMsg.js
var model = require('../../../template/model/model.js')

var show = false;
var item = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexItems: [
      { name: '男', value: 1 },
      { name: '女', value: 2, checked: true }],
    showSexPopup:false,
    item: {
      show: show
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  toggleSexPopup(){
    this.setData({
      showSexPopup: !this.data.showSexPopup
    });
  },
  sexChange: function (e) {
    var sexItems = this.data.sexItems;
    for (var i = 0, len = sexItems.length; i < len; ++i) {
      sexItems[i].checked = sexItems[i].value == e.detail.value;
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
  
  }
})