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
    dateTimeArray: null,
    dateTime: null,
    startYear: 2018,
    endYear: 2080,
    number1: 4,
    disabled1: false,
    disabled2: false,
    chooseMembers:[],
    showPopup: false,
    privacy:true,
    showInput:false,
    gameId:1,
    gameDetail:{}
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

    var dateTimeArray = obj.dateTimeArray;
    var dateTime = obj.dateTime;

    var timeStr = dateTimeArray[0][dateTime[0]]+'-'+dateTimeArray[1][dateTime[1]]+'-'+
    dateTimeArray[2][dateTime[2]]+' '+dateTimeArray[3][dateTime[3]]+':'+dateTimeArray[4][dateTime[4]]

    this.setData({
      chooseMembers: [app.globalData.userInfo],
      dateTimeArray: dateTimeArray,
      dateTime: dateTime,
      timeStr: timeStr,
      gameId: options.id ? options.id:1,
      userId: app.globalData.userInfo.id
    });

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: ((res.windowWidth - 62) / 4) + 'px',
          upWidth: (((res.windowWidth - 62) / 4) - 2) + 'px'
        });
        // console.log(that.data.imageWidth);
        // console.log(that.data.upWidth);
      }
    });

    wx.setNavigationBarTitle({
      title: this.data.gameId == 1 ? "创建比赛" : "修改赛事信息"
    })
    if (this.data.gameId != 1) {
      this.getGameDetail();
    }
  },
  //获取赛事详情
  getGameDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "match/detail",
      params: { matchId: that.data.gameId, uid: app.globalData.userInfo.id },
      msg: "加载中...",
      success: res => {
        // wx.showToast({ title: '已加入', icon: 'info', duration: 1500 })
        res.data.timeStr = util.formatTime(new Date(res.data.startTime), '-', true);
        (res.data.players).map(function (item) {
          item.id = item.userId
        })
        this.setData({
          gameDetail: res.data,
          number1: res.data.playerLimit,
          gameName: res.data.matchName,
          mainCourt: { courtId: res.data.courtId, frontCourt: res.data.frontCourt,
          backCourt: res.data.backCourt, courtName:res.data.courtName},
          chooseMembers: res.data.players,
          timeStr: res.data.timeStr
        });
      }
    }, false);
  },
  //比赛名称
  inputName:function(e){
    this.setData({
      gameName:e.detail.value
    });
  },
  //人数
  prevNum() {
    if (this.data.gameId == 1) {//不能修改
      this.setData({
        number1: this.data.number1 >= 4 ? 4 : this.data.number1 + 1
      });
      this.setData({
        disabled1: this.data.number1 !== 1 ? false : true,
        disabled2: this.data.number1 !== 4 ? false : true
      });
    }
  },
  nextNum() {
    if (this.data.gameId == 1) {//不能修改
      this.setData({
        number1: this.data.number1 <= 1 ? 1 : this.data.number1 - 1
      });
      this.setData({
        disabled1: this.data.number1 !== 1 ? false : true,
        disabled2: this.data.number1 !== 4 ? false : true
      });
    }
  },
  numberChange:function(e){
    if (this.data.gameId == 1) {//不能修改
      this.setData({
        number1: parseInt(e.detail.value) >= 4 ? 4 : parseInt(e.detail.value) <= 1 ? 1 : parseInt(e.detail.value)
      });
      this.setData({
        disabled1: this.data.number1 !== 1 ? false : true,
        disabled2: this.data.number1 !== 4 ? false : true
      });
    }
  },
  //删除成员
  deleteMember:function(e){
    var index = e.currentTarget.id;
    var arr = this.data.chooseMembers;
    arr.splice(index,1);
    this.setData({
      chooseMembers:arr
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
        url: '/pages/choose/chooseTeam/chooseTeam?type=2'
      })
    } else if (id == 2) {//我关注的球友
      wx.navigateTo({
        url: '/pages/choose/followMember/followMember?type=2'
      })
    } else if (id == 3) {//历史同赛的队友
      wx.navigateTo({
        url: '/pages/choose/gameMember/gameMember'
      })
    } else if (id == 4) {//邀请通讯录
      wx.navigateTo({
        url: '/pages/userMsg/chooseMember/chooseMember?id=4'
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

    var timeStr = dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' +
      dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]]
    this.setData({
      dateTimeArray: dateArr,
      timeStr: timeStr
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
  //选择参赛成员
  addMembers:function(){
    var arr = this.data.chooseMembers;
    var newArr = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        // 如果重复，则i向前推进，但不管重复项
        if (arr[i].id == arr[j].id) j = ++i
      }
      // 将没有重复项的推入到新数组
      newArr.push(arr[i])
    }
    this.setData({
      chooseMembers: newArr
    })
    // console.log(newArr);
  },
  //创建比赛
  createGame:function(e){
    var that = this;
    // console.log(that.data.chooseMembers);
    var playerPoles = [];
    var add = true;
    (that.data.chooseMembers).map(function (item) {
      playerPoles.push({ userId: item.id})
    })
    var mainCourt = that.data.mainCourt;
    var minorCourt1 = that.data.minorCourt1;
    var minorCourt2 = that.data.minorCourt2;
    
    if (!that.data.gameName || !that.data.timeStr || !that.data.number1 || !that.data.mainCourt) {
      wx.showToast({ title: '请完善赛事信息', icon: 'none', duration: 1500 });
      return;
    }
    if (that.data.chooseMembers.length > that.data.number1){
      wx.showToast({ title: '赛事人数不能超过' + that.data.number1+'人', icon: 'none', duration: 1500 });
      return;
    }
    var timeStap = new Date(that.data.timeStr.replace(/-/g, '/')).getTime();//IOS系统不支持2017-01-01格式的时间
    
    if (that.data.gameId == 1) {
      http.postRequest({
        url: "match/create",
        params: {
          playerLimit: that.data.number1, players: playerPoles, matchName: that.data.gameName, startTime: timeStap,
          courtId: mainCourt.courtId, frontCourt: mainCourt.frontCourt, icon: app.globalData.userInfo.avatarUrl,
          backCourt: mainCourt.backCourt, uid: app.globalData.userInfo.id
        },
        msg: '创建中...',
        success: res => {
          wx.showToast({ title: '创建成功', icon: 'none', duration: 1500 })
          wx.navigateBack()
        }
      }, true);
    }else{
      http.postRequest({
        url: "match/update",
        params: {
          playerLimit: that.data.number1, players: playerPoles, matchName: that.data.gameName, startTime: timeStap,
          courtId: mainCourt.courtId, frontCourt: mainCourt.frontCourt, icon: app.globalData.userInfo.avatarUrl,
          backCourt: mainCourt.backCourt, uid: app.globalData.userInfo.id, matchId: that.data.gameId
        },
        msg: '修改中...',
        success: res => {
          wx.showToast({ title: '修改成功', icon: 'none', duration: 1500 })
          wx.navigateBack()
        }
      }, true);
    }
  }
});