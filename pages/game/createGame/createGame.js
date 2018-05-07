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
    showPopup: false,
    privacy:true
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
    if (id == 1) {
      
    } else if (id == 2) {
      
    } else if (id == 3) {
     
    } else if (id == 4) {
     
    } else if (id == 5) {

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
  //是否是私密比赛
  privacySet:function(e){
    this.setData({
      privacy:e.detail.value
    });
  },
  //创建比赛
  createGame:function(e){
    var that = this;
    if (!that.data.gameName || !that.data.dateTime || !that.data.number1 || !that.data.files ||
      that.data.thumbUrl == "../../../images/pic_160.png" || !that.data.claim ||
      !that.data.intro || !that.data.date) {
      wx.showToast({ title: '请完善赛事信息', icon: 'none', duration: 1500 });
      return;
    }
    http.postRequest({
      url: "group/create",
      params: {
        slogan: that.data.slogan, province: that.data.province, city: that.data.city, setupTime: that.data.date,
        groupName: that.data.groupName, thumbUrl: that.data.thumbUrl, claim: that.data.claim,
        intro: that.data.intro, allowSJoin: that.data.allowSJoin, uid: app.globalData.userInfo.id
      },
      msg: '创建中...',
      success: res => {
        wx.showToast({ title: '创建成功', icon: 'none', duration: 1500 })
        wx.navigateBack({
          delta: 1
        })
      }
    }, true);
  }
});