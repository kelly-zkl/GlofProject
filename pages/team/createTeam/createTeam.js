// pages/team/createTeam/createTeam.js
var model = require('../../../template/model/model.js')
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 
var app = getApp();

var show = false;
var item = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      show: show
    },
    showPopup: false,
    allowSJoin:true,
    date:"2017-09-01",
    thumbUrl:"../../../images/pic_160.png",
    team:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      date: util.getNowDate(),
      groupId: options.id
    });  
    wx.setNavigationBarTitle({
      title: that.data.groupId == 1 ? "创建球队" : "修改球队信息"
    })
    if (that.data.groupId != 1){
      that.getGroupDetail();
    }
  },
  //获取球队详情
  getGroupDetail: function (e) {
    var that = this;
    http.postRequest({
      url: "group/detail",
      params: {
        groupId: that.data.groupId, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        that.setData({
          team: res.data,
          groupName: res.data.groupName,
          thumbUrl: res.data.thumbUrl,
          date: res.data.setupTime,
          claim: res.data.claim,
          intro: res.data.intro,
          slogan: res.data.slogan,
          province: res.data.province,
          city: res.data.city,
          allowSJoin: res.data.allowSJoin
        })
      }
    }, false);
  },
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  showArea: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },
  //确定选择
  chooseCity: function (e) {
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    // console.log(e)
    model.updateAreaData(this, 1, e);
    item = this.data.item;
  },
  //选择上传图片
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {
      that.setData({
        picType: ["album", "camera"],
        showPopup: false
      });
    } else if (id == 2) {
      that.setData({
        picType: ["camera"],
        showPopup: false
      });
    }
    that.chooseImage();
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count:1,
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
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  //输入球队名称
  inputName: function (e) {
    this.setData({
      groupName: e.detail.value
    });
  },
  //日期选择
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //输入球员要求
  inputClaim: function (e) {
    this.setData({
      claim: e.detail.value
    });
  },
  //输入球队口号
  inputSlogan: function (e) {
    this.setData({
      slogan: e.detail.value
    });
  },
  //输入球队简介
  inputIntro: function (e) {
    this.setData({
      intro: e.detail.value
    });
  }, 
  //是否允许陌生人加入
  joinSet: function (e) {
    var that = this;
    that.setData({
      allowSJoin: e.detail.value
    });
  },
  //创建球队--修改球队信息
  createTeam:function(e){
    var that = this;
    if (!that.data.groupName || !that.data.slogan || !that.data.province || !that.data.city ||
      that.data.thumbUrl =="../../../images/pic_160.png" || !that.data.claim || 
      !that.data.intro || !that.data.date) {
      wx.showToast({ title: '请完善球队信息', icon: 'none', duration: 1500 });
      return;
    }
    if (this.data.groupId == 1) {
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
          wx.navigateBack()
        }
      }, true);
    }else{
      http.postRequest({
        url: "group/update",
        params: {
          slogan: that.data.slogan, province: that.data.province, city: that.data.city, setupTime: that.data.date,
          groupName: that.data.groupName, thumbUrl: that.data.thumbUrl, claim: that.data.claim,
          intro: that.data.intro, allowSJoin: that.data.allowSJoin, uid: app.globalData.userInfo.id, groupId: that.data.groupId
        },
        msg: '修改中...',
        success: res => {
          wx.showToast({ title: '修改成功', icon: 'none', duration: 1500 })
          wx.navigateBack()
        }
      }, true);
    }
  }
})