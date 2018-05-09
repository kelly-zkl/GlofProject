
const app = getApp();
var http = require("../../../http.js");
var base64 = require("../../../images/base64");

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
    if (options.id == 1) {//同队球友
      this.getFollows();
    } else if (options.id == 2) {//互相关注的球友
      this.getFans();
    } else if (options.id == 3) {// 历史同赛的球友
      this.getTeamMembers();
    } else if (options.id == 4) {

    } else if (options.id == 5) {

    }
  },
  //获取我的关注列表
  getFollows: function (e) {
    var that = this;
    http.postRequest({
      url: "user/following",
      params: {
        beFollowedType: "user", uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          members: res.data.content
        })
      }
    }, true);
  },
  //获取我的粉丝列表
  getFans: function (e) {
    var that = this;
    http.postRequest({
      url: "user/followers",
      params: {
        uid: app.globalData.userInfo.id, page: 1, size: 10
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          members: res.data.content
        })
      }
    }, true);
  },
  //获取我的同组同赛列表
  getTeamMembers: function (e) {
    var that = this;
    http.postRequest({
      url: "user/following",
      params: {
        beWatchType: "user", uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          members: res.data.content
        })
      }
    }, true);
  }
})