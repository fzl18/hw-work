<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].nameAuth1}}</span>
            </financeHeader>
            <section class="safety-form" style="padding:0;box-shadow:none;margin:30px 0">
                <section class="form-group">
                    <div class="input-box">
                    <input type="text" name="safety-answer" v-model="truename" :placeholder="lang[local].nameAuth5" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                    <select-my class="safety-issue-select" v-model="type" :list="dcTypeList" selected="" @change="nameAuthTypeChange" :placeholder="lang[local].nameAuth3"/>
                    </div>
                </section>                
                <section class="form-group">
                    <div class="input-box">
                    <input type="text" name="safety-answer" v-model="idcard" :placeholder="lang[local].nameAuth6" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="login-state input-box">
                        <select v-model="param.districtcode">
                            <option v-for="v,k in districtCode" :value="v">{{k}}</option>
                        </select>
                        <span :class="classActive(stateCode)" @click="stateCode = !stateCode" style="padding-left:10px;">
                            {{param.country && param.country + '  '}} <span style="color:#929292">{{param.districtcode ? '' : lang[local].selectCountry }}</span>
                        </span>
                        <ul class="login-state-select" v-if="stateCode">
                            <li v-for="v,k in districtCode" @click="stateCode = false;param.districtcode=v ; param.country = k"><span>{{k}}</span> <!--<i>{{v}} </i> --></li>
                        </ul>
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                        <textarea type="text" name="safety-answer" rows="3" v-model="addr" :placeholder="lang[local].nameAuth100" style="width:100%;border:none;padding:10px;"/>
                    </div>
                </section>
                <section class="form-group">
                    <div class="tit" style="font-size:16px;">
                        {{lang[local].nameAuth7}}
                    </div>                    
                    <section class="nameAuth">                        
                        <ul>
                            <li>
                                <uploadFile path="nameAuth" v-model="idcardpic1" :class="idcardpic1.state == getStateStart ? 'focus' : ''">
                                    <i></i>
                                    <em :style="{backgroundImage : 'url(' + idcardpic1.origin + ')'}"></em>
                                    <div class="progress" v-if="idcardpic1.state == getStateStart">
                                        <b :style="{height : idcardpic1.progress + '%'}"></b>
                                        <div>{{idcardpic1.progress + '%'}}</div>
                                    </div>
                                    <div> 
                                        <!-- <i class="iconfont icon-jia"></i> <br /><br /><br /> -->
                                        {{lang[local].nameAuth9}} <br /><span>{{lang[local].uploadpicbtn}}</span> </div>
                                </uploadFile>
                            </li>
                            <li>
                                <uploadFile path="nameAuth" v-model="idcardpic2" :class="idcardpic2.state == getStateStart ? 'focus' : ''">
                                    <i></i>
                                    <em :style="{backgroundImage : 'url(' + idcardpic2.origin + ')'}"></em>
                                    <div class="progress" v-if="idcardpic2.state == getStateStart">
                                        <b :style="{height : idcardpic2.progress + '%'}"></b>
                                        <div>{{idcardpic2.progress + '%'}}</div>
                                    </div>
                                    <div> 
                                        <!-- <i class="iconfont icon-jia"></i> <br /><br /><br /> -->
                                    {{lang[local].nameAuth10}} <br /><span>{{lang[local].uploadpicbtn}}</span>
                                    </div>
                                </uploadFile>
                            </li>
                            <li>
                                <uploadFile path="nameAuth" v-model="idcardpic3" :class="idcardpic3.state == getStateStart ? 'focus' : ''">
                                    <i></i>
                                    <img src="../assets/images/ren.png" alt="">
                                    <em :style="{backgroundImage : 'url(' + idcardpic3.origin + ')'}"></em>
                                    <div class="progress" v-if="idcardpic3.state == getStateStart">
                                        <b :style="{height : idcardpic3.progress + '%'}"></b>
                                        <div>{{idcardpic3.progress + '%'}}</div>
                                    </div>
                                    <div>
                                         <!-- <i class="iconfont icon-jia"></i> <br /><br /><br /> -->
                                        {{lang[local].nameAuth11}} <br /><span>{{lang[local].uploadpicbtn}}</span>
                                    </div>
                                </uploadFile>
                                
                            </li>
                            <li>
                                <span style="text-align:left;" v-html="lang[local].nameAuth35"></span>
                                <img src="../assets/images/pt.png" alt="">
                            </li>
                        </ul>
                    </section>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="nameauth" class="form-submit-btn">{{lang[local].confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
            </section>
        </section>
        <!-- <section class="nameauth-imgBig-box" v-if="imgBigState" @click="imgBigState = !imgBigState">
            <div class="nameauth-imgBig">
                <img src="../assets/images/sfz.jpg" alt="">
            </div>
        </section> -->
    </section>
</template>

<script>
    export default {
        name: "nameAuth",
        data (){
            return {
                imgBigState : false,
                dcTypeList : [],
                idcardpic1 : {},
                idcardpic2 : {},
                idcardpic3 : {},
                truename : '',
                type : '',
                idcard : '',
                addr:'',
                stateCode:false,         
                districtCode : {},
                param : {
                    districtcode : '',
                    country:''
                }
            };
        },
        watch : {
            local(){
                this.dcType()
                this.getDistrictCode()
            },
            idcardpic1 (n, o){
                if(n.state == this.getStateSuccess){
                    this.$store.commit('msg/add', this.lang[this.local].nameAuth13);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang[this.local].nameAuth16);
                };
            },
            idcardpic2 (n, o){
                if(n.state == this.getStateSuccess){
                    this.$store.commit('msg/add', this.lang[this.local].nameAuth14);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang[this.local].nameAuth17);
                };
            },
            idcardpic3 (n, o){
                if(n.state == this.getStateSuccess){
                    this.$store.commit('msg/add', this.lang[this.local].nameAuth15);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang[this.local].nameAuth18);
                };
            },
        },
        created (){
            this.nameAuthType = [['', this.nameAuth3]];
            this.dcType();
            this.getDistrictCode();
        },
        methods : {
            
            getDistrictCode (){
                this.axios({
                    url : this.api.getDistrictCode,
                    data:{
                        type:2
                    }
                }).then((res) => {
                    this.districtCode = res.data || {};
                    // this.stateCode = true
                }).catch((err) => {
                    console.log(err);
                    this.districtCode = {cn : '+86'}
                });
            },
            nameauth (){

                if(!!!this.type){
                    this.$store.commit('msg/err', this.lang[this.local].safety29);
                    return false;
                };
                if(this.truename.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].nameAuth22);
                    return false;
                };
                if(this.idcard.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].nameAuth23);
                    return false;
                };
                if(!!!this.idcardpic1.data){
                    this.$store.commit('msg/err', this.lang[this.local].nameAuth19);
                    return false;
                };
                if(!!!this.idcardpic2.data){
                    this.$store.commit('msg/err', this.lang[this.local].nameAuth20);
                    return false;
                };
                if(!!!this.idcardpic3.data){
                    this.$store.commit('msg/err', this.lang[this.local].nameAuth21);
                    return false;
                };
                if(!this.addr || this.addr ==''){
                    this.$store.commit('msg/err', this.lang[this.local].nameAuth100);
                    return false;
                };

                this.getStart();
                this.axios({
                    url : this.api.nameauth,
                    data : {
                        type : this.type,
                        truename : this.truename,
                        idcard : this.idcard,
                        idcardpic1 : this.idcardpic1.data,
                        idcardpic2 : this.idcardpic2.data,
                        idcardpic3 : this.idcardpic3.data,
                        district_code:this.param.districtcode,
                        district_address:this.addr
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].nameAuth24);
                    // this.$router.push('./nameAuthDetails');
                    this.$router.push('/account');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].nameAuth25);
                });
            },
            nameAuthTypeChange (val){
                if(val[0]){
                    this.$store.commit('msg/delMsg', this.lang[this.local].safety29);
                }else{
                    this.$store.commit('msg/err', this.lang[this.local].safety29);
                };
            },
            dcType (){
                this.axios({
                    url : this.api.dcType,
                }).then((res) => {
                    var data = res.data || [];
                    var dcTypeList = [['', this.lang[this.local].safety28]];
                    data.forEach((q) => {
                        dcTypeList.push([q.id, q.name]);
                    });
                    this.dcTypeList = dcTypeList;
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .login-state{
        width: 100%;
        & > select{
            display: none;
        }
        & > span{
            cursor: pointer;
            font-size: 16px;
            position: relative;
            line-height: 40px;
            display: block;
            
            &.active{
                &:after{
                    transform:translateY(-50%) rotateZ(180deg);
                }
            }
            &:after{
                content: '\F104';
                @include iconfont(16px);
                display: block;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                transition: transform 0.4s ease;
            }
        }
        .login-state-select{
            position: absolute;
            width: 100%;
            top: 40px - 1px;
            background: #ffffff;            
            box-shadow: 0 0 5px rgba(0,0,0,.3);
            max-height: 200px;
            z-index:999;
            overflow: auto;
            @media screen and (max-width: 820px){
                top: 40px - 1px;
            }
            li{
                display: block;
                padding: 15px 20px;
                font-size: 16px;
                color: $fontColor;
                overflow: hidden;
                cursor: pointer;
                text-transform: uppercase;
                span{
                    float: left;
                }
                i{
                    display: block;
                    float: right;
                    font-style: normal;
                }
                &:nth-child(even){background:#eee;}
            }
        }
    }

    .nameAuth ul.maxImg{
        li{
            position: absolute;
            left: 112%;
            bottom:0px;
            line-height: 1;
            width: 260px;
            span{
                display: block;
                height: 350px;
                width: 100%;
                // background: url("../assets/images/sfz.jpg") no-repeat center center;
                background-size: auto 100%;
                margin-top: 0;
            }
            p{
                line-height: 2.2;
                font-size: 14px;
                min-height: auto;
                a{
                    display: inline-block;
                }
            }
        }
    }
</style>

