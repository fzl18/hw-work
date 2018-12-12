
// 财务中心
export const apiFinance = {
    "assets" : '/api/Finance/assets',
    "weituo" : '/api/Finance/weituo',
    "chexiao" : '/api/Finance/chexiao',

    "userQianbaoList" : '/api/Finance/userQianbaoList',
    "myyhks" : '/api/Finance/myyhks',
    "area" : '/api/Finance/area',
    "bankList" : '/api/Finance/bankList',
    "upbank" : '/api/Finance/upbank',
    "delbank" : '/api/Finance/delbank',
    "defaultbank" : '/api/Finance/defaultbank',
    "chengjiao" : '/api/Finance/chengjiao',

    "pay" : '/api/Finance/aliAndWechat',
    "updatepay" : '/api/Finance/updateUseraccount',
    "deletepay" : '/api/Finance/delaccount',


    "coinList" : '/api/Finance/coinList',
    "listWallet" : '/api/Finance/myQianbao',
    "upqianbao" : '/api/Finance/upqianbao',
    "delWallet" : '/api/Finance/delQianbao',

    "myzcLog" : '/api/Finance/myzcLog',
    "myzrLog" : '/api/Finance/myzrLog',
    "takeCoinVerify" : '/api/Finance/verify',
    "myasset" : '/api/Finance/myasset',
    "upmyzc" : '/api/Finance/upmyzc',
    "upmyzr" : '/api/Finance/topUpAddress',
    "myzrads" : '/api/Finance/topUpAddress',
    "zcother" : '/api/Finance/zcother',
    "ZcListOfIn" : '/api/Finance/ZcListOfIn',
    "freal" : '/api/Finance/freal',
    "transLog" : '/api/Finance/transLog',
    // "myaddrstatus" : '/api/Finance/myaddrstatus',
    "activateAddr" : '/api/Finance/activateAddr',
    "invitList" : '/api/Finance/invitList',
    "invit" : '/api/Finance/invit',
    "spreadActive" : '/api/Finance/spreadActive',

    // "delKey" : '/api/Finance/delKey',

    "loginlog" : '/api/Security/loginlog',
    "basicinfo" : '/api/Security/basicinfo',
    "question" : '/api/Security/question',
    "upquestion" : '/api/Security/upquestion',
    "uppaypassword" : '/api/Security/uppaypassword',
    "findPayPwdVerify" : '/api/Security/findPayPwdVerify',
    "findPayPwd" : '/api/Security/findPayPwd',
    "uppassword" : '/api/Security/uppassword',
    "dcType" : '/api/Security/dcType',
    "nameauth" : '/api/Security/nameauth',
    "ga" : '/api/Security/ga',
    "bindGa" : '/api/Security/bindGa',
    "unbindGa" : '/api/Security/unbindGa',
    "setGaVerify" : '/api/Security/setGaVerify',
    "upmobleVerify" : '/api/security/upmobleVerify',
    "upmoble" : '/api/Security/upmoble',
    "payPasswordVerifyCode":"/api/Security/payPasswordVerifyCode",
    "withdrawVerifyCode":"/api/Finance/withdrawVerifyCode",
    "getMainCoins":"/api/finance/getMainCoins",

    "getRsaMailCode":"/api/security/RsaVerifyCode",
    "setRsa":"/api/security/setRsa",
    "rsaInfo":"/api/security/rsaInfo",

    // C2C
    "transferInfo" : '/api/business/assetInfo',//拿用户账户信息
    "accountList":"/api/C2C/accountList",  //我的资产--c2c账户列表
    "assetsTransfer":"/api/C2C/assetsTransfer", //c2c资产转移
    "orderList":"/api/C2C/orderList", //c2c订单列表
    "orderDetail":"/api/C2C/orderDetail", //c2c订单详情
    "cancelOrder":"/api/C2C/cancelOrder", //取消c2c订单
    "confirmPay":"/api/C2C/confirmPay", //c2c确认付款
    "confirmReceivable":"/api/C2C/confirmReceivable", //确认收款
    "sendCaptcha":"/api/email/sendCaptcha", //发送确认收款验证码
    "transferModeSet":"/api/C2C/transferModeSet", //转账方式设置
    "enabled":"/api/C2C/enabled", //转账方式开关
    "transferMode":"/api/C2C/transferMode", //转账方式
    "unbindTransferMode":"/api/C2C/unbindTransferMode", //转账方式解绑
    "transferModeList":"/api/C2C/transferModeList", //转账方式下拉列表
    "basicCoin":"/api/trade/basicInfo",  //获取币种和法币基础信息
    "pendCurrencyList":"/api/trade/pendCurrencyList",  //获取当前用户法币信息
    "createPend":"/api/trade/createPend", //我的委托单: 创建委托单
    "setNickname":"/api/member/setNickname", //设置用户昵称
    "getNickname":"/api/member/getNickname", //获取用户昵称

    "appealType" : '/api/appeal/type',// 申诉类型
    "appealCreate" : '/api/appeal/create',// 申诉提交
    "appealList":"/api/appeal/index", //列表
    "cancel":"/api/appeal/cancel", //取消
    "appealDetail":"/api/appeal/detail", //
    "uploadEvidence":"/api/appeal/uploadEvidence", //
    "quotesQuery":"/api/Business/quotesQuery", // 报价查询

    
    "rechargeInfo":"/api/CoinCurrency/rechargeInfo", //获取充值币种信息、账户配置信息
    "rechargeCode":"/api/CoinCurrency/rechargeCode", //获取充值码
    "rechargeSubmit":"/api/CoinCurrency/rechargeSubmit", //提交充值
    "rechargeList":"/api/CoinCurrency/rechargeList", //充值列表

    "withdrawInfo":"/api/CoinCurrency/withdrawInfo", //获取提现币种信息、银行列表信息
    "withdrawSubmit":"/api/CoinCurrency/withdrawSubmit", //法币通道 提现
    "withdrawList":"/api/CoinCurrency/withdrawList", //提现列表
    "withdrawConfirm":"/api/CoinCurrency/withdrawConfirm", //法币通道 提现确认
    "withdrawPreview":"/api/CoinCurrency/withdrawPreview", //法币通道 提现待确认页
    "rechargeConfirm":"/api/CoinCurrency/rechargeConfirm", //法币通道 确认转账




};

