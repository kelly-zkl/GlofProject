
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 1,
    radioType: 5,
    radioDing: 0,
    radioShou: 0,
    avoid:true
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
          leftPosition: 50 - (3600 / ((res.windowWidth - 30) / (that.data.players.length))) + '%'
        });
      }
    });
  },
  //设置老虎
  changeTiger:function(e){
    console.log(e.detail.value);
    var idx = e.detail.value;
    var tiger = this.data.players[idx].userId;
    this.setData({
      tiger: tiger
    });
  },
  //基本单位
  numberChange: function (e) {
    this.setData({
      number1: e.detail.value
    })
  },
  //分类 比洞/杆
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
  //顶洞
  dingChange: function (e) {
    this.setData({
      radioDing: e.currentTarget.dataset.id
    })
  },
  //收顶洞
  shouChange: function (e) {
    this.setData({
      radioShou: e.currentTarget.dataset.id
    })
  },
  //避开地雷
  avoidSet: function (e) {
    this.setData({
      avoid: e.detail.value
    })
  },
  //保存设置
  saveSet: function () {
    var that = this;
    var pkPlayers = [];
    (that.data.players).map(function (item, idx) {
      pkPlayers[idx] = item.userId;
    })

    if (!that.data.number1) {
      wx.showToast({ title: '请输入基本单位', icon: 'none', duration: 1500 });
      return;
    }
    if (!that.data.tiger) {
      wx.showToast({ title: '请选择老虎', icon: 'none', duration: 1500 });
      return;
    }
    http.postRequest({
      url: "match/pkRuleAdd",
      params: {
        matchId: that.data.gameId, uid: app.globalData.userInfo.id, pkRuleDTL: {
          modeName: '打老虎', thgMode: that.data.radioShou, landlord: that.data.tiger,
          mode: 40, graUnit: that.data.number1, ups: that.data.avoid, classify: that.data.radioType,
          pkPlayers: pkPlayers, thMode: that.data.radioDing
        }
      },
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1000 })
        setTimeout(function () {
          wx.navigateBack()
        }, 1000)
      }
    }, true);
  }
})