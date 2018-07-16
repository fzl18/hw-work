<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.nameAuth1}}</span></h4>
            <section class="safety-hint">
                {{lang.nameAuth2}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <label>{{lang.nameAuth3}}</label>
                    <select-my class="safety-issue-select" v-model="type" :list="dcTypeList" selected="" @change="nameAuthTypeChange" />
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth5}}</label>
                    <input type="text" name="safety-answer" v-model="truename" :placeholder="lang.nameAuth5" />
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth6}}</label>
                    <input type="text" name="safety-answer" v-model="idcard" :placeholder="lang.nameAuth6" />
                </section>
                <section class="form-group">
                    <label>{{lang.nameAuth7}}</label>
                    <section class="nameAuth">
                        <p style="line-height: 1.8;padding-top: 10px;padding-bottom: 10px;">{{lang.nameAuth8}}<br/>{{lang.nameAuth33}}</p>
                        <ul>
                            <li>
                                <uploadFile path="nameAuth" v-model="idcardpic1" :class="idcardpic1.state == getStateStart ? 'focus' : ''">
                                    <i></i>
                                    <em :style="{backgroundImage : 'url(' + idcardpic1.origin + ')'}"></em>
                                    <div class="progress" v-if="idcardpic1.state == getStateStart">
                                        <b :style="{height : idcardpic1.progress + '%'}"></b>
                                        <div>{{idcardpic1.progress + '%'}}</div>
                                    </div>
                                    <span>{{lang.nameAuth9}}</span>
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
                                    <span>{{lang.nameAuth10}}</span>
                                </uploadFile>
                            </li>
                            <li>
                                <uploadFile path="nameAuth" v-model="idcardpic3" :class="idcardpic3.state == getStateStart ? 'focus' : ''">
                                    <i></i>
                                    <em :style="{backgroundImage : 'url(' + idcardpic3.origin + ')'}"></em>
                                    <div class="progress" v-if="idcardpic3.state == getStateStart">
                                        <b :style="{height : idcardpic3.progress + '%'}"></b>
                                        <div>{{idcardpic3.progress + '%'}}</div>
                                    </div>
                                    <span>{{lang.nameAuth11}}</span>
                                </uploadFile>
                            </li>
                        </ul>
                        <ul class="maxImg">
                            <li>
                                <p>{{lang.nameAuth34}}<a href="javascript:;"class="nameAuth-big"  @click="imgBigState = true">{{lang.nameAuth12}}</a></p>
                                <span @click="imgBigState = true"></span>
                            </li>
                        </ul>
                    </section>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="nameauth" class="form-submit-btn">{{lang.confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
            </section>
        </section>
        <section class="nameauth-imgBig-box" v-if="imgBigState" @click="imgBigState = !imgBigState">
            <div class="nameauth-imgBig">
                <img src="../assets/images/sfz.jpg" alt="">
            </div>
        </section>
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
                    this.$store.commit('msg/add', this.lang.nameAuth13);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang.nameAuth16);
                };
            },
            idcardpic2 (n, o){
                if(n.state == this.getStateSuccess){
                    this.$store.commit('msg/add', this.lang.nameAuth14);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang.nameAuth17);
                };
            },
            idcardpic3 (n, o){
                if(n.state == this.getStateSuccess){
                    this.$store.commit('msg/add', this.lang.nameAuth15);
                };
                if(n.state == this.getStateError){
                    this.$store.commit('msg/err', n.message || this.lang.nameAuth18);
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
                    this.$store.commit('msg/err', this.lang.safety29);
                    return false;
                };
                if(this.truename.length <= 0){
                    this.$store.commit('msg/err', this.lang.nameAuth22);
                    return false;
                };
                if(this.idcard.length <= 0){
                    this.$store.commit('msg/err', this.lang.nameAuth23);
                    return false;
                };
                if(!!!this.idcardpic1.data){
                    this.$store.commit('msg/err', this.lang.nameAuth19);
                    return false;
                };
                if(!!!this.idcardpic2.data){
                    this.$store.commit('msg/err', this.lang.nameAuth20);
                    return false;
                };
                if(!!!this.idcardpic3.data){
                    this.$store.commit('msg/err', this.lang.nameAuth21);
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
                    this.$store.commit('msg/add', this.lang.nameAuth24);
                    this.$router.push('./nameAuthDetails');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.nameAuth25);
                });
            },
            nameAuthTypeChange (val){
                if(val[0]){
                    this.$store.commit('msg/delMsg', this.lang.safety29);
                }else{
                    this.$store.commit('msg/err', this.lang.safety29);
                };
            },
            dcType (){
                this.axios({
                    url : this.api.dcType,
                }).then((res) => {
                    var data = res.data || [];
                    var dcTypeList = [['', this.lang.safety28]];
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
