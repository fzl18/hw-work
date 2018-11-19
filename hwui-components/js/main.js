requirejs.config({
    // baseUrl: 'lib',
    paths:{
		jquery: 'https://cdn.bootcss.com/jquery/1.10.2/jquery.min',
		vue:'https://cdn.bootcss.com/vue/2.5.17/vue.min',
		ELEMENT:'https://unpkg.com/element-ui/lib/index',
		axios:'https://cdn.bootcss.com/axios/0.18.0/axios.min',
		header:'../components/demo'

	},
	shim:{
		'ELEMENT':{
			deps:['vue'],
			exports: 'ELEMENT'
		},
	}
})
requirejs(['jquery','vue','ELEMENT','axios','header'],
function($,vue,ELEMENT,axios){	
	vue.use(ELEMENT)
	new vue({
      el: '#app',
      data: function() {
        return {
        	visible: false,
        }
      }
    })
})