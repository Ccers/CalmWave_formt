<template>
  <view class="container">
    <!-- 标题 -->
    <view class="title">HRV 报表</view>

    <!-- 时间筛选按钮 -->
    <view class="time-filter">
      <button
        v-for="(label, index) in timeRanges"
        :key="index"
        :class="['time-button', { active: selectedRange === label }]"
        @click="setTimeRange(label)"
      >
        {{ label }}
      </button>
    </view>

    <!-- 更新时间 -->
    <view class="update-time">更新时间: {{ updateTime }}</view>

    <!-- 玻璃卡片 -->
    <view class="glass-card animate-fade-in" style="width:95%; height:600rpx;display:flex;justify-content:center">
      <canvas class="chart" canvas-id="hrvChart" id="hrvChart"></canvas>
    </view>

    <!-- 低压力占比 -->
    <view class="low-stress-container animate-slide-up">
      <text class="low-stress-label">低压力时段占比：</text>
      <text class="low-stress-value">{{ lowStressPercentage }}%</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import uCharts from '@qiun/ucharts/u-charts.js' // 假设使用 uCharts 作为绘图库

const chartData = ref([
  { time: '01:28', value: 30 },
  { time: '02:00', value: 35 },
  { time: '02:30', value: 32 },
  { time: '03:00', value: 38 },
  { time: '03:30', value: 42 },
  { time: '04:00', value: 36 },
  { time: '11:44', value: 50 },
])

const updateTime = ref('11:44')
const lowStressPercentage = ref(0)
const timeRanges = ref(["日", "周", "月", "6个月"])
const selectedRange = ref("日")

const setTimeRange = (range) => {
  selectedRange.value = range
  console.log(`选择了 ${range} 时间范围`) // 这里可以加入数据筛选逻辑
}

const calculateLowStressPercentage = () => {
  const threshold = 40
  const lowStressCount = chartData.value.filter((item) => item.value < threshold).length
  const totalCount = chartData.value.length
  lowStressPercentage.value = ((lowStressCount / totalCount) * 100).toFixed(1)
}

const drawChart = () => {
  uni.getSystemInfo({
    success: (res) => {
      const windowWidth = res.windowWidth
      const context = uni.createCanvasContext('hrvChart')

      chart = new uCharts({
        context,
        canvasId: 'hrvChart',
        type: 'line',
        categories: chartData.value.map((item) => item.time),
        series: [
          {
            name: 'HRV',
            data: chartData.value.map((item) => item.value),
            format: (val) => val.toFixed(0),
            color: '#007BFF', // 科技感蓝色
          },
        ],
        xAxis: { disableGrid: false, fontColor: '#333', lineColor: '#aaa', type: 'calibration' },
        yAxis: { title: 'HRV值', format: (val) => val.toFixed(0), min: 20, fontColor: '#333' },
        width: windowWidth,
        height: 300,
        dataLabel: true,
        dataPointShape: true,
        background: 'transparent',
        legend: false,
      })

      context.draw()
    },
  })
}

onMounted(() => {
  calculateLowStressPercentage()
  drawChart()
})
</script>

<style scoped>
/* 🌟 浅色渐变背景 */
.container {
  background: linear-gradient(135deg, #cce5ff, #ffffff);
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

/* 标题 */
.title {
  font-size: 42rpx;
  font-weight: bold;
  text-transform: uppercase;
  color: #007BFF;
  text-shadow: 1px 1px 5px rgba(0, 123, 255, 0.5);
  margin-bottom: 50rpx;
}

/* 更新时间 */
.update-time {
  font-size: 30rpx;
  margin-bottom: 20rpx;
  color: #555;
}

/* 🌟 时间筛选按钮 */
.time-filter {
  display: flex;
  gap: 15rpx;
  width: 50;
  margin-bottom: 20rpx;
}

.time-button {
  flex: 1;
  min-width: 150rpx;
  font-size: 28rpx;
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
  border: 2rpx solid #007BFF;
  color: #007BFF;
  background: transparent;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 10rpx rgba(0, 123, 255, 0.2);
}

.time-button:hover {
  background: #007BFF;
  color: white;
  transform: scale(1.05);
}

.time-button.active {
  background: #007BFF;
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(0, 123, 255, 0.4);
}

/* 🌟 玻璃拟态卡片 */
.glass-card {
  width: 85%;
  height: 320rpx;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s ease-in-out;
}

/* 玻璃卡片悬停效果 */
.glass-card:hover {
  transform: scale(1.02);
}

/* 图表 */
.chart {
  width: 90%;
  height: 90%;
}

/* 低压力占比 */
.low-stress-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 100rpx;
}

.low-stress-label {
  font-size: 30rpx;
  color: #555;
}

.low-stress-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff8800;
}

/* 🌟 动画效果 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 1.2s ease-out forwards;
}
</style>
