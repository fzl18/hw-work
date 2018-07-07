'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    isShow: false,
    lists: []
  },
  starShow: function starShow() {
    this.setData({
      isShow: true
    });
  },
  call: function call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    });
  },
  onLoad: function onLoad() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    var userId = curUser.userId,
        apptoken = curUser.apptoken;
    wx.showLoading({
      title: "加载中"
    });
    wx.request({
      url: wx.baseUrl + '/getUserCardList',
      method: 'post',
      data: {
        userId: userId,
        apptoken: apptoken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        wx.hideLoading();
        console.log(res.data);
        if (res.data.code == "E00001") {
          wx.showAlert({
            content: res.data.message
          });
        } else {
          _this.setData({
            lists: res.data.data
          });
        }
      }

    });
  }
});