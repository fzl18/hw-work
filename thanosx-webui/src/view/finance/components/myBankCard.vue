<template>
    <section>
        <financeHeader>
            <span>{{lang[local].myBankCard}}</span>
        </financeHeader>
        <section class="bankCard-box">

            <section v-if="getState == getStateSuccess" class="bankCard item" v-for="(item, i) in list" :key="item.id">
                <h4>
                    <img :src="item.img" alt="">
                    <span>{{lang[local].tailNum}}{{(item.bankcard || '').slice(-4)}}<i>{{lang[local].depositCard}}</i></span>
                </h4>
                <ul class="site">
                    <li>
                        <span :title="item.name">{{lang[local].cardName}}: {{hideName(item.name)}}</span>
                        <a :href="api.defaultbank" @click="setDefault(item, i)" :class="classActive(item.default_bank == 1)">{{item.default_bank == '1' ? lang[local].default :
                            lang[local].setDefault}}{{item.defaultStatus ? '...' : ''}}</a>
                    </li>
                    <li>
                        <span :title="item.bankaddr">{{lang[local].branchBank}}: {{item.bankaddr}}</span>
                        <a :href="api.delbank" @click="delbank(item, i)">{{lang[local].del}}{{item.delStatus ? '...' : ''}}</a>
                    </li>
                </ul>
            </section>

            <section class="bankCard item load" v-if="getState == getStateStart">
                <load />
            </section>

            <router-link to="./addBankCard" tag="section" class="add">
                <span>{{lang[local].gu_finance106}}</span>
            </router-link>

        </section>
    </section>
</template>

<script>
    export default {
        name: "my-bank-card",
        data (){
            return {
                list : []
            }
        },
        created (){
            this.myyhks();
        },
        methods : {
            myyhks (){
                this.getStart();
                this.list = [];
                this.axios({
                    url : this.api.myyhks,
                }).then((res) => {
                    this.list = res.data || [];
                    this.getSuccess();
                }).catch((err) => {
                    console.log(err);
                    this.list = [];
                    this.myyhks();
                    this.getError();
                    this.$store.commit('msg/err', err.message || this.lang.gu_finance70);
                });
            },
            setDefault (item, index){
                if(item.default_bank == '1'){
                    return false;
                };
                this.$set(this.list[index], 'defaultStatus', true);
                this.axios({
                    url : this.api.defaultbank,
                    data : {
                        id : item.id
                    }
                }).then((res) => {
                    this.$set(this.list[index], 'defaultStatus', false);
                    this.$store.commit('msg/add', this.lang.gu_finance81);
                    this.myyhks();
                }).catch((err) => {
                    this.$set(this.list[index], 'defaultStatus', false);
                    this.$store.commit('msg/err', err.message || this.lang.gu_finance80);
                });
            },
            delbank (item, index){
                this.$set(this.list[index], 'delStatus', true);
                this.axios({
                    url : this.api.delbank,
                    data : {
                        id : item.id
                    }
                }).then((res) => {
                    this.$set(this.list[index], 'delStatus', false);
                    this.$store.commit('msg/add', this.lang.gu_finance68);
                    this.myyhks();
                }).catch((err) => {
                    this.$set(this.list[index], 'delStatus', false);
                    this.$store.commit('msg/err', err.message || this.lang.gu_finance69);
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
</style>
