const isWeb = process.env.VUE_APP_BUILD_TARGET == "web" ? true : false
const config = {
    isWeb,
    fee: isWeb ? window.fee : '10000',    //费率
    apiURL: isWeb ? window.apiURL : 'http://bvcrpc.hwelltech.net:88/',  // 接口地址
    useLang: isWeb ? window.useLang : 'en',  // 默认当前使用语言
    limit:5, //资产个数
    currency:"BVC",
    issueAddress: 'b3dTws3ShReaHefvkXvT4sn5L7z26SRMky',//默认发行地址,
    timeout: 5000, //定时时间ms
    decimalLimit: 6,
    winMenu:[                                           // 窗口菜单
        {   tit:'关于我们',
            submenu:[
                {type:'info',tit:'联系我们', ctx:'service@bvcadt.com'},
            ]
        }
    ] 
}

export default config