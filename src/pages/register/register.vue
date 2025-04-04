<template>
  <div class="container">
    <div class="login-box">
      <!-- 头像和欢迎信息 -->
      <div class="avatar">
        <image
          src="/static/logo.png"
          mode="scaleToFill"
        />
      </div>
      <h2 class="welcome-text">欢迎回来</h2>
      <p class="sub-text">请登录您的账户以继续</p>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <i class="icon user"></i>
          <input type="text" v-model="account" placeholder="请输入用户名" required />
        </div>

        <div class="input-group">
          <i class="icon lock"></i>
          <input type="password" v-model="password" placeholder="请输入密码" required />
        </div>

        <div class="options">
          <label>
            <!-- <input type="checkbox" v-model="rememberMe" /> -->
            ⏹️记住我？
          </label>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>

        <button @click="handleLogin" class="login-button" >登录</button>
      </form>

      <!-- 其他登录方式 -->
      <p class="other-login-text">其他登录方式</p>
      <div class="social-icons">
        <button class="social">
          <img
            src="/static/wechat.png"
            style="width: 30px; height: 30px;"
          />
        </button>
        <button class="social">
          <img
            src="/static/qq.png"
            style="width: 30px; height: 30px;"
          />
        </button>
      </div>

      <!-- 注册 -->
      <p class="register-text">
        还没有账号？
        <a href="#" class="register-link">立即注册</a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { registerApi } from "@/utils/register"
export default {
  setup() {
    const account = ref("");
    const password = ref("");
    const rememberMe = ref(false);

    const handleLogin = async () => {
      console.log('点击登录按钮')
      if(!account.value || !password.value){
        uni.showToast({
          title:'请输入用户名和密码',
          icon:'none'
        });
        return ;
      }
      try{
        console.log("准备发送请求，账号：", account.value, "密码：", password.value);
        const res=await registerApi({
          account:account.value,
          password:password.value,
        })
        console.log(res)
        uni.showToast({
          title:'登录成功',
          icon:'success'
        });
      }
      catch(error){
        console.log(error)
        uni.showToast({
          title:'登录失败',
          icon:'none'
        });
      }
    };

    return { account, password, rememberMe, handleLogin };
  },
};
</script>

<style scoped>
page {
  background: linear-gradient(135deg, #cce5ff,#ffffff );
  color: #2c3e50;
}
/* 容器样式 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #cce5ff;
  padding-left: 50rpx;
  padding-right: 50rpx;
}

/* 登录框 */
.login-box {
  background: white;
  padding: 30px;
  width: 360px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 头像 */
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.user-icon {
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
}

/* 文本 */
.welcome-text {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.sub-text {
  color: #757575;
  font-size: 14px;
}

/* 输入框 */
.input-group {
  position: relative;
  margin-top: 15px;
}

.input-group input {
  width: 90%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.user {
  background: url('https://img.icons8.com/ios-filled/50/000000/user.png') no-repeat center / cover;
}

.lock {
  background: url('https://img.icons8.com/ios-filled/50/000000/lock.png') no-repeat center / cover;
}

/* 选项（记住我 & 忘记密码） */
.options {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
}

.forgot-password {
  color: #2c3e50;
  text-decoration: none;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 10px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.login-button:hover {
  background: #2c3e50;
}

/* 其他登录方式 */
.other-login-text {
  margin-top: 15px;
  font-size: 14px;
  color: #757575;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.social {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  overflow: hidden;
}

/* 注册 */
.register-text {
  margin-top: 15px;
  font-size: 14px;
}

.register-link {
  color: #2c3e50;
  text-decoration: none;
}
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  cursor: pointer;
}
</style>
