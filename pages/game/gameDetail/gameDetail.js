const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");

Page({
  data: {
    holes: [{ name: 'C1', role: 3 }, { name: 'C2', role: 3 }, { name: 'C3', role: 3 }, { name: 'C4', role: 3 }],
    radioType:1,
    showJoin: true,
    gameId:'',
    showPopup: false,
    number1: 4,
    disabled1: false,
    disabled2: false,
    activeHole: 'C1'
  },
  onLoad: function (options) {
    // var that = this;
    // that.setData({
    //   gameId: options.id
    // });
  },
  onShow:function(){
    this.setData({
      radioType: 1
    })
  },
  //PK规则、积分卡、主页面
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
    if (e.currentTarget.dataset.id == 0){//PK规则
      wx.navigateTo({
        url: '/pages/rules/pkRule/pkRule',
      })
    } else if (e.currentTarget.dataset.id == 2){//记分卡
      wx.navigateTo({
        url: '/pages/game/gameScore/gameScore',
      })
    }
  },
  //选择洞
  holeChange: function (e) {
    console.log();
    this.setData({
      activeHole: e.currentTarget.id
    });
  },
  //设置分数
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;

  },
  //分数
  prevNum() {
    this.setData({
      number1: this.data.number1 >= 100 ? 100 : this.data.number1 + 1
    });
    this.setData({
      disabled1: this.data.number1 !== 1 ? false : true,
      disabled2: this.data.number1 !== 100 ? false : true
    });
  },
  nextNum() {
    this.setData({
      number1: this.data.number1 <= 1 ? 1 : this.data.number1 - 1
    });
    this.setData({
      disabled1: this.data.number1 !== 1 ? false : true,
      disabled2: this.data.number1 !== 100 ? false : true
    });
  },
  numberChange: function (e) {
    this.setData({
      number1: parseInt(e.detail.value) >= 100 ? 100 : parseInt(e.detail.value) <= 1 ? 1 : parseInt(e.detail.value)
    });
    this.setData({
      disabled1: this.data.number1 !== 1 ? false : true,
      disabled2: this.data.number1 !== 100 ? false : true
    });
  },
  //保存设置的分数
  saveScore: function (e) {
    var that = this;
    http.postRequest({
      url: "match/updatePole",
      params: { matchId: that.data.gameId, index: 0, uid: app.globalData.userInfo.id,
        playerPoles: [{ userId: '', pole:0}]},
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 })
      }
    }, true);
  },
  //关注比赛
  followGame:function(e) {
    var that = this;
    http.postRequest({
      url: "user/addFollower",
      params: { beFollowedId: that.data.gameId, beFollowedType: "match", uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '关注成功', icon: 'info', duration: 1500 })
        this.setData({
          showJoin: !this.data.showJoin
        });
      }
    }, true);
  },
  //取消关注比赛
  unFollowGame:function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要取消关注该比赛？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "user/cancelFollower",
            params: {
              id: that.data.userInfo.followedId, uid: app.globalData.userInfo.id,
              beFollowedType: "match"
            },
            msg: "加载中...",
            success: res => {
              wx.showToast({ title: '已取消关注', icon: 'info', duration: 1500 })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  },
  //加入比赛
  joinGame:function(e) {
    var that = this;
    http.postRequest({
      url: "match / join",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '已加入', icon: 'info', duration: 1500 })
        this.setData({
          showJoin: !this.data.showJoin
        });
      }
    }, true);
  },
  //退出比赛
  quitGame:function(e){

  },
  //结束比赛
  finishGame:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要结束比赛？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "match/finish",
            params: {
              matchId: that.data.gameId, uid: app.globalData.userInfo.id
            },
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '比赛已结束', icon: 'info', duration: 1500 })
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  }
});