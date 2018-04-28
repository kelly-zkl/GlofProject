// pages/team/teamDetail/teamDetail.js

const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
        wx.showToast({ title: '加载成功', icon: 'none', duration: 1500 });
        res.data.createTime = util.formatTime(new Date(res.data.createTime * 1000), '-');
        that.setData({
          team: res.data
        })
      }
    }, true);
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
            }
          }, true);
        }
      }
    });
  }
})