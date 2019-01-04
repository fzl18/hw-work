
# 开始
> 安装 node.js
>> npm install
>>> npm start
<br/>

# 打包输出步骤
> 安装 node.js
>> 进入项目根目录下 运行命令行 输入:
>>> npm run buildPHP
>>> 完成后输出目录为 'D:\phpStudy\PHPTutorial\'

<br/>


## 引用库
> [vue](https://cn.vuejs.org/v2/api/) <br>
> [vuex](https://vuex.vuejs.org/zh-cn/)<br>
> [vue-router](https://router.vuejs.org/zh-cn/installation.html)<br>
> [vue-cookie](https://www.npmjs.com/package/vue-cookie)<br>
> [axios](https://www.npmjs.com/package/axios)    ajax <br>
> [animate.css](https://daneden.github.io/animate.css/)  动画css库 <br>
> [sass](http://peiwen.lu/SassReferenceChineseTranslation/) sass文档 <br>
> [iconfont](http://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.11&manage_type=myprojects&projectId=611740&keyword=)  iconfont 项目地址(需要添加账号)

<br/>

## vue简解
> [axios](https://www.npmjs.com/package/axios)    ajax <br>
> [vue 事件处理](https://cn.vuejs.org/v2/guide/events.html) <br>
> [vue 列表渲染](https://cn.vuejs.org/v2/guide/list.html) <br>
> [vue 表单输入绑定](https://cn.vuejs.org/v2/guide/forms.html)<br>
###### html 引用变量
```html
<template>
    <section @click='clickFunction'>
        {{data}}
    </section>
</template>
```
###### 得到 html
```html
<section>
    demo
</section>
```
```javascript
{
    data (){
        return {  // 这里的变量都是可以注入到 template 的
            data : 'demo'
        }
    },
    created (){
        
        this.getData();
    },
    methods : {
        ...
        clickFunction (){  // @click='clickFunction'  调用 dom event
            alert('clickFunction');
        },
        getData (){
            // 调用 api ajax 方法
            this.axios({
                url : this.api.walletList,  // url
                data : {
                    test : 'test' //传入参数
                    ... 
                }
            }).then((res) => { // api 返回 code == 1000 执行
                console.log(res)
            }).catch((err) => { // api 返回 code != 1000 执行, 以及其他的错误
                console.log(err.message);
            });
        }
    }
}
```

<br/>

## build 要求
> 组件有用到第三方库，组件必须异步引入

```javascript
const test = () => import(/* webpackChunkName: "test" */ '../components/test.vue')
```

<br/>

## 目录结构
```javascript
* build
    * buildPHP (php build 执行文件)
    * webpack.php.conf (php build 配置文件)
* src
    * assets (公共静态资源)
    * common (公共方法)
    * components (公共组件)
    * store (公共 store)
    * view (模块单页应用)
        * article (文章)
        * finance (财务)
        * index (首页)
        * login (登录注册)
        * safety (安全中心)
            * assets (单页静态资源)
            * components (单页组件)
            * router (单页 router)
            * store (单页 store)
            * App.vue (单页根组件)
            * main.js (单页入口文件)
* static
    * font (iconfont)
    * lang (语言包)
        * zh-cn.js (中文语言包)
    * ...
* template (start build 模板)
* templatePHP (php build 模板)
* ...
```




