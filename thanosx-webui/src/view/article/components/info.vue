<template>
    <section class="article-right">
        <h4>{{info.title || info && info.list && info.oneself && info.oneself.catname}}</h4>
        <article class="article-info" v-if="info.content  && getState == getStateSuccess" v-html="info.content">
        </article>
        <load v-if="getState == getStateStart" />
    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "info",
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
                this.articleInfo()
            }
        },
        methods : {
            articleInfo (page){
                page = page || {};
                this.getState = this.getStateStart;
                this.axios({
                    url : this.api.articleInfo,
                    data : {
                        id : this.$route.params.id,
                        pid : this.$route.params.pid || '',
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
        }
    }
</script>
