const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    showReply: false,
    showDelete: false,
    imageWidth: '0px',
    dynamics: [],
    page: 1,
    size: 10
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: ((res.windowWidth - 86) / 3) + 'px',
        });
      }
    });
  },
  onShow: function (e) {
    this.getUserInfo();
    this.getDynamics();
  },
  //获取球友动态
  getDynamics: function (e) {
    var that = this;
    http.postRequest({
      url: "userPost/followingPage",
      params: {
        page: that.data.page, size: that.data.size,
        belongType: "user", uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.createTime), '-', true)
        })
        this.setData({
          dynamics: res.data.content
        })
      }
    }, false);
  },
  //获取用户信息
  getUserInfo: function (e) {
    var that = this;
    http.postRequest({
      url: "user/detail",
      params: { uid: app.globalData.userInfo.id, id: app.globalData.userInfo.id },
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        this.setData({
          userInfo: res.data
        })
      }
    }, false);
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.urls // 需要预览的图片http链接列表
    })
  },
  //跳转到发动态页面
  gotoPost: function () {
    wx.navigateTo({
      url: '/pages/userMsg/sendDynamic/sendDynamic?type=user',
    })
  },
  //跳转到个人主页
  gotoPer: function (e) {
    wx.navigateTo({
      url: '/pages/userMsg/personalPage/personalPage?tab=0&id=' + e.currentTarget.id,
    })
  },
  //跳转到比赛详情页
  gotoGame: function (e) {
    wx.navigateTo({
      url: '/pages/game/gameDetail/gameDetail?id=' + e.currentTarget.id,
    })
  },
  //跳转到球队主页
  gotoTeam: function (e) {
    wx.navigateTo({
      url: '/pages/team/teamDetail/teamDetail?id=' + e.currentTarget.id,
    })
  },
  //删除动态
  deleteDyna: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该动态？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "userPost/delete",
            params: {
              id: e.currentTarget.id, uid: app.globalData.userInfo.id
            },
            msg: "操作中...",
            success: res => {
              that.getDynamics();
              wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 })
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  },
  //删除回复
  deleteReply: function (value) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该回复？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "replyPost/delete",
            params: {
              replyPostId: that.data.beReplyPostId, uid: app.globalData.userInfo.id
            },
            msg: "操作中...",
            success: res => {
              that.getDynamics();
              wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 })
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  },
  toggleDelete() {
    this.setData({
      showDelete: !this.data.showDelete
    });
  },
  deleteChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {//删除评论
      that.deleteReply();
    }
    that.setData({
      showDelete: false
    });
  },
  //创建回复
  createReply: function (e) {
    var that = this;
    if (e.detail.value.length > 0) {
      http.postRequest({
        url: "replyPost/create",
        params: {
          userPostId: that.data.userPostId, uid: app.globalData.userInfo.id, content: e.detail.value,
          beReplyPostId: that.data.beReplyPostId
        },
        msg: "操作中...",
        success: res => {
          that.getDynamics();
        }
      }, true);
    }
    that.setData({
      showReply: false
    });
  },
  toggleReply() {
    this.setData({
      showReply: !this.data.showReply
    });
  },
  pressReply: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.replyId) {//有评论id
      if (e.currentTarget.dataset.uid == app.globalData.userInfo.id) {//本人的动态
        this.setData({
          showDelete: true,
          userPostId: e.currentTarget.id,
          beReplyPostId: e.currentTarget.dataset.replyId
        });
      } else {//自己的评论可删除
        this.setData({
          showReply: true,
          userPostId: e.currentTarget.id,
          beReplyPostId: e.currentTarget.dataset.replyId
        });
      }
    } else {//没有评论的时候，只能评论
      this.setData({
        showReply: true,
        userPostId: e.currentTarget.id,
        beReplyPostId: e.currentTarget.dataset.replyId
      });
    }
  },
  //点赞
  userVote: function (e) {
    http.postRequest({
      url: "userPost/vote",
      params: {
        bbsId: e.currentTarget.id, uid: app.globalData.userInfo.id, voted: e.currentTarget.dataset.voted
      },
      success: res => {
        this.getDynamics();
      }
    }, false);
  }
})