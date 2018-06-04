
var http = require("../../../http.js");
var app = getApp();

Page({
  data: {
    selectedAllStatus: false,
    inputShowed: false,
    inputVal: "",
    members: []
  },
  onLoad: function (options) {

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    if (e.detail.value.length > 0) {
      this.getUsers();
    }
  },
  //用户搜索
  getUsers: function (e) {
    var that = this;
    http.postRequest({
      url: "user/query",
      params: { keyword: that.data.inputVal },
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        this.setData({
          members: res.data.content
        })
      }
    }, false);
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
  confirm: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上个页面

    var memArr = [];

    (this.data.members).map(function (item) {
      if (item.selected) {
        memArr.push(item)
      }
    })

    //直接调用上2个页面的setData()方法，把数据存到上2个页面中去
    prevPage.setData({
      chooseMembers: prevPage.data.chooseMembers.concat(memArr)
    })
    prevPage.addMembers();
    wx.navigateBack()
  }
});