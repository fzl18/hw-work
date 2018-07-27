<template>
    <section class="article-box main-box">
        <header-component active="article" />  
        <load v-if="getState == getStateStart" />
        <section class="article-main">
            <section class="container">
                <section class="article-left">
                    <!-- <h4><span>{{(info.top && info.parent && info.parent.name) || activeItem.catname}}</span></h4> -->
                    <dl class="article-menu">
                        <dd v-for="same in (info && info.same || [])">
                            <router-link :class="classActive(same.id == ((info.top && info.parent && info.parent.id) || $route.params.pid || $route.params.id) && (activeItem = same))" :to="'/' + same.id">{{same.catname}}</router-link>
                        </dd>
                    </dl>
                </section>
                <router-view />
            </section>
        </section>        
        <footer-component />
    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "app",
        data (){
            return {
                activeItem : {}
            }
        },
        computed : {
            ...mapState(['info'])
        },
        watch : {
            activeItem (n, o){
                this.$store.commit('activeObject', n);
            },
        },
        methods : {

        }
    }
</script>
