<template>
    <section class="finance-box main-box">
        <header-component active="finance" />
        <section class="finance-main container" v-if="$route.name !='c2cDetail' && $route.name !='appealDetail' ">            
            <section class="finance-left">
                <div class="finance-nav">
                    <router-link v-for="m in menu" :key="m.name" :class="m.name + ' ' + classActive(($route.meta.parent || $route.name) == m.name)" :to="'/' + m.name"><i class="iconfont" :class="m.icon"></i> {{lang[local][m.text]}}</router-link>
                </div>
            </section>
            <section class="finance-right">
                <router-view />
            </section>
        </section>
        <section class="container" v-if="$route.name =='c2cDetail' ">
            <div style="min-height:90vh">
                <router-view />
            </div>            
        </section>
        <section class="container" v-if="$route.name =='appealDetail' ">
            <div style="min-height:90vh">
                <router-view />
            </div>            
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
                        icon: 'icon-dingdan'
                        
                    },
                    {
                        text : 'appeal',
                        name : 'appeal',
                        icon: 'icon-kefuzhichi'
                        
                    },
                    {
                        text : 'transferMode',
                        name : 'transferMode',
                        icon: 'icon-tongmingwaihuizhuanzhang'
                        
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
        mounted (){
            console.log(this.$route.name)
        },
    }
</script>

