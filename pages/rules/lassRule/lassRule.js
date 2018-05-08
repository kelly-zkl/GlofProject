
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 1,
    radioDing: 0,
    radioShou: 0,
    radioBao: 0,
    radioGroup:0,
    handicap: true,
    avoid: true,
    count:0,
    good:false,
    poor:false,
    all:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //保存设置
  saveSet: function () {

  },
  //分组
  groupChange:function(e){
    this.setData({
      radioGroup: e.currentTarget.dataset.id
    })
  },
  //记分方式
  scoreChange:function(e){
    if (e.currentTarget.dataset.id == 0){//较好成绩
      this.setData({
        good: !this.data.good
      })
      if (this.data.good){
        this.setData({
          count: this.data.count + 1
        })
      }else{
        this.setData({
          count: this.data.count - 1
        })
      }
    } else if (e.currentTarget.dataset.id == 1){//较差成绩
      this.setData({
        poor: !this.data.poor
      })
      if (this.data.poor) {
        this.setData({
          count: this.data.count + 1
        })
      } else {
        this.setData({
          count: this.data.count - 1
        })
      }
    } else if (e.currentTarget.dataset.id == 2){//总分
      this.setData({
        all: !this.data.all
      })
      if (this.data.all) {
        this.setData({
          count: this.data.count + 1
        })
      } else {
        this.setData({
          count: this.data.count - 1
        })
      }
    }
  },
  //顶洞
  dingChange: function (e) {
    this.setData({
      radioDing: e.currentTarget.dataset.id
    })
  },
  //收顶洞
  shouChange: function (e) {
    this.setData({
      radioShou: e.currentTarget.dataset.id
    })
  },
  //包洞
  baoChange: function (e) {
    this.setData({
      radioBao: e.currentTarget.dataset.id
    })
  },
  //让分
  handicapSet: function (e) {
    this.setData({
      handicap: e.detail.value
    })
  },
  //避开地雷
  avoidSet: function (e) {
    this.setData({
      avoid: e.detail.value
    })
  }
})