<template>
    <section class="home-box main-box c2c">
        <header-component active="c2c" />
            <router-view />
        <msg />
        <footer-component />
    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "app",
        data (){
            return {
            }
        },

        created (){
        },
        methods : {
        }
    }
</script>
