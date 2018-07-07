'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    presents: [],
    data: {},
    phone: ''
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
      url: wx.baseUrl + '/getExchangePresentInfo',
      method: 'post',
      data: {
        userId: userId,
        apptoken: apptoken,
        recordId: option.recordId
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