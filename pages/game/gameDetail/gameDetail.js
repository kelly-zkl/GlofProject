var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    showPopup: true,
    tabs: ["赛事", "互动区","照片墙"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
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
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  followGame() {//关注比赛
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  joinGame() {//加入比赛
    this.setData({
      showPopup: !this.data.showPopup
    });
  }
});