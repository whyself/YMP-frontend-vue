<template>
  <a-card title="用户登录" style="max-width:400px;margin:40px auto;">
  <a-form :model="form" :rules="rules" ref="loginForm">
      <a-form-item label="用户名/邮箱" name="usernameOrEmail" :rules="rules.usernameOrEmail">
        <a-input v-model:value="form.usernameOrEmail" placeholder="请输入用户名或邮箱" />
      </a-form-item>
      <a-form-item label="密码" name="password" :rules="rules.password">
        <a-input-password v-model:value="form.password" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" block @click="onLogin">登录</a-button>
        <div style="margin-top:8px;text-align:right;">
          <a @click="$router.push('/user/register')">没有账号？去注册</a>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../requests';
import { message } from 'ant-design-vue';

const router = useRouter();
const form = ref({ usernameOrEmail: '', password: '' });
const rules = {
  usernameOrEmail: [ { required: true, message: '请输入用户名或邮箱', trigger: 'blur' } ],
  password: [ { required: true, min: 6, message: '密码至少6位', trigger: 'blur' } ]
};

const loginForm = ref();

const onLogin = () => {
  loginForm.value.validate().then(async () => {
    try {
      const res = await api.post('/user/login', {
        usernameOrEmail: form.value.usernameOrEmail,
        password: form.value.password
      });
      if (res.data && res.data.success && res.data.token && res.data.user && res.data.user.username && res.data.user.email) {
        // 保存token、用户名和邮箱到localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('email', res.data.user.email);
        message.success('登录成功');
        router.push('/'); // 跳转主页
      } else {
        message.error('登录失败：未获取到用户信息');
      }
    } catch (err: any) {
      let msg = '登录请求失败';
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      } else if (typeof err === 'object') {
        msg = JSON.stringify(err);
      }
      message.error(msg);
    }
  }).catch((err: any) => {
    // 校验失败时弹窗提示
    if (err && err.errorFields && err.errorFields.length > 0) {
      message.error(err.errorFields[0].errors[0] || '请检查表单输入');
    } else {
      message.error('请检查表单输入');
    }
  });
};
</script>

<style scoped>
</style>
