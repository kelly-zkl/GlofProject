
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 1,
    radioType: 0,
    radioDing: 0,
    radioShou: 0,
    radioBao: 0,
    showBeat:false,
    showDou:false,
    avoid: true,
    lanIndx:0,
    beIndx:1
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
          leftPosition: 50 - (3500 / ((res.windowWidth*0.9 - 30) / (that.data.players.length))) + '%'
        });
      }
    });
    var landlord = this.data.players[0].userId;
    var hatchet = this.data.players[1].userId;
    var landlordNa = this.data.players[0];
    var hatchetNa = this.data.players[1];
    this.setData({
      landlord: landlord,
      douName: landlordNa,
      hatchet: hatchet,
      beatNa: hatchetNa
    });
  },
  
  //选择地主
  toggleDou: function () {
    this.setData({
      showDou: !this.data.showDou
    });
  },
  chooseDou: function (e) {
    console.log(e.detail.value);
    var idx = e.detail.value;
    var landlord = this.data.players[idx].userId;
    var landlordNa = this.data.players[idx];
    this.setData({
      landlord: landlord,
      douName: landlordNa,
      lanIndx: idx,
      showDou:false
    });
  },
  //选择打手
  toggleBeat: function () {
    this.setData({
      showBeat: !this.data.showBeat
    });
  },
  chooseBeat: function (e) {
    console.log(e.detail.value);
    var idx = e.detail.value;
    var hatchet = this.data.players[idx].userId;
    var hatchetNa = this.data.players[idx];
    this.setData({
      hatchet: hatchet,
      beatNa: hatchetNa,
      beIndx: idx,
      showBeat:false
    });
  },
  //斗地主分类 1/2名
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
  //基本单位
  numberChange: function (e) {
    this.setData({
      number1: e.detail.value
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
    if (!that.data.hatchet) {
      wx.showToast({ title: '请选择打手', icon: 'none', duration: 1500 });
      return;
    }
    http.postRequest({
      url: "match/pkRuleAdd",
      params: {
        matchId: that.data.gameId, uid: app.globalData.userInfo.id, pkRuleDTL: {
          modeName: '斗地主(3+1)', bhMode: that.data.radioBao, thgMode: that.data.radioShou,
          mode: 21, graUnit: that.data.number1, ups: that.data.avoid, classify: that.data.radioType,
          landlord: that.data.landlord, pkPlayers: pkPlayers, thMode: that.data.radioDing,
          hatchet: that.data.hatchet
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