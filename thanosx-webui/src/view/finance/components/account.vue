<template>
    <section class="account">
        <financeHeader>
            <span>{{lang[local].account}}</span>
        </financeHeader>
        <section class="userinfo">
            <Row>
                <Col span="4">
                    <p>UID</p>
                    <p class="con">{{userBasicinfo.userid}}</p>
                </Col>
                <Col span="6" class="name">
                    <p>用户名</p>
                    <p class="con">{{userBasicinfo.username}}</p>
                </Col>
                <Col span="6" class="name">
                    <p>实名认证</p>
                    <p>
                        <router-link :to=" userBasicinfo.nameauthstatus == '0' && userBasicinfo.idcard
                            ? ''
                            : userBasicinfo.nameauthstatus == '1' && userBasicinfo.idcard
                            ? ''
                            : userBasicinfo.nameauthstatus == '2' && userBasicinfo.idcard
                            ? '/nameAuth'
                            :'/nameAuth' ">
                        <span class="tag"> {{
                            userBasicinfo.nameauthstatus == '0' && userBasicinfo.idcard
                            ? lang[local].nameAuth27
                            : userBasicinfo.nameauthstatus == '1' && userBasicinfo.idcard
                            ? lang[local].certified
                            : userBasicinfo.nameauthstatus == '2' && userBasicinfo.idcard
                            ? lang[local].nameAuth31
                            :lang[local].unauthorized
                            }}
                        </span>
                        </router-link>
                    </p>
                </Col>
                <Col span="8" class="txt">
                    <p>最近登录时间：{{userBasicinfo.last_login_time}}</p>
                    <p >IP：{{userBasicinfo.last_login_ip}}</p>
                </Col>
            </Row>
        </section>
        <section class="userSet">
            <dl>
                <dt><i class="iconfont icon-mima1"></i></dt>
                <dd>登录密码</dd>
                <dd class="txt">安全等级：<span>{{userBasicinfo.level == 2 ? lang[local].safety25 : userBasicinfo.level == 1 ? lang[local].safety26 :  userBasicinfo.level == 0 ?  lang[local].safety27 : ''}}</span></dd>
                <dd class="btn"> <router-link to="/uppassword" >修改</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-yuechi"></i></dt>
                <dd>交易密码</dd>
                <dd class="txt">用于提币、C2C转账时安全验证</dd>
                <dd class="btn"> <router-link to="/setTradePassword" >修改</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-shouji"></i></dt>
                <dd>手机号码</dd>
                <dd class="txt">用于提币、找回密码、修改安全设置时安全验证<span>(未绑定)</span></dd>
                <dd class="btn"> <router-link to="/mobileBind" >修改</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-yanzheng"></i></dt>
                <dd>谷歌身份验证器</dd>
                <dd class="txt">用于登录和安全设置验证</dd>
                <dd class="btn"> <router-link to="/ga" >修改</router-link></dd>
            </dl>

        </section>

        <h4 class="finance-title">
            <span>{{lang[local].loginLog}}</span>
        </h4>
        <list class="finance-coin-table" :url="api.loginlog" >
            <dl slot="head">
                <dd>{{lang[local].safety31}}</dd>
                <dd>{{lang[local].safety32}}</dd>
                <dd>{{lang[local].safety35}}</dd>
                <dd>{{lang[local].safety36}}</dd>
                <dd>{{lang[local].safety34}}</dd>
                <!-- <dd>{{lang[local].state}}</dd> -->
            </dl>
            <dl slot="body" slot-scope="{item}" :key="item.id">
                <dd>{{localDate(item.addtime)}}</dd>
                <dd>{{item.type}}</dd>
                <dd>{{item.addip}}</dd>
                <dd>{{item.addr}}</dd>
                <dd>{{item.remark}}</dd>
                <!-- <dd>{{item.status == 1 ? lang[local].normal : lang[local].otc21}}</dd> -->
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "account",
        data (){
            return {
                updatePwdStatus : false,
                password : '',
                moble : '',
            };
        },
        created (){
            this.basicinfo();
        },
        mounted (){
        },
        methods : {
        },
    }
</script>
