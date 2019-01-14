const isWeb = false 
const config = {
    isWeb,
    fee: isWeb ? window.fee : 100,    //费率
    apiURL: isWeb ? window.apiURL : 'http://sdrpc.hwelltech.net:88/',  // 接口地址
    useLang: isWeb ? window.useLang : 'cn',  // 默认当前使用语言
    winMenu:[              // 窗口菜单
        {   tit:'关于我们',
            submenu:[
                {tit:'关于', url:'sdfefef'},
                {tit:'联系', url:'sdfefef'},
            ]
        },
        {   tit:'帮助',
            submenu:[
                {tit:'文档', url:'sdfefef'}
            ]
        },
    ] 
}

export default config