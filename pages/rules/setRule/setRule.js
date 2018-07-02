
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rules: [],
    leftPosition:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      gameId: options.id
    });
    that.setData({
      rules: [{
        url: '../../../images/icon_rod.png', name: '比杆',
        path: '/pages/rules/rodRule/rodRule?id=' + that.data.gameId, show: true
      },
      {
        url: '../../../images/icon_hole.png', name: '比洞',
        path: '/pages/rules/holeRule/holeRule?id=' + that.data.gameId, show: true
      },
      {
        url: '../../../images/icon_landlord.png', name: '斗地主',
        path: '/pages/rules/doudeRule/doudeRule?id=' + that.data.gameId, show: false
      },
      {
        url: '../../../images/icon_landlord4.png', name: '斗地主（3+1）',
        path: '/pages/rules/doude3Rule/doude3Rule?id=' + that.data.gameId, show: true
      },
      {
        url: '../../../images/icon_lass.png', name: '拉斯',
        path: '/pages/rules/lassRule/lassRule?id=' + that.data.gameId, show: true
      },
      {
        url: '../../../images/icon_8421.png', name: '8421',
        path: '/pages/rules/8421/8421?id=' + that.data.gameId, show: true
      },
      {
        url: '../../../images/icon_head.png', name: '2分头尾肉',
        path: '/pages/rules/divideRule/divideRule?id=' + that.data.gameId, show: true
      },
      {
        url: '../../../images/icon_tiger.png', name: '打老虎',
        path: '/pages/rules/tigerRule/tigerRule?id=' + that.data.gameId, show: true
      }]
    });
    this.gameDetail();
  },
  onShow:function(e){
    // this.gameDetail();
  },
  //选择PK的人数
  checkboxChange: function (e) {
    var that = this;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var len = e.detail.value.length;
    var arry = [];

    if (len > 0){
      (e.detail.value).map(function(item){
        arry.push(that.data.users[item]);
      })
    }
    that.setData({
      players: JSON.stringify(arry)
    })
    that.showList(len);
  },
  showList:function(len){
    var arry = this.data.rules;
    if (len <= 1) {//不能选择
      (arry).map(function (item) {
        item.show = false;
      })
    } else if (len == 2) {//2人可选择比杆、比洞
      (arry).map(function (item,index) {
        if(index == 0 || index == 1){
          item.show = true;
        }else{
          item.show = false;
        }
      })
    } else if (len == 3) {//3人可选择比杆、比洞、斗地主、打老虎
      (arry).map(function (item, index) {
        if (index == 0 || index == 1 || index == 2 || index == 7) {
          item.show = true;
        } else {
          item.show = false;
        }
      })
    } else if (len == 4) {//4人可以选择比杆、比洞、斗地主(3+1)、打老虎、拉斯、头尾肉、8421
      (arry).map(function (item, index) {
        if (index == 2){
          item.show = false;
        }else{
          item.show = true;
        }
      })
    }

    this.setData({
      rules: arry
    });
  },
  //比赛详情
  gameDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "match/detail",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        that.setData({
          gameDetail: res.data,
          users: res.data.players,
          players: JSON.stringify(res.data.players)
        });
        that.showList(that.data.gameDetail.players.length);
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              leftPosition: 50 - (3600 / (res.windowWidth / (that.data.gameDetail.players.length)))+'%'
            });
          }
        });
        console.log(that.data.leftPosition);
      }
    }, false);
  }
})