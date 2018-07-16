<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.safety0}}</span></h4>
            <section>
                <ul class="safety-base">
                    <li>{{lang.safety22}}：</li>
                    <li>{{hidePhone(userBasicinfo.username)}}</li>
                    <li></li>
                </ul>
                <ul class="safety-base">
                    <li>UID：</li>
                    <li>{{userBasicinfo.userid}}</li>
                    <li></li>
                </ul>
                <ul class="safety-base">
                    <li>{{lang.safety24}}：</li>
                    <li>
                        <span>*********</span>
                    </li>
                    <li>
                        <router-link to="./uppassword">{{lang.safety12}}</router-link>
                    </li>
                </ul>
                <ul class="safety-base">
                    <li>{{lang.safety23}}：</li>
                    <li>{{userBasicinfo.questionid ? '' : lang.safety10}}{{userBasicinfo.question && userBasicinfo.question.question}}</li>
                    <li>
                        <router-link v-if="!!!userBasicinfo.questionid" to="./issue">{{lang.safety13}}</router-link>
                    </li>
                </ul>
            </section>
        </section>

        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.safety1}}</span></h4>
            <section class="safety-state">
                <div class="safety-state-item realName">
                    <h4>
                        <b>{{lang.realNam}}</b>
                        <span v-if="userBasicinfo.userid" :class="classActive(userBasicinfo.truename && userBasicinfo.nameauthstatus == '1')">
                            {{
                            userBasicinfo.nameauthstatus == '0' && userBasicinfo.idcard
                            ? lang.nameAuth27
                            : userBasicinfo.nameauthstatus == '1' && userBasicinfo.idcard
                            ? lang.certified
                            : userBasicinfo.nameauthstatus == '2' && userBasicinfo.idcard
                            ? lang.nameAuth31
                            :lang.unauthorized
                            }}
                        </span>
                        <small v-if="userBasicinfo.truename && userBasicinfo.userid">({{hideName(userBasicinfo.truename)}})</small>
                    </h4>
                    <div class="safety-state-text">
                        {{lang.safety5}}
                    </div>
                    <router-link :to="userBasicinfo.truename ? './nameAuthDetails' :'./nameAuth'" class="safety-state-more" :class="classActive(userBasicinfo.truename)">
                        {{userBasicinfo.truename ? lang.safety6 : lang.safety7}}
                    </router-link>
                </div>
                <div class="safety-state-item tradePassword">
                    <h4>
                        <b>{{lang.payPassword}}</b>
                        <span :class="classActive(userBasicinfo.paypassword)" v-if="userBasicinfo.userid">
                            {{userBasicinfo.paypassword ? lang.safety9 : lang.safety10}}
                        </span>
                    </h4>
                    <div class="safety-state-text">
                        {{lang.safety11}}
                    </div>
                    <router-link :to="userBasicinfo.paypassword ? './upTradePassword' : './setTradePassword'"
                                 class="safety-state-more"
                                 :class="classActive(userBasicinfo.paypassword)">
                        {{userBasicinfo.paypassword ? lang.safety12 : lang.safety13}}
                    </router-link>
                </div>
                <div class="safety-state-item bindPhone">
                    <h4>
                        <b>{{lang.safety14}}</b>
                        <span v-if="userBasicinfo.userid" :class="classActive(userBasicinfo.moble)">
                            {{userBasicinfo.moble ? lang.safety15 : lang.safety16}}
                        </span>
                        <small v-if="userBasicinfo.userid" :class="moble ? 'active animated tada' : ''">
                            ({{moble ? moble : hidePhone(userBasicinfo.moble)}})
                        </small>
                    </h4>
                    <div class="safety-state-text">
                        {{lang.safety17}}
                    </div>
                    <router-link v-on:click.native="moble ? moble='' : userBasicinfo.moble ? moble=userBasicinfo.moble : ''"
                                :to="userBasicinfo.moble ? '' : './mobileBind'"
                                 class="safety-state-more"
                                 :class="classActive(userBasicinfo.moble)">
                        {{userBasicinfo.moble ? lang.safety18 : lang.safety19}}
                    </router-link>
                </div>
                <div class="safety-state-item gaCode">
                    <h4>
                        <b>{{lang.safety20}}</b>
                        <span :class="classActive(userBasicinfo.gabind)"  v-if="userBasicinfo.userid">
                            {{userBasicinfo.gabind ? lang.certified : lang.unauthorized}}
                        </span>
                    </h4>
                    <div class="safety-state-text">
                        {{lang.safety21}}
                    </div>
                    <router-link to="./ga" class="safety-state-more" :class="classActive(userBasicinfo.gabind)" >{{userBasicinfo.gabind ? lang.safety13 : lang.safety7}}</router-link>
                </div>
                <section class="safety-state-icon">
                    <div class="safety-state-icon-bg"></div>
                    <div class="safety-state-icon-state">{{userBasicinfo.level == 2 ? lang.safety25 : userBasicinfo.level == 1 ? lang.safety26 :  userBasicinfo.level == 0 ?  lang.safety27 : ''}}</div>
                    <div class="safety-state-icon-over"></div>
                    <div class="dot dot1"></div>
                    <div class="dot dot2"></div>
                    <div class="dot dot3"></div>
                </section>
            </section>
        </section>

        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.safety30}}</span></h4>
            <list :url="api.loginlog" >
                <dl slot="head">
                    <dd>{{lang.safety31}}</dd>
                    <dd>{{lang.safety32}}</dd>
                    <dd>{{lang.safety34}}</dd>
                    <dd>{{lang.safety35}}</dd>
                    <dd>{{lang.safety36}}</dd>
                    <dd>{{lang.state}}</dd>
                </dl>
                <dl slot="body" slot-scope="{item}">
                    <dd>{{localDate(item.addtime)}}</dd>
                    <dd>{{item.type}}</dd>
                    <dd>{{item.remark}}</dd>
                    <dd>{{item.addip}}</dd>
                    <dd>{{item.addr}}</dd>
                    <dd>{{item.status == 1 ? lang.normal : lang.otc21}}</dd>
                </dl>
            </list>
        </section>
    </section>
</template>

<script>
    export default {
        name: "ga",
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

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
