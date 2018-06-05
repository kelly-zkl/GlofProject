// pages/team/teamDetail/teamDetail.js

const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
var drawQrcode = require('../../../utils/qrcode.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    redirect:false,
    text:'',
    showPage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      groupId: options.id,
      redirect: options.redirect ? options.redirect:false
    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          codeWidth: (res.windowWidth * 0.8 * 0.7),
          imageWidth: (res.windowWidth * 0.4)
        });
      }
    });

    this.setData({
      text: '/pages/team/teamDetail/teamDetail?id=' + this.data.groupId + '&redirect=true'
    })
    this.createQrCode(this.data.text);
    this.createsCode(this.data.text);
  },
  togglePage: function () {
    this.setData({
      showPage: !this.data.showPage
    });
  },
  //获取页面二维码
  createQrCode: function (text) {
    drawQrcode({
      width: this.data.codeWidth,
      height: this.data.codeWidth,
      canvasId: 'qrcode',
      typeNumber: 10,
      text: this.data.text,
      callback(e) {
        console.log('e: ', e)
      }
    })
  },
  createsCode: function (text) {
    drawQrcode({
      width: this.data.imageWidth,
      height: this.data.imageWidth,
      canvasId: 'myQrcode',
      typeNumber: 10,
      text: this.data.text,
      callback(e) {
        console.log('e: ', e)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGroupDetail();
  },
  //获取球队详情
  getGroupDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "group/detail",
      params: {
        groupId: that.data.groupId, uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'none', duration: 1500 });
        res.data.createTime = util.formatTime(new Date(res.data.createTime * 1000), '-');
        that.setData({
          team: res.data
        })
      }
    }, false);
  },
  //加入球队
  joinTeam:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要加入该球队？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "group/join",
            params: {
              groupId: that.data.groupId, uid: app.globalData.userInfo.id
            },
            msg: "加载中....",
            success: res => {
              wx.showToast({ title: '申请成功,待审核', icon: 'none', duration: 1500 });
              if (that.data.redirect){//分享
                wx.redirectTo({
                  url: '/pages/team/myTeam/myTeam?id=' + that.data.groupId,
                })
              }else{//搜索
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 1500)
              }
            }
          }, true);
        }
      }
    });
  },
  //分享页面
  onShareAppMessage: function (e) {
    return {
      title: 'GLOF',
      desc: this.data.team.groupName,
      path: '/pages/home/glof/glof?groupId=' + this.data.groupId,
      success: function (res) {// 转发成功
        wx.showToast({ title: '分享成功', icon: 'info', duration: 1500 })
      },
      fail: function (res) {// 转发失败
        wx.showToast({ title: '分享失败', icon: 'info', duration: 1500 })
      }
    }
  }
})