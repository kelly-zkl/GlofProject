var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({
  data: {
    tabs: ["球队", "关注的人", "我的粉丝","同组同赛"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
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
      icon20: base64.icon20,
      icon60: base64.icon60
    });
  },
  onShow:function(e){
    if (this.data.activeIndex == 0) {//球队
      this.getTeams();
    } else if (this.data.activeIndex == 1) {//我关注的人
      this.getFollows();
    } else if (this.data.activeIndex == 2) {//我的粉丝
      this.getFans();
    } else {//3同组同赛
      this.getTeamMembers();
    }
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0){//球队
      this.getTeams();
    } else if (e.currentTarget.id == 1) {//我关注的人
      this.getFollows();
    } else if (e.currentTarget.id == 2) {//我的粉丝
      this.getFans();
    }else{//3同组同赛
      this.getTeamMembers();
    }
  },
  //获取我的球队列表
  getTeams: function (e) {
    var that = this;
    http.postRequest({
      url: "group/mine",
      params: {
        page: 1, size:10,uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          myteams: res.data.minesGroup,
          joinsteams: res.data.joinsGroup
        })
      }
    }, false);
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
          follows: res.data.content
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
        uid: app.globalData.userInfo.id,page: 1,size: 10
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          fans: res.data.content
        })
      }
    }, true);
  },
  //获取我的同组同赛列表
  getTeamMembers: function (e) {
    var that = this;
    http.postRequest({
      url: "user/historyRival",
      params: {
        page: 1, uid: app.globalData.userInfo.id, size:10
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          teamMembers: res.data.content
        })
      }
    }, true);
  },
});
