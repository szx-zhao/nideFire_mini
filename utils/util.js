var api = require('../config/api.js')
//封装微信请求的工具函数库

function formatTime(date) {
  /**将传入的日期对象格式化为 YYYY-MM-DD hh:mm:ss 的字符串格式。
   */
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**封装了微信的 wx.request() 函数，
 * 用于向指定的 url 发送请求，请求方法为 method，请求数据为 data。
 * 在请求头中添加了 Content-Type 和 X-Nideshop-Token，其中 X-Nideshop-Token 的值从本地缓存中获取，
 * 如果请求成功，返回一个 Promise 对象，resolve 时返回响应数据，reject 时返回错误信息。
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log("success");

        if (res.statusCode == 200) {

          if (res.data.errno == 401) {
            //需要登录后才可以操作

            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);

                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

function get(url, data = {}) {
  /**
   * 封装了 request() 函数，用于发送 GET 请求。
   */
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  /**
   * 封装了 request() 函数，用于发送 POST 请求。
   */
  return request(url, data, 'POST')
}

/**
 * 检查微信会话是否过期
 * 
 * 装了微信的 wx.checkSession() 函数
 * 用于检查当前微信会话是否过期。如果会话未过期，返回一个 Promise 对象，resolve 时返回 true，reject 时返回 false。
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 * 
 * 封装了微信的 wx.login() 函数，用于获取用户登录凭证 code。
 * 如果获取成功，返回一个 Promise 对象，resolve 时返回 code，reject 时返回错误信息。
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  /**
   * 封装了微信的 wx.getUserInfo() 函数，用于获取用户信息。
   * 如果获取成功，返回一个 Promise 对象，resolve 时返回用户信息，reject 时返回错误信息。
   */
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  //用于跳转到指定的页面 url。如果需要登录才能访问该页面，则跳转到登录页面。
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  //辅助函数：在页面上显示一个错误提示框，提示框的标题为 msg，图标为 /static/images/icon_error.png。
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

module.exports = {
  //将上述函数导出，以便其他文件可以引用。 
  formatTime,
  request,
  get,
  post,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
}


