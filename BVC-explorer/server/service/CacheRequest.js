'use strict'
const request = require('request-promise')
const SERVER_ROOT = gConfig.dataAPIServer
const service = require('../service')

Date.prototype.format = function (format) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}
function getDateByTimeZone (timeZone, _date) {
  const d = _date ? new Date(_date) : new Date()
  const localTime = d.getTime()
  const localOffset = d.getTimezoneOffset() * 60000
  const utc = localTime + localOffset
  const offset = timeZone
  const localSecondTime = utc + (3600000 * offset)
  return new Date(localSecondTime)
}

function GetDateStr (AddDayCount) {
  var dd = getDateByTimeZone(8)
  dd.setDate(dd.getDate() + AddDayCount)

  var m = dd.getMonth() + 1
  var d = dd.getDate()
  if (d < 10) {
    d = '0' + d
  }

  if (m < 10) {
    m = '0' + m
  }
  return m + '-' + d
}

function GetDateStr2 (AddDayCount, zone) {
  var _zone = zone || 8
  var dd = getDateByTimeZone(_zone)
  dd.setDate(dd.getDate() + AddDayCount)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1
  var d = dd.getDate()
  if (d < 10) {
    d = '0' + d
  }

  if (m < 10) {
    m = '0' + m
  }
  return y + '-' + m + '-' + d + 'T16:00:00Z'
}

function GetDateStr3 (AddDayCount, zone) {
  var _zone = zone || 8
  var dd = getDateByTimeZone(_zone)
  dd.setDate(dd.getDate() + AddDayCount)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1
  var d = dd.getDate()
  if (d < 10) {
    d = '0' + d
  }

  if (m < 10) {
    m = '0' + m
  }
  return y + '-' + m + '-' + d 
}

module.exports = {
  txCharts: function (ctx, next) {
    const self = this
    let txs = txCache.get('txCharts')
    if (txs == undefined) {
      let params = ctx.request.query
      const days = params.days||7
      params.zone = params.zone||8
      return request({
        uri: SERVER_ROOT + '/reports?start=' + GetDateStr3(-(Number(days)-1),params.zone) + '&end=' + GetDateStr3(0,params.zone)+'&zone='+params.zone,
        qs: {},
        json: true
      }).then((data) => {
        let x = []
        let y = []
        const reports = data.reports.data
        for (let i = 0; i < reports.length; i++) {
          x.push(reports[i].date)
          y.push(reports[i].count)
        }
        const zone = data.reports.zone

        // let resSuccess = txCache.set('txCharts', {x: x,y: y,zone: zone}, 10)
        ctx.responseData.call(self, {x: x,y: y,zone: zone})
      })
    }else {
      ctx.responseData.call(self, txs)
    }
  },
  ledgers: function (ctx, next) {
    const self = this
    let txs = txCache.get('cLedger')
    if (txs == undefined) {
      let params = ctx.params
      return request({
        uri: SERVER_ROOT + '/ledgers',
        qs: params,
        json: true
      }).then((result) => {
        let resSuccess = txCache.set('cLedger', result, 10)
        ctx.responseData.call(self, result)
      })
    }else {
      ctx.responseData.call(self, txs)
    }
  },
  transactions: function (ctx, next) {
    const self = this
    let txs = txCache.get('cTxs')
    if (txs == undefined) {
      let params = ctx.params
      return request({
        uri: SERVER_ROOT + '/transactions?limit=10&descending=true',
        qs: params,
        json: true
      }).then((result) => {
        let resSuccess = txCache.set('cTxs', result, 10)
        ctx.responseData.call(self, result)
      })
    }else {
      ctx.responseData.call(self, txs)
    }
  }
}
