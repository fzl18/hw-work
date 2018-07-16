<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.ga8}}</span></h4>
            <section class="safety-hint">
                {{lang.tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang.ga8}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <div>
                        <label class="checkbox-my big">
                            <input type="checkbox" v-model="login" />
                            <i></i>
                            {{lang.ga9}}
                        </label>
                    </div>
                </section>
                <section class="form-group">
                    <div>
                        <label class="checkbox-my big">
                            <input type="checkbox" v-model="transfer" />
                            <i></i>
                            {{lang.ga10}}
                        </label>
                    </div>
                </section>
                <section class="form-group">
                    <input type="text" @keyup.enter="setGaVerify"  v-model="token" name="safety-unbindGa-token" :placeholder="lang['4009']" />
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="setGaVerify" class="form-submit-btn">{{lang.ga11}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
                <section class="form-group">
                    <router-link to="./gaRemove" class="form-submit-btn white">{{lang.ga7}}</router-link>
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
                    this.$store.commit('msg/err', this.lang.ga1);
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
                    this.$store.commit('msg/add', this.lang.ga12);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.ga13);
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
