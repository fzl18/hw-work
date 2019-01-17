requirejs.config({
    baseUrl: './lib',
    paths:{
		jquery: 'jquery.min',
		vue:'vue.min',
		iview:'iview.min',
		axios:'axios.min',
		login:'../components/login',
		home:'../components/home',
	},
	shim:{
		'iview':{
			deps:['vue'],
			exports: 'iview'
		},
	}
})
requirejs(['jquery','vue','iview','axios','home','login'],
function($,vue,iview,axios){	
	vue.use(iview)
	vue.prototype.axios = axios
	new vue({
      el: '#app',
      data: function() {
        return {
			islogin:false,
			account:'',
			secret:'',
			logintype:0,
        }
      }
	})
	
})