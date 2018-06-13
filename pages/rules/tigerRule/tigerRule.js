
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 1,
    radioType: 0,
    radioDing: 0,
    radioShou: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var arr = JSON.parse(options.player);
    that.setData({
      gameId: options.id,
      // ruleId: options.ruleId,
      players: arr
    })

    // wx.setNavigationBarTitle({
    //   title: this.data.ruleId == 1 ? "比杆" : "修改规则"
    // })
    // if (this.data.ruleId != 1) {
    //   this.getPkDetail();
    // }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          leftPosition: 50 - (3500 / ((res.windowWidth * 0.9 - 30) / (that.data.players.length))) + '%'
        });
      }
    });
  },
  
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
  dingChange: function (e) {
    this.setData({
      radioDing: e.currentTarget.dataset.id
    })
  },
  shouChange: function (e) {
    this.setData({
      radioShou: e.currentTarget.dataset.id
    })
  },
  //设置老虎
  radioChange: function (e) {
    console.log(e);
  },
  //保存设置
  saveSet: function () {

  },
})