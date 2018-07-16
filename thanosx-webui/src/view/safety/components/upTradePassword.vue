<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.tradePassword9}}</span></h4>
            <section class="safety-hint">
                {{lang.tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang.tradePassword9}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <input type="password" @keyup.enter="uppaypassword"  v-model="param.oldpaypwd" name="safety-trade-oldpaypwd" :placeholder="lang.tradePassword5" />
                </section>
                <section class="form-group">
                    <input type="password" @keyup.enter="uppaypassword" v-model="param.newpaypwd" name="safety-trade-newpaypwd" :placeholder="lang.tradePassword3" />
                </section>
                <section class="form-group">
                    <input type="password" @keyup.enter="uppaypassword" v-model="param.repaypwd" name="safety-trade-repaypwd" :placeholder="lang.tradePassword4" />
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="uppaypassword" class="form-submit-btn">{{lang.confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
                <section class="form-group">
                    <router-link to="./findTradePassword" class="form-submit-btn white">{{lang.tradePassword11}}</router-link>
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
                    this.$store.commit('msg/err', this.lang.tradePassword7);
                    return false;
                };
                if(newpaypwd.length < 8){
                    this.$store.commit('msg/err', this.lang.tradePassword6);
                    return false;
                };
                if(newpaypwd != repaypwd){
                    this.$store.commit('msg/err', this.lang.tradePassword8);
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
                    this.$store.commit('msg/add', this.lang.tradePassword13);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.tradePassword12);
                });

            },
        },
    }
</script>

