<template>
    <div class="search">
        <div v-if="type == 'head'">
            <Input v-model="key" search size="default" @on-search="handleSearch" @on-focus="isfocus = true" @on-blur="isfocus = false" :placeholder="$t('enter')" class="hinput" :style="isfocus? 'width:250px': ''"/>
        </div>
        <div v-else>
            <Input v-model="key" size="large" @on-search="handleSearch" search enter-button :placeholder="$t('enter')" />
        </div>
    </div>
    
</template>

<script>
import {Input} from 'iview'
export default {
    name:'Search',
    props:['type'],
    components:{
        Input
    },
    data(){
        return {
            isfocus:false,
            key:''
        }
    },
    methods:{
        handleSearch(){
            if(this.key){
                if(this.key.length < 15){
                    this.$router.push(`/blockdetail?block=${this.key}`)
                    this.key = ''
                }
                if(this.key.length > 15 && this.key && this.key.length < 40){
                    this.$router.push(`/account?address=${this.key}`)
                    this.key = ''
                }
                if(this.key.length > 41){
                    this.$router.push(`/hash?hash=${this.key}`)
                    this.key = ''
                }
            }else{
                this.$Notice.warning({
                    title: `${this.$t('note')}：`,
                    desc:`${this.$t('searcherr')}`
                });
                
            }
            
            
        }
    }

}
</script>
<style lang="less" scoped>
.search{
    display: inline-block;
    .hinput{
        width:120px;
        transition: all 500ms;
    }
}

</style>
