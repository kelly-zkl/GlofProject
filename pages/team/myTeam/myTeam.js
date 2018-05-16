var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var http = require("../../../http.js");
var util = require('../../../utils/util.js'); 

Page({
  data: {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    tabs: ["动态", "成员","队赛","资料"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    showPopup: false
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.setData({
      groupId: options.id
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGroupDetail();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //球队管理
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {//修改球队资料
      
    } else if (id == 2) {//卸任队长
      
    } else if (id == 3) {//退出球队
      that.setData({
        showPopup: false
      });
      that.quitTeam();
    } else if (id == 4) {
      that.setData({
        showPopup: false
      });
    }
  },
  //球员管理
  toggleMember() {
    this.setData({
      showMember: !this.data.showMember
    });
  },
  memberChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 2) {//修改正式差点

    } else if (id == 3) {//设为队长
      
    } else if (id == 4) {//设为秘书

    } else if (id == 5) {//设为管理员

    } else if (id == 6) {//踢出球队

    } else if (id == 7) {//取消
      that.setData({
        showMember: false
      });
    }
  },
  //管理成员
  toggleManager() {
    this.setData({
      showManager: !this.data.showManager
    });
  },
  memberChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {//邀请球友加入球队

    }else if (id == 2) {//导入比赛成员
      that.setData({
        showManager: false
      });
      wx.navigateTo({
        url: '/pages/team/importGameMem/importGameMem',
      })
    } else if (id == 3) {//群发消息
      that.setData({
        showManager: false
      });
      wx.navigateTo({
        url: '/pages/team/sendMsg/sendMsg',
      })
    } else if (id == 4) {//计算参考差点

    } else if (id == 5) {//同步参考差点-正式差点

    } else if (id == 6) {//退出球队
      that.setData({
        showManager: false
      });
      that.quitTeam();
    } else if (id == 7) {//取消
      that.setData({
        showManager: false
      });
    }
  },
  //获取球队详情
  getGroupDetail:function(e){
    var that = this;
    http.postRequest({
      url: "group/detail",
      params: {
        groupId: that.data.groupId, uid: app.globalData.userInfo.id
      },
      msg: "加载中....",
      success: res => {
        wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        res.data.createTime = util.formatTime(new Date(res.data.createTime*1000), '-');
        that.setData({
          team: res.data
        })
      }
    }, true);
  },
  //退出球队
  quitTeam:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出该球队？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "group/quit",
            params: {
              groupId: that.data.groupId, uid: app.globalData.userInfo.id
            },
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '已退出该球队', icon: 'info', duration: 1500 })
              wx.navigateBack({
                delta: 1
              })
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  }
});