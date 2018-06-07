<template>
  <div class="content">
    <template v-if="step == 1">
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.account}}</span>（填写拥有足够多SDA的账号，用于支付合约部署费用和向合约账号支付相应SDA） </div>
        <div><input type="text" placeholder="请输入您的SDA账户地址"> <span class="err">{{info.err1}}</span> </div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.pw}}</span> （上方账号对应的密钥）</div>
        <div><input type="text" placeholder="请输入您的SDA账户密码"> <span class="err">{{info.err2}}</span></div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.num}}</span>（向生成的合约账号发送最少0.6个SDA，用于激活合约账号） </div>
        <div><input type="text" placeholder="请至少填写0.6个SDA"> <span class="err">{{info.err3}}</span></div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.script}}</span>（lua编写的合约脚本，用于执行） </div>
        <div><textarea rows="5" placeholder="result={}"></textarea> <span class="err">{{info.err4}}</span></div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.scriptParam}}</span>（传递给lua合约脚本的Init函数的参数） </div>
        <div><textarea rows="5" placeholder="result={}"></textarea> <span class="err">{{info.err5}}</span></div>
      </div>
      <div class="btn"><i-button type="primary" size="large" @click="next">{{local[lang].infolist.contract.submit}}</i-button></div>
    </template>

    <template v-if="step == 2">
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.caccount}}</span>（合约部署成功后生成的合约账号）</div>
        <div><input type="text" placeholder="sdfwefsdf" disabled> <span class="err">{{info.err6}}</span> </div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.script}}</span>（合约账号对应的合约脚本，不可编辑）</div>
        <div><textarea rows="8" placeholder="asdfwefsef" disabled></textarea> <span class="err">{{info.err7}}</span></div>
      </div>
      <div class="btn"><i-button type="primary" size="large" @click="next">输入执行合约{{local[lang].infolist.contract.script}}</i-button></div>
    </template>

    <template v-if="step == 3">
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.account}}</span>（填写拥有足够多SDA的账号，用于支付合约部署费用和向合约账号支付相应SDA） </div>
        <div><input type="text" placeholder="请输入您的SDA账户地址"> <span class="err">{{info.err1}}</span> </div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.pw}}</span> （上方账号对应的密钥）</div>
        <div><input type="text" placeholder="请输入您的SDA账户密码"> <span class="err">{{info.err2}}</span></div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.caccount}}</span>（向生成的合约账号发送最少0.6个SDA，用于激活合约账号） </div>
        <div><input type="text" placeholder="请至少填写0.6个SDA"> <span class="err">{{info.err3}}</span></div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.script}}</span>（lua编写的合约脚本，用于执行） </div>
        <div><textarea rows="5" placeholder="result={}"></textarea> <span class="err">{{info.err4}}</span></div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.scriptParam}}</span>（传递给lua合约脚本的Init函数的参数） </div>
        <div><textarea rows="5" placeholder="result={}"></textarea> <span class="err">{{info.err5}}</span></div>
      </div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.param}}</span>（向生成的合约账号发送最少0.6个SDA，用于激活合约账号） </div>
        <div><input type="text" placeholder="请至少填写0.6个SDA"> <span class="err">{{info.err3}}</span></div>
      </div>
      <div class="btn"><i-button type="primary" size="large">{{local[lang].infolist.contract.execution}}</i-button></div>
      <div class="row">
        <div class="tit"><span>{{local[lang].infolist.contract.results}}</span>（lua编写的合约脚本，用于执行） </div>
        <div><textarea rows="5" placeholder="result={}" disabled></textarea> <span class="err">{{info.err4}}</span></div>
      </div>
    </template>
      
  </div>  
</template>

<script>
import { mapState, mapMutations, } from 'vuex'
export default {
  data(){
    return {
      step:1,
      info:{
        err1:'',
        err2:'',
        err3:'',
        err4:'',
        err5:'',
        err6:'',
        err7:'',
      }
    }
  },
  computed: mapState([
    'local','lang'
  ]),
  methods:{
    next(){
      this.step ++
    }
  }
}
</script>

<style scoped>
  .content{width:50%;margin:50px auto}
  .row{margin:25px 0;position: relative;}
  .tit{margin-bottom:8px;color:#418FC9}
  .tit span{min-width:80px;display:inline-block;color: #575757}
  input, textarea{height:36px;padding-left:10px;margin-right:10px;border:1px solid #DCDCDC;width:90%;}
  textarea{height:inherit;padding:10px;}
  input:focus, textarea:focus{background: #FFFFCC;}
  .err{color:#F35822;margin-left:50px;position: absolute;top:35px;left:85%;}
  .btn{text-align: center;margin-top: 50px;}
</style>