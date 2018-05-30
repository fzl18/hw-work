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
//按钮倒计时
function buttonCountdown($el, msNum, timeFormat) {
      var text = $el.data("text") || $el.text(),
          timer = 0;
      $el.prop("disabled", true).addClass("layui-btn-disabled")
              .on("bc.clear", function () {
                  clearTime();
              });

      (function countdown() {
          var time = showTime(msNum)[timeFormat];
          $el.text('重新获取'+time);
          if (msNum <= 0) {
              msNum = 0;
              clearTime();
          } else {
              msNum -= 1000;
              timer = setTimeout(arguments.callee, 1000);
          }
      })();

      function clearTime() {
          clearTimeout(timer);
          $el.prop("disabled", false).removeClass("layui-btn-disabled").text(text);
      }

      function showTime(ms) {
          var d = Math.floor(ms / 1000 / 60 / 60 / 24),
                  h = Math.floor(ms / 1000 / 60 / 60 % 24),
                  m = Math.floor(ms / 1000 / 60 % 60),
                  s = Math.floor(ms / 1000 % 60),
                  ss = Math.floor(ms / 1000);

          return {
              d: d + "天",
              h: h + "小时",
              m: m + "分",
              ss: ss + "s",
              "d:h:m:s": d + "天" + h + "小时" + m + "分" + s + "秒",
              "h:m:s": h + "小时" + m + "分" + s + "秒",
              "m:s": m + "分" + s + "秒"
          };
      }

      return this;
  }

  $(".getcode").click(function(e){
    e.preventDefault()
    buttonCountdown($(this), 1000 * 60 * 1, "ss")
  })
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
  // placeholder 兼容ie方法
    var JPlaceHolder = {
    //检测
    _check : function(){
      return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
      if(!this._check()){
        this.fix();
      }
    },
    //修复
    fix : function(){
      $(':input[placeholder]').each(function(index, element) {
        var self = $(this), txt = self.attr('placeholder');
        if(!(self.hasClass('layui-unselect')))
        self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
        var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
        var holder = $('<span class="fix"></span>').text(txt).css({position:'absolute', left:pos.left , top:(pos.top+ 9) + 'px', height:h, lienHeight:h, paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
        
        self.focusin(function(e) {
          holder.hide();
        }).focusout(function(e) {
          if(!self.val()){
            holder.show();
          }
          if(self.hasClass('layui-unselect')){
            holder.hide();
          }
        });              
        holder.click(function(e) {                
          holder.hide();
          self.focus();
        });
      });
    }
  };
  JPlaceHolder.init(); 
  
}()

