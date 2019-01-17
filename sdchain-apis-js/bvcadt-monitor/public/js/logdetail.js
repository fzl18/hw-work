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
    },
    search: function () {
      const querys = Utils.getQuerys();
      const _id = querys['id'];
      const key = querys['key'];
      const u = key.substring(0,key.indexOf('_'));
      $.ajax({
        'dataType': 'json',
        'type': 'GET',
        'url': 'api/'+u+'/errorDetail?id='+_id,
        'success': function (resData) {
            if(resData.code===0){
                const nodeInfo = resData.data;
                let key = nodeInfo.key;
                 key=key.substring(key.indexOf('_')+1,key.length);
                
                let html = '';
                const nodeInfoC = $('#page-wrapper .row .alert-info span');
                nodeInfoC.eq(0).text(key);
                nodeInfoC.eq(1).text(nodeInfo.address);
                nodeInfoC.eq(2).text(new Date(nodeInfo.time).format('yyyy-MM-dd hh:mm:ss'));
                nodeInfoC.eq(3).text(nodeInfo.error);
                $('#json-renderer').jsonViewer(resData.data.errorDetail, { collapsed: false });
            }
        }
    });
    },
    tologdetail: function (id) {
      window.location.href = 'logdetail.html?id=' + id
    },
    initListener: function () {
    }
  }
}()
