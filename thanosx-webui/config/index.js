'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

const entry = ['index', 'finance', 'login', 'article', 'safety', 'otc', 'trade', 'mobile'];

var php = {};
var build = {};

entry.forEach((item) => {
    php[item] = path.resolve('D:\\phpStudy\\PHPTutorial\\WWW\\radar-new\\app\\home\\view\\' + item + '\\index.html');
    build[item] = path.resolve(__dirname, '../dist/' + item + '.html');
});

module.exports = {
    entry : entry,
    dev: {

        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
                target: 'http://120.79.219.175/',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                }
            },
            '/home/': {
                target: 'http://120.79.219.175/',    //39.108.169.210
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                }
            }
        },

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        // host: '192.168.1.46', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },

    build: {
        // Template for index.html
        // index: path.resolve(__dirname, '../dist/index.html'),
        // finance: path.resolve(__dirname, '../dist/finance.html'),
        // login: path.resolve(__dirname, '../dist/login.html'),
        // article: path.resolve(__dirname, '../dist/article.html'),
        // safety: path.resolve(__dirname, '../dist/safety.html'),
        // otc: path.resolve(__dirname, '../dist/otc.html'),
        ...build,

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    php : {
        // index: path.resolve('D:\\phpStudy\\PHPTutorial\\WWW\\radar-new\\app\\home\\view\\index\\index.html'),
        // finance: path.resolve('D:\\phpStudy\\PHPTutorial\\WWW\\radar-new\\app\\home\\view\\finance\\index.html'),
        // login: path.resolve('D:\\phpStudy\\PHPTutorial\\WWW\\radar-new\\app\\home\\view\\login\\index.html'),
        // article: path.resolve('D:\\phpStudy\\PHPTutorial\\WWW\\radar-new\\app\\home\\view\\news\\index.html'),
        // safety: path.resolve('D:\\phpStudy\\PHPTutorial\\WWW\\radar-new\\app\\home\\view\\safety\\index.html'),
        // otc: path.resolve('D:\\phpStudy\\PHPTutorial\\WWW\\radar-new\\app\\home\\view\\otc\\index.html'),
        ...php,

        assetsRoot: path.resolve('D:\\phpStudy\\PHPTutorial\\WWW\\radar-new\\public\\home'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/public/home/',
        productionSourceMap: false,
        devtool: '#source-map',

        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        bundleAnalyzerReport: process.env.npm_config_report
    }
}
