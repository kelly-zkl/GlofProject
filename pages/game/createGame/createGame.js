// pages/game/createGame/createGame.js

var http = require("../../../http.js");
var util = require('../../../utils/util.js');
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    startYear: 2018,
    endYear: 2080,
    number1: 4,
    disabled1: false,
    disabled2: false,
    files: [],
    chooseMembers:[],
    showPopup: false,
    privacy:true,
    showInput:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();

    this.setData({
      chooseMembers: [app.globalData.userInfo],
      dateTimeArray: obj.dateTimeArray,
      dateTime: obj.dateTime,
      date: util.getNowDate()
    });
  },
  //比赛名称
  inputName:function(e){
    this.setData({
      gameName:e.detail.value
    });
  },
  //人数
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
  numberChange:function(e){
    this.setData({
      number1: parseInt(e.detail.value) >= 100 ? 100 : parseInt(e.detail.value) <= 1 ? 1 : parseInt(e.detail.value)
    });
    this.setData({
      disabled1: this.data.number1 !== 1 ? false : true,
      disabled2: this.data.number1 !== 100 ? false : true
    });
  },

  //选择球员
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {//同队球友
      wx.navigateTo({
        url: '/pages/choose/chooseTeam/chooseTeam?type=2',
      })
    } else if (id == 2) {//我关注的球友
      wx.navigateTo({
        url: '/pages/choose/followMember/followMember',
      })
    } else if (id == 3) {//历史同赛的队友
      wx.navigateTo({
        url: '/pages/choose/gameMember/gameMember',
      })
    } else if (id == 4) {//邀请通讯录
      wx.navigateTo({
        url: '/pages/userMsg/chooseMember/chooseMember?id=4',
      })
    } else if (id == 5) {//手动录入
      that.toggleInput();
    }
    this.setData({
      showPopup: false
    });
  },

  //日期选择
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr
    });
  },
  //手动录入球员
  toggleInput() {
    this.setData({
      showInput: !this.data.showInput
    });
  },
  //是否是私密比赛
  privacySet:function(e){
    this.setData({
      privacy:e.detail.value
    });
  },
  //创建比赛
  createGame:function(e){
    var that = this;
    console.log(that.data.chooseMembers);
    var playerPoles = [{ userId: app.globalData.userInfo.id}];
    (that.data.chooseMembers).map(function (item) {
      if (item.selected) {
        playerPoles.push({ userId: item.id})
      }
    })
    var mainCourt = that.data.mainCourt;
    var minorCourt1 = that.data.minorCourt1;
    var minorCourt2 = that.data.minorCourt2;
    if (!that.data.gameName || !that.data.dateTimeArray || !that.data.number1 || !that.data.files ||
      !that.data.dateTime || !that.data.mainCourt) {
      wx.showToast({ title: '请完善赛事信息', icon: 'none', duration: 1500 });
      return;
    }
    var timeStap = new Date(that.data.dateTimeArray[0][that.data.dateTime[0]] + '-' + that.data.dateTimeArray[1][that.data.dateTime[1]] + '-' + that.data.dateTimeArray[2][that.data.dateTime[2]] + ' ' + that.data.dateTimeArray[3][that.data.dateTime[3]] + ':' +that.data.dateTimeArray[4][that.data.dateTime[4]]).getTime();
    http.postRequest({
      url: "match/create",
      params: {
        playerLimit: that.data.number1, players: playerPoles, matchName: that.data.gameName, startTime: timeStap, 
        courtId: mainCourt.courtId, frontCourt: mainCourt.frontCourt, 
        backCourt: mainCourt.backCourt, uid: app.globalData.userInfo.id
      },
      msg: '创建中...',
      success: res => {
        wx.showToast({ title: '创建成功', icon: 'none', duration: 1500 })
        wx.navigateBack()
      }
    }, true);
  }
});