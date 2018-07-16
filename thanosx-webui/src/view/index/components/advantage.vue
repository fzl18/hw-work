<template>
    <section class="advantage">
        <div class="container">
            <div class="tit">平台优势</div>
            <Row class="advantageList">
                <Col span="8" class="tt">
                    <p class="title" style="line-height:40px;top:6px;"> <i class="iconfont icon-technologylogy" style="font-size:32px;top:6px;"></i> 技术保障</p>
                    <p class="txt" style="top:3px;">金融证券级算法，交易高效稳定；自主研发撮合系统，能每秒处理上万笔交易算法支持多种专业交易，如GTT、IOC、FOK。</p>
                </Col>
                <Col span="8" class="tt">
                    <p class="title"> <i class="iconfont icon-anquan" style="top:8px;"></i> 安全可靠</p>
                    <p class="txt">拥有顶级风控、反欺诈技术，安全防护体系严密。多层防护，严格保护用户的资金安全。</p>
                </Col>
                <Col span="8" class="tt">
                    <p class="title"> <i class="iconfont icon-tuandui"></i> 专业团队</p>
                    <p class="txt">团队成员来自世界顶级金融机构，专业设计团队打造产品细节，追求用户体验，交易操作便捷，为用户提供优质的产品服务。</p>
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
