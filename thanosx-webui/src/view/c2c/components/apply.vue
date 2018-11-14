<template>
    <div class="apply container">
        <h3 class="tit">{{lang[local].c2cbizapply}}</h3>
        <div class="stepbar" v-if="step > 1">
            <ul>
                <li><span class="org">1</span>{{lang[local].apply1}}</li>
                <li :class="step==2 ?'cur':''"><span class="org">2</span>{{lang[local].apply2}}</li>
                <li :class="step==3 ?'cur':''"><span class="org">3</span>{{lang[local].apply3}}</li>
                <li :class="step==4 ?'cur':''"><span class="org">4</span>{{lang[local].apply4}}</li>
            </ul>
        </div>
        <section class="part1 " v-if="step==1">
            <div class="read">
                <div class="title"><h3>{{lang[local].apply5}}</h3></div>
                <div class="con">{{lang[local].apply6}}</div>
            </div>
            <h3>{{lang[local].apply7}}</h3>
            <Row :gutter="16" class="auth">                
                <Col span="4"><div><i class="iconfont icon-shouji1"></i>{{lang[local].apply8}}</div> </Col>
                <Col span="4"><div><i class="iconfont icon-ai-weixin"></i>{{lang[local].apply9}}</div> </Col>
                <Col span="4"><div><i class="iconfont icon-QQ"></i>QQ</div> </Col>
                <Col span="4"><div><i class="iconfont icon-zichanguanli-fill"></i>{{lang[local].apply10}}</div> </Col>
                <Col span="4"><div><i class="iconfont icon-shenfenzheng"></i>{{lang[local].apply11}}</div> </Col>
                <Col span="4"><div><i class="iconfont icon-fengxianbaozhangjihua"></i>{{lang[local].apply12}}</div> </Col>
            </Row>
            <div style="margin:40px 0 80px 0" class="blue">{{lang[local].apply13}}</div>
            <div>
                <h3>{{lang[local].apply1}}</h3>
                <p>1) {{lang[local].apply14}}</p>
                <p>2) {{lang[local].apply15}}</p>
            </div>
            <div>
                <h3>{{lang[local].apply45}}</h3>
                <p>{{lang[local].c2cDetailTxt78}} <a href="mailto:service@thanosx.com">service@thanosx.com</a> ) {{lang[local].c2cDetailTxt79}}</p>
            </div>
            <div class="btn">
                <div style="margin:30px 0"><Checkbox v-model="tAgree" size="large"> {{lang[local].loginAgree}} </Checkbox><a :href="goUrl" target="_blank">{{lang[local].apply16}}</a> </div>
                <Button size="large" type="primary" @click="gonext">{{lang[local].apply17}}</Button>
            </div>
        </section>
        <section class="part2" v-if="step==2">
            <div class="box">
                <div class="title"><h3>2 {{lang[local].apply18}}</h3></div>
                <Row>
                    <Col span="4">{{lang[local].apply19}}：{{userDetail.truename}}</Col>
                    <Col span="4">{{lang[local].apply20}}：{{userDetail.dctype}}</Col>
                    <Col span="16">{{lang[local].apply21}}：{{userDetail.idcard}}</Col>
                    <Col span="24">{{lang[local].apply22}}：{{userDetail.address}}</Col>
                </Row>
            </div>
            <Row :gutter="24">
                <Col span="8">
                    <div class="box">
                        <img :src="userDetail.idcard1" alt="">
                    </div>
                </Col>
                <Col span="8">
                    <div class="box">
                        <img :src="userDetail.idcard2" alt="">
                    </div>
                </Col>
                <Col span="8">
                    <div class="box">
                        <img :src="userDetail.idcard3" alt="">
                    </div>
                </Col>
            </Row>
        </section>
        <section class="part3" v-if="step==3">
            <div class="box">
                <div class="title"><h3>3 {{lang[local].apply23}}</h3></div>
                <Row>
                    <Col span="4">{{lang[local].apply19}}：{{userDetail.truename}}</Col>
                    <Col span="4"><i class="iconfont icon-shouji1"></i> {{userDetail.mobile}}</Col>
                    <Col span="4"><i class="iconfont icon-letter"></i> {{userDetail.email}} </Col>
                </Row>                
            </div>
            <Row>
                <Col span="6"><Input v-model="weixin" :maxlength="50" type="text" size="large" style="width:300px" :placeholder=" lang[local].apply24"><span slot="prepend">{{lang[local].apply25}}</span></Input></Col>
                <Col span="6"><Input v-model="QQ" :maxlength="50" type="text" size="large" style="width:300px" :placeholder="lang[local].apply26"><span slot="prepend">QQ</span></Input></Col>
                <Col span="6"><Input v-model="Skype" :maxlength="50" type="text" size="large" style="width:300px" :placeholder="lang[local].apply46"><span slot="prepend">Skype</span></Input></Col>
                <Col span="6"><Input v-model="Line" :maxlength="50" type="text" size="large" style="width:300px" :placeholder="lang[local].apply47"><span slot="prepend">Line</span></Input></Col>
                <Col span="24" style="margin-top:40px">{{lang[local].apply27}}</Col>
            </Row>
        </section>
        <section class="part4" v-if="step==4">
            <div class="box">
                <div class="title"><h3>4 {{lang[local].apply28}}</h3></div>
                <Row>
                    <Col span="24">{{lang[local].apply19}}：{{userDetail.truename}}</Col>
                    <Col span="11">{{lang[local].apply29}} <Input v-model="assets" size="large" :maxlength="1000" type="textarea" :rows="5" :placeholder="lang[local].apply43"/></Col>
                    <Col span="11" offset="2">{{lang[local].apply30}} <Input v-model="risk" size="large" :maxlength="1000" type="textarea" :rows="5" :placeholder="lang[local].apply44"/></Col>
                </Row> 
            </div>
            <hr />
            <div>
                <h3>{{lang[local].apply31}}</h3>
                <p>{{lang[local].apply32}}</p>
                <div class="uploadpic">
                    <ul>
                        <li v-for="(item,index) in pNum" :class=" item.origin ? '' :'no' ">
                            <i v-if="pNum.length >1 && item.origin " class="iconfont icon-shut" @click.stop="delpic(index)"></i>
                            <uploadFile path="nameAuth" v-model="pNum[index]" :class="pNum[index].state == getStateStart ? 'focus' : ''" @input="uploadOk">
                                <em :style="{backgroundImage : 'url(' + pNum[index].origin + ')'}"></em>
                                <div class="progress" v-if="pNum[index].state == getStateStart">
                                    <b :style="{height : pNum[index].progress + '%'}"></b>
                                    <div>{{pNum[index].progress + '%'}}</div>
                                </div>
                                <div class="txt"> <i class="iconfont icon-jia" style="font-size:30px"/> </div>
                                <!-- <div class="txt"> {{lang[local].uploadpicbtn}}</div> -->
                            </uploadFile>
                        </li>
                        <!-- <li v-if="pNum.length < 5" class="add" @click="addpic"><i class="iconfont icon-jia" style="font-size:30px"/></li> -->
                    </ul>
                </div>
            </div>
            <div style="margin:50px 0"><Checkbox v-model="bAgree" size="large" @on-change="applyCheckAsset"> {{lang[local].apply33}} <span class="org">{{userDetail.c2c_deposit_amount}} {{userDetail.c2c_deposit_coin}}</span> {{lang[local].apply34}}</Checkbox></div>
        </section>
        <div class="footer" v-if="step != 1">
            <Button size="large" type="text" @click="step--" style="border:1px solid #FF6600">{{lang[local].apply35}}</Button>
            <Button v-if="step != 4" size="large" type="primary" @click="gonext" style="border:1px solid #FF6600">{{lang[local].apply36}}</Button>
            <Button v-if="step == 4" size="large" type="primary" @click="submit" style="border:1px solid #FF6600">{{lang[local].apply37}}</Button>
        </div>
        <Modal
            v-model="errModel"
            :closable = false
            :footer-hide = true
            :mask-closable = false
            class-name="vertical-center-modal">
            <div>
                <h2>
                    {{errInfo}}
                </h2>
                <div style="text-align:right;">
                 <Button type="primary" size="large" style="font-size:16px" @click="$router.push('/')"> {{lang[local].apply48}}</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import {toUrl} from "../../../common/api/api"
