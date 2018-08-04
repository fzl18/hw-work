
<template>
    <section class="trade-chart">
        <div id="chart_container"></div>
        <div v-if="iframeState" class="chart_container-bg"></div>
    </section>
</template>
<script>

    import {mapState} from 'vuex'
    export default {
        name: "chart",
        data (){
            return {
                widget : null,
                bg : '#2D2D2D',
                borderColor : '#404040',
                up : '#0cba71',
                down : '#ff400c',
                supported_resolutions : ['1', '15', '60', "D", "W", "3W", 'M', '6M', '12M'],
                onHistoryCallback : null,
                onRealtimeCallback : null,
                onReadyCallback : null,
                onSymbolResolvedCallback : null,
                onReadyCallbackState : true,
                firstDataRequest : false,
                iframeState : true,
            };
        },
        watch :{
            chartBarState (n, o){
                if(this.onReadyCallback && this.onReadyCallbackState && n){
                    this.onReadyCallbackState = false;
                    this.onReadyCallback(this.onReadyCallbackParam());
                };
            },
            chartBar (n, o){
                // console.log('chartBar', n.length);
                // console.log('onHistoryCallback', typeof this.onHistoryCallback);
                if(this.onHistoryCallback){
                    if(n.length){
                        this.onHistoryCallback(n, { noData : false });
                    }else{
                        this.onHistoryCallback([], { noData : true });
                    };
                };
            },
            subscribeBarsData (n, o){
                // console.log('subscribeBarsData', JSON.stringify(n));
                // console.log(this.onRealtimeCallback);
                if(this.onRealtimeCallback && n){
                    console.log('onRealtimeCallback');
                    this.onRealtimeCallback(n);
                };
            },
            websocketState (n, o){
                if(this.widget && !this.onReadyCallbackState){
                    this.$store.commit('chartInitState', true);
                    this.widget.setSymbol(this.xnb, this.resolution, function () {
                        // console.log('setSymbol');
                    });
                };
            },
            local (){
                location.href = process.env.NODE_ENV == 'development' ? '/trade.html' : '/home/trade/'
            }
        },
        mounted () {
            // console.log(TradingView.onready);
            TradingView.onready(this.setWidget.bind(this));
        },
        computed : {
            ...mapState([
                'chartBar',
                'chartBarState',
                'interval',
                'resolution',
                'subscribeBarsData',
                'websocketState',
                'chartInitState',
            ]),
        },
        methods : {
            onReadyCallbackParam (){
                return {
                    supports_marks : false,
                    supports_timescale_marks : false,
                    supports_time : false,
                    supports_group_request: true,
                    timezone: "Asia/Shanghai",
                    supported_resolutions : this.supported_resolutions
                }
            },
            onSymbolResolvedCallbackParam (){
                var l = (this.coins[this.rmb] && this.coins[this.rmb].accuracy) || 4;
                return {
                    name : this.xnb,
                    ticker : this.xnb + '_' + this.rmb,
                    description : this.upperCase(this.xnb + '/' + this.rmb),
                    // exchange : 'RDB.ONE',
                    // listed_exchange : 'RDB.ONE',
                    sector : this.upperCase(this.rmb),
                    has_intraday  : true,
                    has_seconds  : true,
                    has_daily  : true,
                    // has_no_volume  : true,
                    has_weekly_and_monthly  : true,
                    intraday_multipliers : ['1', '15', '60'],
                    minmov : 1,
                    pricescale : Math.pow(10, l),
                    volume_precision : l,
                    session : "24x7",
                    // timezone : "Asia/Shanghai",
                    timezone: "Asia/Shanghai",
                    supported_resolutions : this.supported_resolutions,
                };
            },
            onReady (callback){
                this.iframeState = false;
                // console.log(this.chartBarState);
                if(this.chartBarState){
                    setTimeout(()=>{
                        this.onReadyCallbackState = false;
                        callback(this.onReadyCallbackParam());
                    }, 0);
                };
                this.onReadyCallback = callback;
            },

            searchSymbols (userInput, exchange, symbolType, onResultReadyCallback){
            },
            resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback){
                setTimeout(() => {
                    onSymbolResolvedCallback(this.onSymbolResolvedCallbackParam());
                }, 50);
            },
            getBars (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest){
                this.onHistoryCallback = onHistoryCallback;
                // this.firstDataRequest = firstDataRequest;
                // console.log('getBars chartInitState', this.chartInitState);
                if(firstDataRequest){
                    if(this.chartInitState){
                        if(this.chartBarState){
                            if(this.chartBar.length){
                                onHistoryCallback(this.chartBar, { noData : false });
                            }else{
                                onHistoryCallback([], { noData : true });
                            };
                        };
                        this.$store.commit('chartInitState', false);
                    }else{
                        this.$store.commit('resolution', resolution);
                    };
                }else{
                    onHistoryCallback([], { noData : true });
                };
            },
            subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback){
                this.onRealtimeCallback = onRealtimeCallback;
            },
            unsubscribeBars (subscriberUID){
            },
            calculateHistoryDepth (resolution, resolutionBack, intervalBack){
                // console.log('calculateHistoryDepth');
                // console.log(resolution, resolutionBack, intervalBack);
                if(resolution == 1 || resolution == 15 || resolution == 60){
                    return {
                        resolutionBack: 'D',
                        intervalBack: 365
                    };
                }else{
                    return {
                        resolutionBack: 'M',
                        intervalBack: 12
                    };
                };
            },
            getMarks (symbolInfo, startDate, endDate, onDataCallback, resolution){

            },
            getTimescaleMarks (symbolInfo, startDate, endDate, onDataCallback, resolution){
            },
            getServerTime (callback){
                // callback(Math.floor(new Date().getTime()) / 1000);
            },
            datafeed (){
                var {onReady, searchSymbols, resolveSymbol, getBars, subscribeBars, unsubscribeBars, calculateHistoryDepth, getMarks, getTimescaleMarks, getServerTime} = this;
                return {
                    onReady, searchSymbols, resolveSymbol, getBars, subscribeBars, unsubscribeBars, calculateHistoryDepth, getMarks, getTimescaleMarks, getServerTime
                };
            },
            setWidget (){
                var {bg, borderColor, up, down} = this;
                // console.log(new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"));
                this.widget = new TradingView.widget({
                    symbol: this.upperCase(this.xnb),
                    legend_context_menu:'off',
                    interval: this.resolution,
                    datafeed: this.datafeed(),
                    library_path: process.env.NODE_ENV == 'development' ?  "/static/js/chart/" : '/public/home/static/js/chart/',
                    locale: this.local =="zhtw" ? "zh_TW" : this.local ,
                    timezone: "Asia/Shanghai",
                    charts_storage_api_version: "1.1",
                    client_id: 'tradingview.com',
                    user_id: 'public_user_id',

                    // debug: true,

                    enabled_features : [
                    ],

                    // "header_widget"
                    disabled_features: [
                        "left_toolbar",
                        'timeframes_toolbar',
                        'header_symbol_search',
                        'header_saveload',
                        'header_saveload_to_the_right',
                        'header_compare',
                        'header_undo_redo',
                        'header_screenshot',
                        // 'header_resolutions',
                        // 'header_interval_dialog_button',
                        // 'show_interval_dialog_on_key_press',
                        'display_market_status',
                        "save_chart_properties_to_local_storage",
                        "volume_force_overlay",
                        "items_favoriting",
                        // "header_chart_type",
                        // "header_settings",
                        // "header_indicators",
                        // "header_fullscreen_button",

                        // "dont_show_boolean_study_arguments"
                        

                    ],
                    overrides: {                      
                        'paneProperties.legendProperties.showLegend': false,

                        "volumePaneSize": "small",
                        'paneProperties.background' : bg,
                        'paneProperties.vertGridProperties.color' : borderColor,
                        'paneProperties.horzGridProperties.color' : borderColor,

                        'scalesProperties.textColor' : '#888888',
                        'scalesProperties.lineColor' : borderColor,

                        'mainSeriesProperties.haStyle.borderColor' : borderColor,
                        'mainSeriesProperties.candleStyle.upColor' : up,
                        // 'mainSeriesProperties.candleStyle.borderUpColor' : up,
                        // 'mainSeriesProperties.candleStyle.borderDownColor' : down,
                        'mainSeriesProperties.candleStyle.downColor' : down,
                        'mainSeriesProperties.candleStyle.wickUpColor' : up,
                        'mainSeriesProperties.candleStyle.wickDownColor' : down,
                        'mainSeriesProperties.barStyle.upColor' : up,
                        'mainSeriesProperties.barStyle.downColor' : down,
                        'timeScale.rightOffset' : 2,
                        'paneProperties.topMargin' : 10,
                        // "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)"
                    },
                    chart_zoom: 10,
                    favorites: {
                        intervals: this.supported_resolutions,
                    },
                    studies_overrides : {
                        "macd.macd.color": "#ffff0b",
                        "macd.Signal.color": "#ff80ff",
                        "stoch.%k.color": "#ffff0b",
                        "stoch.%d.color": "#ff80ff",
                        "stoch.hlines background.transparency": 90,
                    },
                    // studies_access : {
                    //     type: "white",
                    //     tools: [
                    //         {
                    //             name: "MACD"
                    //         },
                    //     ]
                    // },
                    drawings_access: { type: 'block', tools: [
                        { name: "Regression Trend" },
                    ] },
                    study_count_limit: 10,
                    // custom_css_url : './css/chart.css',
                    fullscreen: false,
                    autosize: true,
                    toolbar_bg: bg,
                    loading_screen: { backgroundColor: bg , foregroundColor : borderColor},
                    container_id: "chart_container",
                    // header_widget:{
                    //     dont_show_boolean_study_arguments:'on'
                    // }
                    

                });

                this.widget.onChartReady(() => {
                    // this.widget.chart().createStudy('MACD', false, false);
                    // this.widget.chart().createStudy('Moving Average', false, false, [1], null, {
                    //
                    // });
                    // this.widget.chart().createStudy('Moving Average', false, false, [7], null, {
                    //     'plot.color' : '#ff80ff'
                    // });
                    // this.widget.chart().createStudy('Moving Average', false, false, [30], null, {
                    //     'plot.color' : '#ffff0b'
                    // });
                    // this.widget.chart().createStudy('Stochastic', false, false);
                });
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/var.scss";
    .trade-chart{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: $tradeMenuH;
        z-index: 1;
    }
    #chart_container{
        @include fullWH;
        z-index: 1;
        position: relative;
        iframe{
            display: block;
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            background: $tradeBg;
        }
    }
    .chart_container-bg{
        position: absolute;
        z-index: 999999999;
        background: $tradeBg;
        @include fullWH;
        left: 0;
        top: 0;
    }
</style>
