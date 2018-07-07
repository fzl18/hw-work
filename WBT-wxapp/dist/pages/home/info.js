'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    presents: [],
    data: {},
    hash: ''
  },
  onLoad: function onLoad(option) {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    var userId = curUser.userId,
        apptoken = curUser.apptoken;
    this.setData({
      hash: option.hash
    });
    wx.showLoading({
      title: '加载中'
    });
    wx.request({
      url: wx.baseUrl + '/paymentInfo',
      method: 'post',
      data: {
        userId: userId,
        apptoken: apptoken,
        hash: option.hash
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