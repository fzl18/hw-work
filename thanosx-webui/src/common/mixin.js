import Vue from 'vue';

import {mapState} from 'vuex'
import {apiStatus, webSocketUrl} from "./api/api";



export const data = {
    getState : -1,
    getStateStart : 0,
    getStateSuccess : 1,
    getStateError : 2,
    getStateEmpty : 3,
    verifyCodeTimeText : '',
    verifyCodeInterval : null,
};

export const computed = {
    ...mapState('login', ['loginInfo', 'loginStatus', 'loginGetStatus']),
    ...mapState([
        'lang',
        'local',
        'api',
        'mobile',
        'apiStatus',
        'webSocketUrl',
        'verifyCodeTime',
        'verifCodeLen',
        'passwordMinLen',
        'areaDecimals',
        'passwordMaxLen',
        'loginUrl',
        'registerUrl',
        'forgetPwdUrl',
        'articleUrl',
        'financeUrl',
        'tradeUrl',
        'tradeMarketUrl',
        'otcUrl',
        'safetyUrl',
        'newbiesUrl',
        'truenametUrl',
        'appDownloadUrl',
        'apkUrl',
        'headerActive'
    ]),
};

export const methods = {
    mobileState (){
        if(window && window.outerWidth && window.outerWidth <= 1024){
            console.log(window.outerWidth);
            this.$store.commit('mobile', 1);
            return 1;
        };
        this.$store.commit('mobile', 1);
        return 0;
    },
    imgUrl (url){
        return this.api.origin + '/' + url.replace(/^\//, '');
    },

    getStart (){
        this.getState = this.getStateStart;
    },

    getSuccess (){
        this.getState = this.getStateSuccess;
    },

    getError (){
        this.getState = this.getStateError;
    },

    getEmpty (){
        this.getState = this.getStateEmpty;
    },

    getStateText (){
        return this.getState == this.getStateStart ? '...' : '';
    },

    toLogin (origin){
        location.href = this.loginUrl + '?origin=' + (origin ? encodeURIComponent(origin) : encodeURIComponent(location.href));
    },

    upperCase (val){
        return (val + '').toUpperCase();
    },

    lowerCase (val){
        return (val + '').toLowerCase();
    },

    localDate (date, day){
        if(date){
            day = day || false;
            date = date + '';
            if(/\./.test(date)){
                date = date * 1000 + '';
            };
            if(date.length == 10){
                date = date * 1000;
            };
            var d = new Date(Math.floor(date * 1));
            d = d ? d : new Date();
            if(day){
                return this.twoLen(d.getHours()) + ':' + this.twoLen(d.getMinutes()) + ':' + this.twoLen(d.getSeconds());
            }else{
                return d.getFullYear() + '-' + this.twoLen(d.getMonth() + 1) + '-' + this.twoLen(d.getDate()) + ' ' + this.twoLen(d.getHours()) + ':' + this.twoLen(d.getMinutes()) + ':' + this.twoLen(d.getSeconds());
            }
        }else{
            return '';
        };
    },

    twoLen (val){
        return val < 10 ? '0' + val : val;
    },

    toRegister (){
        location.href = this.registerUrl + '?origin=' + encodeURIComponent(location.href);
    },

    pwdJudge (pwd){
        if(pwd.length < this.passwordMinLen || pwd.length > this.passwordMaxLen){
            return true;
        };
        if(!/^(?=.*[0-9])(?=.*[a-zA-Z])(.*)$/g.test(pwd)){
            return true;
        };
        return false;
    },

    replacePwd (val){
        return val.replace(/[^0-9a-zA-Z\.\\\/\(\)\_\-\+\=\~\!\@\#\$\%\^\&\*\?\'\<\>]*/g, '');
    },

    // 发送验证码倒计时
    verifyCodeDown (){
        var i = this.verifyCodeTime;
        this.verifyCodeTimeText = i + 's';
        this.verifyCodeInterval = setInterval(() => {
            i--;
            if(i == 0 || this.verifyCodeTimeText == ''){
                clearInterval(this.verifyCodeInterval);
                this.verifyCodeTimeText = '';
                return false;
            };
            this.verifyCodeTimeText = i + 's';
        }, 1000);
    },

    hideName (val){
        val = val ? val + '' : '';
        return val.replace(/^.{1}/, '*');
    },

    // 手机号4位*
    hidePhone (val){
        val = val ? val + '' : '';
        return /[0-9]{11}/g.test(val) ? val.replace(/(.{4})(.{4})(.*)/g, '$1****$3') : val;
    },

    classActive (val){
        return val ? 'active' : '';
    },

    // 价格小数
    priceDecimals (price){
        // return Number.parseFloat(price * 1 || 0).toFixed(8)
        return this.toDecimals(price, 4);
    },

    // 数量小数
    numDecimals (num){
        // return Number.parseFloat(num * 1 || 0).toFixed(4)
        return this.toDecimals(num, 4);
    },

    // 百分号小数
    perCentDecimals (perCent){
        // return Number.parseFloat(perCent * 1 || 0).toFixed(2)
        return this.toDecimals(perCent, 2);
    },

    // 人民币小数
    rmbDecimals (perCent){
        return this.toDecimals(perCent, 2);
        // return Number.parseFloat(perCent * 1 || 0).toFixed(2)
    },

    totalDecimals (total){
        return this.toDecimals(total, 8);
    },

    rmbTotalDecimals (perCent){
        return this.toDecimals(perCent, 6);
        // return Number.parseFloat(perCent * 1 || 0).toFixed(2)
    },

    toDecimals(val, len){
        if(val){
            len = len || 4;
            val = (val + '').replace(eval('/(\-?)([0-9]*)(\.?)([0-9]{1,' + len + '})(.*)/'), '$1$2$3$4');
            if(/\./.test(val)){
                val = val.split('.');
                for(var i = val[1].length; i < len; i ++){
                    val[1] = val[1] + '0';
                };
                return val.join('.');
            }else{
                val = val + '.';
                for(var i = 1; i <= len; i ++){
                    val = val + '0';
                };
                return val;
            };
        }else{
            return val;
        };
    },

    // 获取到顶部的高度
    offsetTop (el){
        if(typeof  el != 'object') return 0;
        var t = 0;
        t = el.offsetTop;
        if(el.offsetParent){
            return t + this.offsetTop(el.offsetParent);
        };
        return t;
    },

    // 获取到浏览器左边的宽度
    offsetLeft (el){
        if(typeof  el != 'object') return;
        var t = 0;
        t = el.offsetLeft;
        if(el.offsetParent){
            return t + this.offsetLeft(el.offsetParent);
        };
        return t;
    },

    //获取登录状态
    getLoginInfo (){
        this.axios({
            url : this.api.getLoginInfo,
        }).then((res) => {
            this.$store.commit('login/loginInfo', res.data);
            this.$store.commit('login/loginGetStatus', true);
            this.$store.commit('login/loginStatus', true);
        }).catch((err) => {
            this.$store.commit('login/loginInfo', {});
            this.$store.commit('login/loginGetStatus', true);
            this.$store.commit('login/loginStatus', false);
        });
    },
};

Vue.mixin({
    data () {
        return {
            ...data,
        };
    },
    computed : {
        ...computed
    },
    methods : {
        ...methods
    }
});





