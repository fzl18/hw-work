import axios from 'axios'
var instance = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? '' : '',
    withCredentials : process.env.NODE_ENV == 'development' ? true : false,
    method: 'post',
    responseType: 'json',
    timeout : 20000,
    headers: {
    }
});

instance.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

instance.interceptors.request.use(function (config) {
    if(config.headers['Content-Type'] == 'multipart/form-data'){
        return config;
    };
    let lang
    switch (localStorage.curLang) {
        case "zh":
            lang = "zh-cn"
            break;
        case "zhtw":
            lang = "zh-tw"
            break;
        default:
            lang = localStorage.curLang
            break;
    }
    if(process.env.NODE_ENV == 'development'){
        
        config.data = {
            data :{ 
                lang:lang, 
                ...config.data},
            // cookie : document.cookie
        };
    }else{
        config.data = {
            data : { 
                lang:lang, 
                ...config.data},
        };
    };
    return config;
}, function (error) {
    return Promise.reject(error);
});


instance.interceptors.response.use(function (res) {
    // if(process.env.NODE_ENV == 'development'){
    //     if(res.data && res.data.cookie){
    //         res.data.cookie.forEach((cookieStr) => {
    //             document.cookie = cookieStr;
    //         });
    //     };
    // };
    if(res.data && res.data.code && res.data.code == 1000){
        return Promise.resolve(res.data);
    }else{
        //20003 重新登录
        if(res.data && res.data.code && res.data.code == 20003){
            this.$store.commit('login/loginStatus', false);
            this.$store.commit('login/loginGetStatus', false);
            this.$router.push(loginUrl);
        }        
        return Promise.reject({code : res.data.code, message : (res.data  && res.data.message) || (res.config.url.replace(res.config.baseURL, '') + '<br />PHP Response Error！(*^▽^*)')});
    };
}, function (error) {
    console.log(error);
    return Promise.reject({
        message : error.message
    });
});


export default instance;











































