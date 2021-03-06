// pages/userMsg/sendDynamic/sendDynamic.js
var http = require("../../../http.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    content:'',
    images:[],
    attach:[],
    showPopup:false,
    check:false,
    isShow:true,
    picType:[],
    belongType:"",
    imageWidth:'0px',
    upWidth:'0px',
    chooseGames:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      belongType: options.type,
      belongId: app.globalData.userInfo.id
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
    if (options.type == 'match'){
      that.setData({
        chooseGames: [{matchId: options.relateId, matchName: options.gameName}],
        belongId: options.relateId
      });
    } else if (options.type == 'group'){
      that.setData({
        chooseTeam: {groupId: options.teamId, groupName: options.teanName},
        belongId: options.teamId,
        isShow:false
      });
    }
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
      count: (9 - that.data.files.length),
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: that.data.picType, // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var arry = [];
        tempFilePaths.map(function(item){
          arry.push({ type: 0, url: item})
        })
        that.setData({
          files: that.data.files.concat(tempFilePaths),
          images: that.data.images.concat(arry)
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
      maxDuration: 30,
      camera: 'back',
      success: function (res) {
        console.log(res);
        that.setData({
          files: that.data.files.push(res.tempFilePath),
          images: that.data.images.push({ type: 1, url: res.tempFilePath})
        })
       
        http.uploadFile(res.tempFilePath, {
          success: function (res) {
            that.setData({
              attach: that.data.attach.push(res.data)
            });
          }
        })
      }
    })
    console.log(that.data.files);
    console.log(that.data.images);
  },
  bindChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  //选择关联的比赛
  addGames: function () {
    var arr = this.data.chooseGames;
    var newArr = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        // 如果重复，则i向前推进，但不管重复项
        if (arr[i].matchId == arr[j].matchId) j = ++i
      }
      // 将没有重复项的推入到新数组
      newArr.push(arr[i])
    }
    this.setData({
      chooseGames: newArr
    })
    // console.log(newArr);
  },
  //发表动态
  postDynamic:function(e){
    var that = this;
    var relates = [];
    
    if (that.data.chooseGames && that.data.chooseGames.length > 0){
      (that.data.chooseGames).map(function (item) {
        relates.push({relateId: item.matchId, relateType: "match"})
      });
    }
    var syncGroupId='';
    if (that.data.chooseTeam){
      syncGroupId = that.data.chooseTeam.groupId;
    }
    
    if (that.data.content.length == 0 && that.data.files.length == 0) {
      wx.showToast({title: '动态不能为空',icon: 'none',duration: 1500});
      return;
    }
    
    http.postRequest({
      url: "userPost/create",
      params: {
        content: that.data.content, relates: relates, attach: that.data.attach,
        syncGroupId: syncGroupId, hidden: that.data.check, uid: app.globalData.userInfo.id,
        belongType: that.data.belongType, belongId: that.data.belongId},
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