
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 1,
    games: [],
    members: [],
    selectedAllStatus: false,
    isTeam: false,
    page:1,
    refresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isTeam: options.type ? options.type == 'team' ? true : false : false
    })
    this.getGames();
  },
  //赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "match/user/joined",
      params: {
        page: that.data.page, size: 10, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        (res.data.content || []).map(function (item) {
          item.timeStr = util.formatTime(new Date(item.startTime), '-', true)
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
      }
    }, false);
  },
  //获取参赛选手
  getMembers:function(){
    var that = this;
    http.postRequest({
      url: "match/players",
      params: {
        uid: app.globalData.userInfo.id, matchId: that.data.matchId
      },
      // msg: "加载中....",
      success: res => {
        // that.data.show ? wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 }) : ''
        this.setData({
          members: res.data
        })
      }
    }, false);
  },
  //选择成员
  changeIndex: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
    wx.setNavigationBarTitle({
      title: e.currentTarget.id == 1 ? "选择比赛" : "选择球员"
    })
    if (e.currentTarget.id == 2){
      this.setData({
        matchId: e.currentTarget.dataset.id
      });
      this.getMembers();
    }
  },
  //选择比赛
  bindCheckbox: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var selected = this.data.members[index].selected;
    var members = this.data.members;
    if (!selected) {
      // this.setData({
      // });
    } else {
      // this.setData({
      // });
    }

    members[index].selected = !selected;

    this.setData({
      members: members
    });
    this.judgeSelect();
  },
  //判断是不是全选
  judgeSelect:function(){
    var select = true;
    (this.data.members).map(function (item) {
      if (!item.selected){
        select = false;
        return;
      }
    })
    this.setData({
      selectedAllStatus: select
    });
  },
  //全选 全不选
  bindSelectAll: function (e) {
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    var members = this.data.members;
    (members).map(function (item) {
      item.selected = selectedAllStatus
    })

    this.setData({
      members: members,
      selectedAllStatus: selectedAllStatus
    });
  },
  //确认选择球队球员
  confirm: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上2个页面

    var memArr = [];
    (this.data.members).map(function (item) {
      if (item.selected) {
        item.id = item.userId,
        memArr.push(item)
      }
    })

    //直接调用上2个页面的setData()方法，把数据存到上2个页面中去
    prevPage.setData({
      chooseMembers: prevPage.data.chooseMembers.concat(memArr)
    })
    if (this.data.isTeam) {//球队导入比赛成员
      prevPage.addMembers();
    }
    wx.navigateBack()
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true
    });
    if (this.data.activeIndex == 1){//赛事列表
      this.setData({
        page: this.data.page + 1
      });
      this.getGames();
    }else{//赛事成员
      this.getMembers
    }
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    if (this.data.activeIndex == 1){
      this.setData({
        page: this.data.page + 1
      });
      this.getGames();
    }
  }
})