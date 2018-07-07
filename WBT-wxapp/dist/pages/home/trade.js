'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    value: 0,
    contentshow: 0,
    sn: '',
    lists: [],
    loading: true
  },
  onLoad: function onLoad() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    var userId = curUser.userId,
        apptoken = curUser.apptoken;
    wx.showLoading({
      title: '加载中'
    });
    wx.request({
      url: wx.baseUrl + '/exchangeList',
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
          return false;
        }
        _this.setData({
          lists: res.data.data,
          loading: !_this.data.loading
        });
      }
    });
  },
  changeTab: function changeTab(e) {
    var index = e.detail.index;
    this.setData({
      contentshow: index
    });
  },
  bindSnInput: function bindSnInput(e) {
    this.setData({
      sn: e.detail.value
    });
  },
  search: function search() {
    if (this.data.sn == '') {
      wx.showAlert({
        content: '兑换码不能为空！'
      });
    } else {
      wx.navigateTo({ url: '/pages/home/tradeConfirm?sn=' + this.data.sn });
    }
  },
  scanCode: function scanCode() {
    var _this = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function success(res) {
        console.log(res);
        _this.setData({
          sn: res.result
        });
      }
    });
  }
});