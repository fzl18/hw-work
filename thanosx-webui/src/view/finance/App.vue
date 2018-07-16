<template>
    <section class="finance-box main-box">
        <header-component active="finance" />
        <section class="inner-header">
            <h4>
                <router-link to="/"><span>{{lang.finance}}</span></router-link>
            </h4>
        </section>
        <section class="finance-main">
            <section class="finance-left">
                <div class="finance-nav">
                    <router-link v-for="m in menu" :key="m.name" :class="m.name + ' ' + classActive(($route.meta.parent || $route.name) == m.name)" :to="'/' + m.name">{{lang[m.text]}}</router-link>
                </div>
                <a href="javascript:;" target="_blank" class="finance-app">
                    <ewm :value="api.appDownload" :size="110"></ewm>
                    <p>{{lang.finance10}}</p>
                </a>
            </section>
            <section class="finance-right">
                <router-view />
            </section>
        </section>
        <msg />
    </section>
</template>

<script>
    export default {
        name: "app",
        data () {
            return {
                menu : [
                    {
                        text : 'myAssets',
                        name : 'index',
                    },
                    {
                        text : 'myBankCard',
                        name : 'myBankCard',
                    },
                    {
                        text : 'myWallet',
                        name : 'myWallet',
                    },
                    {
                        text : 'myPay',
                        name : 'myPay',
                    },
                    {
                        text : 'myEntrust',
                        name : 'myEntrust',
                    },
                    {
                        text : 'myDeal',
                        name : 'myDeal',
                    },
                    // {
                    //     text : 'inviteFriends',
                    //     name : 'inviteFriends',
                    // },
                ]
            }
        },
        watch : {
            '$route' (n, o){
                // console.log(n)
            }
        },
        created (){
            // console.log(this.$route)
        },
    }
</script>

