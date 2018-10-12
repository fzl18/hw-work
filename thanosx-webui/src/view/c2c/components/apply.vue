<template>
    <div class="apply container">
        <h3 class="tit">商家申请</h3>
        <div class="stepbar" v-if="step > 1">
            <ul>
                <li><span class="org">1</span>认证流程</li>
                <li :class="step==2 ?'cur':''"><span class="org">2</span>实名认证信息</li>
                <li :class="step==3 ?'cur':''"><span class="org">3</span>联系方式</li>
                <li :class="step==4 ?'cur':''"><span class="org">4</span>资产证明及风控</li>
            </ul>
        </div>
        <section class="part1 " v-if="step==1">
            <div class="read">
                <div class="title"><h3>协议必读</h3></div>
                <div class="con">请确认，在认证商家前，已详细阅读了本协议所有内容，一旦开始认证流程，即表示您已充分理解并同意本下一的全部内容。
为提高交易的安全性和平台注册用户身份的可信度，ThanosX（以下简称T网）向您提供认证服务。您申请认证，T网有权采取各种其认为必要手段对用户的身份进行识别。但，作为普通的网络服务提供商，T网所能采取的方法有限，且在网络上用户身份识别也存在一定的困难。因此，T网对完全认证的用户身份的准去性和绝对真实性不做任何保证。</div>
            </div>
            <h3>认证所需材料</h3>
            <Row :gutter="16" class="auth">                
                <Col span="4"><div><i class="iconfont icon-shouji1"></i>手机</div> </Col>
                <Col span="4"><div><i class="iconfont icon-ai-weixin"></i>微信</div> </Col>
                <Col span="4"><div><i class="iconfont icon-QQ"></i>QQ</div> </Col>
                <Col span="4"><div><i class="iconfont icon-zichanguanli-fill"></i>个人资产</div> </Col>
                <Col span="4"><div><i class="iconfont icon-shenfenzheng"></i>身份认证</div> </Col>
                <Col span="4"><div><i class="iconfont icon-fengxianbaozhangjihua"></i>风控策略</div> </Col>
            </Row>
            <div style="margin:40px 0 80px 0" class="blue">认证所需材料+资产保证金（商家需要缴纳保证金，保证金具体数额会在用户的个人信息中展示）</div>
            <div>
                <h3>认证流程</h3>
                <p>1) 提交商家申请后，T网工作人员将在3个工作日内审核处理；</p>
                <p>2) 保证金将在申请后自动锁定在交易账户内。商家无法对该笔资金进行交易。若审核不通过，将释放保证金。</p>
            </div>
            <div class="btn">
                <div style="margin:30px 0"><Checkbox v-model="tAgree" size="large"> 已阅读并同意 </Checkbox><a href="" target="_blank">商家认证协议</a> </div>
                <Button size="large" type="primary" @click="gonext">申请</Button>
            </div>
        </section>
        <section class="part2" v-if="step==2">
            <div class="box">
                <div class="title"><h3>2 实名认证信息</h3></div>
                <Row>
                    <Col span="4">真实姓名：{{userDetail.truename}}</Col>
                    <Col span="4">证件类型：{{userDetail.dctype}}</Col>
                    <Col span="4">证件号码：{{userDetail.idcard}}</Col>
                    <Col span="24">居住地址：{{userDetail.address}}</Col>
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
                <div class="title"><h3>3 联系方式</h3></div>
                <Row>
                    <Col span="4">真实姓名：{{userDetail.truename}}</Col>
                    <Col span="4"><i class="iconfont icon-shouji1"></i> {{userDetail.mobile}}</Col>
                    <Col span="4"><i class="iconfont icon-letter"></i> {{userDetail.email}} </Col>
                </Row>                
            </div>
            <Row>
                <Col span="8"><Input v-model="weixin" type="text" size="large" style="width:300px" placeholder=" 请输入微信号"><span slot="prepend">微信号</span></Input></Col>
                <Col span="8"><Input v-model="QQ" type="text" size="large" style="width:300px" placeholder="请输入QQ号"><span slot="prepend">QQ</span></Input></Col>
                <Col span="24" style="margin-top:40px">请输入微信号及QQ号码，至少填写一项，便于我们能与您联系，确认真人信息。</Col>
            </Row>
        </section>
        <section class="part4" v-if="step==4">
            <div class="box">
                <div class="title"><h3>4 资产证明及风控</h3></div>
                <Row>
                    <Col span="24">真实姓名：{{userDetail.truename}}</Col>
                    <Col span="11">个人资产情况 <Input v-model="assets" size="large" type="textarea" :rows="5"/></Col>
                    <Col span="11" offset="2">个人风控策略 <Input v-model="risk" size="large" type="textarea" :rows="5"/></Col>
                </Row> 
            </div>
            <hr />
            <div>
                <h3>资产证明</h3>
                <p>请上传本人实名银行卡余额截图，或对应银行卡近1月的银行流水截图，图片最多上传5张，支持PNG、JPEG、JPG格式，最大5M</p>
                <div class="uploadpic">
                    <ul>
                        <li v-for="(item,index) in pNum">
                            <i class="iconfont icon-shut" @click.stop="delpic(index)"></i>
                            <uploadFile path="nameAuth" v-model="pNum[index]" :class="pNum[index].state == getStateStart ? 'focus' : ''">
                                <em :style="{backgroundImage : 'url(' + pNum[index].origin + ')'}"></em>
                                <div class="progress" v-if="pNum[index].state == getStateStart">
                                    <b :style="{height : pNum[index].progress + '%'}"></b>
                                    <div>{{pNum[index].progress + '%'}}</div>
                                </div>
                                <div class="txt">{{lang[local].uploadpicbtn}}</div>
                            </uploadFile>
                        </li>
                        <li v-if="pNum.length < 5" class="add" @click="addpic"><i class="iconfont icon-jia" style="font-size:30px"/></li>
                    </ul>
                </div>
            </div>
            <div style="margin:50px 0"><Checkbox v-model="bAgree" size="large"> 同意冻结 <span class="org">1000000 THNX</span> 做为商家保证金</Checkbox></div>
        </section>
        <div class="footer" v-if="step != 1">
            <Button size="large" type="text" @click="step--" style="border:1px solid #FF6600">上一步</Button>
            <Button v-if="step != 4" size="large" type="primary" @click="gonext" style="border:1px solid #FF6600">确认</Button>
            <Button v-if="step == 4" size="large" type="primary" @click="submit" style="border:1px solid #FF6600">提交</Button>
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
                 <Button type="primary" size="large" style="font-size:16px" @click="$router.push('/')">返回 </Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data(){
        return{
            step:1,
            tAgree:false,
            bAgree:false,
            weixin:'',
            QQ:'',
            pNum:[''],
            userDetail:{},
            assets:'',
            risk:'',
            errModel:false,
            errInfo:''
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
                    if(!this.QQ && !this.weixin){
                        this.$store.commit('msg/err', '微信号及QQ号码，至少填写一项')
                    }else{
                        this.step++
                    }
                }
            }else{
                this.$store.commit('msg/err', '必须先阅读并同意协议')
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
                this.errModel = true 
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
                
            }).catch( err=>{
                console.log(err)
            })
        },
        submit(){
            let assets_images=''
            this.pNum.map(d => {
                if(d){
                    assets_images = assets_images + d.data +','
                }
            })
            if(!this.bAgree){
                this.$store.commit('msg/err', '必须同意冻结保证金')
                return
            }
            if(this.pNum.length <1){
                this.$store.commit('msg/err', '至少上传一张资产证明图')
                return
            }
            this.axios({
                url : this.api.applySubmit,
                data : {
                    qq:this.QQ,
                    wechat:this.weixin,
                    assets_info:this.assets,
                    risk_info:this.risk,
                    assets_images
                }
            }).then(res=>{
                this.$store.commit('msg/add', res.message)
                this.$route.push(toUrl.c2cUrl)
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
                label{
                    width:180px;height:180px;display: block;
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
