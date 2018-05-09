

Page({

  /**
   * 页面的初始数据
   */
  data: {
    holes: [{ name: 'C1', role: 3 }, { name: 'C2', role: 3 }, { name: 'C3', role: 3 }, { name: 'C4', role: 3 },
      { name: 'C5', role: 3 }, { name: 'C6', role: 3 }, { name: 'C7', role: 3 }, { name: 'C8', role: 3 },
      { name: 'C9', role: 3 }, { name: 'D1', role: 3 }, { name: 'D2', role: 3 }, { name: 'D3', role: 3 }, 
      { name: 'D4', role: 3 }, { name: 'D5', role: 3 }, { name: 'D6', role: 3 }, { name: 'D7', role: 3 },
      { name: 'D8', role: 3 }, { name: 'D9', role: 3 }],
    radioType: 0,
    showPopup: false,
    number1: 4,
    disabled1: false,
    disabled2: false,
    activeHole:'C1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //PK规则、积分卡
  douChange: function (e) {
    this.setData({
      radioType: e.currentTarget.dataset.id
    })
  },
  //选择洞
  holeChange:function(e){
    console.log();
    this.setData({
      activeHole: e.currentTarget.id
    });
  },
  //设置分数
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    
  },
  //分数
  prevNum() {
    this.setData({
      number1: this.data.number1 >= 100 ? 100 : this.data.number1 + 1
    });
    this.setData({
      disabled1: this.data.number1 !== 1 ? false : true,
      disabled2: this.data.number1 !== 100 ? false : true
    });
  },
  nextNum() {
    this.setData({
      number1: this.data.number1 <= 1 ? 1 : this.data.number1 - 1
    });
    this.setData({
      disabled1: this.data.number1 !== 1 ? false : true,
      disabled2: this.data.number1 !== 100 ? false : true
    });
  },
  numberChange: function (e) {
    this.setData({
      number1: parseInt(e.detail.value) >= 100 ? 100 : parseInt(e.detail.value) <= 1 ? 1 : parseInt(e.detail.value)
    });
    this.setData({
      disabled1: this.data.number1 !== 1 ? false : true,
      disabled2: this.data.number1 !== 100 ? false : true
    });
  },
  //保存设置的分数
  saveScore:function(e){
    this.setData({
      showPopup: false
    });
  }
})