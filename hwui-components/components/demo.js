/**
 * hwui-demo
 * 注：自定义组件规范
 */
define(['vue'],function (vue) {
    vue.component('hwui-demo', {
        template: 
        `
	        <el-container>
			  <el-aside v-if="show2" width="200px">Aside</el-aside>
			  <el-container>
			    <el-header>
          <el-row>
            <el-col :span="6" class="logo"><slot name="logo"></slot></el-col>
            <el-col :span="18">
              <el-menu
                :default-active="activeIndex2"
                mode="horizontal"
                @select="handleSelect"
                background-color="#515A6E"
                text-color="#fff"
                active-text-color="#ffd04b">
                <el-menu-item index="1">处理中心</el-menu-item>
                <el-submenu index="2">
                  <template slot="title">我的工作台</template>
                  <el-menu-item index="2-1">选项1</el-menu-item>
                  <el-menu-item index="2-2">选项2</el-menu-item>
                  <el-menu-item index="2-3">选项3</el-menu-item>
                  <el-submenu index="2-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="2-4-1">选项1</el-menu-item>
                    <el-menu-item index="2-4-2">选项2</el-menu-item>
                    <el-menu-item index="2-4-3">选项3</el-menu-item>
                  </el-submenu>
                </el-submenu>
                <el-menu-item index="3" disabled>消息中心</el-menu-item>
                <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
              </el-menu>
            </el-col>
          </el-row>              
          </el-header>                
			    <el-main :class="show2?'':'no-aside'">
                    <el-breadcrumb separator="/">
                      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
                      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="body">
                        <slot name="body"></slot>
                    </div>
                </el-main>
			    <el-footer>2015-2018 © HWKJ</el-footer>
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
                activeIndex: '1',
                activeIndex2: '1'
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        mounted: function () {
           
        },
        watch: {

        }

    });
})