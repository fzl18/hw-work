<template>
    <section class="home-box main-box" :class="mobile ? 'mobile' : ''">
        <header-component active="home" />
        <router-view />
        <footer-component />
        <msg />
    </section>
</template>

<script>

    export default {
        name: "app",

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