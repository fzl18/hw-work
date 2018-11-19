/**
 * hwui-demo
 * 注：自定义组件规范
 */
define(['vue'],function (vue) {
    vue.component('hwui-demo', {
        template: 
        `
	        <el-container>
			  <el-aside width="200px">Aside</el-aside>
			  <el-container>
			    <el-header>Header</el-header>
			    <el-main>Main</el-main>
			    <el-footer>Footer</el-footer>
			  </el-container>
			</el-container>
        `,

        props: {
            name: {
                type: String
            },
        },

        data: function () {
            return {
                show2: false,
            }
        },
        methods: {

        },
        mounted: function () {
           
        },
        watch: {

        }

    });
})