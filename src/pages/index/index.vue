<template>
  <view class="container">
    <view>
      <view class="dashboard-container">
        <canvas canvas-id="gaugeCanvas" class="gauge-canvas"></canvas>
        <text class="emoji">{{ emoji }}</text>
        <text class="pressure-text">{{ pressureLevel }}</text>
        <text class="circle-text">实时压力：{{ pressureLevel }}，{{ timeAgo }} 分钟之前</text>
      </view>
    </view>

    <!-- <view class="bpm-section">
      <text class="bpm-text">BPM：{{ bpm }}</text>
    </view> -->

    <button type="primary" @click="generateMusic">生成音乐</button>
  </view>
  <view class="tips">
    <p class="title">今日心情小贴士</p>
    <p class="content">{{ tip }}</p>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
// 响应式数据
const pressure = ref(40)
const pressureLevel=ref('B')
const musicUrl = ref('')
const bpm = ref(0)
const timeAgo = ref(6)
const emoji = ref('😊')
const pressureHistory = ref([41, 30, 28, 44])
const timeLabels = ref(['01:28', '11:44', '13:30', '15:45'])
const tips = {
  A: '保持放松，深呼吸，有助于缓解压力。',
  B: '适量运动，散步或拉伸可以帮助放松身心。',
  C: '尝试冥想或听轻松的音乐，舒缓情绪。',
  D: '与朋友交流，分享你的感受，获得支持。',
  E: '保证充足睡眠，调整作息，提高精力。'
};
const tip = computed(() => tips[pressureLevel.value] || '保持积极心态，迎接每一天！');
// 生命周期
onMounted(() => {
  checklogin()
  loadHistoryData()
  setTimeout(() => {
    drawGauge(pressure.value)
  }, 500)
  drawLineChart()
})


const onPressureChange = (e) => {
  pressure.value = e.detail.value
  drawGauge(pressure.value)
}

const loadHistoryData = () => {
  try {
    const history = uni.getStorageSync('pressureHistory') || []
    pressureHistory.value = history.slice(-10)
    drawLineChart()
  } catch (e) {
    console.error('本地存储读取失败:', e)
  }
}

const generateMusic = async () => {
  uni.showLoading({ title: '生成中音乐...', mask: true })
  setTimeout(()=>{
    uni.showToast({
      title: '开始播放',
      icon: 'success'
    })
  },500);
//   try {
//     const res = await uni.request({
//       url: 'http://192.168.47.1:5000/generate',
//       method: 'POST',
//       data: { pressure: pressure.value },
//     })

//     if (res[1].data?.music_url) {
//       initializeAudio(res[1].data.music_url)
//       updateVisualData(res[1].data)
//     } else {
//       uni.showToast({ title: '服务响应格式错误', icon: 'none' })
//     }
//   } catch (err) {
//     uni.showToast({ title: `网络错误: ${err.errMsg}`, icon: 'none' })
//   } finally {
//     uni.hideLoading()
//   }
// }

// const initializeAudio = (musicPath) => {
//   const audioCtx = uni.createInnerAudioContext()
//   const fullUrl = `http://192.168.47.1:5000${encodeURI(musicPath)}?t=${Date.now()}`

//   audioCtx.onCanplay(() => {
//     audioCtx.play()
//   })

//   audioCtx.onError((err) => {
//     console.error('播放失败:', err)
//     uni.showToast({ title: `音频错误: ${err.errCode}`, icon: 'none' })
//   })

//   musicUrl.value = fullUrl
// }

// const updateVisualData = (data) => {
//   bpm.value = Math.round(data.visual_data?.bpm) || 0
//   saveHistoryData()
// }

// const saveHistoryData = () => {
//   const newRecord = {
//     pressure: pressure.value,
//     timestamp: Date.now(),
//   }

//   pressureHistory.value = [...pressureHistory.value, newRecord].slice(-10)

//   try {
//     uni.setStorageSync('pressureHistory', pressureHistory.value)
//   } catch (e) {
//     console.error('本地存储写入失败:', e)
//   }
}

const onAudioError = (e) => {
  const errorMapping = {
    10001: '系统资源不足，请关闭其他应用',
    10002: '网络连接不稳定，请重试',
    10003: '音频格式不兼容，请更新客户端',
    10004: '解码失败，建议重新生成',
  }

  uni.showToast({
    title: errorMapping[e.detail.errCode] || '未知播放错误',
    icon: 'none',
    duration: 3000,
  })
}

