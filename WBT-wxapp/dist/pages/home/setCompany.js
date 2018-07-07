"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
    STATUS_BAR_HEIGHT: wx.STATUS_BAR_HEIGHT,
    url: 'data:image/jpeg;base64,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',
    alpha: 0,
    className: '',
    name: '',
    addr: '',
    tel: '',
    man: '',
    position: ''
  },
  onLoad: function onLoad() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    wx.showLoading({
      title: '加载中'
    });
    wx.request({
      url: wx.baseUrl + "/getCompanyInfo",
      method: 'post',
      data: {
        userId: curUser.userId,
        apptoken: curUser.apptoken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        wx.hideLoading();
        console.log(res.data);
        if (res.data.code == 'S00001') {
          _this.setData({
            name: res.data.data.companyName,
            addr: res.data.data.companyAddr,
            tel: res.data.data.linkPhone,
            man: res.data.data.linkMan,
            position: res.data.data.job
          });
        } else {
          wx.showAlert({
            context: res.data.message
          });
        }
      }
    });
  },
  back: function back() {
    wx.navigateBack();
  },
  save: function save() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    if (this.data.addr == '' || this.data.tel == '' || this.data.nam == '' || this.data.position == '') {
      wx.showAlert({
        content: '必填项不能为空'
      });
      return false;
    }
    wx.request({
      url: wx.baseUrl + "/editComapnyCard",
      method: 'post',
      data: {
        userId: curUser.userId,
        apptoken: curUser.apptoken,
        job: this.data.job,
        companyAddr: this.data.addr,
        linkPhone: this.data.tel,
        linkMan: this.data.man
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        wx.showAlert({
          content: res.data.message
        });
        if (res.data.code == "S00001") {}
      }
    });
  }
});