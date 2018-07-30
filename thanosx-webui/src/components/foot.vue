<template>
    <section class="foot">
        <footer class="container footer">
            <div class="link">
                <dl>
                    <dt><a href="javascript:;">服务交易</a>></dt>
                    <dd><a href="">交易中心</a></dd>
                    <dd><a href="">帮助手册</a></dd>
                    <dd><a href="">意见反馈</a></dd>
                </dl>
                <dl style="text-align:center">
                    <dt><a href="javascript:;">条款说明</a>></dt>
                    <dd><a href="">隐私条款</a></dd>
                    <dd><a href="">用户协议</a></dd>
                    <dd><a href="">费率说明</a></dd>
                </dl>
                <dl style="text-align:right">
                    <dt><a href="javascript:;">关于我们</a>></dt>
                    <dd><a href="">联系我们</a></dd>
                    <dd><a href="">新闻公告</a></dd>
                    <dd><a href="">申请上币</a></dd>
                </dl>
            </div>
            <Row class="copyright">
                <Col span="12">
                    <p>Copyright ©2018 All Rights Reserved</p>
                    <p><a href="mailto:admin@gmail.com">Email：admin@gmail.com</a></p>
                </Col>
                <Col span="12">
                    <p class="other">
                        <!-- <a href=""><i class="iconfont icon-Git"></i></a> -->
                        <a href=""><i class="iconfont icon-facebook"></i></a>
                        <a href=""><i class="iconfont icon-stumble_upon"></i></a>
                        <a href=""><i class="iconfont icon-twitter"></i></a>
                        <a href=""><i class="iconfont icon-youtube"></i></a>
                        <a href=""><i class="iconfont icon-linkedin"></i></a>
                        <a href=""><i class="iconfont icon-weibo"></i></a>
                        <a href=""><i class="iconfont icon-icon4"></i></a>
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

