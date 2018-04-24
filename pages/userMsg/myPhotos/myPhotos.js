var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置


Page({
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    tabs: ["照片", "视频"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function (options) {
    this.setData({
      activeIndex: options.tab,
    });
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
  }
});