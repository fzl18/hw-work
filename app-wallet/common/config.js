const config = {
    fee: '10000',    //费率
    apiURL:'http://bvcrpc.hwelltech.net:88/',  // 接口地址
    useLang: 'cn',  // 默认当前使用语言
    limit:5, //资产个数
    currency:"BVC",
    issueAddress: 'bKhzHBtWgiBEVAgDDRR3ioMbbv3wxf9VoX',//默认发行地址,
    issueAmount: 100000000,//默认授信数量
    transferAmountMax: 100000000000,//转账最大金额限制
    timeout: 5000, //定时时间ms
    decimalLimit: 6,//小数点位数限制
    canInput: false //添加授信是否可以输入币种
}

export default config