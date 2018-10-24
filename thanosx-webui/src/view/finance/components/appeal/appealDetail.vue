<template>
    <section class="detail">
        <div class="bar">{{lang[local].appeal}} > <span style="color:#FF6500">{{lang[local].appealDetail2}}</span></div>
        <div class="left">            
            <div style="font-size:18px;padding:0 15px;">
                <financeHeader :hint="false">
                    <span>{{lang[local].appealDetail3}}</span>
                </financeHeader> 
            </div>                       
            <Row class="info">
                <Col span="8">{{lang[local].appealNO}}: {{info.appeal_number}}</Col>
                <Col span="8">{{lang[local].appealStatus2}}: {{info.appeal_status==1 ? lang[local].appealStatus1 : info.appeal_status==2 ? lang[local].appealStatus2 :info.appeal_status== 3? lang[local].appealStatus3 :info.appeal_status==4? lang[local].appealStatus4 :info.appeal_status==5 ? lang[local].appealStatus5 : lang[local].appealStatus6 }}</Col>
                <Col span="8">{{lang[local].appealType}}: {{info.appeal_type}}</Col>
                <Col span="8">{{info.user_type == 1 ? lang[local].appealPerson2 : lang[local].appealPerson1}}: {{info.nickname}}({{info.member_id}})</Col>
                <Col span="16">{{lang[local].nameAuth5}}: {{info.real_name}} ({{info.phone}})</Col>
            </Row>
            <section class="history">
                <div>
                    <ul>
                        <li v-for=" (item,index) in timeline">
                            <div class="tip" v-if="item.type != 2">
                                <div class="tit">
                                    <Row>
                                        <Col span="3">{{item.type == 1 ? lang[local].appealType1 : item.type == 2 ? lang[local].appealType2 : item.type == 3 ? lang[local].appealType3 : item.type == 4 ? lang[local].appealType4 : item.type == 5 ? lang[local].appealType5 : item.type == 6 ? lang[local].appealType6 : ''}}</Col>
                                        <Col span="20">{{localDate(item.time)}}</Col>
                                    </Row>                                            
                                </div>
                                <div class="content">
                                    <Row>
                                        <Col span="3">{{item.type == 6 || item.type == 3 || (item.type == 2 && item.close_type == 4) ? lang[local].appealTxt1 : item.name}}</Col>
                                        <Col span="20" v-if="index == 0">{{lang[local].appealTxt2}}：{{item.appeal_type_name}}</Col>
                                        <Col span="20" v-if="index ==1 && item.type == 3"> {{lang[local].appealTxt3}}</Col>
                                        <Col span="20" v-if="item.type == 6">{{lang[local].appealTxt7}} {{lang[local].appealTxt9}}{{item.final_result == 1 ? lang[local].appealTxt11 : lang[local].appealTxt10}}</Col>
                                        <Col span="20" v-if="index != 0 && (item.type == 4 || item.type == 5)" style="white-space:pre-wrap">
                                            <span v-if="item.has_evidence == 1"> {{lang[local].appealTxt4}}：{{item.remark}}</span>
                                            <span v-if="item.has_evidence == 0"> {{lang[local].appealTxt5}}</span>
                                        </Col>
                                    </Row> 
                                    <Row>
                                        <Col span="3">{{index == 0 ? lang[local].appealTxt6 : item.type == 3 ? lang[local].appealTxt7 : item.has_evidence == 1 ? lang[local].appealTxt8: ''}}</Col>
                                        <Col span="20" v-if="(item.type != 4 && item.type != 5)" style="white-space:pre-wrap">{{item.remark}}</Col>
                                        <Col span="20" v-if="index >= 2 && (item.type == 5 || item.type == 4) && item.has_evidence == 1" class="pic">
                                            <template v-for="img in item.images">
                                                <img :src="img" @click="openpic(img)" class="cursor" />
                                            </template>                                        
                                        </Col>
                                    </Row>       
                                </div>
                            </div>

                            <div class="tip" v-if="item.type == 2">
                                <div class="tit">
                                    <Row>
                                        <Col span="3">{{item.type == 1 ? lang[local].appealType1 : item.type == 2 ? lang[local].appealType2 : item.type == 3 ? lang[local].appealType3 : item.type == 4 ? lang[local].appealType4 : item.type == 5 ? lang[local].appealType5 : item.type == 6 ? lang[local].appealType6 : ''}}</Col>
                                        <Col span="20">{{localDate(item.time)}}</Col>
                                    </Row>                                            
                                </div>
                                <div class="content">
                                    <Row>
                                        <Col span="3">{{item.close_type == 4 ? lang[local].appealTxt1 : item.name}}</Col>
                                        <Col span="20" v-if="item.close_type == 1 ">{{lang[local].appealTip1}}</Col>
                                        <Col span="20" v-if="item.close_type == 2 ">{{lang[local].appealTip2}}</Col>
                                        <Col span="20" v-if="item.close_type == 3 ">{{lang[local].appealTip3}}</Col>
                                        <Col span="20" v-if="item.close_type == 4 ">{{lang[local].appealTip4}}</Col>
                                    </Row> 
                                    <Row v-if="item.close_type == 4">
                                        <Col span="3">{{lang[local].appealTxt7}}</Col>
                                        <Col span="20">{{item.remark}}</Col>
                                    </Row>       
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            <section>
                
            </section>
            <section style="padding:30px;">
                <div class="f15" v-if="info.appeal_status!=2 || info.appeal_status!=5">{{info.appeal_status==1 ? lang[local].appealTip5 : info.appeal_status==3 && info.has_evidence == 0 ? lang[local].appealTip6 : info.appeal_status==3 && info.has_evidence == 1 ? lang[local].appealTip6 : info.appeal_status==4 ? lang[local].appealTip7 :''}}</div>
                <div v-if="info.appeal_status== 3 && info.has_evidence !=1" style="font-size:18px;font-weight:bold;line-height:50px;margin-top:50px;">{{lang[local].appealTip8}} <span class="sell">{{leftTime}}</span> {{lang[local].appealTip9}}</div>
                <Button v-if="info.appeal_status== 3 && !isShow && info.has_evidence !=1" type="primary" size="large" style="padding:10px 50px;margin-top:50px;" @click="isShow = true">{{lang[local].appealS3}}</Button>
                <Button v-if=" info.appeal_status == 1 && info.user_type == 1 " type="text" size="large" style="padding:10px 50px;margin-top:50px;" @click="cancelModal = true">{{lang[local].appealCancel}}</Button>
                <div class="form" v-if="isShow">
                    <p>{{lang[local].appealTip10}}</p>
                    <p><textarea v-model="txt" type="textarea" :rows="6" :placeholder="lang[local].appealTip11" @input='validateTxt'/><span style="color:#bbb">{{lang[local].addOrderTip9}} {{ 200 - txt.length}} {{lang[local].addOrderTip10}}</span></p>
                    <p>{{lang[local].appealTxt8}}</p>
                    <p>
                        <div class="uploadpic">
                            <ul>
                                <li v-for="(item,index) in pNum">
                                    <i class="iconfont icon-shut" @click.stop="delpic(index)"></i>
                                    <uploadFile path="nameAuth" v-model="pNum[index]" :class="pNum[index].state == getStateStart ? 'focus' : ''" @input="uploadOk">
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
                    </p>
                    <p>{{lang[local].appealTip12}}</p>
                    <p style="margin-top:30px">
                        <Button type="primary" size="large"  @click="uploadEvidence">{{lang[local].apply37}}</Button>
                        <Button type="text" size="large"  @click="isShow = false">{{lang[local].cancel}}</Button>
                    </p>

                </div>
            </section>
        </div>   
        <div class="right">
            <p class="tit">{{lang[local].appealOrderInfo}}</p>
            <table>
                <tr>
                    <td width="100">{{lang[local].appealOrderNO}}：</td>
                    <td>{{info.order_number}}</td>
                </tr>
                <tr>
                    <td>{{lang[local].c2cBizName}}：</td>
                    <td>{{info.business_name}}</td>
                </tr>
                <tr>
                    <td>{{lang[local].appealCreateTime}}：</td>
                    <td>{{localDate(info.order_create_time)}}</td>
                </tr>
                <tr>
                    <td colspan="2" class="border"></td>
                </tr>
                <tr>
                    <td style="padding-top:15px">{{lang[local].transferType}}：</td>
                    <td style="padding-top:15px">{{info.order_type ==1 ? lang[local].c2cBuy:lang[local].c2cSell}}</td>
                </tr>
                <tr>
                    <td >{{lang[local].unitPrice}}：</td>
                    <td >{{info.single_price}}</td>
                </tr>
                <tr>
                    <td >{{lang[local].num}}：</td>
                    <td >{{info.amount}}</td>
                </tr>
                <tr>
                    <td style="padding-bottom:15px">{{lang[local].addOrderTip3}}：</td>
                    <td style="padding-bottom:15px">{{info.total_price}}</td>
                </tr>
            </table>
        </div>
        <Modal
            v-model="cancelModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>{{lang[local].appealCancel}}</h1>
            <div class="txt">{{lang[local].appealCancelTxt1}}</div>
            <div class="tip">
                <p>{{lang[local].appealCancelTxt2}}：</p>
                <p>{{lang[local].appealCancelTxt3}}</p>
            </div>
            <div>
                <Row>
                    <Col span="4"><Button type="primary" size="large" @click="cancel">{{lang[local].appealCancelTxt4}}</Button></Col>
                    <Col span="4" :offset="16"><Button type="text" size="large" @click="cancelModal = false">{{lang[local].appealCancelTxt5}}</Button></Col>
                </Row>
            </div>
        </Modal>
        <Modal
            v-model="showPic"
            :closable = false
            :footer-hide = true
            :width = 100
            class-name="vertical-center-modal">
            <div align="center">
                <img :src="bigpic" style="max-height:70vh">
            </div>
        </Modal>
    </section>
