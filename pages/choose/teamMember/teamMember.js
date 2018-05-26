
const app = getApp();
var http = require("../../../http.js");
var base64 = require("../../../images/base64");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    members: [{ selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false },
    { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }],
    selectedAllStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id == 1) {//同队球友
      this.setData({
        teamId: id
      });
    }
  },
  //获取我的关注列表
  getTeamMembers: function (e) {
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
  //选择成员
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
    this.judgeSelect();
  },
  //判断是不是全选
  judgeSelect: function () {
    var select = true;
    (this.data.members).map(function (item) {
      if (!item.selected) {
        select = false;
        return;
      }
    })
    this.setData({
      selectedAllStatus: select
    });
  },
  //确认选择球队球员
  confirm:function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 3];  //上2个页面

    var memArr = [];
    (this.data.members).map(function (item) {
      if (item.selected){
        memArr.push(item)
      }
    })

    //直接调用上2个页面的setData()方法，把数据存到上2个页面中去
    prevPage.setData({
      chooseMembers: memArr
    })
    wx.navigateBack({
      delta: 2
    })
  }
})