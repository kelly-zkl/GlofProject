var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
var wxCharts = require('../../../utils/wxcharts-min.js');
const app = getApp();

Page({
  data: {
    tabs: ["最近10场成绩", "年度打球汇总"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scoreType:0,
    holeType:0,
    titles: ['三杆洞单场平均杆', '四杆洞单场平均杆', '五杆洞单场平均杆'],
    holeTitle:'三杆洞单场平均杆',
    totalTime:[],
    totalData:[],
    otherTime:[],
    otherData:[],
    otherArr:{},
    poleTime:[],
    poleData:[],
    chooseMembers: []
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          chartWidth: res.windowWidth-22
        });
      }
    });

    that.setData({
      chooseMembers: [app.globalData.userInfo]
    })

    that.getTotalData();
    that.getOtherData();
    that.getPoleData();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id==0){//最近10场比赛数据
      this.getTotalData();
      this.getOtherData();
      this.getPoleData();
    }else{//年度打球汇总
      this.yearCharts();
    }
  },
  //三/四/五杆洞
  holeChange:function(e){
    var num = e.currentTarget.dataset.id;
    var data = [];
    this.setData({
      holeType: e.currentTarget.dataset.id,
      holeTitle:this.data.titles[num]
    })
    if (num == 0) {//三杆洞
      (this.data.poleArr).map(function (item) {
        data.push({ name: item.name, data: item.x3})
      });
      this.setData({
        poleData: data
      })
    } else if (num == 1) {//四杆洞
      (this.data.poleArr).map(function (item) {
        data.push({ name: item.name, data: item.x4})
      });
      this.setData({
        poleData: data
      })
    } else {//五杆洞
      (this.data.poleArr).map(function (item) {
        data.push({ name: item.name, data: item.x5})
      });
      this.setData({
        poleData: data
      })
    }
    
    if (this.data.poleTime.length > 0) {//有数据现实折线图
      this.holeCharts();
    }
  },
  //各类成绩指标
  typeChange:function(e){
    this.setData({
      scoreType: e.currentTarget.id
    })
    var num = ''+(e.currentTarget.id-2)+'';
    var data = [];
    (this.data.otherArr).map(function (item) {
      data.push({ name: item.name, data: item[num]})
    });
    this.setData({
      otherData: data
    })
    if (this.data.otherTime.length > 0) {
      this.typesCharts();
    }
  },
  //总杆
  totalCharts:function(){
    var that = this;
    new wxCharts({
      canvasId: 'totalCanvas',
      type: 'line',
      extra: {
        lineStyle: 'curve'
      },
      categories: that.data.totalTime,
      series: that.data.totalData,
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      xAxis:{
        disableGrid: true,
      },
      width: this.data.chartWidth,
      height: 200
    });
  },
  
  //各项指标
  typesCharts:function(){
    var that = this;
    new wxCharts({
      canvasId: 'typeCanvas',
      type: 'line',
      extra: {
        lineStyle: 'curve'
      },
      categories: that.data.otherTime,
      series: that.data.otherData,
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      xAxis: {
        disableGrid: true,
      },
      width: this.data.chartWidth,
      height: 200
    });
  },
  //三/四/五杆洞
  holeCharts:function(){
    var that = this;
    new wxCharts({
      canvasId: 'holeCanvas',
      type: 'line',
      extra: {
        lineStyle: 'curve'
      },
      categories: that.data.poleTime,
      series: that.data.poleData,
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      xAxis: {
        disableGrid: true,
      },
      width: this.data.chartWidth,
      height: 200
    });
  },
  //年度打球汇总
  yearCharts:function(){
    var that = this;
    http.postRequest({
      url: "userMatch/gradle/summary/year",
      params: { uid: app.globalData.userInfo.id },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          yearData:res.data
        })
      }
    }, true);
  },
  //总杆数据
  getTotalData:function(){
    var that = this;
    var playerPoles = [];
    (that.data.chooseMembers).map(function (item, idx) {
      playerPoles[idx] = item.id;
    })
    http.postRequest({
      url: "userMatch/gradle/total",
      params: { uid: app.globalData.userInfo.id, userIds: playerPoles},
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        var data = [];
        (res.data).map(function (item) {
          data.push({ name: item.name, data: item.pole})
        });

        that.setData({
          totalTime:res.data[0].time,
          totalData: data
        })
        if (that.data.totalTime.length >0){
          that.totalCharts();
        }
      }
    }, true);
  },
  //各项指标
  getOtherData: function () {
    var that = this;
    var playerPoles = [];
    (that.data.chooseMembers).map(function (item, idx) {
      playerPoles[idx] = item.id;
    })
    http.postRequest({
      url: "userMatch/gradle/various",
      params: { uid: app.globalData.userInfo.id, userIds: playerPoles },
      msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        var data = [];
        (res.data).map(function (item) {
          data.push({ name: item.name, data: item['-2']})
        });
        that.setData({
          otherTime: res.data[0].time,
          otherData: data,
          otherArr:res.data
        })
        if (that.data.otherTime.length > 0) {
          that.typesCharts();
        }
      }
    }, false);
  },
  //三/四/五杆
  getPoleData: function () {
    var that = this;
    var playerPoles = [];
    (that.data.chooseMembers).map(function (item, idx) {
      playerPoles[idx] = item.id;
    })
    http.postRequest({
      url: "userMatch/gradle/pole",
      params: { uid: app.globalData.userInfo.id, userIds: playerPoles },
      msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        var data = [];
        (res.data).map(function (item) {
          data.push({ name: item.name, data: item.x3})
        });
        that.setData({
          poleTime: res.data[0].time,
          poleData: data,
          poleArr: res.data
        })
        if (that.data.poleTime.length > 0) {
          that.holeCharts();
        }
      }
    }, false);
  },
  //选择对比成员
  addMembers: function () {
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
    this.getTotalData();
    this.getOtherData();
    this.getPoleData();
  },
  // 添加我关注的球友对比成绩
  gotoMembers:function(){
    this.setData({
      chooseMembers: [app.globalData.userInfo]
    })
    wx.navigateTo({
      url: '/pages/choose/followMember/followMember?type=2&num=' + (4-this.data.chooseMembers.length)
    })
  }
});