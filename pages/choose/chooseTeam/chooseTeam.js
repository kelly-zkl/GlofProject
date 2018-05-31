
var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTeams();
    this.setData({
      pageNum: options.type
    })
  },

  //获取我的球队列表
  getTeams: function (e) {
    var that = this;
    http.postRequest({
      url: "group/mine",
      params: {
        page: 1, size: 10, uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          myteams: res.data.minesGroup,
          joinsteams: res.data.joinsGroup
        })
      }
    }, true);
  },
  //选择球队/球友
  gotoNext:function(e){
    console.log(e);
    if (this.data.pageNum == 1){//球队
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上1个页面

      //直接调用上2个页面的setData()方法，把数据存到上1个页面中去
      prevPage.setData({
        chooseTeam: e.currentTarget.dataset.tea
      })
      wx.navigateBack()
    }else{//球友
      wx:wx.navigateTo({
        url: '/pages/choose/teamMember/teamMember?id=' + e.currentTarget.id
      })
    }
  }
})