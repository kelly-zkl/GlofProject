var base64 = require("../../../images/base64");

Page({
  data: {
    cards: [{ name: '今日比赛' }, { name: '总杆排名' }, { name: '赛事人气' }]
  },
  onLoad: function () {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
  },
  //发起约球
  orderBall:function(){
    wx.navigateTo({
      url: '/pages/game/invitationGame/invitationGame',
    })
  }
});
