
const app = getApp();
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pkPublic:false,
    showJoin:false,//让洞
    showBom:false,//地雷
    showStart:false,//起始洞
    page:1
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
          imageWidth: ((res.windowWidth*0.8 - 90) / 5)+'px'
        });
        console.log(that.data.imageWidth);
      }
    });
    that.setData({
      cellStyle: 'width:' + that.data.imageWidth + ';height:' + that.data.imageWidth + ';line-height:' + that.data.imageWidth
    });
  },
  onShow: function () {
    this.gameDetail();
    this.getRuleList();
    this.getPkSet();
  },
  //埋地雷
  toggleBom() {
    this.setData({
      showBom: !this.data.showBom
    });
  },
  selecBom: function (e) {//2埋雷 1没有埋雷
    var indx = e.currentTarget.dataset.id;
    var arr = this.data.pkSet.bomHold;
    var num = arr[indx];
    if (num == 1) {
      arr[indx] = 2;
    } else {
      arr[indx] = 1;
    }
    this.setData({
      'pkSet.bomHold': arr
    })
  },
  //让洞
  toggleJoin() {
    this.setData({
      showJoin: !this.data.showJoin
    });
  },
  selecJoin: function (e) {//1参与 0不参与
    var indx = e.currentTarget.dataset.id;
    var arr = this.data.pkSet.joinHold;
    var num = arr[indx];
    if (num==0){
      arr[indx] = 1;
    }else{
      arr[indx] = 0;
    }
    this.setData({
      'pkSet.joinHold': arr
    })
  },
  //选择起始洞
  toggleStart() {
    this.setData({
      showStart: !this.data.showStart
    });
  },
  selecStart: function (e) {
    this.setData({
      'pkSet.startPos': e.currentTarget.dataset.id
    });
  },
  confirmChoose:function(e){
    this.setData({
      showJoin: false,//让洞
      showBom: false,//地雷
      showStart: false//起始洞
    });
    this.saveSet();
  },
  //pk规则是否公开
  pkSet:function(e){
    var that = this;
    that.setData({
      'pkSet.open': e.detail.value
    });
    that.saveSet();
  },
  //添加PK规则
  gotoSet:function(){
    wx.navigateTo({
      url: '/pages/rules/setRule/setRule?id=' + this.data.gameId,
    })
  },
  //比赛详情
  gameDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "match/detail",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        this.setData({
          gameDetail: res.data
        });
      }
    }, false);
  },
  //设置pk通用设置=>起始洞、地雷、让洞
  saveSet:function(e){
    var that = this;
    http.postRequest({
      url: "match/updatePK",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id, pk: that.data.pkSet },
      msg: "设置中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1500})
      }
    }, true);
  },
  //获取pk通用设置
  getPkSet:function(){
    var that = this;
    http.postRequest({
      url: "match/detailPK",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        that.setData({
          pkSet: res.data
        });
      }
    }, false);
  },
  //获取规则列表
  getRuleList:function(){
    var that = this;
    http.postRequest({
      url: "match/pkRuleList",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.page <= 1) {
          that.setData({
            rules: res.data
          })
        } else {
          that.setData({
            rules: that.data.rules.concat(res.data)
          })
        }
      }
    }, false);
  },
  //删除规则
  deleteRule: function (e) {
    var that = this;
    var ruleIdx = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该规则？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "match/pkRuleDel",
            params: {
              matchId: that.data.gameId, uid: app.globalData.userInfo.id,
              pkRuleId: ruleIdx
            },
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
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true,
      page: 1
    });
    this.gameDetail();
    this.getRuleList();
    this.getPkSet();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getRuleList();
  }
})