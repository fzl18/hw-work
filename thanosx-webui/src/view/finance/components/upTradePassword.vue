<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang[local].tradePassword9}}</span></h4>
            <section class="safety-hint">
                {{lang[local].tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang[local].tradePassword9}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <input type="password" @keyup.enter="uppaypassword"  v-model="param.oldpaypwd" name="safety-trade-oldpaypwd" :placeholder="lang[local].tradePassword5" />
                </section>
                <section class="form-group">
                    <input type="password" @keyup.enter="uppaypassword" v-model="param.newpaypwd" name="safety-trade-newpaypwd" :placeholder="lang[local].tradePassword3" />
                </section>
                <section class="form-group">
                    <input type="password" @keyup.enter="uppaypassword" v-model="param.repaypwd" name="safety-trade-repaypwd" :placeholder="lang[local].tradePassword4" />
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="uppaypassword" class="form-submit-btn">{{lang[local].confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
                <section class="form-group">
                    <router-link to="./findTradePassword" class="form-submit-btn white">{{lang[local].tradePassword11}}</router-link>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "upTradePassword",
        data (){
            return {
                param : {
                    oldpaypwd : '',
                    newpaypwd : '',
                    repaypwd : '',
                },
            };
        },
        created (){
            if(this.userBasicinfo && this.userBasicinfo.userid && !this.userBasicinfo.paypassword){
                this.$router.push('./setTradePassword');
            };
        },
        methods : {
            uppaypassword (){

                if(this.getState == this.getStateStart){
                    return false;
                };

                var {oldpaypwd, newpaypwd, repaypwd} = this.param;
                if(oldpaypwd.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].tradePassword7);
                    return false;
                };
                if(newpaypwd.length < 8){
                    this.$store.commit('msg/err', this.lang[this.local].tradePassword6);
                    return false;
                };
                if(newpaypwd != repaypwd){
                    this.$store.commit('msg/err', this.lang[this.local].tradePassword8);
                    return false;
                };

                this.getStart();

                this.axios({
                    url : this.api.uppaypassword,
                    data : {
                        oldpaypwd,
                        newpaypwd,
                        repaypwd,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].tradePassword13);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].tradePassword12);
                });

            },
        },
    }
</script>

