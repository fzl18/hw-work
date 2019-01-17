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
        this.search()
        this.searchApp()
      },
      search: function () {
        $.ajax({
          'dataType': 'json',
          'type': 'GET',
          'url': 'api/core/listStatus',
          'success': function (resData) {
              if(resData.code===0){
                  const nodesStatus = resData.data;
                  let html = '';
                  for(let i in nodesStatus){
                     let time = nodesStatus[i].lastErrorTime == ''?'':new Date(nodesStatus[i].lastErrorTime).format('yyyy-MM-dd hh:mm:ss')
                     let key = nodesStatus[i].key;
                    
                     key=key.substring(key.indexOf('_')+1,key.length);
                     html+='<div class="col-md-6">'
                                  +'<div class="panel '+(nodesStatus[i].validated?"panel-info":"panel-danger")+'" >'
                                     +'<div class="panel-heading" onclick="CManager.toNodeInfo(\'' + nodesStatus[i].key + '\')">'+key+'</div>'
                                      +'<div class="panel-body">'
                                          +'<p>节点地址: '+nodesStatus[i].address+'</p>'
                                          +'<p>当前状态: '+(nodesStatus[i].validated?"正常":"异常")+'</p>'
                                          +'<p>最近异常: '+time+'</p>'
                                      +'</div>'
                                  +'</div>'
                              +'</div>'
                  }
                  $('#panel-1 .row').html(html);
              }
          }
        });
      },
      searchApp: function () {
        $.ajax({
          'dataType': 'json',
          'type': 'GET',
          'url': 'api/app/listStatus',
          'success': function (resData) {
              if(resData.code===0){
                  const nodesStatus = resData.data;
                  let html = '';
                  for(let i in nodesStatus){
                     let time = nodesStatus[i].lastErrorTime == ''?'':new Date(nodesStatus[i].lastErrorTime).format('yyyy-MM-dd hh:mm:ss')
                      html+='<div class="col-md-6">'
                                  +'<div class="panel '+(nodesStatus[i].validated?"panel-info":"panel-danger")+'">'
                                     +'<div class="panel-heading"  onclick="CManager.toNodeInfo(\'' + nodesStatus[i].key + '\')">'+nodesStatus[i].key+'</div>'
                                      +'<div class="panel-body">'
                                          +'<p>应用地址: '+nodesStatus[i].address+'</p>'
                                          +'<p>当前状态: '+(nodesStatus[i].validated?"正常":"异常")+'</p>'
                                          +'<p>最近异常: '+time+'</p>'
                                      +'</div>'
                                  +'</div>'
                              +'</div>'
                  }
                  $('#panel-2 .row').html(html);
              }
          }
        });
      },
      toNodeInfo: function (key) {
          window.location.href = 'errorlog.html?key=' + key
      },
      initListener: function () {
      }
    }
  }()
  