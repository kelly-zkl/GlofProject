var model = require('../../../template/model/model.js')
var http = require("../../../http.js");

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
    coachType:0,
    coachLev:0,
    files:[],
    showPic: false,
    imageWidth: '0px',
    imageHeight:'0px',
    upWidth: '0px',
    upHeight:'0px',
    picType: ['album', 'camera']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: ((res.windowWidth - 34) / 2) + 'px',
          imageHeight: ((res.windowWidth - 34) / 3) + 'px',
          upWidth: (((res.windowWidth - 34) / 2) - 2) + 'px',
          upHeight: (((res.windowWidth - 34) / 3) - 2) + 'px'
        });
        console.log(that.data.imageWidth);
      }
    });
  },
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //教练类型
  typeChange: function (e) {
    this.setData({
      coachType: e.currentTarget.dataset.id
    })
  },
  //级别
  levChange: function (e) {
    this.setData({
      coachLev: e.currentTarget.dataset.id
    })
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
  //上传图片
  togglePopup() {
    this.setData({
      showPic: !this.data.showPic
    });
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {
      that.setData({
        picType: ['album', 'camera'],
        showPic: false
      });
      that.chooseImage();
    } else if (id == 2) {
      that.setData({
        picType: ['camera'],
        showPic: false
      });
      that.chooseImage();
    }
  },
  //图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: that.data.picType, // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          files: that.data.files.concat(tempFilePaths)
        });

        for (var i in tempFilePaths) {
          http.uploadFile(tempFilePaths[i], {
            success: function (res) {
              console.log(res.data);
              that.setData({
                attach: that.data.attach.concat(res.data)
              });
            }
          })
        }
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //提交审核
  commit:function(){

  }
})