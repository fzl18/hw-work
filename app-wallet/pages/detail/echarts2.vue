<template>
	<view class="container">
		<view class="canvasView" style="padding:20upx;">
			<mpvue-echarts :echarts="echarts" :onInit="lineInit" canvasId="line" ref="lineChart" />
		</view>
	</view>
</template>

<script>
	import * as echarts from '../../components/echarts/echarts.simple.min.js';
	import mpvueEcharts from '../../components/mpvue-echarts/src/echarts.vue';

	const cityList = [{
		value: 55,
		name: '北京'
	}, {
		value: 38,
		name: '上海'
	}, {
		value: 20,
		name: '广州'
	}];

	let pieOption = {
		animation: false,
		backgroundColor: '#fff',
		color: ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
		series: [{
			label: {
				normal: {
					fontSize: 14
				}
			},
			type: 'pie',
			center: ['50%', '50%'],
			radius: [0, '60%'],
			data: [],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 2, 2, 0.3)'
				}
			}
		}]
	};

	let lineOption = {
		animation: true,
		color: ['#00ffff', '#ffffcc'],
		grid: {
			x: 35,
			x2: 10,
			y: 30,
			y2: 25
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			axisLine:{
			  lineStyle:{
			    color:'#7c7c7c',
			  }
			},
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		}],
		yAxis: [{
			type: 'value',
			splitLine:{
				show:false
			},
			splitArea: {
				show: false
			},
			axisLine:{
			    lineStyle:{
			      color:'#7c7c7c',
			    }
			  },
			color:'#fff'
		}],
		series: [{
			name: '走1',
			type: 'line',
			data: [6.0, 76.9, 55.0, 877.2, 25.6, 760.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
		}, {
			name: '走2',
			type: 'line',
			data: [20.6, 8.9, 76.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		}]
	};
	
	export default {
		data() {
			return {
				echarts: echarts,
				updateStatus: false
			}
		},
		onLoad(option) {
			pieOption.series[0].data = cityList.slice(0)
			uni.setNavigationBarTitle({
				title: option.token + '走势'
			})
		},
		methods: {
			goBrowser() {
				// #ifdef APP-PLUS
				plus.runtime.openURL('https://github.com/F-loat/mpvue-echarts');
				// #endif
				// #ifdef MP-WEIXIN
				uni.showModal({
					content: '请复制链接在浏览器里打开',
					showCancel: false
				})
				// #endif
			},
			updatePie() {
				// 参考 mpvue-charts 的懒加载示例
				// https://github.com/F-loat/mpvue-echarts/blob/master/examples/lazyLoad.vue

				if (this.updateStatus) {
					return;
				}
				pieOption.series[0].data.push({
					value: 20,
					name: '武汉'
				});
				pieOption.series[0].data.push({
					value: 10,
					name: '杭州'
				});
				this.$refs.pieChart.init();
				this.updateStatus = true;
			},
			pieInit(canvas, width, height) {
				let pieChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(pieChart)

				pieChart.setOption(pieOption)
				return pieChart
			},
			lineInit(canvas, width, height) {
				let lineChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(lineChart)

				lineChart.setOption(lineOption)
				return lineChart
			}
		},
		components: {
			mpvueEcharts
		}
	}
</script>

<style>
	page,
	view {
		display: flex;
		/* uni-app默认使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。若不需要flex布局可删除本行*/
	}

	page {
		min-height: 100%;
		background: #333333;
	}

	.page-section-title {
		padding: 0 30upx;
	}

	.title {
		margin-left: 30upx;
		color: #8f8f94;
	}

	.container {
		padding-bottom: 30upx;
		box-sizing: border-box;
	}

	.container,
	.canvasView {
		flex: 1;
		flex-direction: column;
		height:600upx;
	}
	.navigate {
		color: #007AFF;
	}

	.canvas-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.update-btn {
		margin-right: 30upx;
	}
</style>
