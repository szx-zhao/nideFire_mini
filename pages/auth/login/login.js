var api = require('../../../config/api.js');
//逻辑代码，用于实现用户登录功能
/**
 * 在页面初始化时，定义了一些数据，包括用户名、密码、验证码和登录错误次数。
 * 在用户点击登录按钮时，会触发startLogin函数，该函数会检查用户名和密码是否为空，如果为空则会弹出错误提示框。
 * 如果用户名和密码都不为空，则会向服务器发送POST请求，请求地址为api.ApiRootUrl + 'auth/login'，请求参数为用户名和密码。
 * 如果请求成功，且返回的状态码为200，则会将登录错误次数重置为0，并将服务器返回的token存储到本地存储中。
 * 最后，跳转到个人中心页面。除此之外，还定义了一些输入框绑定函数和清空输入框函数。
 */
var app = getApp();
Page({
  data: {
    username: '',
    password: '',
    code: '',
    loginErrorCount: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  startLogin: function () {
    var that = this;

    if (that.data.password.length < 1 || that.data.username.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }

    wx.request({
      url: api.ApiRootUrl + 'auth/login',
      data: {
        username: that.data.username,
        password: that.data.password
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code == 200){
          that.setData({
            'loginErrorCount': 0
          });
          wx.setStorage({
            key:"token",
            data: res.data.data.token,
            success: function(){
              wx.switchTab({
                url: '/pages/ucenter/index/index'
              });
            }
          });
        }
      }
    });
  },
  bindUsernameInput: function (e) {

    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function (e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindCodeInput: function (e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})