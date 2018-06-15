
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 1,
    radioDing: 0,
    radioShou: 0,
    radioBao: 0,
    radioGroup:3,
    handicap: true,
    avoid: true,
    count:0,
    good:false,
    poor:false,
    all:false,
    showGroup: false,
    groupA1: {},
    groupA2: {},
    groupB1: {},
    groupB2: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var arr = [];
    if (options.player) {
      arr = JSON.parse(options.player);
    }
    (arr).map(function (item) {
      item.score = 0;
      item.three = 0;
      item.four = 0;
      item.five = 0;
      item.checked = false;
    })
    that.setData({
      gameId: options.id,
      ruleId: options.ruleId ? options.ruleId : 1,
      players: arr
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          leftPosition: 50 - (3600 / ((res.windowWidth * 0.9 - 30) / (that.data.players.length))) + '%'
        });
      }
    });
    if (arr.length > 3) {
      that.setData({
        groupA1: arr[0],
        groupA2: arr[1],
        groupB1: arr[2],
        groupB2: arr[3]
      })
    }

    wx.setNavigationBarTitle({
      title: this.data.ruleId == 1 ? "拉斯" : "修改规则"
    })
    if (this.data.ruleId != 1) {
      this.getPkDetail();
    }
  },
  //pk详情
  getPkDetail: function () {
    var that = this;
    http.postRequest({
      url: "match/pkRuleDetail",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id, pkRuleId: that.data.ruleId },
      msg: "加载中...",
      success: res => {
        that.setData({
          pkDetail: res.data,
          number1: res.data.pkRuleDTL.graUnit,
          radioGroup: res.data.pkRuleDTL.classify,
          handicap: res.data.pkRuleDTL.hasSpread,
          radioDing: res.data.pkRuleDTL.thMode,
          radioShou: res.data.pkRuleDTL.thgMode,
          radioBao: res.data.pkRuleDTL.bhMode,
          avoid: res.data.pkRuleDTL.ups,
          players: res.data.pkRuleDTL.uspread,
          groupA1: res.data.pkRuleDTL.ug1u1,
          groupA2: res.data.pkRuleDTL.ug1u2,
          groupB1: res.data.pkRuleDTL.ug2u1,
          groupB2: res.data.pkRuleDTL.ug2u2,
          good: res.data.pkRuleDTL.gradeG,
          poor: res.data.pkRuleDTL.gradeB,
          all:res.data.pkRuleDTL.gradeT,
        });
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              leftPosition: 50 - (3600 / ((res.windowWidth * 0.9 - 30) / (that.data.players.length))) + '%'
            });
          }
        });
      }
    }, false);
  },
  //分组
  groupChange:function(e){
    this.setData({
      radioGroup: e.currentTarget.dataset.id
    })
  },
  //选择分组的人数
  toggleGroup: function () {
    if (this.data.radioGroup == 4) {//乱拉
      var arry = this.data.players;
      (arry).map(function (item) {
        item.checked = false;
      })
      this.setData({
        players: arry,
        showGroup: !this.data.showGroup
      })
    }
  },
  chooseGroup: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var len = e.detail.value.length;
    var arry = this.data.players;

    if (len == 2) {
      this.setData({
        groupA1: arry[e.detail.value[0]],
        groupA2: arry[e.detail.value[1]]
      })
      var newArr = [];
      for (let i = 0, len = arry.length; i < len; i++) {
        if (arry[i].userId != this.data.groupA1.userId && arry[i].userId != this.data.groupA2.userId) {
          newArr.push(arry[i])
        }
      }
      this.setData({
        groupB1: newArr[0],
        groupB2: newArr[1],
        showGroup: false
      })
    }
  },
  //记分方式
  scoreChange:function(e){
    if (e.currentTarget.dataset.id == 0){//较好成绩
      this.setData({
        good: !this.data.good
      })
      if (this.data.good){
        this.setData({
          count: this.data.count + 1
        })
      }else{
        this.setData({
          count: this.data.count - 1
        })
      }
    } else if (e.currentTarget.dataset.id == 1){//较差成绩
      this.setData({
        poor: !this.data.poor
      })
      if (this.data.poor) {
        this.setData({
          count: this.data.count + 1
        })
      } else {
        this.setData({
          count: this.data.count - 1
        })
      }
    } else if (e.currentTarget.dataset.id == 2){//总分
      this.setData({
        all: !this.data.all
      })
      if (this.data.all) {
        this.setData({
          count: this.data.count + 1
        })
      } else {
        this.setData({
          count: this.data.count - 1
        })
      }
    }
  },
  //让总分
  changeScore: function (e) {
    var arr = this.data.players;
    arr[e.currentTarget.id].score = e.detail.value;
    this.setData({
      players: arr
    })
  },
  //三杆洞
  threeChange: function (e) {
    var arr = this.data.players;
    arr[e.currentTarget.id].three = e.detail.value;
    this.setData({
      players: arr
    })
  },
  //四杆洞
  fourChange: function (e) {
    var arr = this.data.players;
    arr[e.currentTarget.id].four = e.detail.value;
    this.setData({
      players: arr
    })
  },
  //五杆洞
  fiveChange: function (e) {
    var arr = this.data.players;
    arr[e.currentTarget.id].five = e.detail.value;
    this.setData({
      players: arr
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
  //让分
  handicapSet: function (e) {
    this.setData({
      handicap: e.detail.value
    })
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
  //保存设置
  saveSet: function () {
    var that = this;
    var spread = {};
    var handicap3 = {};
    var handicap4 = {};
    var handicap5 = {};
    var pkPlayers = [];
    (that.data.players).map(function (item, idx) {
      spread[item.userId] = item.score;
      handicap3[item.userId] = item.three;
      handicap4[item.userId] = item.four;
      handicap5[item.userId] = item.five;
      pkPlayers[idx] = item.userId;
    })

    if (!that.data.number1) {
      wx.showToast({ title: '请输入基本单位', icon: 'none', duration: 1500 });
      return;
    }
    if (this.data.ruleId == 1) {//添加规则
      http.postRequest({
        url: "match/pkRuleAdd",
        params: {
          matchId: that.data.gameId, uid: app.globalData.userInfo.id, pkRuleDTL: {
            modeName: '拉斯', thgMode: that.data.radioShou, spread: spread, mode: 30,
            graUnit: that.data.number1, ups: that.data.avoid, hasSpread: that.data.handicap, handicap3: handicap3,
            handicap4: handicap4, handicap5: handicap5, thMode: that.data.radioDing, bhMode: that.data.radioBao,
            pkPlayers: pkPlayers, classify: that.data.radioGroup, g1u1: that.data.groupA1.userId,
            g1u2: that.data.groupA2.userId, g2u1: that.data.groupB1.userId, g2u2: that.data.groupB2.userId,
            gradeG: that.data.good, gradeB: that.data.poor, gradeT: that.data.all
          }
        },
        msg: "加载中...",
        success: res => {
          wx.showToast({ title: '设置成功', icon: 'info', duration: 1000 })
          setTimeout(function () {
            wx.navigateBack({ delta: 2})
          }, 1000)
        }
      }, true);
    }else{
      http.postRequest({
        url: "match/pkRuleUpdate",
        params: {
          matchId: that.data.gameId, uid: app.globalData.userInfo.id, pkRuleDTL: {
            modeName: '拉斯', thgMode: that.data.radioShou, spread: spread, mode: 30,
            graUnit: that.data.number1, ups: that.data.avoid, hasSpread: that.data.handicap, handicap3: handicap3,
            handicap4: handicap4, handicap5: handicap5, thMode: that.data.radioDing, bhMode: that.data.radioBao,
            pkPlayers: pkPlayers, classify: that.data.radioGroup, g1u1: that.data.groupA1.userId,
            g1u2: that.data.groupA2.userId, g2u1: that.data.groupB1.userId, g2u2: that.data.groupB2.userId,
            gradeG: that.data.good, gradeB: that.data.poor, gradeT: that.data.all,
            pkRuleId: that.data.pkDetail.pkRuleDTL.pkRuleId
          }
        },
        msg: "修改中...",
        success: res => {
          wx.showToast({ title: '修改成功', icon: 'info', duration: 1000 })
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        }
      }, true);
    }
  }
})