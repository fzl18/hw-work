;!function(){
  var layer=layui.layer,form=layui.form,$=layui.$,laypage=layui.laypage,table=layui.table
  //开启天眼
  $("#login .login_box .input .eye").click(function(){
    var elM = $(this).prev('input')
    var isTxt = elM.prop('type') == 'password' ? false : true
    if(isTxt){elM.prop('type', 'password')}else{elM.prop('type', 'text')}    
    $(this).toggleClass('txtblue')
  })
  //操作提示浮层
  function notice(type,msg){
    switch (type){
      case 'err':
        layer.open({type:1,closeBtn: 0,offset:['120px','42%'],skin:'tip_box err',shade: 0,time: 3000,anim: 3,title: false,content:'<i class="layui-icon layui-icon-close-fill txt_red" style="font-size:20px;position:relative;top:3px;right:10px"></i>'+msg});     
      break;
      case 'success':
        layer.open({type:1,closeBtn: 0,offset:['120px','42%'],skin:'tip_box success',shade: 0,time: 3000,anim: 3,title: false,content:'<i class="layui-icon layui-icon-ok-circle txt_blue" style="font-size:20px;position:relative;top:3px;right:10px"></i>'+msg}); 
      break;
      case 'warn':
        layer.open({type:1,closeBtn: 0,offset:['120px','42%'],skin:'tip_box warn',shade: 0,time: 3000,anim: 3,title: false,content:'<i class="layui-icon layui-icon-about txt_orange" style="font-size:20px;position:relative;top:3px;right:10px"></i>'+msg}); 
      break;
    }
  }
  //自定义验证规则
  form.verify({
    // title: function(value){
    //   if(value.length < 5){
    //     return '标题至少得5个字符啊';
    //   }
    // }
    // ,pass: [/(.+){6,12}$/, '密码必须6到12位']
    // ,content: function(value){
    //   layedit.sync(editIndex);
    // }
  });
  
  //监听指定开关
  form.on('switch(switchTest)', function(data){
    layer.msg('开关checked：'+ (this.checked ? 'true' : 'false'), {
      offset: '6px'
    });
    layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
  });
  
  //监听提交
  form.on('submit(reg)', function(data){
    layer.alert(JSON.stringify(data.field), {
      title: '用户注册提交信息'
    })
    return false;
  });
  form.on('submit(demo1)', function(data){
    // layer.alert(JSON.stringify(data.field))
    notice('success','操作成功！！！')
    return false;
  });
  //分页
  laypage.render({
    elem: 'pages' //注意，这里的 pages 是 ID，不用加 # 号
    ,count: 50 //数据总数，从服务端得到
    ,layout: ['count', 'prev', 'page', 'next','skip']
    ,first:'首页'
    ,jump: function(obj){
      console.log(obj)
    }
  });
  
}()