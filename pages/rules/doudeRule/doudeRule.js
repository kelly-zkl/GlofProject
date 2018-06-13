
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1:1,
    radioType:0,
    radioDing:0,
    radioShou:0,
    radioBao:0,
    avoid: true
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
          leftPosition: 50 - (3500 / ((res.windowWidth-30) / (that.data.players.length))) + '%'
        });
      }
    });
  },
  //选择地主
  chooseDou:function(e){
    console.log(e.detail.value);
    var idx = e.detail.value;
    var landlord = this.data.players[idx].userId;
    this.setData({
      landlord: landlord
    });
  },
  //基本单位
  numberChange: function (e) {
    this.setData({
      number1: e.detail.value
    })
  },
  //避开地雷
  avoidSet: function (e) {
    this.setData({
      avoid: e.detail.value
    })
  },
  //分类 斗第一/2名
  douChange:function(e){
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
  //包洞
  baoChange: function (e) {
    this.setData({
      radioBao: e.currentTarget.dataset.id
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
    if (!that.data.landlord) {
      wx.showToast({ title: '请选择地主', icon: 'none', duration: 1500 });
      return;
    }
    http.postRequest({
      url: "match/pkRuleAdd",
      params: {
        matchId: that.data.gameId, uid: app.globalData.userInfo.id, pkRuleDTL: {
          modeName: '斗地主', bhMode: that.data.radioBao, thgMode: that.data.radioShou,
          mode: 20, graUnit: that.data.number1, ups: that.data.avoid, classify: that.data.radioType,
          landlord: that.data.landlord, pkPlayers: pkPlayers, thMode: that.data.radioDing,
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