export default {
    data(){
        return{
            step:1,
            tAgree:false,
            bAgree:false,
            weixin:'',
            QQ:'',
            Skype:'',
            Line:'',
            pNum:[''],
            userDetail:{},
            assets:'',
            risk:'',
            errModel:false,
            errInfo:'',
            goUrl: toUrl.articleUrl + '/list/c2c_legal_service_greement'
        }
    },
    mounted(){
        this.applyConfirm()
    },
    methods:{
        addpic(){
            this.pNum.push('')
        },
        delpic(index){
            this.pNum.splice(index,1)
        },
        gonext(){
            console.log(this.step);
            
            if(this.tAgree){
                if(this.step == 1){
                    this.applyData()
                    this.step++ 
                    return
                }
                if(this.step == 2){
                    this.step++
                    return
                }
                if(this.step == 3){
                    if(!this.QQ && !this.weixin && !this.Skype && !this.Line){
                        this.$store.commit('msg/err', this.lang[this.local].apply38)
                    }else{
                        this.step++
                    }
                }
            }else{
                this.$store.commit('msg/err', this.lang[this.local].apply39)
            }
        },
        applyConfirm(){
            this.axios({
                url : this.api.applyConfirm,
                data : {
                }
            }).then(res=>{

            }).catch( err=>{
                console.log(err);
                // this.errModel = true 
                this.errInfo = err.message
            })
        },

        applyData(){
            this.axios({
                url : this.api.applyData,
                data : {
                }
            }).then(res=>{
                this.userDetail = res.data
                this.QQ = res.data.qq
                this.weixin = res.data.wechat
                this.Skype = res.data.Skype
                this.Line = res.data.Line
                
            }).catch( err=>{
                console.log(err)
            })
        },
        applyCheckAsset(){
            this.axios({
                url : this.api.applyCheckAsset,
                data : {
                }
            }).then(res=>{
               if(!res.data.asset){
                   this.$store.commit('msg/err', this.lang[this.local].apply40)
                   this.bAgree = false
               }
            }).catch( err=>{
                console.log(err)
            })
        },
        uploadOk(v){
            if(v.state){
                if(this.pNum.length < 5){
                    this.addpic()
                }
            }
        },
        submit(){
            let assets_images=''
            this.pNum.map(d => {
                if(d){
                    assets_images = assets_images + d.data +','
                }
            })
            if(!this.bAgree){
                this.$store.commit('msg/err', this.lang[this.local].apply41)
                return
            }
            if(this.pNum.length <1){
                this.$store.commit('msg/err', this.lang[this.local].apply42)
                return
            }
            this.axios({
                url : this.api.applySubmit,
                data : {
                    qq:this.QQ,
                    wechat:this.weixin,
                    assets_info:this.assets,
                    risk_info:this.risk,
                    assets_images,
                    skype:this.Skype,
                    line:this.Line
                }
            }).then(res=>{
                this.$store.commit('msg/add', res.message)
                location.href = toUrl.c2cUrl + '? myorder=1'
            }).catch( err=>{
                console.log(err)
            })
        }
}
}
</script>

