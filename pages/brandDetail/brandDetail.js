var util = require('../../utils/util.js');
var api = require('../../config/api.js');
//展示某个品牌的详细信息和该品牌下的商品列表


var app = getApp();

Page({
  data: {
    id: 0,
    brand: {},
    goodsList: [],
    page: 1,
    size: 1000
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      id: parseInt(options.id)
    });
    this.getBrand();
  },
  getBrand: function () {
    /**
     * 在页面初始化时，会从跳转参数中获取品牌id并存储到data中，然后调用getBrand函数获取该品牌的详细信息并存储到data中的brand属性中。
     */
    let that = this;
    util.request(api.BrandDetail, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          brand: res.data.brand
        });

        that.getGoodsList();
      }
    });
  },
  getGoodsList() {
    /**
     * 在获取品牌信息成功后，会调用getGoodsList函数获取该品牌下的商品列表并存储到data中的goodsList属性中。
     */
    var that = this;

    util.request(api.GoodsList, { brandId: that.data.id, page: that.data.page, size: that.data.size})
      .then(function (res) {
        if (res.errno === 0) {
          that.setData({
            goodsList: res.data.goodsList
          });
        }
      });
  },
  onReady: function () {
    // 页面渲染完成

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

/**
 * 其中，util和api是引入的工具类和接口配置文件，getApp()用于获取全局应用程序实例。
 * 其他生命周期函数onReady、onShow、onHide和onUnload暂时没有实现任何逻辑。 
 */