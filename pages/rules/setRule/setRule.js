// pages/game/setRule/setRule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rules: [{ url: '../../../images/pic_160.png', name: '比杆', path:'/pages/rules/rodRule/rodRule',show:true},
      { url: '../../../images/pic_160.png', name: '比洞', path: '/pages/rules/holeRule/holeRule', show: true},
      { url: '../../../images/pic_160.png', name: '斗地主', path: '/pages/rules/doudeRule/doudeRule', show: true},
      { url: '../../../images/pic_160.png', name: '斗地主（3+1）', 
        path: '/pages/rules/doude3Rule/doude3Rule', show: true },
      { url: '../../../images/pic_160.png', name: '拉斯', path: '/pages/rules/lassRule/lassRule', show: true },
      { url: '../../../images/pic_160.png', name: '8421', path: '/pages/rules/8421/8421', show: true },
      { url: '../../../images/pic_160.png', name: '2分头尾肉', path: '/pages/rules/divideRule/divideRule', show: true },
      { url: '../../../images/pic_160.png', name: '打老虎', path: '/pages/rules/tigerRule/tigerRule', show: true }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value.length <= 1){//不能选择
      this.setData({
        rules: [{ url: '../../../images/pic_160.png', name: '比杆', path: '/pages/rules/rodRule/rodRule', show: false },
          { url: '../../../images/pic_160.png', name: '比洞', path: '/pages/rules/holeRule/holeRule', show: false },
          { url: '../../../images/pic_160.png', name: '斗地主', path: '/pages/rules/doudeRule/doudeRule', show: false },
          { url: '../../../images/pic_160.png', name: '斗地主（3+1）', 
            path: '/pages/rules/doude3Rule/doude3Rule', show: false },
          { url: '../../../images/pic_160.png', name: '拉斯', path: '/pages/rules/lassRule/lassRule', show: false },
          { url: '../../../images/pic_160.png', name: '8421', path: '/pages/rules/8421/8421', show: false },
          { url: '../../../images/pic_160.png', name: '2分头尾肉', 
            path: '/pages/rules/divideRule/divideRule', show: false },
          { url: '../../../images/pic_160.png', name: '打老虎', path: '/pages/rules/tigerRule/tigerRule', show: false }]
      })
    } else if (e.detail.value.length == 2){//2人可选择比杆、比洞
      this.setData({
        rules: [{ url: '../../../images/pic_160.png', name: '比杆', path: '/pages/rules/rodRule/rodRule', show: true },
          { url: '../../../images/pic_160.png', name: '比洞', path: '/pages/rules/holeRule/holeRule', show: true },
          { url: '../../../images/pic_160.png', name: '斗地主', path: '/pages/rules/doudeRule/doudeRule', show: false },
        {
          url: '../../../images/pic_160.png', name: '斗地主（3+1）',
          path: '/pages/rules/doude3Rule/doude3Rule', show: false
        },
        { url: '../../../images/pic_160.png', name: '拉斯', path: '/pages/rules/lassRule/lassRule', show: false },
        { url: '../../../images/pic_160.png', name: '8421', path: '/pages/rules/8421/8421', show: false },
        { url: '../../../images/pic_160.png', name: '2分头尾肉', 
          path: '/pages/rules/divideRule/divideRule', show: false },
        { url: '../../../images/pic_160.png', name: '打老虎', path: '/pages/rules/tigerRule/tigerRule', show: false }]
      })
    } else if (e.detail.value.length == 3) {//3人可选择比杆、比洞、斗地主、打老虎
      this.setData({
        rules: [{ url: '../../../images/pic_160.png', name: '比杆', path: '/pages/rules/rodRule/rodRule', show: true },
          { url: '../../../images/pic_160.png', name: '比洞', path: '/pages/rules/holeRule/holeRule', show: true },
          { url: '../../../images/pic_160.png', name: '斗地主', path: '/pages/rules/doudeRule/doudeRule', show: true },
        {
          url: '../../../images/pic_160.png', name: '斗地主（3+1）',
          path: '/pages/rules/doude3Rule/doude3Rule', show: false
        },
        { url: '../../../images/pic_160.png', name: '拉斯', path: '/pages/rules/lassRule/lassRule', show: false },
        { url: '../../../images/pic_160.png', name: '8421', path: '/pages/rules/8421/8421', show: false },
        { url: '../../../images/pic_160.png', name: '2分头尾肉',
           path: '/pages/rules/divideRule/divideRule', show: false },
        { url: '../../../images/pic_160.png', name: '打老虎', path: '/pages/rules/tigerRule/tigerRule', show: true }]
      })
    } else if (e.detail.value.length == 4) {//4人可以选择全部
      this.setData({
        rules: [{ url: '../../../images/pic_160.png', name: '比杆', path: '/pages/rules/rodRule/rodRule', show: true },
          { url: '../../../images/pic_160.png', name: '比洞', path: '/pages/rules/holeRule/holeRule', show: true },
          { url: '../../../images/pic_160.png', name: '斗地主', path: '/pages/rules/doudeRule/doudeRule', show: true },
          { url: '../../../images/pic_160.png', name: '斗地主（3+1）', 
            path: '/pages/rules/doude3Rule/doude3Rule', show: true },
          { url: '../../../images/pic_160.png', name: '拉斯', path: '/pages/rules/lassRule/lassRule', show: true },
        { url: '../../../images/pic_160.png', name: '8421', path: '/pages/rules/8421/8421', show: true },
        { url: '../../../images/pic_160.png', name: '2分头尾肉', 
          path: '/pages/rules/divideRule/divideRule', show: true },
        { url: '../../../images/pic_160.png', name: '打老虎', path: '/pages/rules/tigerRule/tigerRule', show: true }]
      })
    }
  }
})