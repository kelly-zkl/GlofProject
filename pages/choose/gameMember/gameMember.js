// pages/team/importGameMem/importGameMem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 1,
    games: [0, 12, 3, 4, 5, 6, 7, 8, 9],
    members: [{ selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false },
    { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }],
    selectedAllStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //赛事列表
  getGames: function (e) {
    var that = this;
    http.postRequest({
      url: "court/query",
      params: {
        page: that.data.page, size: that.data.size,
        keyword: '', lng: that.data.longitude, lat: that.data.latitude
      },
      msg: "加载中....",
      success: res => {
        that.data.show ? wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 }) : ''
        this.setData({
          games: res.data.content
        })
      }
    }, that.data.show);
  },
  //选择成员
  changeIndex: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
    wx.setNavigationBarTitle({
      title: e.currentTarget.id == 1 ? "选择比赛" : "选择球员"
    })
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
        memArr.push(item)
      }
    })

    //直接调用上2个页面的setData()方法，把数据存到上2个页面中去
    prevPage.setData({
      chooseMembers: prevPage.data.chooseMembers.concat(memArr)
    })
    wx.navigateBack()
  }
})