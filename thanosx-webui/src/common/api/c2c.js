export const apiC2c = {
    //商家申请
    "updateName":"/api/Business/updateName", //商家名称修改
    "basicInfo":"/api/trade/basicInfo",  //获取币种和法币基础信息
    "applyConfirm":"/api/Business/applyConfirm", //商家申请: 点击申请验证是否具备申请条件
    "applyData":"/api/Business/applyData", //商家申请: 资料显示
    "applySubmit":"/api/Business/applySubmit", //商家申请: 提交申请
    "detail":"/api/Business/detail", //商家详情
    "personalDetail":"/api/Business/personalDetail", //我的委托单: 商家详情
    "personalPendList":"/api/Business/personalPendList", //我的委托单: 委托列表
    "createPend":"/api/trade/createPend", //我的委托单: 创建委托单
    "cancelPend":"/api/trade/cancelPend", //我的委托单: 取消委托单
    "pendList":"/api/trade/pendList", //委托列表
    "createOrder":"/api/trade/createOrder", //下单
    "userInfo" : '/api/Security/basicinfo',//拿用户信息
    "transferInfo" : '/api/business/transferInfo',//拿用户账户信息
    "sendCaptcha" : '/api/email/sendCaptcha',//下单验证码
};
