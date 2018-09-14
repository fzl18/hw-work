const mutations = {
    changLang(state,lang) {
      state.lang = lang
      console.log()
    },
    changSearchKey(state,prams={type:'',val:''}) {
      state[prams.type] = prams.val
      // console.log(prams.type +':'+ prams.val)
    },
  }
  
  export default mutations