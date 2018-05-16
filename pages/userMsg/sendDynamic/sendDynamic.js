// pages/userMsg/sendDynamic/sendDynamic.js
var http = require("../../../http.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    attach:[],
    showPopup:false,
    check:false,
    syncGroupId:"",
    relates : [{
      relateId : "",
      relateType: "match"
    }],
    picType:[],
    belongType:"",
    imageWidth:'0px',
    upWidth:'0px'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      belongType: options.type,
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: ((res.windowWidth - 38) / 3)+'px',
          upWidth: (((res.windowWidth - 38) / 3)-2)+'px'
        });
        console.log(that.data.imageWidth);
      }
    });
  },

  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1){
      that.setData({
        picType: ['album', 'camera'],
        showPopup: false
      });
      that.chooseImage();
    } else if (id == 2){
      that.setData({
        picType: ['camera'],
        showPopup: false
      });
      that.chooseImage();
    } else if (id == 3){
      that.setData({
        picType: ['album', 'camera'],
        showPopup: false
      });
      that.chooseVideo();
    } else if (id == 4) {
      that.setData({
        picType: ['camera'],
        showPopup: false
      });
      that.chooseVideo();
    }
  },
  //隐私设置
  privacySet:function(e){
    var that = this;
    that.setData({
      check: e.detail.value
    });
  },
  //图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: that.data.picType, // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          files: that.data.files.concat(tempFilePaths)
        });

        for (var i in tempFilePaths){
          http.uploadFile(tempFilePaths[i],{
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
  chooseVideo:function(e){
    var that = this
    wx.chooseVideo({
      sourceType: that.data.picType,
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePath)
        })
      }
    })
  },
  bindChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  //发表动态
  postDynamic:function(e){
    var that = this;
    if (!that.data.content && !that.data.files) {
      wx.showToast({title: '请输入动态',icon: 'none',duration: 1500});
      return;
    }
    http.postRequest({
      url: "userPost/create",
      params: {
        content: that.data.content, relates: that.data.relates, attach: that.data.attach,
        syncGroupId: that.data.syncGroupId, hidden: that.data.check, uid: app.globalData.userInfo.id,
        belongType: that.data.belongType},
      msg: "发表中....",
      success: res => {
        wx.showToast({title: '创建成功',icon: 'info',duration: 1500});
        wx.navigateBack({
          delta: 1
        })
      }
    }, true);
  }
})