'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    val: ''
  },
  bindinput: function bindinput(e) {
    this.setData({
      val: e.detail.value
    });
  },
  save: function save() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    if (this.data.val == '' || this.data.val <= 10) {
      wx.showAlert({
        content: '赠送积分不能小于10或负值！'
      });
      return false;
    }
    wx.request({
      url: wx.baseUrl + '/updateGift',
      method: 'post',
      data: {
        userId: curUser.userId,
        apptoken: curUser.apptoken,
        giftAmount: _this.data.val
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        console.log(res.data);
        if (res.data.code == "S00001") {
          wx.showAlert({
            content: res.data.message,
            success: function success() {
              wx.redirectTo({ url: "/pages/home/index" });
            }
          });
        } else {
          wx.showAlert({
            content: res.data.message
          });
        }
      }
    });
  }
});