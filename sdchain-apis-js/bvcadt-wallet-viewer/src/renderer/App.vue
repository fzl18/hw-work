<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'wallet',
    created(){
      
    },
    mounted(){      
      this.chooseLang()
    },
    watch:{
      'useLang' (n,o){
        this.chooseLang()
      }
    },
    methods:{
      chooseLang(){
        const config = this.config
        if(!config.isWeb){
          const {Menu, dialog} = require('electron').remote
          const LangList = []
          this.LangList.map(d => { LangList.push(
              { label:d.tit, click: ()=>{this.changeLang(d.val)} }
            )})
          const winMenu = [
          {
              label: this.Lang[this.useLang].changeLang,
              submenu: LangList
          },
        ]
        config.winMenu.map( d =>{
          const submenu = []
          d.submenu && d.submenu.map(v =>{
            submenu.push({
              label:v.tit,
              click:()=>{dialog.showMessageBox({
                title:' ',
                type:'info',
                message: v.ctx
              })}
            })
          })
          winMenu.push({
            label:d.tit,
            submenu
          })
        })        
          const menu = Menu.buildFromTemplate(winMenu)
          Menu.setApplicationMenu(menu)
        }        
      }
    }
  }
</script>

<style>
  body{
    margin:0;
    padding:0;
    background: #F5F7F9;
  }
a{text-decoration: none;}
.layout{
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo{
  border-radius: 3px;
  float: left;
  position: relative;
  color:#fff;
  font-size:20px;
  font-weight:bold;
}
.layout-logo img{
  vertical-align: middle;
  width: 50px;
}
.layout-logo span{
  margin-left:10px;
  opacity:.8;
  vertical-align: middle;
}
.layout-logo span.sub{
  font-size:12px;
  margin-left:20px;
  opacity:.6;
}
.layout-nav{
  float:right;
}
.layout-footer-center{
  text-align: center;
}

.vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;  
}
.vertical-center-modal .ivu-modal{
  top: 0;
}
.index_login{  
  background:#3C2C2D;
  height:100vh;
  position: relative;
}
.index_login h1{color:#fff;}
.index_login .copyright{
  margin-top:70px;
  text-align: center;
  color:#fff;
}
.index_login .login{
  width:500px;
  height:400px;
  position: absolute;
  left:0;right:0;top:0;bottom:0;margin:auto;
}
table.list td{
  line-height: 35px;
  border-bottom:1px solid #eee;
  padding:0 10px;
}
table.list td:nth-child(1){
  min-width:70px
}
.ivu-layout-header{
  background: #3C2C2D!important;
  height:50px!important;
  line-height:50px!important;
}
.ivu-menu-dark{
  background: none!important;
}
.ivu-btn-primary{
  background-color: #EA5165!important;
  border-color:#EA5165!important;
  box-shadow:none!important;

}
.ivu-btn-primary.b2{
  background-color: #483838!important;
  border-color:#483838!important;
  box-shadow:none!important;
  opacity: .7;
  padding:2px 15px!important;
}
.ivu-btn-primary.b2 i{
  color:#EA5165;
  font-size:20px;
  opacity:.7;
}
.tx .ivu-card-body{
  padding:0!important;
}
.ivu-card-head{
  background: #F8F8F8!important;
}
.ivu-menu-horizontal{
  height:50px!important;
  line-height: 50px!important;
}
</style>
