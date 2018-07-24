<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.tradePassword9}}</span></h4>
            <section class="safety-hint">
                {{lang.tradePassword2}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <div class="input-box">
                    <input type="password"  @keyup.enter="uppaypassword" v-model="param.newpaypwd" name="safety-trade-setnewpaypwd" :placeholder="lang.payPassword" />
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                    <input type="password" @keyup.enter="uppaypassword" v-model="param.repaypwd" name="safety-trade-setrepaypwd" :placeholder="lang.tradePassword4" />
                    </div>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="uppaypassword" class="form-submit-btn">{{lang.confirm}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
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