<style lang="scss" scoped>
.apply{
    background: #fff;
    padding: 15px;
    padding-bottom: 35px;
    min-height: 80vh;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom:50px;
    h3{
        margin:20px 0;
        &.tit{
            border-left:3px solid #FF4600;padding-left:10px;
        }
    }
    .stepbar{
        margin-bottom:30px;
        ul{
            background:#F6F6F6;height:60;line-height:60px;overflow: hidden;
            li{
                text-align: center;float: left;width:25%;font-weight: bold;font-size:16px;position: relative;
                span{margin-right:15px;}
                &.cur{
                    background:#FF6600;
                    color:#fff;
                    span{color:#fff;}
                    &::before{
                        content:'';width: 0;height: 0;border-width: 30px 20px 30px 20px;border-style: solid;border-color: transparent transparent transparent #F6F6F6;position:absolute;top:0;left:0px;
                    }
                    &::after{
                        content:'';width: 0;height: 0;border-width: 30px 20px 30px 20px;border-style: solid;border-color: transparent transparent transparent #FF6600;position:absolute;top:0;right:-40px;
                    }
                }
            }
        }
    }
    .footer{
        text-align: center;margin:40px;
    }
    .box{
        background: #F4F4F4;padding:20px;margin-bottom:20px;line-height:40px;
        .title{
            color:#FF6600;padding-bottom:10px;margin-bottom:20px;border-bottom:1px dotted #FF6600;
            h3{margin:0}
        }
    }
    .part1{
        .read{
            background: #F4F4F4;padding:20px;
            .title{
                color:#FF6600;text-align:center;padding-bottom:20px;margin-bottom:20px;border-bottom:1px dotted #FF6600;
                h3{margin:0}
            }
            .con{
                line-height:26px;
                font-size:15px;
                padding:10px 0 20px 0;
            }
            
        }
        p{line-height:36px;}
        .auth{
            .iconfont{font-size:26px;margin-right:20px;position: relative;top:5px;}
            &>div{
                height:80px;line-height:80px;text-align: center;color:#fff;font-size:15px;
                div{border-radius:10px;}
                &:nth-child(1){div{background:#F57071}}
                &:nth-child(2){div{background:#FFA473}}
                &:nth-child(3){div{background:#F87E55}}
                &:nth-child(4){div{background:#40A2AF}}
                &:nth-child(5){div{background:#AA8ABC}}
                &:nth-child(6){div{background:#4C95DA;}}
            }
        }
        .btn{text-align: center;line-height:36px;}
    }
    .part2{
        .box{

        }
        img{
            width:100%;
        }

    }
    .part3{
        .iconfont{font-size:26px;position: relative;top:4px;}
    }
    .part4{
        .uploadpic{
            ul{overflow: hidden;margin:30px;}
            li{
                display: inline-block;width:180px;height:180px;border:1px dashed #aaa;margin-right:20px;position: relative;
                text-align: center;vertical-align:middle;line-height: 180px;overflow: hidden;
                &::after{
                    content:'';width: 0;height: 0;border-width: 0 40px 40px 0;border-style: solid;border-color: transparent #aaa transparent transparent ;position:absolute;top:0;right:0;z-index:89;
                }
                &.no::after{border: none;}
                label{
                    width:180px;height:180px;display: block;cursor: pointer;
                    em{display: block;height:100%;width: 100%;background-size: cover;position: relative;z-index:88;}
                }
                .icon-shut{
                    position:absolute;
                    color:#fff;
                    top:0;right:0;
                    font-size:20px;
                    z-index: 100;
                    line-height:26px;
                    cursor: pointer;
                    &:hover{
                        color:#333;
                    }
                }
                &:hover{
                    border-color:#FF4600;
                    &::after{
                        border-color: transparent #FF4600 transparent transparent
                    }
                    .icon-jia{
                        color:#FF4600
                    }
                }
                .txt{
                    position:absolute;
                    top:0;left:0;
                    text-align: center;
                    width: 100%;
                    z-index:86;              
                }
            }
            .add{
                cursor: pointer;
                &::after{
                    border:none;
                }
            }
        }
    }
}
    
</style>
