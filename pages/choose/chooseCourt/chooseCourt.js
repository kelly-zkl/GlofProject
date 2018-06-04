
const app = getApp();
var http = require("../../../http.js");
var base64 = require("../../../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["附近", "经常"],
    showCourt:false,
    showWeather:false,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    refresh: false,
    page: 1,
    size: 10,
    latitude: '',
    longitude: '',
    zoneNames: ['A区', 'B区', 'C区', 'D区'],
    courts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      num: options.type
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.myLocation();
  },
  tabClick: function (e) {
    var that = this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0){
      that.myLocation();
    }
  },
  //获取地址位置
  myLocation:function(e){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.getCourts();
      },
      fail: function () {
        wx.showToast({ title: '定位失败', icon: 'info', duration: 1500 });
        that.getCourts();
      }
    })
  },
  //球场列表
  getCourts: function (e) {
    var that = this;
    http.postRequest({
      url: "court/query",
      params: {
        page: that.data.page, size: that.data.size,
        keyword: '', lng: that.data.longitude, lat: that.data.latitude
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 })
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.page <= 1) {
          this.setData({
            courts: res.data.content
          })
        }else{
          this.setData({
            courts: that.data.courts.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  //一周天气情况：
  toggleWeather:function(){
    this.setData({
      showWeather: !this.data.showWeather
    })
  },
  //场地弹框
  toggleCourt:function(e){
    this.setData({
      showCourt: !this.data.showCourt,
      index: e.currentTarget.id
    })
    this.setData({
      courtName: this.data.courts[this.data.index].courtName,
      zoneNames: this.data.courts[this.data.index].zoneNames
    })
  },
  //选择上半场
  chooseFront:function(e){
    this.setData({
      front: e.currentTarget.id
    })
  },
  //选择下半场
  chooseBack:function(e){
    this.setData({
      back: e.currentTarget.id
    })
  },
  //确定球场
  confirmSelect:function(e){
    
    if (e.currentTarget.id == 2){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上1个页面

      var param = { courtId: this.data.courts[this.data.index].courtId,
        frontCourt: this.data.courts[this.data.index].zoneNames[this.data.front],
        backCourt: this.data.courts[this.data.index].zoneNames[this.data.back],
        courtName: this.data.courts[this.data.index].courtName}
      //直接调用上1个页面的setData()方法，把数据存到上1个页面中去
      if (this.data.num == 1){//主球场
        prevPage.setData({
          mainCourt: param
        })
      } else if (this.data.num == 2) {//子球场1
        prevPage.setData({
          minorCourt1: param
        })
      } else if (this.data.num == 3) {//子球场2
        prevPage.setData({
          minorCourt2: param
        })
      }

      wx.navigateBack()
    }
    this.setData({
      showCourt: false,
      front: -1,
      back: -1
    })
  },
  /**
  * 下拉刷新
  */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true,
      page: 1
    });
    this.getCourts();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getCourts();
  }
})