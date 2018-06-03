var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({
  data: {
    tabs: ["球队", "关注的人", "我的粉丝","同组同赛"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    refresh:false,
    teamPage:1,
    followPage: 1,
    fanPage: 1,
    gamePage: 1
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
      icon60: base64.icon60,
      userId: app.globalData.userInfo.id
    });
  },
  onShow:function(e){
    this.setData({
      teamPage: 1,
      followPage: 1,
      fanPage: 1,
      gamePage: 1
    });
    if (this.data.activeIndex == 0) {//球队
      this.getTeams();
    } else if (this.data.activeIndex == 1) {//我关注的人
      this.getFollows();
    } else if (this.data.activeIndex == 2) {//我的粉丝
      this.getFans();
    } else {//3同组同赛
      this.getGameMembers();
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
      this.getGameMembers();
    }
  },
  //获取我的球队列表
  getTeams: function (e) {
    var that = this;
    http.postRequest({
      url: "group/mine",
      params: {
        page: that.data.teamPage, size:10,uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.teamPage <= 1) {
          that.setData({
            myteams: res.data.minesGroup,
            joinsteams: res.data.joinsGroup
          })
        } else {
          that.setData({
            myteams: that.data.myteams.concat(res.data.minesGroup),
            joinsteams: that.data.joinsteams.concat(res.data.joinsGroup)
          })
        }
      }
    }, false);
  },
  //获取我的关注列表
  getFollows: function (e) {
    var that = this;
    http.postRequest({
      url: "user/following",
      params: {
        beFollowedType: "user", uid: app.globalData.userInfo.id, page: that.data.followPage,size:10
      },
      msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        that.setData({
          follows: res.data.content
        })
        if (that.data.followPage <= 1) {
          that.setData({
            follows: res.data.content
          })
        } else {
          that.setData({
            follows: that.data.follows.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  //获取我的粉丝列表
  getFans: function (e) {
    var that = this;
    http.postRequest({
      url: "user/followers",
      params: {
        uid: app.globalData.userInfo.id, page: that.data.fanPage,size: 10
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.fanPage <= 1) {
          that.setData({
            fans: res.data.content
          })
        } else {
          that.setData({
            fans: that.data.fans.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  //获取我的同组同赛列表
  getGameMembers: function (e) {
    var that = this;
    http.postRequest({
      url: "user/historyRival",
      params: {
        page: that.data.gamePage, uid: app.globalData.userInfo.id, size:10
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.gamePage <= 1) {
          that.setData({
            teamMembers: res.data.content
          })
        } else {
          that.setData({
            teamMembers: that.data.teamMembers.concat(res.data.content)
          })
        }
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
    if (this.data.activeIndex == 0) {//球队
      this.setData({
        teamPage: 1
      });
      this.getTeams();
    } else if (this.data.activeIndex == 1) {//我的关注
      this.setData({
        followPage: 1
      });
      this.getFollows();
    } else if (this.data.activeIndex == 2) {//我的粉丝
      this.setData({
        fanPage: 1
      });
      this.getFans();
    } else if (this.data.activeIndex == 3) {//同组同赛
      this.setData({
        gamePage: 1
      });
      this.getGameMembers();
    }
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    if (this.data.activeIndex == 0) {//球队
      this.setData({
        teamPage: this.data.teamPage + 1
      });
      this.getTeams();
    } else if (this.data.activeIndex == 1) {//我的关注
      this.setData({
        followPage: this.data.followPage + 1
      });
      this.getFollows();
    } else if (this.data.activeIndex == 2){//我的粉丝
      this.setData({
        fanPage: this.data.fanPage + 1
      });
      this.getFans();
    } else if (this.data.activeIndex == 3) {//同组同赛
      this.setData({
        gamePage: this.data.gamePage + 1
      })
      this.getGameMembers();
    }
  }
});
