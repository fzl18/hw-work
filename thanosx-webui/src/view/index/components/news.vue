<template>
    <section class="news-box" :class="animateClass">
        <section class="home-title">
            <h2><span>{{lang.newsTitle}}</span></h2>
            <p>{{lang.newsDescribe}}</p>
        </section>
        <ul class="news-list">
            <li v-if="noticeData.id">
                <a :href="articleUrl + '/' + noticeData.id + '/' + noticeSelf.id" class="news-img"></a>
                <div class="news">
                    <a href="javascript:;" class="news-type">{{noticeSelf.catname}}</a>
                    <h4 class="news-title"><a :href="articleUrl + '/' + noticeData.id + '/' + noticeSelf.id">{{noticeData.title}}</a></h4>
                    <p class="news-text">
                        {{noticeData.description}}
                    </p>
                    <a class="news-more" :href="articleUrl + '/' + noticeData.id + '/' + noticeSelf.id">{{lang.viewMore}}</a>
                </div>
            </li>
            <li v-if="newsData.id">
                <a :href="articleUrl + '/' + newsData.id + '/' + oneself.id" class="news-img"></a>
                <div class="news">
                    <a href="javascript:;" class="news-type">{{oneself.catname}}</a>
                    <h4 class="news-title"><a :href="articleUrl + '/' + newsData.id + '/' + oneself.id">{{newsData.title}}</a></h4>
                    <p class="news-text">
                        {{newsData.description}}
                    </p>
                    <a class="news-more" :href="articleUrl + '/' + newsData.id + '/' + oneself.id">{{lang.viewMore}}</a>
                </div>
            </li>
            <!--<li v-for="item in (news.length > 2 ? 2 : news.length)" :key="news[item - 1].id">
                <a :href="articleUrl + '/' + news[item - 1].id + '/' + oneself.id" class="news-img">
                </a>
                <div class="news">
                    <a href="javascript:;" class="news-type">{{oneself.catname}}</a>
                    <h4 class="news-title"><a :href="articleUrl + '/' + news[item - 1].id + '/' + oneself.id">{{news[item - 1].title}}</a></h4>
                    <p class="news-text">
                        {{news[item - 1].description}}
                    </p>
                    <a class="news-more" :href="articleUrl + '/' + news[item - 1].id + '/' + oneself.id">{{lang.viewMore}}</a>
                </div>
            </li>-->
        </ul>
    </section>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "news",
        data (){
            return {
                showStatus : false,
                news : [],
                newsData : {},
                oneself : {},
            };
        },
        computed : {
            ...mapState(['noticeData', 'noticeSelf'])
        },
        created (){
            this.getNews()
        },
        mounted (){
            var self = this;
            var dom = document.querySelector('body').scrollTop ? document.querySelector('body') : document.querySelector('html');
            if(dom.scrollTop && document.querySelector('.news-list')){
                self.startScroll('.news-list');
            }else{
                setTimeout(function (){
                    if(document.querySelector('.news-list')){
                        self.startScroll('.news-list');
                    };
                }, 500);
            };
        },
        methods : {
            getNews (){
                this.axios({
                    url : this.api.articleInfo,
                    data : {
                        id : 58,
                    }
                }).then((res) => {
                    // this.news = res.data.list || [];
                    this.newsData = (res.data.list && res.data.list[0]) || {};
                    this.oneself = res.data.oneself || {};
                    this.showStatus = !!this.news.length;
                }).catch((err) => {
                    // this.news = [];
                    this.newsData = {};
                    this.oneself = {};
                    this.showStatus = false;
                });
                // this.axios({
                //     url : this.api.getNews,
                // }).then((res) => {
                //     this.news = res.data || [];
                //     this.showStatus = !!this.news.length;
                // }).catch((err) => {
                //     this.news = [];
                //     this.showStatus = false;
                // });
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .news-box{
        padding-top: 50px;
        &.active .news-list li{
            a.news-img,.news{
                opacity: 1;
                transform: translateX(0px);
            }
            .news:nth-child(2){
                opacity: 1;
                transform: translateX(0px);
            }
        }
        .home-title{
            background: $viceMainColor;
        }
        .news-list{
            display: block;
            overflow: hidden;
            width: $webWidth;
            margin: 0 auto;
            $newWidth : 620px;
            $newHeight : 335px;
            li:nth-child(2){
                a.news-img{
                    // background-image: url("../assets/images/new2.png");
                }
            }
            li{
                display: block;
                width: 100%;
                margin-bottom: 70px;
                height: $newHeight;
                &:last-child{
                    margin-bottom: 0;
                }
                a.news-img{
                    display: block;
                    width: $newWidth;
                    height: $newHeight;
                    position: relative;
                    overflow: hidden;
                    float: left;
                    transition: all 1s ease 0s;
                    transform: translateX(-200px);
                    opacity: 0;
                    // background: url("../assets/images/new1.png") no-repeat;
                    img{
                        display: block;
                        @include fullWH;
                    }
                    &:before{
                        content: '';
                        display: block;
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        background: $mainColor;
                        opacity: 0;
                    }
                    &:after{
                        content: '\e603';
                        display: block;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        @include iconfont(35px);
                        @include transitionCommon;
                        color: $viceMainColor;
                        transform: rotateZ(45deg) scale(2) translate(-50%, -50%);
                        opacity: 0;
                    }
                    &:hover{
                        &:before{
                            opacity: 0.3;
                        }
                        &:after{
                            opacity: 1;
                            transform: rotateZ(0deg) scale(1) translate(-50%, -50%);
                        }
                    }
                }
                .news{
                    display: block;
                    height: $newHeight;
                    width: $newWidth;
                    position: relative;
                    float: right;
                    transition: all 1s ease 0s;
                    transform: translateX(200px);
                    opacity: 0;
                    a.news-type{
                        display: inline-block;
                        font-size: 20px;
                        color: $fontColor;
                        line-height: 1;
                        height: 40px;
                        border-bottom: solid 2px $mainColor;
                    }
                    .news-title{
                        height: 100px;
                        line-height: 100px;
                        font-size: 30px;
                        font-weight: normal;
                        @include aRow;
                        a{
                            color: $fontColor;
                        }
                    }
                    .news-text{
                        height: 100px;
                        font-size: 16px;
                        color: $viceFontColor;
                        line-height: 2;
                        overflow: hidden;
                    }
                    .news-more{
                        display: block;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        font-size: 14px;
                        width: 150px;
                        height: 50px;
                        line-height: 50px;
                        text-align: center;
                        background: $mainColor;
                        border: solid 1px $mainColor;
                        color: $viceMainColor;
                        @include transitionCommon;
                        &:hover{
                            background: transparent;
                            color: $mainColor;
                        }
                        &:after{
                            content: '\e607';
                            margin-left: 15px;
                            @include iconfont(16px);
                        }
                    }
                }
                &:nth-child(2n){
                    .news-img{
                        float: right;
                        transform: translateX(200px);
                        transition-delay: 0.5s;
                    }
                    .news{
                        float: left;
                        transform: translateX(-200px);
                        transition-delay: 0.5s;
                    }
                }
            }
        }
    }
</style>
