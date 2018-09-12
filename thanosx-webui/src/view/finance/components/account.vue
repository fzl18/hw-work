<template>
    <section class="account">
        <financeHeader>
            <span>{{lang[local].account}}</span>
        </financeHeader>
        <section class="userinfo">
            <Row>
                <Col span="4">
                    <p>{{lang[local].accUid}}</p>
                    <p class="con">{{userBasicinfo.userid}}</p>
                </Col>
                <Col span="6" class="name">
                    <p>{{lang[local].accName}}</p>
                    <p class="con" :title="userBasicinfo.username">{{userBasicinfo.username}}</p>
                </Col>
                <Col span="6" class="name">
                    <p>{{lang[local].accAuth}}</p>
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
                    <p>{{lang[local].accLogintime}}：{{localDate(userBasicinfo.last_login_time)}}</p>
                    <p>{{lang[local].accIp}}：{{userBasicinfo.last_login_ip}}</p>
                </Col>
            </Row>
        </section>
        <section class="userSet">
            <dl>
                <dt><i class="iconfont icon-mima1"></i></dt>
                <dd>{{lang[local].acctit1}}</dd>
                <dd class="txt">{{lang[local].acctxt1}}：<span>{{userBasicinfo.level == 2 ? lang[local].safety25 : userBasicinfo.level == 1 ? lang[local].safety25 :  userBasicinfo.level == 0 ?  lang[local].safety25 : ''}}</span></dd>
                <dd class="btn"> <router-link to="/uppassword" >{{lang[local].accbtn}}</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-yuechi"></i></dt>
                <dd>{{lang[local].acctit2}}</dd>
                <dd class="txt" :style="local == 'en' && 'font-size:12px;line-height:16px' ">{{lang[local].acctxt2}} <br/><span>({{userBasicinfo.paypassword ? lang[local].safety9 : lang[local].safety10}})</span></dd>
                <dd class="btn"> <router-link to="/setTradePassword" >{{userBasicinfo.paypassword ? lang[local].accbtnrest :lang[local].accbtnset}}</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-shouji"></i></dt>
                <dd>{{lang[local].acctit3}}</dd>
                <dd class="txt" :style="local == 'en' && 'font-size:12px;line-height:16px' ">{{lang[local].acctxt3}}<br/><span style="font-size:13px;">({{userBasicinfo.moble ? userBasicinfo.district_code + userBasicinfo.moble : lang[local].accunbind}})</span></dd>
                <dd class="btn"> <router-link to="/mobileBind" >{{userBasicinfo.moble ? lang[local].accbtnrest : lang[local].accbtnbind}}</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-yanzheng"></i></dt>
                <dd>{{lang[local].acctit4}}</dd>
                <dd class="txt">{{lang[local].acctxt4}}<br /><span style="font-size:14px;">({{userBasicinfo.gabind ? lang[local].accbind:lang[local].accunbind}}) </span> </dd>
                <dd class="btn"> <router-link to="/ga" >{{ userBasicinfo.gabind ? lang[local].accbtnunbind : lang[local].accbtnbind }}</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-yanzheng"></i></dt>
                <dd>{{lang[local].acctit5}}</dd>
                <dd class="txt">{{lang[local].acctxt5}}<br /><span style="font-size:14px;">({{apiBind ? lang[local].safety9:lang[local].safety10}}) </span> </dd>
                <dd class="btn"> <a href="javascript:;" @click="setRsa">{{ apiBind ? lang[local].accbtnrest : lang[local].accbtnset }}</a></dd>
            </dl>

        </section>

        <h4 class="finance-title">
            <span>{{lang[local].loginLog}}</span>
        </h4>
        <list class="finance-coin-table" :url="api.loginlog" :param="count">
            <dl slot="head">
                <dd style="width:25%">{{lang[local].safety31}}</dd>
                <dd style="width:25%">{{lang[local].safety32}}</dd>
                <dd style="width:25%">{{lang[local].safety35}}</dd>
                <dd style="width:25%">{{lang[local].safety36}}</dd>
                <!-- <dd>{{lang[local].safety34}}</dd> -->
                <!-- <dd>{{lang[local].state}}</dd> -->
            </dl>
            <dl slot="body" slot-scope="{item}" :key="item.id">
                <dd style="width:25%">{{localDate(item.addtime)}}</dd>
                <dd style="width:25%">{{item.type}}</dd>
                <dd style="width:25%">{{item.addip}}</dd>
                <dd style="width:25%">{{item.addr}}</dd>
                <!-- <dd>{{item.remark}}</dd> -->
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
                count:0,
                apiBind:false
            };
        },
        created (){
            this.basicinfo();
        },
        mounted (){
            this.rsaInfo()
        },
        watch:{
            local(){
                this.count++
            }
        },
        methods : {
            setRsa(){
                if(this.userBasicinfo.gabind){
                    this.$router.push('/setRsa')
                }else{
                    this.$store.commit('msg/err', this.lang[this.local].setRsaTip)
                    this.$router.push('/ga')
                }
            },
            rsaInfo(){
                this.axios({
                    url : this.api.rsaInfo,
                    data : {
                    }
                }).then((res) => {
                    if(res.data.google_is_bind){
                        this.apiBind = res.data.rsa_is_bind
                    }
                }).catch((err) => {
                    console.log(err)
                });
            }
        },
    }
</script>
