var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
//四个看板展示品牌列表

Page({
  data: {
    brandList: [],
    page: 1,
    size: 10,
    totalPages: 1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数,调用getBrandList函数来获取品牌列表数据并展示在页面上
    this.getBrandList();
  },
  getBrandList: function () {
    /**
     * getBrandList函数中，会调用util.request函数来发送请求，请求的地址是api.BrandList，请求参数是当前页数和每页展示的数量。
     * 如果请求成功，会将返回的数据中的品牌列表数据和总页数存储在页面的data中。
     * 在页面滚动到底部时，会触发onReachBottom函数，如果当前页数小于总页数，则将页数加1并再次调用getBrandList函数来获取下一页的数据。
     */
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.BrandList, { page: that.data.page, size: that.data.size }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          brandList: that.data.brandList.concat(res.data.data),
          totalPages: res.data.totalPages
        });
      }
      wx.hideLoading();
    });
  },
  onReachBottom (){
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
    } else {
      return false;
    }

    this.getBrandList();
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

  }
})