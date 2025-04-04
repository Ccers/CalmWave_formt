<template>
  <view class="chat-container">
    <!-- 消息列表 -->
    <scroll-view class="chat-messages" scroll-y="true" :scroll-into-view="scrollTo">
      <view
        v-for="(msg, index) in messages"
        :key="index"
        :id="'msg-' + index"
        :class="['message-container', msg.role]"
      >
        <!-- 机器人头像 -->
        <image v-if="msg.role === 'bot'" class="avatar bot-avatar" src="/static/bot-avatar.png"></image>

        <!-- 消息内容 -->
        <view :class="['message', msg.role, 'animate-fade-in']">
          <text class="message-text">{{ msg.text }}</text>
        </view>

        <!-- 用户头像 -->
        <image v-if="msg.role === 'user'" class="avatar user-avatar" src="/static/avatar.jpg"></image>
      </view>
    </scroll-view>

    <!-- 输入框 -->
    <view class="chat-input">
      <input
        class="input-box animate-slide-up"
        v-model="userInput"
        placeholder="输入消息..."
        @confirm="sendMessage"
      />
      <button class="send-button animate-bounce" @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const messages = ref([
  { role: 'bot', text: '你好，我是小荔！请问有什么可以帮你的吗？' },
  { role: 'user', text: '我最近总是睡不好。' },
  { role: 'bot', text: '听到这个消息有些担心呢～失眠持续多久了呀？是难以入睡，还是容易半夜醒来呢？' },
  { role: 'user', text: '大概两周了，经常躺下1小时还睡不着，还会半夜惊醒两三次。' },
  { role: 'bot', text: '这样确实很影响状态呢！最近压力大吗？可以试试睡前用温水泡脚，或者听白噪音放松哦～' },
  { role: 'user', text: '工作压力挺大的...白噪音有什么推荐吗？' },
  { role: 'bot', text: '雨声、篝火声或海浪声都很受欢迎呢！我注意到您凌晨1点还在用手机，屏幕蓝光会影响褪黑素分泌哦，试试提前半小时放下手机吧✨' }
])
const userInput = ref('')
const marginTop = ref(0)
const scrollTo = ref('')

onMounted(() => {
  calculateTopHeight()
})

const sendMessage = () => {
  if (!userInput.value.trim()) return

  const messageIndex = messages.value.length
  messages.value.push({ role: 'user', text: userInput.value })

  nextTick(() => {
    scrollTo.value = 'msg-' + messageIndex
  })

  const userMessage = userInput.value
  userInput.value = ''

  setTimeout(() => {
    messages.value.push({ role: 'bot', text: `听起来你最近压力很大，失眠一定很难受💙。试试深呼吸、听点轻柔的音乐，或者和我聊聊，让心情放松下来。😊` })
    nextTick(() => {
      scrollTo.value = 'msg-' + (messages.value.length - 1)
    })
  }, 800)
}

const calculateTopHeight = () => {
  uni.getSystemInfo({
    success: function (res) {
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      marginTop.value = menuButtonInfo.top + menuButtonInfo.height + 10
    },
  })
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20rpx;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
}

/* 消息容器 */
.message-container {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

/* 机器人消息：头像在左 */
.message-container.bot {
  justify-content: flex-start;
}

/* 用户消息：头像在右 */
.message-container.user {
  justify-content: flex-end;
}

/* 头像样式 */
.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin: 0 10rpx;
}

/* 机器人头像 */
.bot-avatar {
  order: -1; /* 机器人头像始终在左 */
}

/* 用户头像 */
.user-avatar {
  order: 1; /* 用户头像始终在右 */
}

/* 消息气泡 */
.message {
  max-width: 75%;
  padding: 12rpx 15rpx;
  border-radius: 12rpx;
  margin: 8rpx 0;
  font-size: 30rpx;
  line-height: 1.4;
}

/* 用户消息（右侧蓝色气泡） */
.message.user {
  background: #0084ff;
  color: white;
  text-align: right;
  border-radius: 12rpx 12rpx 0 12rpx;
}

/* 机器人消息（左侧灰色气泡） */
.message.bot {
  background: #e5e5ea;
  color: black;
  border-radius: 12rpx 12rpx 12rpx 0;
}

/* 输入框 */
.chat-input {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10rpx);
  border-radius: 15rpx;
  padding: 12rpx;
}

.input-box {
  flex: 1;
  font-size: 30rpx;
  padding: 10rpx;
  border: none;
  background: transparent;
  outline: none;
}

.send-button {
  font-size: 30rpx;
  padding: 10rpx 20rpx;
  background: #0084ff;
  color: white;
  border: none;
  border-radius: 10rpx;
  transition: all 0.3s ease;
}
</style>
