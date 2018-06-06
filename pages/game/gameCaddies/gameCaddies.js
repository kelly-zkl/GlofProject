
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 
var drawQrcode = require('../../../utils/qrcode.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage:false,
    imagePath:'',
    text:'',
    cadds: []
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
          scrowWidth: (res.windowWidth*0.8*0.7)
        });
      }
    });

    this.setData({
      text: '/pages/game/gameDetail/gameDetail?id=' + this.data.gameId + '&caddie=true'
    })
    this.createQrCode(this.data.text);

    this.getCadds();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  //获取页面二维码
  createQrCode: function (text) {
    drawQrcode({
      width: this.data.scrowWidth,
      height: this.data.scrowWidth,
      canvasId: 'myQrcode',
      typeNumber: 10,
      text: this.data.text,
      callback(e) {
        console.log('e: ', e)
      }
    })
  },
  
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
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
    var that = this;
    http.postRequest({
      url: "match/caddie/list",
      params: {matchId: that.data.gameId, uid: app.globalData.userInfo.id},
      // msg: "加载中....",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });

        that.setData({
          cadds: res.data
        })
      }
    }, false);
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
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true
    });
    this.getCadds();
  }
})