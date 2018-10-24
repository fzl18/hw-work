<template>
    <section>
        <section  class="safety-block">
            <financeHeader>
                <span>{{lang[local].gaCode1}}</span>
            </financeHeader>
            <section class="safety-form">
                <section class="form-group">
                    <div class="input-box">
                    <input type="text" @keyup.enter="unbindGa"  v-model="token" name="safety-unbindGa-token" :placeholder="lang[local]['4009']" style="width:85%"/>
                    </div>
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="unbindGa" class="form-submit-btn">{{lang[local].ga7}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                    <!-- <router-link to="./gaSet" class="form-submit-btn white">{{lang[local].ga11}}</router-link> -->
                    <a href="javascript: history.go(-1);" class="form-submit-btn white" >{{lang[local].cancel}}</a>
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
                    this.$store.commit('msg/err', this.lang[this.local].ga1);
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
                    this.$store.commit('msg/add', this.lang[this.local].ga5);
                    this.$router.push('/account');
                }).catch((err) => {
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang[this.local].ga6);
                });
            },
        }
    }
</script>

