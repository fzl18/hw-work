
<template>
    <div class="chooseLang" v-if="config.isWeb">
        <Icon type="md-globe" :size="20" :color="top ? '#ccc' : '#666'"/>
        <Dropdown @on-click="changeLang">
            <a href="javascript:void(0)" :style=" top ? 'color:#ccc;': 'color:#666'">
                {{Lang[useLang].language}}
                <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(item,index) in LangList" :key="index" :name="item.val">{{item.tit}}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>
<script>
import particles from "../assets/particles.json"
export default {
    name:'ChooseLang',
    props:['top'],
    data: function () {
        return {
            address:'',
            secret:''
        }
    },    
}
</script>
<style>
    .chooseLang{display: inline-block;margin-left:25px;}
    .chooseLang a{margin-left:5px;font-size:12px;font-weight:normal}
</style>
