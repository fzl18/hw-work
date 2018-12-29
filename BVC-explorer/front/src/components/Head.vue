<template>
  <div class="head">
    <div class="main">
      <Logo class="tlogo" />
      <div class="rpart">
        <div class="menu">
          <ul>
            <li v-for="(nav,index) in menu" :key="index" @click="jump(nav.url)" :class="$route.meta == nav.tit ?'cur':''">{{ $t('menu.' + nav.tit) }} </li>
          </ul>
          <Search type="head" />
        </div>
        <span class="lang">
          <i class="iconfont icon-shixindiqiu"></i>          
            <Dropdown trigger="click" placement="bottom-end" class="langlist" @on-click="handleLang">
              <a href="javascript:void(0)">
                  {{$t('language')}}
                  <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <template v-for="(item,index) in langList">
                  <DropdownItem :name="item.val" :key="index">{{item.tit}}</DropdownItem>
                </template>
              </DropdownMenu>
            </Dropdown>
        </span>
      </div>      
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
import {Dropdown,DropdownMenu,DropdownItem,Icon} from 'iview'
import Search from './Search'
import { list } from '../lang'
export default {
  inject:['reload'],
  name: 'Head',
  components:{
    Logo,Dropdown,DropdownMenu,DropdownItem,Icon,Search
  },
  data(){
    return {
      menu:[{
        tit:'home',
        url:'/',
      },{
        tit:'cadt',
        url:'/cadt',
      },{
        tit:'block',
        url:'/block',
      },{
        tit:'history',
        url:'/history',
      },],
      langList:list,
    }
  },
  mounted(){
    
  },
  methods:{
    jump(url){
      this.$router.push(url)
    },
    handleLang(val){
      localStorage.Lang = val
      this.$i18n.locale = val
      this.reload()
    }
  }
}
</script>

<style scoped lang="less">
@import url('../assets/css/var.less');
.head{
  // height:60px;
  background: @headbg;
  border-bottom: 1px solid #DDDCDC;
  .tlogo{
    display: inline-block;
    transform:scale(.65,.65);
    width: 26%;
    position: relative;
    right:60px;
  }
  .rpart{display: inline-block;text-align: right;width: 74%;}
  .menu{
    display: inline-block;
    vertical-align: middle;
    text-align:right;
    margin-right:20px;
    font-weight:bold;
    ul{
      display: inline-block;
      vertical-align: middle;
      margin-right:20px;
      li{
        float: left;
        list-style:none;
        cursor: pointer;
        padding:0 15px;
        margin:0 10px;
        color:@txtColor1;
        display:block;
        height:60px;
        line-height: 60px;
        &.cur{
          position: relative;
          &::after{
            content:'';
            position:absolute;
            bottom:-1px;
            width:100%;
            height:2px;
            left:0;
            background:@txtColor2;
          }
        }
        &.cur, &:hover{
          color:@txtColor2;
        }        
      }
    }    
  }
  .lang{
    display: inline-block;
    vertical-align:middle;
    font-size:12px;
    i{
      display: inline-block;
      font-size:20px;
      opacity:.5;
      margin-right:5px;
    }
    span{
      color:#6D5353;
      display: inline-block;
    }
    .langlist{
      position: relative;
      top:-3px;      
      a{color:#6D5353;}
      li{
        text-align: center;
      }
    }
  }
}
  
</style>
