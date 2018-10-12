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
                    <p>{{lang[local].niName}} : {{business_name}}<i class="iconfont icon-bianji org" style="font-size:22px;cursor: pointer;margin:0 20px" @click="editniName = true"/></p>
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
                <Col span="24" style="border-top:1px dotted #aaa;margin-top:20px;padding-top:20px;">
                    <span>{{lang[local].accName}}：{{userBasicinfo.username}}</span> <span>{{lang[local].inviteRecord2}}：</span>
                </Col>
            </Row>
        </section>
       
        <section class="userSet">
            <h4 class="finance-title">
                <span>{{lang[local].loginLog}}</span>
            </h4>
            <dl>
                <dt><i class="iconfont icon-mima1"></i></dt>
                <dd class="txt">{{lang[local].acctit1}}</dd>
                <dd>{{lang[local].acctxt1}}：<span>{{userBasicinfo.level == 2 ? lang[local].safety25 : userBasicinfo.level == 1 ? lang[local].safety25 :  userBasicinfo.level == 0 ?  lang[local].safety25 : ''}}</span></dd>
                <dd class="btn"> <router-link to="/uppassword" >{{lang[local].accbtn}}</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-yuechi"></i></dt>
                <dd class="txt">{{lang[local].acctit2}}</dd>
                <dd :style="local == 'en' && 'font-size:12px;line-height:16px' ">{{lang[local].acctxt2}} <span>({{userBasicinfo.paypassword ? lang[local].safety9 : lang[local].safety10}})</span></dd>
                <dd class="btn"> <router-link to="/setTradePassword" >{{userBasicinfo.paypassword ? lang[local].accbtnrest :lang[local].accbtnset}}</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-shouji"></i></dt>
                <dd class="txt">{{lang[local].acctit3}}</dd>
                <dd :style="local == 'en' && 'font-size:12px;line-height:16px' ">{{lang[local].acctxt3}} <span style="font-size:13px;">({{userBasicinfo.moble ? userBasicinfo.district_code + userBasicinfo.moble : lang[local].accunbind}})</span></dd>
                <dd class="btn"> <router-link to="/mobileBind" >{{userBasicinfo.moble ? lang[local].accbtnrest : lang[local].accbtnbind}}</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-yanzheng"></i></dt>
                <dd class="txt">{{lang[local].acctit4}}</dd>
                <dd>{{lang[local].acctxt4}} <span style="font-size:14px;">({{userBasicinfo.gabind ? lang[local].accbind:lang[local].accunbind}}) </span> </dd>
                <dd class="btn"> <router-link to="/ga" >{{ userBasicinfo.gabind ? lang[local].accbtnunbind : lang[local].accbtnbind }}</router-link></dd>
            </dl>
            <dl>
                <dt><i class="iconfont icon-yanzheng"></i></dt>
                <dd class="txt">{{lang[local].acctit5}}</dd>
                <dd>{{lang[local].acctxt5}} <span style="font-size:14px;">({{apiBind ? lang[local].safety9:lang[local].safety10}}) </span> </dd>
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
        <Modal
            v-model="editniName"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>修改商家名称</h1>
            <table class="editniName">
                <tr>
                    <td>名称</td>
                    <td align="right"><Input size="large" v-model="business_name"/></td>
                </tr>
                <tr>
                    <td colspan="2">
                        为了隐私安全，仅在OTC交易中显示商家信息，不显示注册信息。商家最长支持10个字符
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <Row style="margin-top:50px">
                            <Col span="12"><Button type="primary" size="large" @click="saveName">保存</Button></Col>
                            <Col span="6" offset="6"><Button type="text" size="large" @click="editniName=false">关闭</Button></Col>
                        </Row>
                    </td>
                </tr>
            </table>
        </Modal>
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
                apiBind:false,
                editniName:false,
                business_name:'',                
            };
        },
        created (){
            this.basicinfo()
            this.getNickname()
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
            },
            getNickname(){
                this.axios({
                    url : this.api.getNickname,
                    data : {
                        
                    }
                }).then(res=>{
                    this.business_name = res.data.nickname
                })           
            },
            saveName(){
                if(!this.business_name.trim()){
                    this.$store.commit('msg/err', '名称不能为空')
                    return
                } 
                this.axios({
                    url : this.api.setNickname,
                    data : {
                        nickname:this.business_name.trim()
                    }
                }).then(res=>{
                    this.$store.commit('msg/add', res.message)
                    this.editniName=false
                })           
            }
        },
    }
</script>
<style lang="scss" scoped>
.editniName{
    margin:30px auto;
    tr{
        td{
            line-height: 30px;font-size: 14px;padding:10px 0;
        } 
    }
    
}
</style>
