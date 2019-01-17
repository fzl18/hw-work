<template>
    <div class="index_login">
      <Login v-if="!islogin" />
      <Home v-else/>
    </div>
</template>
<script>
  import Home from '../components/Home'
  import Login from '../components/Login'
  export default {
    name: 'index',
    components: { Login,Home },
    data(){
      return {
        islogin:false,
        account:'',
        secret:'',
        logintype:0,
      }
    },
    mounted(){
    },
    methods: {
      
    }
  }
</script>