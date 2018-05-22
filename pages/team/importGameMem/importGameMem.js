// pages/team/importGameMem/importGameMem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:1,
    games:[0,12,3,4,5,6,7,8,9],
    members: [{ selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false },
      { selected: false }, { selected: false }, { selected: false }, { selected: false }, { selected: false }],
    selectedAllStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //选择成员
  changeIndex:function(e){
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  //选择比赛
  bindCheckbox: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var selected = this.data.members[index].selected;
    var members = this.data.members;
    if (!selected) {
      // this.setData({
      // });
    } else {
      // this.setData({
      // });
    }

    members[index].selected = !selected;

    this.setData({
      members: members
    });
  },
  //全选 全不选
  bindSelectAll: function (e) {
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    var members = this.data.members;
    (members).map(function (item) {
      item.selected = selectedAllStatus
    })

    this.setData({
      members: members,
      selectedAllStatus: selectedAllStatus
    });
  },
})