<template>
    <section class="finance-table">
        <section class="head">
            <slot name="head"></slot>
        </section>
        <slot></slot>
        <listLoadTemplate @update="getList" :getStatus="getState" />
        <section class="tbody" v-if="getState == getStateSuccess">
            <slot name="body" v-for="item in (listSeek || list)" :item="item" :getList="getList"></slot>
        </section>
        <page :page="page" @pageChange="pageChange" v-if="pageStatus && getState == getStateSuccess" />
    </section>
</template>

<script>
    export default {
        name: "list",
        data (){
            return {
                listSeek : null,
                list : [],
                page : {
                    currPage : 1,
                    pageSize : 10,
                }
            }
        },
        props : {
            url : {
                type : String,
                default : '',
            },
            pageSize : {
                default : 10,
            },
            pageStatus : {
                default : true,
            },
            param : {
                default : function () {
                    return {};
                }
            },
            seek : {
                type : Object,
                default : function () {
                    return {};
                }
            },
        },
        watch : {
            param (n, o){
                if(JSON.stringify(n) != JSON.stringify(o)){
                    // console.log(JSON.stringify(n));
                    this.getList();
                };
            },
            seek (n, o){
                var k = Object.keys(n)[0];
                if(n[k]){
                    var list = [];
                    this.list.forEach((item) => {
                        if(eval('/' + n[k] + '/gi').test(item[k])){
                            list.push(item);
                        };
                    });
                    this.listSeek = list;
                    if(list.length){
                        this.getSuccess();
                    }else{
                        this.getEmpty();
                    };
                }else{
                    this.listSeek = null;
                    if(this.list.length){
                        this.getSuccess();
                    }else{
                        this.getEmpty();
                    };
                };
            },
        },
        created (){
            this.page.pageSize = this.pageSize || this.page.pageSize;
            this.getList();
        },
        methods : {
            pageChange (page){
                this.getList(page);
            },
            getList (page){
                if(this.url.length <= 0){
                    this.$store.commit('msg/err', this.lang[this.local].finance9);
                    return false;
                };
                if(this.page.totalPage && this.page.totalPage <= 0){
                    return false;
                };
                page = page || this.page || {};

                if(page.totalPage && page.currPage){
                    page.currPage = page.currPage > page.totalPage ? page.totalPage : page.currPage;
                };
                this.getState = this.getStateStart;
                var data = Object.assign({}, page, this.param);
                this.axios({
                    url : this.url,
                    data : data
                }).then((res) => {
                    this.list = res.data.list || [];
                    this.page = res.data.page || this.page;
                    this.getState = res.data.list.length ? this.getStateSuccess : this.getStateEmpty;
                }).catch((err) => {
                    this.list = [];
                    this.page = {};
                    this.getState = this.getStateError;
                    this.$store.commit('msg/err', err.message);
                });
            },
        }
    }
</script>

