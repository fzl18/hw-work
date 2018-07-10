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
  onLoad: function onLoad() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    var userId = curUser.userId,
        apptoken = curUser.apptoken;
    wx.showLoading({
      title: "加载中"
    });
    wx.request({
      url: wx.baseUrl + '/paymentList',
      method: 'post',
      data: {
        userId: userId,
        apptoken: apptoken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function success(res) {
        console.log(res);
        wx.hideLoading();
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
  },
  handleChange1: function handleChange1(e) {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    var userId = curUser.userId,
        apptoken = curUser.apptoken;
    wx.showLoading({
      title: "加载中"
    });
    var index = e.detail.index;
    this.setData({
      current1: index
    });
    switch (index) {
      case 0:
        wx.request({
          url: wx.baseUrl + '/paymentList',
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
        break;
      case 1:
        wx.request({
          url: wx.baseUrl + '/paymentList',
          method: 'post',
          data: {
            userId: userId,
            apptoken: apptoken,
            type: 0
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function success(res) {
            wx.hideLoading();
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
        break;
      case 2:
        wx.request({
          url: wx.baseUrl + '/paymentList',
          method: 'post',
          data: {
            userId: userId,
            apptoken: apptoken,
            type: 1
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function success(res) {
            wx.hideLoading();
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
        break;
      default:
        break;
    }
  },
  handleContentChange1: function handleContentChange1(e) {
    var current = e.detail.current;
    this.setData({
      current1: current
    });
  }
});