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
                                        {{lang[local].nameAuth9}} <span>{{lang[local].uploadpicbtn}}</span> </div>
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
                                    {{lang[local].nameAuth10}} <span>{{lang[local].uploadpicbtn}}</span>
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
                                        {{lang[local].nameAuth11}} <span>{{lang[local].uploadpicbtn}}</span>
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
            };
        },
        watch : {
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
        },
        methods : {
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

<style lang="scss">
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
                background: url("../assets/images/sfz.jpg") no-repeat center center;
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
