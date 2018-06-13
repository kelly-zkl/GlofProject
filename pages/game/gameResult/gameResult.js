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
    holeTitle:'三杆洞单场平均杆',
    totalTime:[],
    totalData:[],
    otherTime:[],
    otherData:[],
    otherArr:{},
    poleTime:[],
    poleData:[],
    poleArr:{}
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
    this.setData({
      holeType: e.currentTarget.dataset.id
    })
    if (num == 0){
      this.setData({
        holeTitle: '三杆洞单场平均杆',
        poleData: this.data.poleArr.x3
      })
    } else if (num == 1){
      this.setData({
        holeTitle: '四杆洞单场平均杆',
        poleData: this.data.poleArr.x4
      })
    }else{
      this.setData({
        holeTitle: '五杆洞单场平均杆',
        poleData: this.data.poleArr.x5
      })
    }
    this.holeCharts();
  },
  //各类成绩指标
  typeChange:function(e){
    this.setData({
      scoreType: e.currentTarget.id
    })
    var num = ''+(e.currentTarget.id-2)+'';
    this.setData({
      otherData: this.data.otherArr[num]
    })
    this.typesCharts();
  },
  //总杆
  totalCharts:function(){
    var that = this;
    new wxCharts({
      canvasId: 'totalCanvas',
      legend:false,
      type: 'line',
      extra: {
        lineStyle: 'curve'
      },
      categories: that.data.totalTime,
      series: [{
        name: ' ',
        color: '#66CC99',
        data: that.data.totalData,
        format: function (val) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      // xAxis:{
      //   disableGrid: true,
      // },
      width: this.data.chartWidth,
      height: 200
    });
  },
  
  //各项指标
  typesCharts:function(){
    var that = this;
    new wxCharts({
      canvasId: 'typeCanvas',
      legend: false,
      type: 'line',
      extra: {
        lineStyle: 'curve'
      },
      categories: that.data.otherTime,
      series: [{
        name: ' ',
        color: '#66CC99',
        data: that.data.otherData,
        format: function (val) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      // xAxis: {
      //   disableGrid: true,
      // },
      width: this.data.chartWidth,
      height: 200
    });
  },
  //三/四/五杆洞
  holeCharts:function(){
    var that = this;
    new wxCharts({
      canvasId: 'holeCanvas',
      legend: false,
      type: 'line',
      extra: {
        lineStyle: 'curve'
      },
      categories: that.data.poleTime,
      series: [{
        name: ' ',
        color: '#66CC99',
        data: that.data.poleData,
        format: function (val) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      // xAxis: {
      //   disableGrid: true,
      // },
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
    http.postRequest({
      url: "userMatch/gradle/total",
      params: {uid: app.globalData.userInfo.id},
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          totalTime:res.data.time,
          totalData: res.data.pole
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
    http.postRequest({
      url: "userMatch/gradle/various",
      params: { uid: app.globalData.userInfo.id },
      msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          otherTime: res.data.time,
          otherData: res.data['-2'],
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
    http.postRequest({
      url: "userMatch/gradle/pole",
      params: { uid: app.globalData.userInfo.id },
      msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          poleTime: res.data.time,
          poleData: res.data.x3,
          poleArr: res.data
        })
        if (that.data.poleTime.length > 0) {
          that.holeCharts();
        }
      }
    }, false);
  },
});