const drawGauge = (pressureValue) => {
  const ctx = uni.createCanvasContext('gaugeCanvas')
  const centerX = 150
  const centerY = 150
  const radius = 120
  const startAngle = 135
  const endAngle = 405
  const gradient = ctx.createLinearGradient(20, 0, 180, 0)

  gradient.addColorStop(0, '#ff6a00')
  gradient.addColorStop(0.5, '#ff00ff')
  gradient.addColorStop(1, '#00c3ff')

  ctx.clearRect(0, 0, 300, 300)

  // 画背景刻度线
  ctx.setStrokeStyle('#999')
  ctx.setLineWidth(1)
  const ticks = [0, 45, 135, 180, 225, 270, 315]
  ticks.forEach((angle) => {
    const rad = (angle * Math.PI) / 180
    const x1 = centerX + (radius - 10) * Math.cos(rad)
    const y1 = centerY + (radius - 10) * Math.sin(rad)
    const x2 = centerX + (radius - 20) * Math.cos(rad)
    const y2 = centerY + (radius - 20) * Math.sin(rad)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  })

  // 画渐变圆环
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180, false)
  ctx.setStrokeStyle(gradient)
  ctx.setLineWidth(25)
  ctx.setLineCap('round')
  ctx.stroke()

  // 计算指示点位置
  const progressAngle = startAngle + (endAngle - startAngle) * (pressureValue / 100)
  const radian = (progressAngle * Math.PI) / 180
  const dotX = centerX + radius * Math.cos(radian)
  const dotY = centerY + radius * Math.sin(radian)

  // 画指示点
  ctx.beginPath()
  ctx.arc(dotX, dotY, 8, 0, Math.PI * 2, false)
  ctx.setFillStyle('white')
  ctx.setStrokeStyle('#ff6a00')
  ctx.setLineWidth(4)
  ctx.fill()
  ctx.stroke()

  ctx.draw()

  // 更新表情
  updateEmoji(pressureValue)
}

const updateEmoji = (value) => {
  if (value < 30) emoji.value = '😊'
  else if (value < 60) emoji.value = '😐'
  else if (value < 80) emoji.value = '😟'
  else emoji.value = '😨'
}

const drawLineChart = () => {
  const ctx = uni.createCanvasContext('lineChart')
  const canvasWidth = 600
  const canvasHeight = 400

  // 1. 绘制背景
  ctx.setFillStyle('#FFFFFF')
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 2. 绘制坐标轴
  ctx.beginPath()
  ctx.setStrokeStyle('#ddd')
  ctx.setLineWidth(1)

  // Y轴
  ctx.moveTo(60, 20)
  ctx.lineTo(60, canvasHeight - 40)

  // X轴
  ctx.moveTo(60, canvasHeight - 40)
  ctx.lineTo(canvasWidth - 20, canvasHeight - 40)
  ctx.stroke()

  // 3. 绘制数据点 & 折线
  ctx.beginPath()
  ctx.setStrokeStyle('#FF4040')
  ctx.setLineWidth(3)

  pressureHistory.value.forEach((value, index) => {
    const x = 60 + (index * (canvasWidth - 80)) / (pressureHistory.value.length - 1)
    const y = canvasHeight - 40 - (value / 100) * (canvasHeight - 80)

    // 绘制点
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.setFillStyle('#FF4040')
    ctx.fill()

    // 绘制文字
    ctx.setFontSize(20)
    ctx.setFillStyle('#666')
    ctx.fillText(timeLabels.value[index], x - 30, canvasHeight - 20)

    // 绘制折线
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  ctx.draw()
}
const userStore=useUserStore()
const checklogin=()=>{
  // console.log(userStore.account)
  if(!userStore.account){
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    uni.redirectTo({
      url:'/pages/register/register',
    })
  }
}
</script>

<style>
page {
  background: linear-gradient(135deg, #cce5ff,#ffffff );
  color: #2c3e50;
  height: 100vh;
}
.container {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  
}

.pressure-input {
  margin: 40rpx 0;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
}
.main-content {
  flex: 1;
  display: flex;
  justify-content: center; 
  align-items: center;
  position: relative;
}
.dashboard-container {
  width: 600rpx;
  height: 600rpx;
  transform: translateX(15%) translateY(50%);
}

.gauge-canvas {
  width: 300px;
  height: 300px;
  display: block;
  background-color: transparent;
}

.emoji {
  position: absolute;
  font-size: 80px;
  top: 48%;
  left: 50%;
  transform: translate(-65%, -50%);
}

.pressure-text {
  position: absolute;
  font-size: 34px;
  font-weight: bold;
  color: #ff6a00;
  top: 65%;
  left: 50%;
  transform: translate(-90%, 30%);
}

.circle-text {
  position: absolute;
  font-size: 12px;
  color: #666;
  top: 35%;
  left: 50%;
  transform: translate(-60%, -900%);
}

.bpm-section {
  text-align: center;
  margin: 200rpx 0;
}

.bpm-text {
  display: inline-block;
  font-size: 36rpx;
  color: #197dff;
  font-weight: bold;
  background: #f8f8f8;
  padding: 15rpx 50rpx;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 12rpx rgba(115, 64, 255, 0.2);
}

button[type='primary'] {
  margin-top: 400rpx;
  background-color: #4a6fa5;
  color: white;
}

audio {
  width: 80%;
  margin-top: 50rpx;
}
.tips {
  padding: 15px;
  background: linear-gradient(135deg, #f0f8ff, #dbeafe);
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;
  margin: 20px auto;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #0077b6;
  margin-bottom: 10px;
}

.content {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}
</style>
