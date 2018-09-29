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
                loading:true,
                isOpen:false,
                list : [],

            }
        },

        created (){
            this.getIcoList()
        },
        methods : {
            getIcoList(){
                this.axios({
                    url : this.api.lists,
                    data : {
                    }
                }).then((res) => {
                    res.data
                    this.loading = false
                }).catch((err) => {
                    // this.list = [];
                    this.showStatus = false;
                });
            },
        }
    }
</script>
