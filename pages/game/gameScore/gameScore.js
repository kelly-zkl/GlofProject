
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    holes: [{ name: 'C1', role: 3 }, { name: 'C2', role: 3 }, { name: 'C3', role: 3 }, { name: 'C4', role: 3 },
      { name: 'C5', role: 3 }, { name: 'C6', role: 3 }, { name: 'C7', role: 3 }, { name: 'C8', role: 3 },
      { name: 'C9', role: 3 }, { name: 'D1', role: 3 }, { name: 'D2', role: 3 }, { name: 'D3', role: 3 }, 
      { name: 'D4', role: 3 }, { name: 'D5', role: 3 }, { name: 'D6', role: 3 }, { name: 'D7', role: 3 },
      { name: 'D8', role: 3 }, { name: 'D9', role: 3 }],
    radioType: 0,
    showPopup: false,
    number1: 4,
    disabled1: false,
    disabled2: false,
    activeHole:0,
    scrowHeight:0,
    ruleIdx:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      gameId: options.id
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrowHeight: res.windowHeight -160
        });
        console.log(res.windowHeight);
        console.log(that.data.scrowHeight);
      }
    }); 
  },
  onShow:function(){
    this.gameDetail();
    this.getRuleList();
  },
  //PK规则、积分卡
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
    this.gameDetail();
    this.getRuleList();
  },
  //选择洞
  holeChange:function(e){
    console.log();
    this.setData({
      activeHole: e.currentTarget.dataset.id
    });
  },
  //设置分数
  togglePopup(e) {
    if (this.data.gameDetail.joined == 1) {//参赛
      this.setData({
        showPopup: !this.data.showPopup,
        activeHole: e.currentTarget.dataset.idx
      });
    }
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
  },
  //分数
  prevNum(e) {//+1
    var num = e.currentTarget.dataset.num;
    var idx = e.currentTarget.dataset.idx;
    num = num + 1;
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
    this.setData({
      gameDetail: this.data.gameDetail
    });
  },
  nextNum(e) {//-1
    var num = e.currentTarget.dataset.num;
    var idx = e.currentTarget.dataset.idx;
    num = num - 1;
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
    this.setData({
      gameDetail: this.data.gameDetail
    });
  },
  numberChange: function (e) {//输入框
    var num = e.detail.value;
    var idx = e.currentTarget.dataset.idx;
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
  },
  //保存设置的分数
  saveScore:function(e){
    var that = this;
    var user = [];
    that.data.gameDetail.players.map(function (item, index) {
      var num = { userId: item.userId, pole: that.data.gameDetail.userEPoles[that.data.activeHole][index] };
      user.push(num);
    })
    http.postRequest({
      url: "match/updatePole",
      params: {
        matchId: that.data.gameId, index: that.data.activeHole, uid: app.globalData.userInfo.id,
        players: user
      },
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 });
        this.setData({
          showPopup: false
        });
        that.gameDetail();
      }
    }, true);
  },
  //比赛详情
  gameDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "match/detail",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        // wx.showToast({ title: '已加入', icon: 'info', duration: 1500 })
        res.data.timeStr = util.formatTime(new Date(res.data.startTime), '-', true);
        
        this.setData({
          gameDetail: res.data
        });
      }
    }, false);
  },
  //选择规则
  changeRule:function(e){
    this.setData({
      ruleIdx: e.currentTarget.id
    })
    this.getGameScore();
  },
  //获取规则列表
  getRuleList: function () {
    var that = this;
    http.postRequest({
      url: "match/pkRuleList",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        this.setData({
          rules: res.data
        });
        this.getGameScore();
      }
    }, false);
  },
  //删除规则
  deleteRule: function (e) {
    var that = this;
    var ruleIdx= e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该规则？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "match/pkRuleDel",
            params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id, 
            pkRuleId: that.data.rules[ruleIdx].pkRuleId},
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 });
              that.getRuleList();
            }
          }, true);
        }
      }
    })
  },
  //比赛成绩查询
  getGameScore:function(){
    var that = this;
    http.postRequest({
      url: "match/grade",
      params: {
        matchId: that.data.gameId, uid: app.globalData.userInfo.id,
        pkRuleId: that.data.rules[that.data.ruleIdx].pkRuleId
      },
      // msg: "操作中...",
      success: res => {
        // wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 });
        this.setData({
          score: res.data
        });
      }
    }, false);
  }
})