App({
//小程序的入口文件，定义了一个 App 对象，包含两个属性：onLaunch 和 globalData
// 小程序启动时获取用户信息和 token，并将它们存储在全局变量中，以便在其他页面中使用

  onLaunch: function () {
    /**
     * onLaunch 是小程序的生命周期函数之一，它会在小程序启动时执行。
     * 在这个函数中，代码尝试从本地存储中获取用户信息和 token，并将它们存储在 globalData 对象中。
     * 如果获取失败，就会将错误信息打印到控制台。
     */
    try {
      this.globalData.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      this.globalData.token = wx.getStorageSync('token');
    } catch (e) {
      console.log(e);
    }
  },

  globalData: {
    /**
     * globalData 是一个全局变量，可以在小程序的任何页面中访问。
     * 
     * 包含userInfo 和 token两个属性。userInfo 是一个对象，包含了用户的昵称和头像信息。token 是一个字符串，用于验证用户身份。
     */
    userInfo: {
      nickname: '点击登录',
      avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    token: '',
  }
})