<template>
    <section class="finance-box main-box">
        <header-component active="finance" />
        <section class="finance-main container">
            <section class="finance-left">
                <div class="finance-nav">
                    <router-link v-for="m in menu" :key="m.name" :class="m.name + ' ' + classActive(($route.meta.parent || $route.name) == m.name)" :to="'/' + m.name"><i class="iconfont" :class="m.icon"></i> {{lang[local][m.text]}}</router-link>
                </div>
                <!-- <a href="javascript:;" target="_blank" class="finance-app">
                    <ewm :value="api.appDownload" :size="110"></ewm>
                    <p>{{lang[local].finance10}}</p>
                </a> -->
            </section>
            <section class="finance-right">
                <router-view />
            </section>
        </section>
        <msg />
        <footer-component />
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
                        icon: 'icon-zichan1'
                    },
                    {
                        text : 'myWallet',
                        name : 'myWallet',
                        icon: 'icon-icon-'
                    },
                    {
                        text : 'myEntrust',
                        name : 'myEntrust',
                        icon: 'icon-weituoqianyue'
                    },
                    {
                        text : 'myDeal',
                        name : 'myDeal',
                        icon: 'icon-jiaoyi01'
                        
                    },
                    {
                        text : 'coinRecord',
                        name : 'coinRecord',
                        icon: 'icon-jiaoyicopy'
                        
                    },
                    {
                        text : 'c2cOrder',
                        name : 'c2cOrder',
                        icon: 'icon-jiaoyicopy'
                        
                    },
                    {
                        text : 'transferMode',
                        name : 'transferMode',
                        icon: 'icon-jiaoyicopy'
                        
                    },
                    {
                        text : 'account',
                        name : 'account',
                        icon: 'icon-shezhi'
                        
                    },
                    // {
                    //     text : 'myDeal',
                    //     name : 'myDeal',
                    //     icon: 'icon-jiaoyicopy'
                    // },
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

