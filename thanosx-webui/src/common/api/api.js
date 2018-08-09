// http://23.91.100.214:3000/RadarTech/radar-frontend/wiki/_pages
export const apiCommon = {
    "getLoginInfo" : '/api/index/getLoginInfo',
    // "getLinks" : '/api/index/getLinks',
    // "getNews" : '/api/index/getNews',
    "logout" : '/api/login/logout',
    "upFiles" : '/home/UpFiles/upload',
    "getMarketInfo" : '/api/index/getMarketInfo',
    "myCoin" : '/api/Finance/myCoin',
    "navListArticle" : '/api/Article/navList',
    'articleInfo' : '/api/Article/info',
    'getDistrictCode' : '/api/index/getDistrictCode',
    'origin' : process.env.NODE_ENV == 'development' ? 'http://120.79.219.175' : '',
    'noticeId' : 36,
    'newsId' : 58,
    'appDownload' : 'https://www.rdb.one/home/mobile/appDownload',

};

// api 返回状态
export const apiStatus = {
    success : 1000,  //成功
    noLogin : 4003,  //未登陆
    gacode : 4009,  //谷歌验证码
};

// 跳转 url
export const toUrl = {
    apkUrl : 'http://comnfile.ufile.ucloud.com.cn/RDB1.0.0.apk',
    loginUrl : process.env.NODE_ENV == 'development' ? '/login.html' : '/home/login',
    appDownloadUrl : process.env.NODE_ENV == 'development' ? '/mobile.html/appDownload' : '/home/mobile/appDownload',
    mobileUrl : process.env.NODE_ENV == 'development' ? '/mobile.html' : '/home/mobile',
    registerUrl : process.env.NODE_ENV == 'development' ? '/login.html/register' : '/home/login/register',
    forgetPwdUrl : process.env.NODE_ENV == 'development' ? '/login.html/resetPassword' : '/home/login/resetPassword',
    financeUrl : process.env.NODE_ENV == 'development' ? '/finance.html' : '/home/finance',
    tradeUrl : process.env.NODE_ENV == 'development' ? '/trade.html' : '/home/trade',
    // otcUrl : process.env.NODE_ENV == 'development' ? '/otc.html' : '/home/otc',
    // safetyUrl : process.env.NODE_ENV == 'development' ? '/safety.html' : '/home/safety',
    newbiesUrl : process.env.NODE_ENV == 'development' ? '/article.html' : '/home/article',
    tradeMarketUrl : process.env.NODE_ENV == 'development' ? '/trade.html/{xnb}/{rmb}' : '/home/trade/{xnb}/{rmb}',
    truenametUrl : process.env.NODE_ENV == 'development' ? '/safety.html/nameAuth' : '/home/safety/nameAuth',
    articleUrl : process.env.NODE_ENV == 'development' ? '/article.html' : '/home/article',
    icoUrl : process.env.NODE_ENV == 'development' ? '/ico.html' : '/home/ico',
};

// export const webSocketUrl = process.env.NODE_ENV == 'development' ? 'ws://23.91.100.214:8686/sub' : 'wss://market-api.rdb.one/sub';
export const webSocketUrl = process.env.NODE_ENV == 'development' ? 'ws://116.62.233.139:8686/sub' : window.webSocketUrl ? window.webSocketUrl : 'wss://market.thanosx.com/sub';


