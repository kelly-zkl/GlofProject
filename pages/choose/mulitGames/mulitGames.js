// pages/team/relationGame/relationGame.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    games: [{ selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false },
    { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }],
    selectedAllStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //选择比赛
  bindCheckbox: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var selected = this.data.games[index].selected;
    var games = this.data.games;
    if (!selected) {
      // this.setData({
      // });
    } else {
      // this.setData({
      // });
    }

    games[index].selected = !selected;

    this.setData({
      games: games
    });
  },
  //全选 全不选
  bindSelectAll: function (e) {
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    var games = this.data.games;
    (games).map(function (item) {
      item.selected = selectedAllStatus
    })

    this.setData({
      games: games,
      selectedAllStatus: selectedAllStatus
    });
  },
  //确定关联比赛
  chooseGame: function () {

  }
})