var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 
const app = getApp();

Page({
  data: {
    tabs: ["附近赛事", "我的赛事"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    longitude:'',
    latitude:'',
    refresh:false,
    page:1,
    totalPage:1,
    myTotalpage:2
  },
  onLoad: function (options) {
    wx.showTabBarRedDot({
      index: 2
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    if (options.userId) {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '/pages/userMsg/personalPage/personalPage?tab=1&id=' + options.userId,
      })
    }

    if (options.gameId) {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '/pages/game/gameDetail/gameDetail?id=' + options.gameId,
      })
    }
  },
  onShow:function(e){
    var that = this;
    that.setData({
      page: 1
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        if (that.data.activeIndex == 0) {//附近赛事
          that.getGames();
        } else if (that.data.activeIndex == 1) {//我的赛事
          that.getMyGames();
        }
      },
      fail: function () {
        wx.showToast({ title: '定位失败', icon: 'info', duration: 1500 });
        if (that.data.activeIndex == 0) {//附近赛事
          that.getGames();
        } else if (that.data.activeIndex == 1) {//我的赛事
          that.getMyGames();
        }
      }
    })
  },
  //标签页 附近赛事--我的赛事
  tabClick: function (e) {
    var that = this;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        if (e.currentTarget.id == 0) {//附近赛事
          that.getGames();
        } else if (e.currentTarget.id == 1) {//我的赛事
          that.getMyGames();
        }
      },
      fail: function () {
        wx.showToast({ title: '定位失败', icon: 'info', duration: 1500 });
        if (e.currentTarget.id == 0) {//附近赛事
          that.getGames();
        } else if (e.currentTarget.id == 1) {//我的赛事
          that.getMyGames();
        }
      }
    })
  },
  //扫一扫
  scan: function (e) {
    wx.scanCode({
      success: (res) => {
        console.log("扫码结果" + res);

      },
      fail: (res) => {
        console.log("扫码失败" + res);
      }
    })
  },
  //获取附近赛事列表
  getGames:function(e){
    var that = this;
    http.postRequest({
      url: "match/query",
      params: {
        lng: that.data.longitude, lat: that.data.latitude, page: that.data.page, size: 10, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-',true)
        })
        if (that.data.page <= 1) {
          that.setData({
            games: res.data.content
          })
        } else {
          that.setData({
            games: that.data.games.concat(res.data.content)
          })
        }
        that.setData({
          totalPage: res.data.totalPages
        })
      }
    }, false);
  },
  //我的赛事列表
  getMyGames:function(){
    var that = this;
    http.postRequest({
      url: "match/user/home",
      params: {
        uid: app.globalData.userInfo.id, lng: that.data.longitude, lat: that.data.latitude
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh){
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
        })
        that.setData({
          myGames: res.data
        })
      }
    }, false);
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh:true
    });
    if (this.data.activeIndex == 0) {//附近赛事
      this.setData({
        page: 1
      });
      this.getGames();
    } else if (this.data.activeIndex == 1) {//我的赛事
      this.getMyGames();
    }
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    if (this.data.activeIndex == 0) {//附近赛事
      this.setData({
        page: this.data.page + 1
      });
      this.getGames();
    }
  }
});