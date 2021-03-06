const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 
var drawQrcode = require('../../../utils/qrcode.js'); 

Page({
  data: {
    radioType:1,
    showJoin: false,
    gameId:'',
    showPopup: false,
    showManager:false,
    showModify:false,
    showMore:false,
    showPic:false,
    showPage:false,//页面二维码
    showCadd:false,
    disabled1: false,
    disabled2: false,
    caddie:false,
    activeHole: 0,
    scrowWidth:0,
    uid:'',
    text:'',
    parType:1
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      gameId: options.id,
      caddie: options.caddie ? options.caddie : that.data.caddie,
      uid: app.globalData.userInfo.id,
      text: '/pages/game/gameDetail/gameDetail?id=' + options.id
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

    this.createQrCode(this.data.text);
    this.caddQrCode(this.data.text);
  },
  onShow:function(){
    this.setData({
      radioType: 1
    })
    console.log(this.data.caddie);
    if (this.data.caddie){
      this.addCadd();
    }else{
      this.gameDetail();
      this.getCadds();
    }
  },
  togglePage:function(){
    this.setData({
      showPage: !this.data.showPage
    });
  },
  //切换分数类型
  changeType: function () {
    if (this.data.parType == 0) {
      this.setData({
        parType: 1
      })
    } else {
      this.setData({
        parType: 0
      })
    }
  },
  //获取页面二维码
  createQrCode: function (text) {
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: this.data.text
    })
  },
  //添加球童
  addCadd:function(){
    var that = this;
    http.postRequest({
      url: "match/caddie/join",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "操作中...",
      success: res => {
        // wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 });
        that.gameDetail();
        that.getCadds();
      }
    }, false);
  },
  //获取球童二维码
  caddQrCode: function (text) {
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'qrcode',
      text: this.data.text + '&caddie=true'
    })
  },
  //添加球童弹框
  toggleCadd: function () {
    this.setData({
      showCadd: !this.data.showCadd
    })
  },
  //删除球童
  deleteCad: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该球童？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "user/cancelFollower",
            params: {
              id: e.currentTarget.id, uid: app.globalData.userInfo.id,
              beFollowedType: "match"
            },
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 })
              that.getCadds();
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  },
  //获取球童列表
  getCadds: function () {
    var that = this;
    http.postRequest({
      url: "match/caddie/list",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });

        that.setData({
          cadds: res.data
        })
      }
    }, false);
  },
  //查询天气
  queryWeather:function(){
    var that = this;
    http.postRequest({
      url: "weather/detail",
      params: { city: this.data.gameDetail.city},
      // msg: "加载中....",
      success: res => {
        var str = res.data.forecast[0].type + ' ' + res.data.forecast[0].low + '~' + res.data.forecast[0].high + ' ' + res.data.forecast[0].fengli
        that.setData({
          weather: str
        })
      }
    }, false);
  },
  //赛事设置管理
  toggleManager: function () {
    this.setData({
      showManager: !this.data.showManager
    });
  },
  managerChange: function (e) {
    if (e.currentTarget.id == 1) {//修改赛事
      wx.navigateTo({
        url: '/pages/game/createGame/createGame?id=' + this.data.gameId,
      })
    } else if (e.currentTarget.id == 2) {//设置赛事权限
      wx.navigateTo({
        url: '/pages/game/gameAuthority/gameAuthority?id=' + this.data.gameId,
      })
    } else if (e.currentTarget.id == 3) {//设置赛事图片
      this.togglePic();
    } else if (e.currentTarget.id == 4) {//成绩填写记录
      wx.navigateTo({
        url: '/pages/game/writeScoreList/writeScoreList?id=' + this.data.gameId,
      })
    } else if (e.currentTarget.id == 5) {//重新开赛
    } else if (e.currentTarget.id == 6) {//结束赛事
      this.finishGame();
    } else if (e.currentTarget.id == 7) {//退出比赛
      this.quitGame();
    } else if (e.currentTarget.id == 8) {//取消关注比赛
      this.unFollowGame(); 
    } else if (e.currentTarget.id == 9) {//关注比赛
      this.followGame();
    } else if (e.currentTarget.id == 10) {//加入比赛
      this.joinGame();
    }
    this.setData({
      showManager: false
    })
  },
  //修改球手信息
  toggleModify: function (e) {
    this.setData({
      showModify: !this.data.showModify,
      userId: e.currentTarget.id
    });
  },
  modifyChange: function (e) {
    if (e.currentTarget.id == 1) {//修改TEE台
      wx.navigateTo({
        url: '/pages/game/modifyTee/modifyTee?id=' + this.data.gameId,
      })
    } else if (e.currentTarget.id == 2) {//查看球手主页
      var num = app.globalData.userInfo.id == this.data.userId ? 0 : 1
      wx.navigateTo({
        url: '/pages/userMsg/personalPage/personalPage?tab=' + num + '&id=' + this.data.userId
      })
    } else if (e.currentTarget.id == 3) {//踢出赛事
    }
    this.setData({
      showModify: false
    })
  },
  //球童/删除球童
  toggleMore: function (e) {
    console.log(e);
    this.setData({
      showMore: !this.data.showMore,
      item: e.currentTarget.dataset.id
    });
  },
  moreChange: function (e) {
    if (e.currentTarget.id == 1){//赛事动态
      wx.navigateTo({
        url: '/pages/game/gameDynamic/gameDynamic?gameName=' + this.data.gameDetail.matchName + '&id=' + this.data.gameId
      })
    }else if (e.currentTarget.id == 2) {//球童主页
      wx.navigateTo({
        url: '/pages/userMsg/personalPage/personalPage?tab=1&id=' + this.data.item.id
      })
    } else if (e.currentTarget.id == 3){//删除球童
      wx.navigateTo({
        url: '/pages/game/gameCaddies/gameCaddies?id=' + this.data.gameId + '&gameName=' + this.data.gameDetail.matchName
      })
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
  picChange:function(e){
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {
      that.setData({
        picType: ["album", "camera"],
        showPic: false
      });
    } else if (id == 2) {
      that.setData({
        picType: ["camera"],
        showPic: false
      });
    }
    that.chooseImage();
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: that.data.picType, // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        for (var i in tempFilePaths) {
          http.uploadFile(tempFilePaths[i], {
            success: function (res) {
              console.log(res.data);
              that.setData({
                thumbUrl: res.data
              });
              that.modifyPic();
            }
          })
        }
      }
    })
  },
  //修改赛事图标
  modifyPic:function(){
    var that = this;
    http.postRequest({
      url: "match/update",
      params: {matchId: that.data.gameId, icon: that.data.thumbUrl, uid: app.globalData.userInfo.id},
      msg: "操作中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 });
        that.gameDetail();
      }
    }, true);
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
    }
    // else{
    //   this.toggleMore();
    // }
  },
  //选择洞
  holeChange: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.id;
    var num = this.data.gameDetail.zones1[index].par;
    this.setData({
      activeHole: index,
      parNum: num
    });
  },
  //设置分数
  togglePopup(e) {
    var index = e.currentTarget.dataset.idx;
    this.setData({
      showPopup: index % 10 != 9 ? !this.data.showPopup : false
    })
    if (this.data.showPopup && index % 10 != 9) {
      var num = this.data.gameDetail.zones1[index].par;
      if (this.data.gameDetail.stat == 2 && index % 10 != 9) {
        if (this.data.gameDetail.joined == 1 || this.data.caddie) {//参赛this.data.gameDetail.stat==2&&
          this.setData({
            activeHole: index,
            parNum: num
          });
        }
      }
    }
    // else {//未关注、未参赛
    //   this.setData({
    //     showJoin: true
    //   });
    // }
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
  },
  //前一洞
  preHole: function () {
    var holeIndx = this.data.activeHole != 0 ? this.data.activeHole == 10 ? this.data.activeHole - 2 : this.data.activeHole - 1 : this.data.activeHole;
    var num = this.data.gameDetail.zones1[holeIndx].par;
    this.setData({
      activeHole: holeIndx,
      parNum: num
    });
  },
  //后一洞
  nextHole: function () {
    var holeIndx = this.data.activeHole < 18 ? this.data.activeHole == 8 ? this.data.activeHole + 2 : this.data.activeHole + 1 : this.data.activeHole;
    var num = this.data.gameDetail.zones1[holeIndx].par;
    this.setData({
      activeHole: holeIndx,
      parNum: num
    });
  },
  //分数
  prevNum(e) {//加1
    var num = (e.currentTarget.dataset.num + this.data.parNum);
    var idx = e.currentTarget.dataset.idx;
    num = (num >= 100 ? num : num + 1);
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
    this.setData({
      gameDetail: this.data.gameDetail,
      disabled1: num > 0 ? false : true,
      disabled2: num < 100 ? false : true
    });
  },
  nextNum(e) {//减1
    var num = (e.currentTarget.dataset.num + this.data.parNum);
    var idx = e.currentTarget.dataset.idx;
    num = (num <= 0 ? num : num - 1);
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
    this.setData({
      gameDetail: this.data.gameDetail,
      disabled1: num > 0 ? false : true,
      disabled2: num < 100 ? false : true
    });
  },
  numberChange: function (e) {//输入框
    var num = (parseInt(e.detail.value) + this.data.parNum);
    var idx = e.currentTarget.dataset.idx;
    num = (parseInt(num) >= 100 ? 100 : parseInt(num) <= 0 ? 0 : parseInt(num));
    this.data.gameDetail.userEPoles[this.data.activeHole][idx] = num;
    this.setData({
      gameDetail: this.data.gameDetail,
      disabled1: num > 0 ? false : true,
      disabled2: num < 100 ? false : true
    });
  },
  //保存设置的分数
  saveScore: function (e) {
    var that = this;
    var holeIndx = that.data.activeHole < 9 ? that.data.activeHole : that.data.activeHole - 1;
    var user = [];
    that.data.gameDetail.players.map(function (item, index) {
      var num = { userId: item.userId, pole: that.data.gameDetail.userEPoles[that.data.activeHole][index] };
      user.push(num);
    })
    http.postRequest({
      url: "match/updatePole",
      params: {
        matchId: that.data.gameId, index: holeIndx, uid: app.globalData.userInfo.id,
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
              id: that.data.gameDetail.followerId, uid: app.globalData.userInfo.id,
              beFollowedType: "match"
            },
            msg: "加载中...",
            success: res => {
              wx.showToast({ title: '已取消关注', icon: 'info', duration: 1500 })
              that.gameDetail();
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
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出比赛？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "match/exit",
            params: {
              matchId: that.data.gameId, uid: app.globalData.userInfo.id
            },
            msg: "操作中...",
            success: res => {
              wx.navigateBack()
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
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
              that.gameDetail();
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
        if (!that.data.caddie){
          that.setData({
            showJoin: res.data.joined == 1 || res.data.followerId?false:true
          });
        }
        that.setData({
          gameDetail: res.data,
          caddie: res.data.joined == 2?true:false
        });
        that.queryWeather();
      }
    }, false);
  },
  //分享页面
  onShareAppMessage: function (e) {
    this.setData({
      showPage: false,//页面二维码
      showCadd: false
    });
    console.log(e);
    var cadd = false;
    if (e.target){
      cadd = e.target.id&&e.target.id=='true'?true:false;
    }
    
    var text = '';
    if (cadd){
      text = '/pages/home/glof/glof?gameId=' + this.data.gameId + '&caddie=true';
    }else{
      text = '/pages/home/glof/glof?gameId=' + this.data.gameId;
    }
    console.log(text);
    return {
      title: 'GLOF',
      desc: this.data.gameDetail.matchName,
      path: text,
      success: function (res) {// 转发成功
        wx.showToast({ title: '分享成功', icon: 'info', duration: 1500 })
      },
      fail: function (res) {// 转发失败
        wx.showToast({ title: '分享失败', icon: 'info', duration: 1500 })
      }
    }
  }
});