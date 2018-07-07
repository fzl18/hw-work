'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    id: '',
    pw: ''
  },
  gotohome: function gotohome() {
    var id = this.data.id,
        pw = this.data.pw;
    console.log(id, pw);
    if (id == '' || pw == '') {
      wx.showAlert({
        content: '手机号或密码不能为空'
      });
      return false;
    }
    wx.request({
      url: wx.baseUrl + '/companyLogin',
      method: 'post',
      data: {
        userName: id,
        password: pw
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        if (res.data.code == "E00001") {
          wx.showAlert({
            content: res.data.message
          });
          return false;
        }
        var key = res.data.data;
        if (key.isHaveCard == 'false') {
          wx.redirectTo({ url: "/pages/home/setCompany" });
          return false;
        } else {
          wx.setStorageSync('curUser', JSON.parse(JSON.stringify(key)));
          wx.redirectTo({ url: "/pages/home/index" });
        }
      }
    });
  },
  bindIdInput: function bindIdInput(e) {
    this.setData({
      id: e.detail.value
    });
  },
  bindPwInput: function bindPwInput(e) {
    this.setData({
      pw: e.detail.value
    });
  }
});