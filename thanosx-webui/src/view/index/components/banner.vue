<template>
    <section class="banner">
        <section class="container">
            <div class="cti">
                <div class="txt">
                    <i class="iconfont icon-logo"></i>
                </div>
                <div class="zs"></div>
            </div>
            <ul class="bar">
                <li class="bbox">
                    <p>今日待分配收入累积折合</p>
                    <p class="hot">$ 46.000990008</p>
                    <p>连续持有TNSX每百万收入折合</p>
                    <div class="jiao"></div>
                </li>
                <li class="bbox" style="margin:0 2%">
                    <p><a href="">账户注册</a></p>
                    <p><a href="">如何充提币及到账时间限额</a></p>
                    <p><a href="">币币交易及手续费的说明</a></p>
                    <p class="more"><a href="">查看更多帮助</a></p>
                    <div class="jiao"></div>
                </li>
                <li class="bbox">
                    <p><a href="">上币投票公示</a></p>
                    <p><a href="">申请上币规则说明</a></p>
                    <p></p>
                    <p class="more"><a href="">查看更多</a></p>
                    <div class="jiao"></div>
                </li>
            </ul>            
        </section>
    </section>
</template>

<script>

    export default {
        name: "banner",
        data (){
            return {
                noticeShowStatus : false,
                noticeY : 0,
                noticeIndex : 0,
                noticeData : [],
                noticeInterval : null,
                noticeTime : 3000,
                status : 0,
                time : 0,
                timeInterval : null,
                slideLength : 1,
            };
        },
        created (){
            this.getHomeAnnouncement();
        },
        methods : {
            getHomeAnnouncement (){
                this.axios({
                    url : this.api.articleInfo,
                    data : {
                        id : 36,
                    }
                }).then((res) => {
                    let list = res.data.list || [];
                    if(list.length > 3){
                        list = list.slice(0, 3);
                    };
                    this.noticeData = list;
                    this.noticeShowStatus = true;
                    this.$store.commit('noticeData', (res.data.list && res.data.list[0]) || {});
                    this.$store.commit('noticeSelf', res.data.oneself || {});
                }).catch((err) => {
                    this.noticeShowStatus = false;
                });
            },
        },
    }

</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .banner{
        background: #000 url("../assets/images/index_bg.jpg") top center no-repeat;
        background-size:auto 100%;
        height:505px;
        overflow: hidden;
        position: relative;
        .cti{            
            text-align:center;
            height:410px;
            .txt{
                margin-top:-40px;
                .icon-logo{font-size:250px;color:#fff;}
            }            
            .zs{
                background:url("../assets/images/index_txt.png") no-repeat;
                height:267px;width:400px;background-size:auto 80%;
                margin:0 auto;
                position: relative;
                top:-150px;
                left:30px;
            }            
        }
        .bar{            
            .bbox{
                background: rgba(139, 139, 139,.3);
                min-height:100px;
                font-size:12px;
                padding:10px 0;
                float: left;
                width:32%;
                position: relative;
                border-radius:4px;
                p{
                    padding:0 20px;color: #979797;line-height:20px;
                    &.more{
                        text-align: right;text-decoration:underline;
                        a{color:#FFF;}
                    }
                }
                a{
                    color: #979797;
                    &:hover{color:#fff;}
                }
                .hot{font-size: 20px;color:#fff;font-weight:bold;line-height:30px;}
                &:after{
                    content:'';
                    position: absolute;
                    top:0;
                    right:0;
                    width:0;
                    height:0;
                    border-top: 20px solid #FF6500;
                    border-left: 20px solid transparent;
                }
            }
        }
        &::after{content:'';width:100%;height:40px;position: absolute;bottom:0px;left:0;background:url("../assets/images/bar.png") bottom center no-repeat;background-size:100%;}
    }

</style>
