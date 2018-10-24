<template>
    <section>
        <financeHeader :hint="false">
            <span>{{lang[local].appeal}}</span>
        </financeHeader>

        <section class="tab_btn">
            <a href="javascript:;" :class="!cur ? 'cur' :'' " @click="hadndleTab(0)">{{lang[local].appealStartMe}}</a>
            <a href="javascript:;" :class="cur ? 'cur' :'' " @click="hadndleTab(1)">{{lang[local].appealToMe}}</a>
        </section>
        <section class="finance-table">
            <section class="head">
                <dl>
                    <dd style="width:17%" align="center">{{lang[local].appealNO}}</dd>
                    <dd style="width:17%" align="center">{{lang[local].appealOrderNO}}</dd>
                    <dd style="width:10%" align="center">{{!cur?lang[local].appealPerson2: lang[local].appealPerson}}</dd>
                    <dd style="width:10%" align="center">{{lang[local].appealType}}</dd>
                    <dd style="width:15%" align="center">{{lang[local].appealStatus}}</dd>
                    <dd style="width:16%" align="center">{{lang[local].appealTime}}</dd>
                    <dd style="width:15%;text-align:center">{{lang[local].operation}}</dd>
                </dl> 
            </section>
            <section class="tbody">
                <dl v-for="item in list">
                        <dd style="width:17%" align="center">{{item.appeal_number}}</dd>
                        <dd style="width:17%" align="center">{{item.order_number}}</dd>
                        <dd style="width:10%" align="center">{{item.nickname}}</dd>
                        <dd style="width:10%" align="center">{{item.type_name}}</dd>              
                        <dd style="width:15%" align="center">{{item.status==1 ? lang[local].appealStatus1 : item.status==2 ? lang[local].appealStatus2 :item.status== 3? lang[local].appealStatus3 :item.status==4? lang[local].appealStatus4:item.status==5? lang[local].appealStatus5:lang[local].appealStatus6}}</dd>              
                        <dd style="width:16%" align="center">{{localDate(item.create_time)}}</dd>              
                        <dd style="width:15%">
                            <Button type="text" v-if="item.status ==1 && !cur" @click="cancelBox(item.appeal_id)">{{lang[local].cancel}}</Button>
                            <Button type="text" v-if="item.status ==3" @click="$router.push(`/appealDetail?id=${item.appeal_id}`)">{{lang[local].appealS3}}</Button>
                            <Button type="text" @click="$router.push(`/appealDetail?id=${item.appeal_id}`)">{{lang[local].appealDetail}}</Button>
                        </dd>
                </dl>
            </section>
            <page :page="page" @pageChange="pageChange" v-if="page.totalCount > 10"/>
        </section>
        <Modal
            v-model="cancelModal"
            :closable = false
            :footer-hide = true
            class-name="vertical-center-modal">
            <h1>{{lang[local].appealCancel}}</h1>
            <div class="txt">{{lang[local].appealCancelTxt1}}</div>
            <div class="tip">
                <p>{{lang[local].appealCancelTxt2}}：</p>
                <p>{{lang[local].appealCancelTxt3}}</p>
            </div>
            <div>
                <Row>
                    <Col span="4"><Button type="primary" size="large" @click="cancel">{{lang[local].appealCancelTxt4}}</Button></Col>
                    <Col span="4" :offset="16"><Button type="text" size="large" @click="cancelModal = false">{{lang[local].appealCancelTxt5}}</Button></Col>
                </Row>
            </div>
        </Modal>
    </section>    
</template>

<script>
    import bigNum from "bignumber.js"
    export default {
        name: "index",
        data (){
            return {
                cur:0,
                list:[],
                page : {
                    currPage : 1,
                    totalPage : 1,
                    pageSize : 10,
                    totalCount : 10,
                },
                cancelModal:false,
                cancelId:null,
            };
        },
        watch : {
        },
        computed : {
         
        },
        created (){
            this.getList()
        },
        mounted(){
        },
        methods : {

            hadndleTab (index){
                this.cur = index
                this.getList()
            },
            pageChange(){
                this.getList()
            },
            getList(){
                this.axios({
                    url : this.api.appealList,
                    data : {
                        type:this.cur + 1,
                        ...this.page
                    }
                }).then(res=>{
                    this.list = res.data.list
                    this.page = res.data.page
                }).catch( err=>{
                    console.log(err);
                })
            },
            cancelBox(id){
                this.cancelModal = true
                this.cancelId = id
            },
            cancel(){
                this.axios({
                    url : this.api.cancel,
                    data : {
                        appeal_id:this.cancelId
                    }
                }).then(res=>{
                    this.getList()
                    this.cancelId = null
                    this.cancelModal = false
                    this.$store.commit('msg/err', res.message);
                }).catch( err=>{
                    console.log(err);
                    this.$store.commit('msg/err', err.message);
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .vertical-center-modal{
        .txt{font-size:16px;color:red;margin:50px 0;}
        .tip{margin-bottom:50px;font-size:15px;color:#333}
    }
    
    .ivu-btn-text{
        padding:8px 20px;
    }
</style>
