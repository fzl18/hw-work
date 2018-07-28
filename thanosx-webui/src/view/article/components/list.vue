<template>
    <section class="article-right">
        <h4>{{info.category && info.category.type_name}}</h4>
        <ul class="" v-if="getState == getStateSuccess">
            <li v-for="item in info.list">                
                <router-link :to="'/info/' + item.id ">{{item.title}} <span style="float:right;">{{item.create_time}}</span></router-link>
            </li>
        </ul>
        <load v-if="getState == getStateStart" />
        <page :page="(info && info.page )|| {}" @pageChange="pageChange" v-if="info && info.list && info.page && getState == getStateSuccess && info.list.length" style="margin:50px 0"/>
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
                        id : this.$route.params.id,
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
