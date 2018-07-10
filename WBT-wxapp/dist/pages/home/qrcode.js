'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wxqrcode = require('../../static/utils/wxqrcode.js');

var _wxqrcode2 = _interopRequireDefault(_wxqrcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = Page({
  data: {
    pointSend: '',
    presentExchange: ''
  },
  onLoad: function onLoad() {
    var _this = this;
    var curUser = wx.getStorageSync('curUser');
    console.log(curUser);
    var userId = curUser.userId,
        companyCardId = curUser.companyCardId;
    var qrcodeSize = this.getQRCodeSize();
    var n1 = 'pointSend|' + userId;
    var n2 = 'presentExchange|' + userId;
    this.createQRCode(n1, qrcodeSize, 'pointSend');
    this.createQRCode(n2, qrcodeSize, 'presentExchange');
    console.log(n1, n2);
  },

  //适配不同屏幕大小的canvas
  getQRCodeSize: function getQRCodeSize() {
    var size = 0;try {
      var res = wx.getSystemInfoSync();
      var scale = 686 / 750; // 750 / 278; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = res.windowWidth * scale;
      size = width;
    } catch (e) {
      // console.log("获取设备信息失败"+e);
    }
    return size;
  },
  setCanvasSize: function setCanvasSize() {
    var size = {};
    var res = wx.getSystemInfoSync();
    // console.log(res)
    var scale = 686 / 750;
    var width = res.windowWidth * scale;
    var height = width;
    size.w = width;
    size.h = height;
    return size;
  },
  createQRCode: function createQRCode(text, size, name) {
    //调用插件中的draw方法，绘制二维码图片
    var that = this;
    // console.log('QRcode: ', text, size)
    var _img = _wxqrcode2.default.createQrCodeImg(text, {
      size: parseInt(size)
    });
    console.log(name);
    that.setData(_defineProperty({}, name, _img));
  },
  saveImgToPhotosAlbumTap: function saveImgToPhotosAlbumTap(e) {
    console.log(e.currentTarget.dataset.img);
    wx.downloadFile({
      url: e.currentTarget.dataset.img,
      success: function success(res) {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function success(res) {
            console.log(res);
          },
          fail: function fail(res) {
            console.log(res);
            console.log('fail');
          }
        });
      },
      fail: function fail() {
        console.log('fail');
      }
    });
  }
});