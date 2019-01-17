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
      this.searchNodeErrors()
    },
    searchNodeErrors: function () {
      const querys = Utils.getQuerys();
      const key = querys['key'];
      const page = querys['page'];
      CManager.pageData.key = key;
      const u = key.substring(0,key.indexOf('_'));
      $.ajax({
        'dataType': 'json',
        'type': 'GET',
        'url': 'api/'+u.toLowerCase()+'/detailErrors?key='+key+'&page='+page,
        'success': function (resData) {
            if(resData.code===0){
                const nodeInfo = resData.data;
                const nodeInfoC = $('#page-wrapper .row .alert-info span');
                 let key = nodeInfo.key;
                 key=key.substring(key.indexOf('_')+1,key.length);
                nodeInfoC.eq(0).text(key);
                nodeInfoC.eq(1).text(nodeInfo.address);
                const nodeErrors = resData.data.errors;
                let html = '';
                for(let i in nodeErrors){
                  let time = new Date(nodeErrors[i].time).format('yyyy-MM-dd hh:mm:ss')
                  html+='<div class="col-md-4">'
                        +'<div class="panel panel-danger" >'
                           +'<div class="panel-heading" onclick="CManager.tologdetail(\'' + nodeErrors[i]._id + '\')"><span>'+time+'</span></div>'
                            +'<div class="panel-body">'
                                +'<p class="">'+nodeErrors[i].error+'</p>'
                            +'</div>'
                           +'</div>'
                     +'</div>'
                }
                $('#errors .row').html(html);
            }
        }
    });
    },
    tologdetail: function (id) {
      window.location.href = 'logdetail.html?id=' + id+'&key='+ CManager.pageData.key
    },
    initListener: function () {
    }
  }
}()
