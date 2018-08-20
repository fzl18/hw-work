<template>
    <section>
        <banner />
        <market />
        <!--<statistic />-->
        <app-banner />
        <advantage />
        <!-- <news /> -->        
        <!-- <Link /> -->
        <msg />
    </section>
</template>

<script>
    import News from "./news";
    import AppBanner from "./app";
    import Statistic from "./statistic";
    import Advantage from "./advantage";
    import Market from "./market";
    import Banner from "./banner";
    import Link from "./link";

    export default {
        name: "app",
        components : {
            Banner,
            Market,
            AppBanner,
            Advantage,
            Link,
        },
        created (){
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
    @import "../../../assets/css/var.scss";
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
