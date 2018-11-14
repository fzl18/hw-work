<template>
    <section  id="app" class="app" :class="animateClass">
        <div class="container">
            <Row>
                <Col span="12" class="pic"><img :src="pic" alt=""/></Col>
                <Col span="12" class="appinfo">
                    <p class="tit">Thanos  X   1.0</p>
                    <p class="txt">{{lang[local].apptxt}}</p>
                    <!-- <p class="download"><a href="">ios {{lang[local].appDownload}}</a><a href="">Android {{lang[local].appDownload}}</a></p> -->
                    <p class="download" style="font-size:24px;font-weight:bold;color:#FF7100">

                        <Poptip trigger="hover" content="content" placement="bottom" width="200">
                            <a :href="iosUrl" target="_blank"><i class="iconfont icon-ios"></i> iOS</a>
                            <div class="api" slot="content" style="text-align:center">
                                <ewm :value="iosUrl"></ewm>
                            </div>
                        </Poptip>                        
                        <!-- <a href="javascritp:;" style="background:#ccc;border-color:#ccc"><i class="iconfont icon-ios"></i> iOS</a> -->
                        <!-- <a href="javascritp:;" style="background:#ccc;border-color:#ccc"><i class="iconfont icon-anzhuo"></i> Android</a> -->
                        
                        <Poptip trigger="hover" content="content" placement="bottom" width="200">
                            <a :href="androidUrl" target="_blank"><i class="iconfont icon-anzhuo"></i> Android</a>
                            <div class="api" slot="content" style="text-align:center">
                                <ewm :value="androidUrl"></ewm>
                            </div>
                        </Poptip>
                    </p>
                </Col>
            </Row>
        </div>
    </section>
</template>

<script>
    export default {
        name: "app-banner",
        data(){
            return {
                iosUrl:window.iosUrl || 'iosUrl' ,
                androidUrl:window.androidUrl || 'androidUrl',
            }
        },
        computed : {
            pic(){
                return  require(`../assets/images/index_mobile_${this.local}.png`)
            }
        },
        mounted (){
            var self = this;
            var dom = document.querySelector('body').scrollTop ? document.querySelector('body') : document.querySelector('html');
            if(dom.scrollTop  && document.querySelector('.app')){
                self.startScroll('.app');
            }else{
                setTimeout(function (){
                    self.startScroll('.app');
                }, 500);
            };
        },
        methods:{
            openWindow(type){
                let url = type =='ios' ? ( window.iosUrl || 'https://www.ios.com'):(window.androidUrl || 'https://www.android.com')
                window.open(url)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .app{
        width: 100%;
        background:#F6F6F6;
        box-shadow:0 3px 35px rgba(116, 116, 116, 0.3) inset;
        background-attachment: fixed;
        height: 332px;
        .pic{
            text-align:center;
            img{margin-top:55px;}
        }
        .appinfo{
            margin-top:100px;            
            .tit{font-size:28px;}
            .txt{margin:20px 0;color:#979797}
            .download{
                a{
                    color:#fff;min-width:150px;
                    font-size:18px;background: #FF7100;
                    font-weight:normal;
                    padding:8px 45px;
                    border:2px solid #FF7100;
                    border-radius:28px;text-align: center;
                    min-width:200px;
                    display: inline-block;margin-right:20px;
                    &:hover{
                        background: #FFF;color:#FF7100;
                        // cursor: not-allowed;
                    }
                    .iconfont{
                        font-size:24px;
                        font-weight:100;
                    }
                }
            }
        }
        

        &.active .app-banner-main{
            .app-img1{
                transform: translateY(0);
            }
            .app-img2{
                transform: translateY(0);
            }
            .app-text{
                transform: translateX(0px);
                opacity: 1;
            }
            .app-btn-box{
                opacity: 1;
                transform: translateX(0px);
            }
        }
        .app-banner-main{
            width: $webWidth;
            margin: 0 auto;
            height: 100%;
            position: relative;
            overflow: hidden;
            .app-img1,.app-img2{
                position: absolute;
                display: block;
                width: 316px;
                height: 616px;
                left: 8px;
                bottom: -70px;
                transform: translateY(616px);
            }
            .app-img1{
                z-index: 1;
                transform-origin: 50% (616px - 70px);
                transition: transform 0.8s ease 0s;
            }
            .app-img2{
                z-index: 2;
                left: 168px;
                bottom: -180px;
                transform-origin: 50% (616px - 180px);
                transition: transform 1s ease 0s;
            }
            .app-text{
                position: absolute;
                right: 0;
                top: 100px;
                color: $viceMainColor;
                text-align: center;
                opacity: 0;
                transform: translateX(100px);
                transition: all 1s ease 0.5s;
                h4{
                    font-size: 45px;
                    line-height: 2.8;
                    font-weight: normal;
                }
                p{
                    font-size: 24px;
                    font-weight: normal;
                }
            }
            .app-btn-box{
                position: absolute;
                right: 95px;
                bottom: 80px;
                overflow: hidden;
                opacity: 0;
                transition: all 1s ease 0.5s;
                transform: translateX(50px);
                & > div{
                    display: block;
                    position: relative;
                    float: left;
                }
                .app-btn-list{
                    margin-right: 70px;
                    a{
                        display: block;
                        width: 220px;
                        color: $viceMainColor;
                        font-size: 22px;
                        font-weight: bold;
                        border: solid 1px $mainColor;
                        margin-top: 18px;
                        height: 60px;
                        text-align: center;
                        line-height: 50px;
                        @include transitionCommon;
                        span{
                            display: inline-block;
                            vertical-align: middle;
                            line-height: 1;
                        }
                        &:before{
                            display: inline-block;
                            vertical-align: middle;
                            line-height: 1;
                            font-weight: normal;
                            content: '\e606';
                            @include iconfont(35px);
                            margin-right: 15px;
                        }
                        &:nth-child(1){
                            background: $viceMainColor;
                            color: #323232;
                            border-color: $viceMainColor;
                            margin-top: 0;
                            &:before{
                                content: '\e638';
                            }
                            &:hover{
                                background: transparent;
                                color: $viceMainColor;
                            }
                        }
                        &:nth-child(2){
                            font-weight: normal;
                            &:before{
                                display: none;
                            }
                            &:hover{
                                background: $mainColor;
                            }
                        }
                        &:nth-child(3){
                            background: $mainColor;
                            &:hover{
                                background: transparent;
                            }
                        }
                    }
                }
                .app-btn-ewm{
                    float: left;
                    background: $viceMainColor;
                    padding: 15px 15px 0;
                    img{
                        display: block;
                        width: 160px;
                        height: 160px;
                    }
                    p{
                        color: $mainColor;
                        font-size: 18px;
                        padding-bottom: 8px;
                        text-align: center;
                        line-height: 1.8;
                    }
                }
            }
        }
    }
</style>
