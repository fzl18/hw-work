"use strict";
const path = require('path');
const fs = require('fs');

module.exports.mkdir = function(dir) {
    let p = path.dirname(path.normalize(dir));
    let isAbs = path.isAbsolute(p);
    let current_path = '';
    p = p.split(path.sep);
    if(isAbs) {
        current_path = p[0];
        if((current_path.length <= 0) && (path.sep == '/')) {
            current_path = "/";
        }
        p.shift();
    }

    for(let i = 0; i < p.length; ++i) {
        current_path = path.join(current_path, p[i]);
        if (!fs.existsSync(current_path))
        {
            fs.mkdirSync(current_path);
        }
    }
};

module.exports.sleep = async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
};

module.exports.searchInArray = function (arr,_key) {
    let resObj = {}
    if(Array.isArray(arr)){
        for(let i in arr){
            if(arr[i].key===_key){
                resObj = arr[i];
                break;
            }
        }
    }
    return resObj;
};
