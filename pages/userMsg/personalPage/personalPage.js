var http = require("../../../http.js");
const app = getApp();
var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var util = require('../../../utils/util.js'); 

Page({
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    tabs: ["动态", "相册","视频"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    showReply: false,
    showDelete: false,
    userInfo: {},
    person:0,
    createId:"",
    dynamics:[],
    imageWidth: '0px',
    userId:"",
    refresh:false,
    page:1,
    size:10,
    idx:1
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      person:options.tab,
      createId:options.id
    });
    wx.setNavigationBarTitle({
      title: that.data.person == 0 ? "我的主页" :"球友主页"
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: ((res.windowWidth - 86) / 3) + 'px',
        });
      }
    });
    that.setData({
      icon20: base64.icon20,
      icon60: base64.icon60,
      male: '../../../images/icon_male.png',
      female: '../../../images/icon_female.png',
      userId: app.globalData.userInfo.id
    })
  },
  onShow:function(e){
    this.setData({
      page: 1
    });
    this.getUserInfo();
    this.getDynamics();
  },
  //获取动态列表
  getDynamics: function (e) {
    var that = this;
    http.postRequest({
      url: "userPost/homePage",
      params: {
        creatorId: that.data.createId, page: that.data.page, size: that.data.size,
        belongType: "user", uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.createTime), '-', true)
        })
        if (that.data.page <= 1) {
          that.setData({
            dynamics: res.data.content
          })
        } else {
          that.setData({
            dynamics: that.data.dynamics.concat(res.data.content)
          })
        }
      }
    },false);
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.urls // 需要预览的图片http链接列表
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //跳转到发动态页面
  gotoPost:function(){
    wx.navigateTo({
      url: '/pages/userMsg/sendDynamic/sendDynamic?type=user',
    })
  },
  //跳转到个人主页
  gotoPer:function(e){
    if (e.currentTarget.id != app.globalData.userInfo.id) {//本人的动态
      wx.navigateTo({
        url: '/pages/userMsg/personalPage/personalPage?tab=0&id=' + e.currentTarget.id,
      })
    }
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
  //获取用户信息
  getUserInfo:function(){
    var that = this;
    http.postRequest({
      url: "user/detail",
      params: { uid: app.globalData.userInfo.id, id: that.data.createId},
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        that.setData({
          userInfo: res.data
        })
      }
    }, false);
  },
  //关注用户
  followPerson:function(e){
    var that = this;
    http.postRequest({
      url: "user/addFollower",
      params: { beFollowedId: that.data.createId, beFollowedType: "user", uid: app.globalData.userInfo.id },
      msg:"加载中...",
      success: res => {
        this.getUserInfo();
        wx.showToast({ title: '关注成功', icon: 'info', duration: 1500 })
      }
    }, true);
  },
  //取消关注用户
  unfollowPerson: function (e) {
    var that = this;
    http.postRequest({
      url: "user/cancelFollower",
      params: { id: that.data.userInfo.followedId, uid: app.globalData.userInfo.id,
        beFollowedType:"user" },
      msg: "加载中...",
      success: res => {
        this.getUserInfo();
        wx.showToast({ title: '已取消关注', icon: 'info', duration: 1500 })
      }
    }, true);
  },
  //聊天
  chatPage:function(e){
    wx.navigateTo({
      url: '/pages/team/chatDetail/chatDetail',
    })
  },
  //删除动态
  deleteDyna:function(e){
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
  deleteReply:function(value){
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
  createReply:function(e){
    var that = this;
    if (e.detail.value.length > 0){
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
  pressReply:function(e){
    console.log(e);
    if (e.currentTarget.dataset.replyId){//有评论id
      if (e.currentTarget.dataset.uid == app.globalData.userInfo.id) {//本人的动态
        this.setData({
          showDelete: true,
          userPostId: e.currentTarget.id,
          beReplyPostId: e.currentTarget.dataset.replyId
        });
      }else{//自己的评论可删除
        this.setData({
          showReply: true,
          userPostId: e.currentTarget.id,
          beReplyPostId: e.currentTarget.dataset.replyId
        });
      }
    }else{//没有评论的时候，只能评论
      this.setData({
        showReply: true,
        userPostId: e.currentTarget.id,
        beReplyPostId: e.currentTarget.dataset.replyId
      });
    }
  },
  //点赞
  userVote:function(e){
    http.postRequest({
      url: "userPost/vote",
      params: {
        bbsId: e.currentTarget.id, uid: app.globalData.userInfo.id, voted: e.currentTarget.dataset.voted
      },
      success: res => {
        this.getDynamics();
      }
    }, false);
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true
    });
    
    this.setData({
      page: 1
    });
    this.getDynamics();
    this.getUserInfo();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getDynamics();
  },
  //分享页面
  onShareAppMessage: function () {
    return {
      title: 'GLOF',
      desc: this.data.userInfo.name+"的主页",
      path: '/pages/home/glof/glof?userId=' + this.data.userInfo.id,
      success: function (res) {// 转发成功
        wx.showToast({ title: '分享成功', icon: 'info', duration: 1500 })
      },
      fail: function (res) {// 转发失败
        wx.showToast({ title: '分享失败', icon: 'info', duration: 1500 })
      }
    }
  }
})