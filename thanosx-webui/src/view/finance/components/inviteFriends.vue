<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].inviteFriends}}</span>
        </financeHeader>
        <section class="finance-hint">
            {{lang[local].inviteFriends1}}
        </section>
        <load v-if="!invitState" />
        <section class="finance-coin">

            <section class="takeCoin" v-if="invitState && !spread">
                <section class="takeCoin-form finance-form">
                    <section class="form-group">
                        <label>{{lang[local].inviteCode}}</label>
                        <input @keyup.enter="spreadActive" type="text" v-model="invite" :placeholder="lang[local].inviteCode" />
                        <p class="inviteFriends-codeText">{{lang[local].inviteFriends2}}</p>
                    </section>
                    <section class="form-group form-group-btn">
                        <a href="javascript:;" @click="spreadActive" class="form-submit-btn">
                            {{lang[local].activate}}{{this.getState == this.getStateStart ? '...' : ''}}
                        </a>
                    </section>
                </section>
            </section>

            <section class="inviteFriends-text" v-if="invitState && !spread">
                <p>{{lang[local].inviteFriends3}}</p>
                <section class="inviteFriends-ewm">
                    <img src="../../../../static/images/push-ewm9.png" alt="">
                    <img src="../../../../static/images/push-ewm10.jpg" alt="">
                </section>
            </section>

            <section class="inviteFriends-text" v-if="invitState && spread">
                <p><span class="mainColor">{{lang[local].inviteFriends4}} </span>{{lang[local].inviteFriends5}}</p>
                <section class="inviteFriends-img">
                    <img src="../assets/images/invite.jpg" alt="">
                    <div v-if="spread">
                        <ewm :value="spread" :size="136" />
                    </div>
                </section>
                <p><br></p>
                <p><span class="mainColor">{{lang[local].inviteFriends6}} </span>{{lang[local].inviteFriends7}}</p>
                <p>{{lang[local].inviteFriends8}} <a :href="spread" target="_blank">{{spread}}</a></p>
                <copy :val="spread"><button class="inviteFriends-copy-btn">{{lang[local].clickCopyLink}}</button></copy>
            </section>

        </section>
        <h4 class="finance-title">
            <span>{{lang[local].inviteRecord}}</span>
        </h4>
        <list class="inviteFriends-table" :url="api.invitList" >
            <dl slot="head">
                <dd>{{lang[local].inviteRecord1}}</dd>
                <dd>{{lang[local].inviteRecord2}}</dd>
                <dd>{{lang[local].inviteRecord3}}</dd>
                <dd>{{lang[local].inviteRecord4}}</dd>
            </dl>
            <dl slot="body" slot-scope="{item}" :key="item.id">
                <dd>{{item.username}}</dd>
                <dd>{{localDate(item.addtime)}}</dd>
                <dd>{{item.idcard_status}}</dd>
                <dd>{{item.isradar}}</dd>
            </dl>
        </list>
    </section>
</template>

<script>
    export default {
        name: "inviteFriends",
        data (){
            return {
                invite : '',
                spread : false,
                invitState : false,
            };
        },
        created (){
            this.invit();
        },
        methods : {
            spreadActive (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(this.invite == ''){
                    this.$store.commit('msg/err', this.lang[local].inviteCodeError);
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.spreadActive,
                    data : {
                        code : this.invite
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[local].activateS);
                    this.invit();
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[local].activateE);
                    console.log(err);
                });
            },
            invit (){
                this.axios({
                    url : this.api.invit,
                }).then((res) => {
                    this.invitState = true;
                    if(res.data.code){
                        this.spread = location.origin + this.registerUrl + '/' + res.data.code;
                    }else{
                        this.spread = false;
                    }
                }).catch((err) => {
                    this.invitState = true;
                    this.spread = false;
                    console.log(err);
                });
            },
        }
    }
</script>

<style scoped>

</style>
