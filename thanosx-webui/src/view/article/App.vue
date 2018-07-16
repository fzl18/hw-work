<template>
    <section class="article-box main-box">
        <header-component active="article" />
        <section class="banner-article">
            <div>
                <section class="banner-article-text">
                    <h1>{{(info.top && info.top.name) || (info.parent && info.parent.name)}}</h1>
                    <div>
                        <a href="/">{{lang.home}}</a>
                        /
                        <router-link :to="'/' + (info && info.same && info.same[0].id)">{{(info.top && info.top.name) || (info.parent && info.parent.name)}}</router-link>
                       <span> /
                            <router-link :to="'/' + ((info.top && info.parent && info.parent.id) || activeItem.id)" class="mainColor">{{(info.top && info.parent && info.parent.name) || activeItem.catname}}</router-link>
                       </span>
                    </div>
                </section>
            </div>
        </section>
        <load v-if="getState == getStateStart" />
        <section class="article-main">
            <section class="article-left">
                <h4><span>{{(info.top && info.parent && info.parent.name) || activeItem.catname}}</span></h4>
                <dl class="article-menu">
                    <dd v-for="same in (info && info.same || [])">
                        <router-link :class="classActive(same.id == ((info.top && info.parent && info.parent.id) || $route.params.pid || $route.params.id) && (activeItem = same))" :to="'/' + same.id">{{same.catname}}</router-link>
                    </dd>
                </dl>
            </section>
            <router-view />
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
