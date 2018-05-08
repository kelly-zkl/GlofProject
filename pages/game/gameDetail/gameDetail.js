

Page({
  data: {
    radioType:1,
    showPopup: true,
    groupId:''
  },
  onLoad: function (options) {
    // var that = this;
    // that.setData({
    //   groupId: options.id
    // });
  },
  onShow:function(){
    this.setData({
      radioType: 1
    })
  },
  //PK规则、积分卡、主页面
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
    if (e.currentTarget.dataset.id == 0){//PK规则
      wx.navigateTo({
        url: '/pages/rules/pkRule/pkRule',
      })
    } else if (e.currentTarget.dataset.id == 2){//记分卡
      wx.navigateTo({
        url: '/pages/game/gameScore/gameScore',
      })
    }
  },
  //关注比赛/加入比赛
  togglePopup:function(e) {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  //关注比赛
  followGame:function(e) {
    // var that = this;
    // http.postRequest({
    //   url: "user/addFollower",
    //   params: { beFollowedId: that.data.groupId, beFollowedType: "match", uid: app.globalData.userInfo.id },
    //   msg: "加载中...",
    //   success: res => {
    //     wx.showToast({ title: '关注成功', icon: 'info', duration: 1500 })
    //     this.setData({
    //       showPopup: !this.data.showPopup
    //     });
    //   }
    // }, true);
  },
  //取消关注比赛
  unFollowGame:function(e) {
    var that = this;
    http.postRequest({
      url: "user/cancelFollower",
      params: {
        id: that.data.userInfo.followedId, uid: app.globalData.userInfo.id,
        beFollowedType: "match"
      },
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '已取消关注', icon: 'info', duration: 1500 })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    }, true);
  },
  //加入比赛
  joinGame:function(e) {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  //退出比赛
  quitGame:function(e){

  }
});