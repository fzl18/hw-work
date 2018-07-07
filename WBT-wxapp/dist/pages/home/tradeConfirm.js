'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    presents: [],
    data: {},
    phone: '',
    loading: true
  },
  onLoad: function onLoad(option) {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    var userId = curUser.userId,
        apptoken = curUser.apptoken;
    this.setData({
      phone: option.phone
    });
    wx.showLoading({
      title: '加载中'
    });
    wx.request({
      url: wx.baseUrl + '/distoryInfo',
      method: 'post',
      data: {
        userId: userId,
        apptoken: apptoken,
        exchangeCode: option.sn
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code == "S00001") {
          _this.setData({
            presents: res.data.data.presents,
            data: res.data.data
          });
        } else {
          wx.showAlert({
            content: res.data.message,
            success: function success() {
              wx.navigateBack();
            }
          });
        }
      }
    });
  },
  ok: function ok() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    var userId = curUser.userId,
        apptoken = curUser.apptoken;
    this.setData({
      phone: option.phone
    });
    wx.request({
      url: wx.baseUrl + '/destory',
      method: 'post',
      data: {
        userId: userId,
        apptoken: apptoken,
        exchangeCode: option.sn
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        if (res.data.code == "S00001") {
          wx.showAlert({
            content: res.data.message,
            success: function success() {
              wx.redirectTo({ url: "/pages/home/trade" });
            }
          });
        } else {
          wx.showAlert({
            content: res.data.message
          });
        }
      }
    });
  },
  call: function call() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    });
  }
});