<template>
    <div class="main">
        <img src="../assets/images/err.png" alt="">
        <p class="txt">{{$t('err' + err)}}</p>
        <p><Button type="primary" @click="$router.push('/')">{{$t('backhome')}}</Button></p>
    </div>
</template>

<script>
import {Button} from 'iview'
export default {
    name:'Err',
    components:{
        Button
    },
    data(){
        return {
            err:'err'
        }
    },
    created(){
        this.err = this.$route.query.err
    },

}
</script>
<style lang="less" scoped>
.main{
    text-align:center;
    padding-top:8%;
    .txt{
        font-size:16px;
        padding:20px 0;
    }
}
</style>
