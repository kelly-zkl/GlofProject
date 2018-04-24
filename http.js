/**
 * http请求
 * */
const baseUrl = "http://192.168.31.30:8080/";
var requestHandler = {
  url:"",
  params: {},
  msg:"",
  success: function (res) {}
}
const request = (method, requestHandler, isShowLoading) => {
  var param = requestHandler.params;
  isShowLoading && wx.showLoading && wx.showLoading({ title: requestHandler.msg})  
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + requestHandler.url,
      method:method,
      data:param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {//请求成功
        isShowLoading && wx.hideLoading && wx.hideLoading();
        console.log(res.data);
        requestHandler.success(res);
        resolve(res);
      },
      fail:function(err){//请求失败
        console.log(err);
        isShowLoading && wx.hideLoading && wx.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'info',
          duration: 1500
        });
        reject(new Error('Network request failed'));
      }
    })
  })
}
//get请求
const getRequest = (requestHandler, isShowLoading) =>{
  request("GET", requestHandler, isShowLoading);
}
//post请求
const postRequest = (requestHandler, isShowLoading) => {
  request("POST", requestHandler, isShowLoading);
}

/**
 * 上传文件
 * */
const uploadFile = (url,path,param) =>{
  wx.showLoading({ title: '正在上传...', })
  const uploadTask = wx.uploadFile({
    url: url,
    filePath: path,
    name: 'file',
    formData: param,
    success: function (res) {
      wx.hideLoading();
      var data = res.data
    },
    fail: function (err) {
      console.log(err);
      wx.hideLoading();
      wx.showToast({
        title: '上传失败',
        icon: 'success',
        duration: 1500
      });
    }
  })
}

/**
 * 下载文件
 */
const downloadFile = (url) =>{
  const downloadTask = wx.downloadFile({
    url: url,
    success: function (res) {
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          })
        }
      })
    },
    fail: function (err) {
      console.log(err);
    }
  })
}
  
module.exports = {
  getRequest: getRequest,
  postRequest: postRequest,
  uploadFile: uploadFile,
  downloadFile: downloadFile
}
