<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].tradePassword9}}</span>
                <span class="tips"><Icon type="information-circled" color="#ff0000"/> {{lang[local].tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang[local].tradePassword9}}</span>
            </financeHeader>
            <section class="safety-form">
                <section class="form-group">
                    <div class="input-box">
                     <i class="iconfont icon-mima" ></i> <input type="password"  @keyup.enter="uppaypassword" v-model="param.newpaypwd" name="safety-trade-setnewpaypwd" :placeholder="lang[local].payPassword" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                        <i class="iconfont icon-mima" ></i> <input type="password" @keyup.enter="uppaypassword" v-model="param.repaypwd" name="safety-trade-setrepaypwd" :placeholder="lang[local].tradePassword4" />
                    </div>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="uppaypassword" class="form-submit-btn">{{lang[local].confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "setTradePassword",
        data (){
            return {
                param : {
                    newpaypwd : '',
                    repaypwd : '',
                },
            };
        },
        created (){
            if(this.userBasicinfo && this.userBasicinfo.userid && this.userBasicinfo.paypassword){
                this.$router.push('./upTradePassword');
            };
        },
        methods : {
            uppaypassword (){
                if(this.getState == this.getStateStart){
                    return false;
                };

                var {newpaypwd, repaypwd} = this.param;
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

