
const state = {
    tips : {}
};

const getters = {
    tip (state){
        return state.tips
    }
};

const actions = {

};

const mutations = {
    add (state, param){
        if(param){
            var key = param && (param.id || param.text);
            var p = {};
            p[key] = param;

            if(state.tips[key] && state.tips[key].timer){
                clearTimeout(state.tips[key].timer);
            };

            state.tips = Object.assign({}, state.tips, p);

            if(param.status && param.time > 0){
                p.timer = setTimeout(() => {
                    this.commit("tips/update", {
                        text : param.text,
                        id : param.id,
                        status : false,
                        timer : null,
                    });
                }, param.time)
            };
        };
    },

    hideAll (state){
        for(var k in state.tips){
            state.tips[k] = Object.assign({}, state.tips[k], {
                status : false,
            });
        };
    },

    show (state, key){
        if(key && state.tips[key]){
            if(state.tips[key].timer){
                clearTimeout(state.tips[key].timer);
            };
            if(state.tips[key].time > 0){
                state.tips[key].timer = setTimeout(() => {
                    this.commit("tips/update", {
                        text : state.tips[key].text,
                        id : state.tips[key].id,
                        status : false,
                        timer : null,
                    });
                }, state.tips[key].time)
            };
            state.tips[key] = Object.assign({}, state.tips[key], {
                status : true,
            });
        };
    },

    hide (state, key){
        if(key && state.tips[key]) {
            state.tips[key] = Object.assign({}, state.tips[key], {
                status: false,
            });
        };
    },

    del (state, key ){
        if(key && state.tips[key]){
            if(state.tips[key].timer){
                clearTimeout(state.tips[key].timer);
            };
            delete state.tips[key];
            state.tips = Object.assign({}, state.tips);
        };
    },

    delAll (state){
        state.tips = {};
    },

    update (state, param){
        var key = param && (param.id || param.text);
        if(key && state.tips[key]){
            state.tips[key] = Object.assign({}, state.tips[key], param);
        };
    },

    tipsData (state, param){
        var key = param && param.tip && (param.tip.id || param.tip.text);
        if(key && state.tips[key]){
            state.tips[param.tip.text] = Object.assign({}, state.tips[param.tip.text], {
                tipsData : param.tipsData
            });
        };
    },
};

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}
