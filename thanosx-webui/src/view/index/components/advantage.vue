<template>
    <section class="advantage">
        <div class="container">
            <div class="tit">{{lang[local].hometitle}}</div>
            <Row class="advantageList">
                <Col span="8" class="tt">
                    <p class="title" style="line-height:40px;top:6px;"> <i class="iconfont icon-technologylogy" style="font-size:32px;top:6px;"></i> {{lang[local].hometit1}}</p>
                    <p class="txt" style="top:3px;">{{lang[local].hometxt1}}</p>
                </Col>
                <Col span="8" class="tt">
                    <p class="title"> <i class="iconfont icon-anquan" style="top:8px;"></i> {{lang[local].hometit2}}</p>
                    <p class="txt">{{lang[local].hometxt2}}</p>
                </Col>
                <Col span="8" class="tt">
                    <p class="title"> <i class="iconfont icon-tuandui"></i> {{lang[local].hometit3}}</p>
                    <p class="txt">{{lang[local].hometxt3}}</p>
                </Col>
            </Row>
        </div>
    </section>
</template>

<script>
    export default {
        name: "advantage",
        data (){
            return {
            };
        }
    }
</script>
<style scoped lang="scss">
    @import "../../../assets/css/var.scss";
    .advantage{
        margin:80px 0;
        .tit{color:#515151;font-size:22px;margin-bottom:20px;}
        .advantageList{
            .tt{
                padding:0 5%;
                text-align:center;
                .title{
                    font-size:18px;color:#FF7100;margin:20px 0;position: relative;
                    .iconfont{font-size:40px;margin-right: 20px;position: relative;}
                }
                .txt{line-height:26px;color:#515151;position: relative;}
            }
        }
    }
</style>
