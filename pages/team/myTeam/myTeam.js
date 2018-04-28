var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    tabs: ["动态", "成员","队赛","资料"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
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
    that.setData({
      groupId: options.id
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGroupDetail();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //获取球队详情
  getGroupDetail:function(e){
    var that = this;
    http.postRequest({
      url: "group/detail",
      params: {
        groupId: that.data.groupId, uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        res.data.createTime = util.formatTime(new Date(res.data.createTime*1000), '-');
        that.setData({
          team: res.data
        })
      }
    }, true);
  }
});