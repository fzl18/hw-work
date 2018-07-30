<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].gaCode1}}</span>
            </financeHeader>
            <section class="safety-form">
                <section class="form-group">
                    <div>
                        <label class="checkbox-my big">                            
                            <input type="checkbox" v-model="login" />
                            <i class="iconfont" :class=" login ? 'icon-icon2' : 'icon-huisekuang'"></i>
                            {{lang[local].ga9}}
                        </label>
                    </div>
                </section>
                <section class="form-group">
                    <div>
                        <label class="checkbox-my big">
                            <input type="checkbox" v-model="transfer" />
                            <i class="iconfont" :class=" transfer ? 'icon-icon2' : 'icon-huisekuang'"></i>
                            {{lang[local].ga10}}
                        </label>
                    </div>
                </section>
                <section class="form-group">
                    <div class="input-box">
                    <input type="text" @keyup.enter="setGaVerify"  v-model="token" name="safety-unbindGa-token" :placeholder="lang[local]['4009']" />
                    </div>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="setGaVerify" class="form-submit-btn">{{lang[local].ga11}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    <router-link to="./gaRemove" class="form-submit-btn white">{{lang[local].ga7}}</router-link>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "ga-set",
        data (){
            return {
                token : '',
                login : false,
                transfer : false,
            };
        },
        created (){
            if(this.userBasicinfo && this.userBasicinfo.userid && this.userBasicinfo.gabind){
                this.login = this.userBasicinfo.ga_login;
                this.transfer = this.userBasicinfo.ga_trans;
            }else{
                this.$router.push('./ga');
            };
        },
        methods : {
            setGaVerify (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(this.token.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].ga1);
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.setGaVerify,
                    data : {
                        token : this.token,
                        login : (this.login || false) *1,
                        transfer : (this.transfer || false) * 1,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang[this.local].ga12);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].ga13);
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
