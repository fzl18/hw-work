requirejs.config({
    baseUrl: './lib',
    paths:{
		jquery: 'jquery.min',
		vue:'vue.min',
		ELEMENT:'elementui',
		axios:'axios.min',
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