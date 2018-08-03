<template>
    <section class="article-right">
        <h4>{{info.category && info.category.type_name}}</h4>
        <load v-if="getState == getStateStart" />
        <template v-if="info.category && info.category.is_page == 0">
            <ul class="" v-if="getState == getStateSuccess">
                <li v-for="item in info.list">
                    <router-link :to="'/info/' + item.id ">{{item.title}} <span style="float:right;">{{item.create_time}}</span></router-link>
                </li>
            </ul>
        <page :page="(info && info.page )|| {}" @pageChange="pageChange" v-if="info && info.list && info.page && getState == getStateSuccess && info.list.length" style="margin:50px 0"/>
        </template>
        <template v-if="info.category && info.category.is_page != 0">
            <article class="article-info" v-if="getState == getStateSuccess" v-html="info.category.type_content"></article>
        </template>
    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "list",
        data (){
            return {                
            };
        },
        created (){
            this.articleInfo();
        },
        computed : {
            ...mapState(['activeObject'])
        },
        beforeRouteUpdate (to, from, next){
            next();
            this.articleInfo();
            var dom = document.querySelector('body').scrollTop ? document.querySelector('body') : document.querySelector('html');
            dom.scrollTop = 0;
        },
        watch : {
            local(){
                this.articleInfo();
            }
        },
        methods : {
            articleInfo (page){
                page = page || {};
                this.getState = this.getStateStart;
                this.axios({
                    url : this.api.lists,
                    data : {
                        alias : this.$route.params.id,
                        ...page
                    }
                }).then((res) => {
                    this.$store.commit('info', res.data);
                    this.getState = this.getStateSuccess;
                }).catch((err) => {
                    this.$store.commit('info', {});
                    // location.href = '/';
                    this.getState = this.getStateError;
                    console.log(err);
                });
            },
            pageChange (page){
                this.articleInfo(page);
            },
        }
    }
</script>
