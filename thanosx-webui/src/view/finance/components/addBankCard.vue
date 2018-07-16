<template>
    <section>
        <financeHeader>
            <span>{{lang.gu_finance106}}</span>
        </financeHeader>
        <form @submit="upbank">
            <section class="finance-form">
                <section class="form-group">
                    <label>{{lang.gu_finance140}}</label>
                    <input type="text" v-model="param.bankcard" :placeholder="lang.gu_finance140" />
                    <p class="form-remark">{{lang.gu_finance150}}</p>
                </section>
                <section class="form-group" style="z-index: 99999;">
                    <label>{{lang.gu_finance160}}</label>
                    <select-my class="safety-issue-select"  :list="bankList" selected="" @change="bankListChange" />
                </section>
                <section class="form-group">
                    <label>{{lang.bankCity}}</label>
                    <select-my class="safety-issue-select min" :list="provinceList" selected="" @change="provinceChange" />
                    <select-my class="safety-issue-select min" :list="cityList"  selected="" @change="cityChange" />
                    <select-my class="safety-issue-select min" :list="countyList"  selected="" @change="countyChange" />
                    <div style="clear: both"></div>
                </section>
                <section class="form-group">
                    <label>{{lang.bankName}}</label>
                    <!--<input type="text" v-model="param.name" :placeholder="lang.bankName" />-->
                    <section class="text">
                        <span v-if="loginInfo.truename">{{loginInfo.truename}}<small> ({{lang.nameAuth1}}{{lang.nameAuth5}})</small></span>
                        <a v-else :href="truenametUrl">{{lang.nameAuth29}}</a>
                    </section>
                </section>
                <section class="form-group">
                    <label>{{lang.branchBank}}</label>
                    <input type="text" v-model="param.bankaddr" :placeholder="lang.branchBank" />
                </section>
                <section class="form-group form-group-btn">
                    <a href="javascript:;" @click="upbank" class="form-submit-btn">{{lang.gu_finance27}}{{this.getState == this.getStateStart ? '...' : ''}}</a>
                </section>
                <section class="form-group">
                    <a href="javascript:;" @click="$router.go(-1)" class="form-submit-btn white">{{lang.cancel}}</a>
                </section>
            </section>
        </form>
    </section>
</template>

<script>
    export default {
        name: "add-bank-card",
        data (){
            return {
                param : {
                    bankprov : '',
                    bankcity : '',
                    banktown : '',
                    bankaddr : '',
                    name : '',
                    bank : '',
                    bankcard : '',
                },
                province : [],
                city : {},
                county : {},
                provinceList : [],
                cityList : [],
                countyList : [],
                bankList : [],
            }
        },
        created (){
            this.area();
            this.getBankList();
        },
        methods : {
            upbank (){
                if(this.getState == this.getStateStart){
                    return false;
                };
                if(!this.loginInfo.truename){
                    this.$store.commit('msg/err', this.lang.nameAuth29);
                    return false;
                };

                var {bankprov, bankcity, banktown, bankaddr, name, bank, bankcard} = this.param;
                if(!bankcard){
                    this.$store.commit('msg/err', this.lang.bankcardError);
                    return false;
                };
                if(!bank){
                    this.$store.commit('msg/err', this.lang.bankError);
                    return false;
                };
                if(!bankprov){
                    this.$store.commit('msg/err', this.lang.bankprovError);
                    return false;
                };
                if(!bankcity){
                    this.$store.commit('msg/err', this.lang.bankcityError);
                    return false;
                };
                if(!banktown){
                    this.$store.commit('msg/err', this.lang.banktownError);
                    return false;
                };

                if(!bankaddr){
                    this.$store.commit('msg/err', this.lang.bankaddrError);
                    return false;
                };
                name = this.loginInfo.truename;
                this.getStart();
                this.axios({
                    url : this.api.upbank,
                    data : {
                        bankprov, bankcity, banktown, bankaddr, name, bank, bankcard
                    },
                }).then((res) => {
                    this.getSuccess();
                    this.$store.commit('msg/add', this.lang.addBackCardSuccess)
                    this.$router.push('./myBankCard');
                }).catch((err) => {
                    console.log(err);
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.addBackCardError)
                });
            },
            selectList (data, name, k){
                var data = data || [];
                var list = [['', this.lang.gu_finance100]];
                k = k || 'name';
                data.forEach((q) => {
                    list.push([q.id, q[k]]);
                });
                this[name] = list;
            },
            provinceChange (val){
                this.param.bankprov = val[1];
                this.selectList(this.city[val[0]], 'cityList');
                this.selectList([], 'countyList');
            },
            cityChange (val){
                this.param.bankcity = val[1];
                this.selectList(this.county[val[0]], 'countyList');
            },
            countyChange (val){
                this.param.banktown = val[1];
            },
            bankListChange (val){
                this.param.bank = val[1];
                if(val[0]){
                    this.$store.commit('msg/del', this.lang.gu_finance103)
                }else{
                    this.$store.commit('msg/err', this.lang.gu_finance103)
                };
            },
            getBankList (){
                this.axios({
                    url : this.api.bankList,
                }).then((res) => {
                    this.selectList(res.data || [], 'bankList', 'title');
                }).catch((err) => {
                    console.log(err);
                    this.$store.commit('msg/err', err.message || this.lang.gu_finance101)
                });
            },
            area (){
                this.axios({
                    url : this.api.area,
                }).then((res) => {
                    this.county = res.data.county;
                    this.city = res.data.city;
                    this.province = res.data.province;
                    this.selectList(this.province, 'provinceList');
                }).catch((err) => {
                    console.log(err);
                    this.$store.commit('msg/err', err.message || this.lang.gu_finance102)
                });
            }
        },
    }
</script>
