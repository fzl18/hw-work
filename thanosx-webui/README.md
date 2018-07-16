
# 开始
> 安装 node.js
>> npm install
>>> npm start

<br/>
# radar web

> 镭达数字资产交易平台 前端重构项目

<br/>

## [重构进度](http://23.91.100.214:3000/RadarTech/radar-frontend/wiki/%E5%89%8D%E7%AB%AF%E9%87%8D%E6%9E%84%E8%BF%9B%E5%BA%A6)
<table>
    <thead>
        <tr>
            <th width="200">模块</th>
            <th width="200">重构进度</th>
            <th width="240">API <a href="http://23.91.100.214:3000/RadarTech/radar-frontend/wiki/API+%E8%BF%94%E5%9B%9E%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E"><small>(API返回格式说明)</small></a></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>首页</td>
            <td>完成</td>
            <td>
                <a href="http://23.91.100.214:3000/RadarTech/radar-frontend/wiki/%E9%A6%96%E9%A1%B5%E9%9C%80%E6%B1%82API" target="_blank" >首页API</a>
            </td>
        </tr>
        <tr>
            <td>交易中心</td>
            <td>完成</td>
            <td></td>
        </tr>
        <tr>
            <td>OTC交易</td>
            <td>完成</td>
            <td>100%</td>
        </tr>
        <tr>
            <td>财务中心</td>
            <td>完成</td>
            <td></td>
        </tr>
        <tr>
            <td>安全中心</td>
            <td>完成</td>
            <td></td>
        </tr>
        <tr>
            <td>登录注册</td>
            <td>完成</td>
            <td></td>
        </tr>
    </tbody>
</table>

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




