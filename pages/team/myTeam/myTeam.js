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
    showPopup: false,
    showReply: false,
    showDelete: false,
    showModify:false,
    showRefer:false,
    showSync:false,
    dynamics: [],
    imageWidth: '0px',
    page: 1,
    size: 10,
    radioType: 0,
    members:[]
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imageWidth: ((res.windowWidth - 50) / 4) + 'px',//weui-cell的padding:10px 15px
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
    
    if (this.data.activeIndex == 0) {//动态
      this.getDynamics();
    } else if (this.data.activeIndex == 1) {//成员
      this.getMembers();
    } else if (this.data.activeIndex == 2) {//队赛
      // this.getFans();
    }
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//动态
      this.getDynamics();
    } else if (e.currentTarget.id == 1) {//成员
      this.getMembers();
    } else if (e.currentTarget.id == 2) {//队赛
      // this.getFans();
    } else {//详情
      this.getGroupDetail();
    }
  },
  //成员详情、成员头像
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
  //获取动态列表
  getDynamics: function (e) {
    var that = this;
    http.postRequest({
      url: "userPost/homePage",
      params: {
        belongId: that.data.groupId, page: that.data.page, size: that.data.size,
        belongType: "group", uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        this.setData({
          dynamics: res.data.content
        })
      }
    }, false);
  },
  //跳转到发动态页面
  gotoPost: function () {
    wx.navigateTo({
      url: '/pages/userMsg/sendDynamic/sendDynamic?type=group',
    })
  },
  //跳转到关联比赛页面
  relationGame: function () {
    wx.navigateTo({
      url: '/pages/choose/mulitGames/mulitGames',
    })
  },
  //跳转到个人主页
  gotoPer: function (e) {
    if (e.currentTarget.id != app.globalData.userInfo.id) {//本人的动态
      wx.navigateTo({
        url: '/pages/userMsg/personalPage/personalPage?tab=0&id=' + e.currentTarget.id,
      })
    }
  },
  //跳转到比赛详情页
  gotoGame: function (e) {
    wx.navigateTo({
      url: '/pages/game/gameDetail/gameDetail?id=' + e.currentTarget.id,
    })
  },
  //跳转到球队主页
  gotoTeam: function (e) {
    wx.navigateTo({
      url: '/pages/team/teamDetail/teamDetail?id=' + e.currentTarget.id,
    })
  },
  //修改正式差点
  toggleModify() {
    this.setData({
      showMember:false,
      showModify: !this.data.showModify
    });
  },
  //计算参考差点
  toggleRefer() {
    this.setData({
      showManager: false,
      showRefer: !this.data.showRefer
    });
  },
  //同步参考差点 => 正式差点
  toggleSync() {
    this.setData({
      showManager: false,
      showSync: !this.data.showSync
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
      wx.navigateTo({
        url: '/pages/team/createTeam/createTeam?id=' + this.data.team.groupId,
      })
    } else if (id == 2) {//卸任队长
      that.setPosition(false, 'member');
    } else if (id == 3) {//退出球队
      that.quitTeam();
    }
    that.setData({
      showPopup: false
    });
  },
  //球员详情
  toggleMember(e) {
    this.setData({
      showMember: !this.data.showMember,
      userId: e.currentTarget.id,
      userName:e.currentTarget.dataset.name
    });
  },
  memberChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1){//队员主页
      wx.navigateTo({
        url: '/pages/userMsg/personalPage/personalPage?tab=1&id=' + that.data.userId,
      })
    } else if (id == 2) {//修改正式差点

    } else if (id == 3) {//设为队长
      that.setPosition(true,'leader');
    } else if (id == 4) {//设为秘书
      that.setPosition(true, 'secretary');
    } else if (id == 5) {//设为管理员
      that.setPosition(true, 'admin');
    } else if (id == 6) {//踢出球队
      that.hackingTeam();
    }
    that.setData({
      showMember: false
    });
  },
  //管理成员
  toggleManager() {
    this.setData({
      showManager: !this.data.showManager
    });
  },
  managerChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {//邀请球友加入球队

    }else if (id == 2) {//导入比赛成员
      wx.navigateTo({
        url: '/pages/choose/gameMember/gameMember',
      })
    } else if (id == 3) {//群发消息
      wx.navigateTo({
        url: '/pages/team/sendMsg/sendMsg',
      })
    } else if (id == 6) {//退出球队
      that.quitTeam();
    }
    that.setData({
      showManager: false
    });
  },
  //获取球队详情
  getGroupDetail:function(e){
    var that = this;
    http.postRequest({
      url: "group/detail",
      params: {
        groupId: that.data.groupId, uid: app.globalData.userInfo.id
      },
      // msg: "加载中....",
      success: res => {
        // wx.showToast({ title: '加载成功', icon: 'info', duration: 1500 });
        // res.data.createTime = util.formatTime(new Date(res.data.createTime*1000), '-');
        that.setData({
          team: res.data
        })
      }
    }, false);
  },
  //踢出球队
  hackingTeam:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要将该成员踢出球队？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "group/hacking",
            params: {
              groupId: that.data.groupId, uid: app.globalData.userInfo.id, userId: that.data.userId
            },
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '操作成功', icon: 'info', duration: 1500 })
              this.getMembers();
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
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
              wx.navigateBack()
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.urls // 需要预览的图片http链接列表
    })
  },
  //删除动态
  deleteDyna: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该动态？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "userPost/delete",
            params: {
              id: e.currentTarget.id, uid: app.globalData.userInfo.id
            },
            msg: "操作中...",
            success: res => {
              that.getDynamics();
              wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 })
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  },
  //删除回复
  deleteReply: function (value) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该回复？',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            url: "replyPost/delete",
            params: {
              replyPostId: that.data.beReplyPostId, uid: app.globalData.userInfo.id
            },
            msg: "操作中...",
            success: res => {
              that.getDynamics();
              wx.showToast({ title: '删除成功', icon: 'info', duration: 1500 })
            }
          }, true);
        } else if (res.cancel) {
        }
      }
    })
  },
  toggleDelete() {
    this.setData({
      showDelete: !this.data.showDelete
    });
  },
  deleteChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {//删除评论
      that.deleteReply();
    }
    that.setData({
      showDelete: false
    });
  },
  //创建回复
  createReply: function (e) {
    var that = this;
    if (e.detail.value.length > 0) {
      http.postRequest({
        url: "replyPost/create",
        params: {
          userPostId: that.data.userPostId, uid: app.globalData.userInfo.id, content: e.detail.value,
          beReplyPostId: that.data.beReplyPostId
        },
        msg: "操作中...",
        success: res => {
          that.getDynamics();
        }
      }, true);
    }
    that.setData({
      showReply: false
    });
  },
  toggleReply() {
    this.setData({
      showReply: !this.data.showReply
    });
  },
  pressReply: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.replyId) {//有评论id
      if (e.currentTarget.dataset.uid == app.globalData.userInfo.id) {//本人的动态
        this.setData({
          showDelete: true,
          userPostId: e.currentTarget.id,
          beReplyPostId: e.currentTarget.dataset.replyId
        });
      } else {//自己的评论可删除
        this.setData({
          showReply: true,
          userPostId: e.currentTarget.id,
          beReplyPostId: e.currentTarget.dataset.replyId
        });
      }
    } else {//没有评论的时候，只能评论
      this.setData({
        showReply: true,
        userPostId: e.currentTarget.id,
        beReplyPostId: e.currentTarget.dataset.replyId
      });
    }
  },
  //点赞
  userVote: function (e) {
    http.postRequest({
      url: "userPost/vote",
      params: {
        bbsId: e.currentTarget.id, uid: app.globalData.userInfo.id, voted: e.currentTarget.dataset.voted
      },
      success: res => {
        this.getDynamics();
      }
    }, false);
  },
  //群主设置成员职位
  setPosition: function (admin, tag){
    http.postRequest({
      url: "group/appoint",
      params: {//标签 群主:admin 队长:leader 秘书:secretary 成员:member 临时成员:snap
        groupId: that.data.groupId, uid: app.globalData.userInfo.id, userId: that.data.userId,
        admin: admin, tag: tag
      },
      msg: "操作中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'info', duration: 1500 })
      }
    }, true);
  },
  //获取球员列表
  getMembers(){
    var that = this;
    http.postRequest({
      url: "group/members",
      params: {
        groupId: that.data.groupId
      },
      success: res => {
        that.setData({
          members: res.data.content
        })
      }
    }, false);
  }
});