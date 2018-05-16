// pages/userMsg/feedBack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files:[],
    imageWidth: '0px',
    upWidth: '0px'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: ((res.windowWidth - 42) / 4) + 'px',
          upWidth: (((res.windowWidth - 42) / 4) - 2) + 'px'
        });
        console.log(that.data.imageWidth);
      }
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
  //输入的意见内容
  bindChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  //发送意见反馈
  send:function(e){

  }
})