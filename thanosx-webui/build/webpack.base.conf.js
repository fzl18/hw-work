'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

console.log(NODE_ENVPHP);
var entry = {};
config.entry.forEach((item) => {
    entry[item] =  ["babel-polyfill", './src/view/' + item + '/main.js'];
});

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        // index: ["babel-polyfill", './src/view/index/main.js'],
        // finance: ["babel-polyfill", './src/view/finance/main.js'],
        // login: ["babel-polyfill", './src/view/login/main.js'],
        // article: ["babel-polyfill", './src/view/article/main.js'],
        // safety: ["babel-polyfill", './src/view/safety/main.js'],
        // chart: ['./static/js/chart/charting_library.min.js'],
        ...entry
    },
    output: {
        path: NODE_ENVPHP ? config.php.assetsRoot : config.build.assetsRoot,
        filename: '[name].js',
        publicPath: NODE_ENVPHP
            ? config.php.assetsPublicPath
            : process.env.NODE_ENV === 'production'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src'),
            'vue': 'vue/dist/vue.js',
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}
