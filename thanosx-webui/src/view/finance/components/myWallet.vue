<template>
    <section>
        <financeHeader>
            <span>{{lang.myWallet}}</span>
        </financeHeader>
        <section class="myWallet-box">
            <section v-if="getState == getStateSuccess" class="item" v-for="item in listData">
                <div>
                    <i :style="{backgroundImage : 'url(' + imgUrl(item.logo) + ')'}"></i>
                    <span><b>{{upperCase(item.coinname)}}</b> {{item.coin}}</span>
                    <b>{{item.name}}</b>
                </div>
                <ul class="site">
                    <li>
                        <span :title="item.addr">{{lang.site}}: {{item.addr}}</span>
                        <a href="javascript:;"><copy :val="item.addr">{{lang.copy}}</copy></a>
                    </li>
                    <li>
                        <span v-if="item.qb_title" :title="item.addr_child">{{item.qb_title}}: {{item.addr_child}}</span>
                        <a href="javascript:;" @click="del(item)">{{lang.del}}</a>
                    </li>
                </ul>
            </section>

            <section class="bankCard item load" v-if="getState == getStateStart">
                <load />
            </section>

            <router-link to="./addWallet" tag="section" class="add">
                <span>{{lang.addWallet}}</span>
            </router-link>

        </section>

    </section>
</template>

<script>
    export default {
        name: "my-wallet",
        data (){
            return {
                listData : []
            };
        },
        created (){
            this.getData();
        },
        methods : {
            del (item){
                this.axios({
                    url : this.api.delWallet,
                    data : {
                        id : item.id
                    }
                }).then((res) => {
                    this.$store.commit('msg/add', this.lang.finance30);
                    this.getData();
                }).catch((err) => {
                    this.$store.commit('msg/err', err.message || this.lang.finance31);
                });
            },
            getData (){
                this.getStart();
                this.listData = [];
                this.axios({
                    url : this.api.listWallet,
                }).then((res) => {
                    this.listData = res.data || [];
                    this.getSuccess();
                }).catch((err) => {
                    this.listData = [];
                    this.getError();
                    console.log(err);
                });
            }
        }
    }
</script>
