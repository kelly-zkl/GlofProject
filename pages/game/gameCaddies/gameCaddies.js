
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      gameId: options.id,
      gameName: options.gameName
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrowWidth: (res.windowWidth*0.8*0.7) + 'px'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  //添加球童
  addCad:function(){
    this.setData({
      showPage: !this.data.showPage
    })
  },

  //删除球童
  deleteCad:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该球童？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "user/cancelFollower",
            params: {
              id: e.currentTarget.id, uid: app.globalData.userInfo.id,
              beFollowedType: "match"
            },
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 })
              that.getCadds();
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  },
  //获取球童列表
  getCadds:function(){
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      showPage: false
    })
    return {
      title: 'GLOF',
      desc: this.data.gameName,
      path: '/pages/home/glof/glof?gameId=' + this.data.gameId + '&caddie=true',
      success: function (res) {// 转发成功
        wx.showToast({ title: '分享成功', icon: 'info', duration: 1500 })
      },
      fail: function (res) {// 转发失败
        wx.showToast({ title: '分享失败', icon: 'info', duration: 1500 })
      }
    }
  }
})