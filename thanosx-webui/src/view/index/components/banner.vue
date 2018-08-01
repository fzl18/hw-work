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
                    <p class="hot"><Icon type="social-bitcoin" color="#FFA202" /> 46.000990008</p>
                    <p>连续持有TNSX每百万收入折合 <Icon type="social-bitcoin" color="#FFA202" /> 21354488</p>
                    <div class="jiao"></div>
                </li>
                <li class="bbox" style="margin:0 2%">
                    <template v-for=" item in helplist.list" >
                        <p><a :href="articleUrl + '/info/' + item.id ">{{item.title}}</a></p>
                    </template>
                        <p class="more"><a :href="articleUrl + '/info/' + helplist.type_id">{{lang[local].viewMore}}</a></p>
                        <div class="jiao"></div>
                    
                </li>
                <li class="bbox">
                    <template v-for=" item in noticelist.list" >
                        <p><a :href="articleUrl + '/info/' + item.id ">{{item.title}}</a></p>
                    </template>
                    <p class="more"><a :href="articleUrl + '/info/' + noticelist.type_id">{{lang[local].viewMore}}</a></p>
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
                helplist:[],
                noticelist:[],
            };
        },
        created (){
            // this.getHomeAnnouncement();
            this.getNotice();
        },
        watch:{
            local(n, o){
                this.getNotice()
            },
        },
        methods : {
            // getHomeAnnouncement (){
            //     this.axios({
            //         url : this.api.articleInfo,
            //         data : {
            //             id : 36,
            //         }
            //     }).then((res) => {
            //         let list = res.data.list || [];
            //         if(list.length > 3){
            //             list = list.slice(0, 3);
            //         };
            //         this.noticeData = list;
            //         this.noticeShowStatus = true;
            //         this.$store.commit('noticeData', (res.data.list && res.data.list[0]) || {});
            //         this.$store.commit('noticeSelf', res.data.oneself || {});
            //     }).catch((err) => {
            //         this.noticeShowStatus = false;
            //     });
            // },
            getNotice (){
                this.axios({
                    url : this.api.getNotice,
                    data : {
                    }
                }).then((res) => {
                    let list = res.data || [];
                    this.helplist = list.help_data || []
                    this.noticelist = list.notice_data || []
                    this.noticeShowStatus = true;
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
        background-size:100% 100%;
        height:525px;
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
                min-height:120px;
                font-size:14px;
                padding:10px 0;
                float: left;
                width:32%;
                position: relative;
                border-radius:4px;
                p{
                    padding:0 20px;color: #979797;line-height:24px;
                    &.more{
                        text-align: right;text-decoration:underline;
                        a{
                            color:#FFF;
                            position: absolute;
                            bottom: 10px;
                            display: block;
                            right: 15px;
                            &:hover{opacity:.8;}
                        }
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
