<template>
    <section class="foot">
        <footer class="container footer">
            <div class="link">
                <dl>
                    <dt><a href="javascript:;">{{lang[local].newslist1[0].title}}</a>></dt>
                    <dd><a :href="tradeUrl">{{lang[local].newslist1[1].title}}</a></dd>
                    <dd><a :href="articleUrl + '/list/' + lang[local].newslist1[2].type_alias">{{lang[local].newslist1[2].title}}</a></dd>
                    <dd><a href="mailto:service@thanosx.com">{{lang[local].newslist1[3].title}}</a></dd>
                </dl>
                <dl style="text-align:center">
                    <dt><a href="javascript:;">{{lang[local].newslist2[0].title}}</a>></dt>
                    <dd><a :href="articleUrl + '/list/' + lang[local].newslist2[1].type_alias">{{lang[local].newslist2[1].title}}</a></dd>
                    <dd><a :href="articleUrl + '/list/' + lang[local].newslist2[2].type_alias">{{lang[local].newslist2[2].title}}</a></dd>
                    <dd><a :href="articleUrl + '/list/' + lang[local].newslist2[3].type_alias">{{lang[local].newslist2[3].title}}</a></dd>
                </dl>
                <dl style="text-align:right">
                    <dt><a href="javascript:;">{{lang[local].newslist3[0].title}}</a>></dt>
                    <dd><a :href="articleUrl + '/list/' + lang[local].newslist3[1].type_alias">{{lang[local].newslist3[1].title}}</a></dd>
                    <dd><a :href="articleUrl + '/list/' + lang[local].newslist3[2].type_alias">{{lang[local].newslist3[2].title}}</a></dd>
                    <!-- <dd><a :href="articleUrl + '/list/' + lang[local].newslist3[3].type_alias">{{lang[local].newslist3[3].title}}</a></dd> -->
                </dl>
            </div>
            <Row class="copyright">
                <Col span="12">
                    <p>Copyright ©2018 All Rights Reserved</p>
                    <p><a href="mailto:service@thanosx.com">Email：service@thanosx.com</a></p>
                </Col>
                <Col span="12">
                    <p class="other">
                        <!-- <a href=""><i class="iconfont icon-Git"></i></a> -->
                        <a target="_blank" href="https://www.crypton.global/space.php?id=5b56c521326a7c6"><i class="iconfont icon-icon3" style="font-size:24px;font-weight:bold"></i></a>
                        <a target="_blank" href="https://www.facebook.com/imthanosx/"><i class="iconfont icon-facebook"></i></a>
                        <!-- <a href=""><i class="iconfont icon-stumble_upon"></i></a> -->
                        <a target="_blank" href="https://twitter.com/imthanosx"><i class="iconfont icon-twitter"></i></a>
                        <a target="_blank" href="https://www.youtube.com/channel/UCl1w7Rm81ZOpZEoIJukpXFQ"><i class="iconfont icon-youtube"></i></a>
                        <!-- <a href=""><i class="iconfont icon-linkedin"></i></a> -->
                        <a target="_blank" href="https://www.reddit.com/user/IMTHANOSX/"><i class="iconfont icon-reddit-alien"></i></a>
                        <a target="_blank" href="javascript:;" class="weixin"><i class="iconfont icon-icon4" style="font-size:20px;"></i><span><img src="../view/index/assets/images/wx.jpg" alt=""></span></a>
                        <a target="_blank" href="https://medium.com/@thanosx"><i class="iconfont icon-icon1"></i></a>
                    </p>
                </Col>
            </Row>
        </footer>
    </section>
</template>

<script>
    export default {
        name: "footer-component",
        data (){
            return {
                links : [],
                linksShowStatus : false,
                navList : [],
            };
        },
        created (){
            // this.getLinks();
            // this.navListArticle();
        },
        methods : {
            navHref (nav){
                if(/\/article/.test(location.href)){
                    this.$router.push('/' + nav.id);
                }else{
                    location.href = this.articleUrl + '/' + nav.id;
                }
            },
            navListArticle (){
                this.axios({
                    url : this.api.navListArticle,
                }).then((res) => {
                    var data = res.data;
                    data.forEach(item => {
                        if(item.children && item.children.length > 5){
                            item.children = item.children.splice(0, 5);
                        };
                    });
                    this.navList = res.data || [];
                }).catch((err) => {
                    console.log(err);
                });
            },
            getLinks (){
                this.axios({
                    url : this.api.getLinks,
                }).then((res) => {
                    this.links = res.data || [];
                    this.linksShowStatus = !!this.links;
                }).catch((err) => {
                    this.links = [];
                    this.linksShowStatus = false;
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .weixin{
        position: relative;
        span{            
            display:none;
            position: absolute;
            right:10px;
            bottom:20px;
            img{width:200px;}
        }
        &:hover{
            span{
                display:block;
            }
        }
    }
</style>
