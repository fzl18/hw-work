<template>
    <section class="trade-box main-box">
        <header-component active="trade" />
        <router-view />
        <msg />
    </section>
</template>

<script>

    export default {
        name: "app",
    }
</script>
<style lang="scss">
    @import "../../assets/css/var.scss";
    html,body{
        display: block;
        @include fullWH;
    }
</style>
