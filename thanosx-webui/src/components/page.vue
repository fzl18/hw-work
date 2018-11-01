<template>
    <section class="page" v-if="page.currPage > 0">
        <section class="page-left" v-if="headerActive != 'otc'">
            {{lang[local].page1}}
            <span>{{((page.currPage - 1) * page.pageSize) + 1}}</span>
            {{lang[local].page2}}
            <span>{{page.currPage * page.pageSize > page.totalCount ? page.totalCount : page.currPage * page.pageSize}}</span>
            {{lang[local].page3}}
            <span>{{page.totalCount}}</span>
            {{lang[local].page4}}&nbsp;&nbsp;
            <select-my @change="pageSizeChange" :list="pageSizeList" :selected="page.pageSize" />
            &nbsp;{{lang[local].page5}}
        </section>
        <section class="page-right">

            <a href="javascript:;" v-if="page.currPage > 3 && page.totalPage > 3" @click="pageClick(1)">{{lang[local].page6}}</a>
            <a href="javascript:;" v-if="page.currPage > 1 && page.totalPage > 1" @click="pageClick(page.currPage*1 -1)">{{lang[local].page7}}</a>

            <a href="javascript:;" v-for="up in upCount" @click="pageClick(page.currPage - upCount + up - 1)">{{page.currPage - upCount + up  - 1}}</a>

            <a href="javascript:;" class="active">{{page.currPage}}</a>
            <a href="javascript:;" v-for="i in (page.totalPage * 1 - page.currPage * 1 > 2 ? 2 : page.totalPage * 1 - page.currPage * 1) "  @click="pageClick(i + page.currPage * 1)">{{i + page.currPage * 1}}</a>

            <a href="javascript:;" v-if="page.currPage < page.totalPage" @click="pageClick(page.currPage * 1 + 1)">{{lang[local].page8}}</a>
            <a href="javascript:;" v-if="page.currPage < page.totalPage && page.totalPage > 5" @click="pageClick(page.totalPage)">{{lang[local].page9}}</a>

        </section>
    </section>
</template>

<script>
    export default {
        name: "page",
        props : {
            page : {
                type: Object,
                default: function () {
                    return {
                        currPage : 0,
                        totalPage : 0,
                        pageSize : 10,
                        totalCount : 10,
                    }
                }
            }
        },
        data () {
            return {
                pageSizeList : [10, 30, 50]
            };
        },
        created (){
            // console.log(this.$route);
        },
        watch : {
        },
        computed : {
            upCount (){
                return (this.page.currPage * 1 - 3 >= 1 ? 3 : this.page.currPage * 1 - 1);
            }
        },
        methods : {
            pageClick (index){
                // console.log(index);
                if(this.headerActive == 'otc'){
                    if(this.$route.name == 'order'){
                        this.$router.push('/order/' + this.$route.params.type + '/' + index);
                    };
                    return;
                };
                this.$emit('pageChange', Object.assign({}, this.page, {
                    currPage : index * 1
                }));
            },
            pageSizeChange (size){
                this.$emit('pageChange', Object.assign({}, this.page, {
                    pageSize : size * 1
                }));
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/css/var.scss";
    .page{
        margin-bottom: 30px;
        height: $pageHeight;
        line-height: $pageHeight;
        font-size: 14px;
        .page-left{
            float: left;
        }
        .page-right{
            float: right;
            a{
                color: #666666;
                display: inline-block;
                margin: 0 12px;
                &.active{
                    width: $pageHeight;
                    height: $pageHeight;
                    text-align: center;
                    border: solid 1px $mainColor;
                    background: $mainColor;
                    color: #ffffff;
                    margin: 0;
                }
                &.page-num{
                    border: solid 1px #cccccc;
                    width: $pageHeight;
                    height: $pageHeight;
                    text-align: center;
                }
            }
        }
    }
</style>
