var http = require("../../../http.js");
const app = getApp();
var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    tabs: ["动态", "相册","视频"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    userInfo: {},
    person:0,
    createId:"",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dynamics:[],
    page:1,
    size:10
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
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    if (app.globalData.userInfo) {
      that.setData({
        icon20: base64.icon20,
        icon60: base64.icon60,
        userInfo: app.globalData.userInfo
      })
    }
  },
  onShow:function(e){
    this.getDynamics();
  },
  getDynamics: function (e) {
    var that = this;
    http.postRequest({
      url: "userPost/homePage",
      params: {
        creatorId: that.data.createId, page: that.data.page, size: that.data.size,
        belongType: "user", uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        this.setData({
          dynamics : res.data.content
        })
      }
    }, true);
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  gotoPost:function(){
    wx.navigateTo({
      url: '/pages/userMsg/sendDynamic/sendDynamic?type=user',
    })
  }
})