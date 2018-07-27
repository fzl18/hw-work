<template>
    <section class="article-right">

        <h4>{{info.title || info && info.list && info.oneself && info.oneself.catname}}</h4>

        <article class="article-info" v-if="info.content  && getState == getStateSuccess" v-html="info.content">
        </article>

        <ul class="article-faq" v-if="info.type == 3  && getState == getStateSuccess">
            <li v-for="item in info.list" :key="item.id" >
                <!-- <h4 @click="getFaq(item.id)"  :class="classActive(faq && faq[item.id])">{{item.title}}<span></span></h4> -->
                <!-- <div v-if="faq && faq[item.id]" v-html="faq[item.id].content"></div> -->
                <router-link :to="'/' + item.id + '/' + activeObject.id">{{item.title}}<span></span></router-link>
            </li>
        </ul>

        <ul class="article-new article-notice" v-if="info.type == 1 && info.list && $route.params.id != api.noticeId && getState == getStateSuccess">
            <li v-for="item in info.list">
                <h6><a :href="item.sourceLink || '/'" target="_blank">{{item.source || lang.webName}}</a></h6>
                <section>
                    <h4><router-link :to="'/' + item.id + '/' + activeObject.id">{{item.title}}</router-link></h4>
                    <p class="article-notice-text">{{item.description || '...'}}</p>
                </section>
                <p class="article-new-time">{{localDate(item.createtime)}}</p>
            </li>
        </ul>

        <ul class="article-notice" v-if="false">
            <li v-for="item in info.list">
                <router-link :to="'/' + item.id + '/' + activeObject.id" class="article-new-img">
                    <img :src="item.thumb" alt="" v-if="item.thumb">
                    <img src="../assets/images/new1.jpg" alt="" v-else>
                </router-link>
                <section>
                    <p class="article-notice-time">{{localDate(item.createtime)}}</p>
                    <h4><router-link :to="'/' + item.id + '/' + activeObject.id">{{item.title}}</router-link></h4>
                    <p class="article-notice-text">{{item.description || '...'}}</p>
                </section>
            </li>
        </ul>

        <ul class="article-notice2" v-if="info.type == 1 && info.list && $route.params.id == api.noticeId && getState == getStateSuccess">
            <li v-for="item in info.list">
                <router-link :to="'/' + item.id + '/' + activeObject.id">
                    <i>{{localDate(item.createtime)}}</i>
                    <b>{{item.title}}</b>
                    <span>{{lang.viewDetails}}</span>
                </router-link>
            </li>
        </ul>

        <load v-if="getState == getStateStart" />
        <page :page="(info && info.page )|| {}" @pageChange="pageChange" v-if="info && info.list && info.page && getState == getStateSuccess && info.list.length" />
    </section>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "list",
        data (){
            return {
                faq : {},
            };
        },
        created (){
            // this.articleInfo();
        },
        computed : {
            ...mapState(['activeObject'])
        },
        beforeRouteUpdate (to, from, next){
            next();
            this.faq = {};
            this.articleInfo();
            var dom = document.querySelector('body').scrollTop ? document.querySelector('body') : document.querySelector('html');
            dom.scrollTop = 0;
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
            getFaq (id){
                if(this.faq[id]){
                    return;
                };
                this.axios({
                    url : this.api.articleInfo,
                    data : {
                        id : id,
                    }
                }).then((res) => {
                    this.$set(this.faq, id, res.data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            pageChange (page){
                this.articleInfo(page);
            },
        }
    }
</script>
