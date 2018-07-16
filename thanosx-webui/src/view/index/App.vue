<template>
    <section class="home-box main-box" :class="mobile ? 'mobile' : ''">
        <header-component active="home" />
        <banner />
        <market />
        <!--<statistic />-->
        <app-banner />
        <advantage />
        <!-- <news /> -->        
        <Link />
        <footer-component />
        <msg />
    </section>
</template>

<script>
    import News from "./components/news";
    import AppBanner from "./components/app";
    import Statistic from "./components/statistic";
    import Advantage from "./components/advantage";
    import Market from "./components/market";
    import Banner from "./components/banner";
    import Link from "./components/link";

    export default {
        name: "app",
        components : {
            Link,
            Banner,
            Market,
            Advantage,
            Statistic,
            AppBanner,
            News,
        },
        created (){
            this.mobileState();
        },
        data (){
            return {

            };
        },
        methods : {

        },
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/var.scss";
    .home-box{
        position: relative;
    }
    .return-top{
        display: block;
        position: absolute;
        bottom: 60px;
        right: 100px;
        &:after{
            content: '\e601';
            @include iconfont(40px);
            position: relative;
            z-index: 10;
            color: $mainColor;
        }
        &:before{
            content: '';
            background: $viceMainColor;
            display: block;
            position: absolute;
            z-index: 1;
            width: 20px;
            height: 20px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
    @media screen and (max-width: 1300px){
        .return-top{
            right: 0;
        }
    }
</style>
