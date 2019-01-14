const CManager = new function () {
    return {
      pageData: {
        coreMonitorUrl: Constant.data.coreMonitorUrl,
        key: '',
        page: 1,
        rows: 10
      },
      // main function to initiate the module
      init: function () {
        this.initListener()
      },
      remove: function (tb) {
        const postData={
            date:$('#timeEnd').val(),
            token:$('#token').val()
        }
        $.ajax({
          'dataType': 'json',
          'type': 'POST',
          'data':postData,
          'url': 'api/'+tb+'/remove',
          'success': function (resData) {
              console.log(resData)
              let res = ''
              if(resData.code===0){
                res = '已删除日志 '+resData.data.n+' 条'
              }else{
                $("#res").css('color','red')
                res = resData.message
              }
              $("#res").text(res)
          }
        });
      },
      toNodeInfo: function (key) {
          window.location.href = 'errorlog.html?key=' + key
      },
      initListener: function () {
          $('#saveBtn').click(function(){
            $("#res").text('')
            $("#res").attr('style','')
            CManager.remove($('#tb').val())
          })
          $('#clearBtn').click(function(){
            $("#res").attr('style','')
            $("#res").text('')
            $("#token").val('')
            $("#timeEnd").val('')
          })
      }
    }
  }()
  