</template>

<script>
export default {
    data(){
        return{
            cancelModal:false,
            leftTime:'',
            isShow:false,
            txt:'',
            pNum:[''],
            info:{},
            timeline:[],
            showPic:false,
            bigpic:'',
        }
    },
    mounted(){
        console.log(this.$route.query.id);
        
        this.appealDetail()
        this.tourl = process.env.NODE_ENV == 'development' ? '/article.html' : '/home/article'
    },
    methods:{
        cancel(){
            this.axios({
                url : this.api.cancel,
                data : {
                    appeal_id:this.$route.query.id
                }
            }).then(res=>{
                this.appealDetail()
                this.cancelModal = false
                this.$store.commit('msg/err', res.message);
            }).catch( err=>{
                console.log(err);
                this.$store.commit('msg/err', err.message);
            })
        },
        addpic(){
            this.pNum.push('')
        },
        delpic(index){
            this.pNum.splice(index,1)
        },
        uploadOk(v){
            if(v.state){
                if(this.pNum.length < 5){
                    this.addpic()
                }
            }
        },
        appealDetail(){
            this.axios({
                url : this.api.appealDetail,
                data : {
                    appeal_id:this.$route.query.id,
                }
            }).then((res) => {
                this.info = res.data.info
                let time = res.data.info.remain_time
                this.timeline = res.data.info.timeline
                if(time > 0){
                    setInterval(()=>{
                        let M = Math.floor(time/60%60)
                        let S = Math.floor(time%60)
                        this.leftTime = `${M}:${S<10 ? '0' + S :S}`
                        time--
                        if(!M && !S){
                            clearInterval()
                            this.payModal=false
                            this.appealDetail()
                        }
                    },1000) 
                }
            }).catch((err) => {
                this.$store.commit('msg/err', err.message)
                if(this.loginGetStatus && this.loginStatus){
                    location.href = process.env.NODE_ENV == 'development' ? '/finance.html/appeal' : '/home/finance/appeal'
                }else{
                    location.href = process.env.NODE_ENV == 'development' ? '/login.html' : '/home/login'
                }
            });
        },
        validateTxt(){
            if(this.txt.length > 200){
                this.txt = this.txt.substring(0,200)
            }
        },
        uploadEvidence(){
            let images=[]
            this.pNum.map(d => {
                if(d){
                    images.push(d.origin)
                }
            })
            
            this.axios({
                url : this.api.uploadEvidence,
                data : {
                    appeal_id:this.$route.query.id,
                    content:this.txt,
                    images:images.join()
                }
            }).then((res) => {
                this.$store.commit('msg/add', res.message)
                this.isShow = false
                this.appealDetail()
            }).catch((err) => {
                this.$store.commit('msg/err', err.message)
            })
        },
        openpic(pic){
            this.showPic = true
            this.bigpic = pic
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .detail{
        margin-top:60px;
        overflow: hidden;
        min-height:80vh;
        .left{
            background:#fff;
            // box-shadow:0 0 8px rgba(0,0,0,.3);
            
            float: right;
            width:calc(100% - 335px);
            .tit{
                font-weight: bold;
                font-size:16px;
                padding:0 15px;
            }
            .info{
                padding:15px 30px;
                background: #F6F6F6;
                line-height:40px;
                font-size:15px;
                border-top:1px dotted #ccc;
                border-bottom:1px dotted #ccc;
            }
            .history{
                padding:15px 30px;
                background: #fff;
                ul{
                    overflow: hidden;
                }
                li{
                    margin:30px 0;
                    margin-left:20px;
                    position: relative;
                    line-height:36px;
                    &::after{content:'';position:absolute;top:30px;left:-20px; width:15px;height:15px;background:#FF6600;border-radius:50%; }
                    &::before{content:'';position:absolute;top:10px;left:-14px; width:4px;height:130%;background:#E7E7E7;}
                    &:last-child::before{height:60%;}
                    .tip{
                        width: 98%;
                        min-height:100px;
                        display:inline-block;margin-left:10px;line-height:35px; //border:1px solid #FF6600;
                        border-radius:4px;
                        background: #FCFAED;
                        font-size:15px;
                        position: relative;
                        box-shadow:0 2px 5px rgba(0,0,0,.3);
                        &::after{
                            content:'';width:0;height:0;border-width:6px;border-style: solid;border-color:transparent #F9F5F2 transparent transparent;
                            position:absolute;top:30px;left:-12px;
                        }
                        &::before{
                            content:'';width:0;height:0;border-width:6px;border-style: solid;border-color:transparent rgba(0,0,0,.2) transparent transparent;
                            position:absolute;top:30px;left:-13px;
                        }
                        .tit{
                            border-bottom: 1px dotted #ccc;
                            padding:6px 20px;
                            color:#909090;
                            font-weight: normal;
                            font-size:15px;
                        }
                        .content{
                            padding:6px 20px;
                            color:#545454;
                            .pic{
                                img{
                                    width:150px;height:150px;margin:10px;border:1px solid #ddd;background: #fff;padding:10px;box-shadow:0 2px 5px rgba(0,0,0,.1)
                                }
                            }
                        }
                    }
                }
                
            }
        }
        .right{
            background:#fff;
            // box-shadow:0 0 8px rgba(0,0,0,.3);
            float: left;
            width:320px;
            .tit{font-size:16px;color: #8E8E8E;margin-bottom:15px;padding:15px 20px;background:#FF6600;color:#fff;}
            table{
                width:100%;
                tr{
                    & td:first-child{
                        text-align:right;
                    }
                }
                td{
                    height:40px;
                    line-height: 40px;
                    font-size:15px;
                    &.border{border-bottom:1px dotted #ccc;height:1px;line-height: 1px;padding-bottom:15px}

                }
            }
        }
    }

    .f15{
        font-size:15px;
    }
    .cursor{
        cursor: pointer;
    }

    .form{
        line-height: 60px;
        font-size:15px;
        border:1px solid rgb(255, 173, 118);
        padding:30px 20px;margin:30px 0;
        p:first-child{
            color:#FF6600;font-weight: bold;font-size:16px;
            margin-bottom:20px;
        }
        p:nth-child(2){
            position: relative;
            span{
                position:absolute;
                right:10px;
                bottom:10px;
            }
        }
        p:last-child{
            margin-top:50px;
        }
        textarea{
            border:1px solid #E7E7E7;
            border-radius: 4px;
            width:100%;
            outline: none;
            padding:10px;
            line-height:28px;
        }
    }
    .bar{background: #fff;padding:15px; font-size:16px;margin-bottom:10px; font-weight: bold}
    .iconfont{font-size:26px;font-weight:normal;margin-right:10px;position: relative;top:3px;}
    .uploadpic{
        ul{overflow: hidden;}
        li{
            display: inline-block;width:180px;height:180px;border:1px dashed #aaa;margin-right:20px;margin-bottom:20px;position: relative;
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
                top:0;right:-7px;
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
    .vertical-center-modal{
        .txt{font-size:16px;color:red;margin:50px 0;}
        .tip{margin-bottom:50px;font-size:15px;color:#333}
    }
</style>
