'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    isShow: false,
    val: ''
  },
  starShow: function starShow() {
    this.setData({
      isShow: true
    });
  },
  onLoad: function onLoad() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    console.log(curUser);
    var userId = curUser.userId,
        apptoken = curUser.apptoken;
    wx.request({
      url: wx.baseUrl + '/getPointBalance',
      method: 'get',
      data: {
        userId: userId,
        apptoken: apptoken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        if (res.data.code == "E00001") {
          if (res.data.data) {
            _this.setData({
              val: 0
            });
          } else {
            wx.showAlert({
              content: res.data.message
            });
          }
        }
      }
    });
  }
});