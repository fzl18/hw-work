import axios from 'axios'



var fetch = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? 'http://localhost:3100/' : window.url,
    // withCredentials : false,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    timeout : 20000,
})

fetch.interceptors.response.use(function (res) {

    if(res.data && res.data.code == 0){
        return Promise.resolve(res.data);
    }else{
        if(res.data && res.data.code && res.data.code == 20003){
        }        
        return Promise.reject('Response Error！(*^▽^*)');
    };
}, function (error) {
    console.log(error);
    return Promise.reject({
        message : error.message
    });
});





var instance = axios.create({
    baseURL: process.env.NODE_ENV == 'development' ? 'http://localhost:3100/' : window.url,
    withCredentials : false,
    method: 'post',
    timeout : 20000,
})

// instance.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

instance.interceptors.request.use(function (config) {

    config.headers={
        'Content-Type':'application/x-www-form-urlencoded'
    }

    if(config.headers['Content-Type'] == 'multipart/form-data'){
        return config;
    };
    
    if(process.env.NODE_ENV == 'development'){
        
        config.data = {
            data :{
                ...config.data},
        };
    }else{
        config.data = {
            data : {
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
            // this.$store.commit('login/loginStatus', false);
            // this.$store.commit('login/loginGetStatus', false);
            // this.$router.push(loginUrl);
        }        
        return Promise.reject({code : res.data.code, message : (res.data  && res.data.message) || (res.config.url.replace(res.config.baseURL, '') + '<br />PHP Response Error！(*^▽^*)')});
    };
}, function (error) {
    console.log(error);
    return Promise.reject({
        message : error.message
    });
});


export default fetch;
