<template>
    <section>
        <section  class="safety-block">
            <h4 class="safety-title"><span>{{lang.ga4}}</span></h4>
            <section class="safety-hint">
                {{lang.tradePassword10 + ' ' + (userBasicinfo.username || '') + ' ' +  lang.ga4}}
            </section>
            <section class="safety-form">
                <section class="form-group">
                    <input type="text" @keyup.enter="unbindGa"  v-model="token" name="safety-unbindGa-token" :placeholder="lang['4009']" />
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="unbindGa" class="form-submit-btn">{{lang.ga7}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
                <section class="form-group">
                    <router-link to="./gaSet" class="form-submit-btn white">{{lang.ga11}}</router-link>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    export default {
        name: "ga-remove",
        data (){
            return {
                token : ''
            };
        },
        created (){
            if(this.userBasicinfo && this.userBasicinfo.userid && !this.userBasicinfo.gabind){
                this.$router.push('./ga');
            };
        },
        methods : {
            unbindGa (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(this.token.length <= 0){
                    this.$store.commit('msg/err', this.lang.ga1);
                    return false;
                };
                this.getStart();
                this.axios({
                    url : this.api.unbindGa,
                    data : {
                        token : this.token,
                    }
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang.ga2);
                    this.$router.push('./');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.ga3);
                });
            },
        }
    }
</script>

