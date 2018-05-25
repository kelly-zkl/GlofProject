const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({
  data: {
    radioType:1,
    showJoin: true,
    gameId:'',
    showPopup: false,
    showManager:false,
    showModify:false,
    showMore:false,
    showPic:false,
    disabled1: false,
    disabled2: false,
    activeHole: 0,
    scrowWidth:0
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      gameId: options.id
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrowWidth: ((res.windowWidth - 121)*100 / res.windowWidth)+'%'
        });
        // console.log(res.windowHeight);
        // console.log(that.data.scrowWidth);
      }
    });
  },
  onShow:function(){
    this.setData({
      radioType: 1
    })
    this.gameDetail();
  },
  //赛事设置管理
  toggleManager: function () {
    this.setData({
      showManager: !this.data.showManager
    });
  },
  managerChange: function () {
    if (e.currentTarget.dataset.id == 1) {//修改赛事
      // wx.navigateTo({
      //   url: '/pages/game/modifyTee/modifyTee?id=' + this.data.gameId,
      // })
    } else if (e.currentTarget.dataset.id == 2) {//设置赛事权限
      // wx.navigateTo({
      //   url: '/pages/game/gameScore/gameScore?id=' + this.data.gameId,
      // })
    } else if (e.currentTarget.dataset.id == 3) {//设置赛事图片
      this.togglePic();
    } else if (e.currentTarget.dataset.id == 4) {//成绩填写记录
      wx.navigateTo({
        url: '/pages/game/writeScoreList/writeScoreList?id=' + this.data.gameId,
      })
    } else if (e.currentTarget.dataset.id == 5) {//重新开赛
    } else if (e.currentTarget.dataset.id == 6) {//结束赛事
    } else if (e.currentTarget.dataset.id == 7) {//退出比赛
    }
    this.setData({
      showManager: false
    })
  },
  //修改球手信息
  toggleModify: function () {
    this.setData({
      showModify: !this.data.showModify
    });
  },
  modifyChange: function () {
    if (e.currentTarget.dataset.id == 1) {//修改TEE台
      wx.navigateTo({
        url: '/pages/game/modifyTee/modifyTee?id=' + this.data.gameId,
      })
    } else if (e.currentTarget.dataset.id == 2) {//查看球手主页
      wx.navigateTo({
        url: '//pages/userMsg/personalPage/personalPage?tab=1&id=' + this.data.gameId,
      })
    } else if (e.currentTarget.dataset.id == 3) {//踢出赛事
    }
    this.setData({
      showModify: false
    })
  },
  //发红包/动态
  toggleMore: function () {
    this.setData({
      showMore: !this.data.showMore
    });
  },
  moreChange: function () {
    if (e.currentTarget.dataset.id == 1) {//发红包
      
    } else if (e.currentTarget.dataset.id == 2) {//发动态
      wx.navigateTo({
        url: '//pages/game/gameDynamic/gameDynamic?id=' + this.data.gameId,
      })
    } else if (e.currentTarget.dataset.id == 3){//球童
    }
    this.setData({
      showMore: false
    })
  },
  //赛事图片
  togglePic:function(){
    this.setData({
      showPic: !this.data.showPic
    });
  },
  picChange:function(){
    if (e.currentTarget.dataset.id == 1) {//选择相册
      
    } else if (e.currentTarget.dataset.id == 2) {//拍摄图片
      
    }
    this.setData({
      showPic: false
    })
  },
  //PK规则、积分卡、主页面
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
    if (e.currentTarget.dataset.id == 0){//PK规则
      wx.navigateTo({
        url: '/pages/rules/pkRule/pkRule?id=' + this.data.gameId,
      })
    } else if (e.currentTarget.dataset.id == 2){//记分卡
      wx.navigateTo({
        url: '/pages/game/gameScore/gameScore?id=' + this.data.gameId,
      })
    }else{
      this.toggleMore();
    }
  },
  //选择洞
  holeChange: function (e) {
    console.log(e);
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
    } else {//未关注、未参赛
      this.setData({
        showJoin: false
      });
    }
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
  },
  //分数
  prevNum(e) {//加1
    var num = e.currentTarget.dataset.num;
    var idx = e.currentTarget.dataset.idx;
    num = num +1;
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
    this.setData({
      gameDetail: this.data.gameDetail
    });
    // this.setData({
    //   disabled1: num !== 1 ? false : true,
    //   disabled2: num !== 100 ? false : true
    // });
  },
  nextNum(e) {//减1
    var num = e.currentTarget.dataset.num;
    var idx = e.currentTarget.dataset.idx;
    num = num -1;
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
    this.setData({
      gameDetail: this.data.gameDetail
    });
    // this.setData({
    //   disabled1: num !== 1 ? false : true,
    //   disabled2: num !== 100 ? false : true
    // });
  },
  numberChange: function (e) {
    var num = e.detail.value;
    var idx = e.currentTarget.dataset.idx;
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
    // this.setData({
    //   disabled1: num !== 1 ? false : true,
    //   disabled2: num !== 100 ? false : true
    // });
  },
  //保存设置的分数
  saveScore: function (e) {
    var that = this;
    var user = [];
    that.data.gameDetail.players.map(function (item,index) {
      var num = { userId: item.userId, pole: that.data.gameDetail.userEPoles[that.data.activeHole][index]};
      user.push(num);
    })
    http.postRequest({
      url: "match/updatePole",
      params: {
        matchId: that.data.gameId, index: that.data.activeHole, uid: app.globalData.userInfo.id,
        players: user},
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
  //关注比赛
  followGame:function(e) {
    var that = this;
    http.postRequest({
      url: "user/addFollower",
      params: { beFollowedId: that.data.gameId, beFollowedType: "match", uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '关注成功', icon: 'info', duration: 1500 })
        that.gameDetail();
        this.setData({
          showJoin: false
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
      url: "match/join",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '已加入', icon: 'info', duration: 1500 })
        that.gameDetail();
        this.setData({
          showJoin: false
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
  },
  //比赛详情
  gameDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "match/detail",
      params: {matchId: that.data.gameId, uid: app.globalData.userInfo.id},
      msg: "加载中...",
      success: res => {
        // wx.showToast({ title: '已加入', icon: 'info', duration: 1500 })
        res.data.timeStr = util.formatTime(new Date(res.data.startTime), '-', true);
        if (res.data.joined == 1 || res.data.followerId){
          this.setData({
            showJoin: false
          });
        }
        this.setData({
          gameDetail: res.data
        });
      }
    }, false);
  }
});