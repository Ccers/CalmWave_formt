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
    <view class="chat-input" :style="{ marginBottom: inputMargin }">
      <input
        class="input-box animate-slide-up"
        v-model="userInput"
        placeholder="输入消息..."
        @confirm="sendMessage"
        @focus="adjustInputMargin"
        @blur="resetInputMargin"
      />
      <button class="send-button animate-bounce" @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { ai_askAPI } from '@/utils/ai_askAPI'
// import type { AskParam, AskResponseParam } from '@/types/ai-ask'

const messages = ref([
  { role: 'bot', text: '你好，我是小荔！请问有什么可以帮你的吗？' }
])
const userInput = ref('')
const scrollTo = ref('')
const inputMargin = ref('0px')
const userStore=useUserStore()

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const messageIndex = messages.value.length
  messages.value.push({ role: 'user', text: userInput.value })

  nextTick(() => {
    scrollTo.value = 'msg-' + messageIndex
  })

  const userMessage = userInput.value
  userInput.value = ''

  try{
    const params={
      account:userStore.account,
      question:userMessage
    }
    console.log(params)
    const response= await ai_askAPI(params)
    console.log(response.result)
    if(response.result && response.result.answer){
      messages.value.push({
        role:'bot',
        text:response.result.answer
      })
    } else {
      messages.value.push({
        role: 'bot', 
        text: '抱歉，我暂时无法回答这个问题。请稍后再试。' 
      })
    }
  } catch(error){
      console.error('API请求失败:', error)
      messages.value.push({ 
      role: 'bot', 
      text: '网络似乎不太稳定，请检查连接后重试。' 
    })
  }

  // setTimeout(() => {
  //   messages.value.push({ role: 'bot', text: `听起来你最近压力很大，失眠一定很难受💙。试试深呼吸、听点轻柔的音乐，或者和我聊聊，让心情放松下来。😊` })
  //   nextTick(() => {
  //     scrollTo.value = 'msg-' + (messages.value.length - 1)
  //   })
  // }, 800)
}

const adjustInputMargin = () => {
  inputMargin.value = '50px'; // 适当调整这个值，避免整个聊天记录上移过多
}

const resetInputMargin = () => {
  inputMargin.value = '0px';
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
  transition: margin-bottom 0.3s ease;
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
