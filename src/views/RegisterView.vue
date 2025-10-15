<template>
  <a-card title="用户注册" style="max-width:400px;margin:40px auto;">
  <a-form :model="form" :rules="rules" ref="registerForm">
      <a-form-item label="用户名" name="username" :rules="rules.username">
        <a-input v-model:value="form.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="邮箱" name="email" :rules="rules.email">
        <a-input v-model:value="form.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="密码" name="password" :rules="rules.password">
        <a-input-password v-model:value="form.password" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" block @click="onRegister">注册</a-button>
        <div style="margin-top:8px;text-align:right;">
          <a @click="$router.push('/user/login')">已有账号？去登录</a>
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
const form = ref({ username: '', email: '', password: '' });
const rules = {
  username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
  email: [ { required: true, type: 'email', message: '请输入有效邮箱', trigger: 'blur' } ],
  password: [
    { required: true, min: 6, message: '密码至少6位', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        if (!value) return Promise.resolve();
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        if (!hasLetter || !hasNumber) {
          return Promise.reject('密码需包含字母和数字');
        }
        return Promise.resolve();
      },
      trigger: 'blur',
    }
  ]
};

const registerForm = ref();

const onRegister = () => {
  registerForm.value.validate()
    .then(async () => {
      try {
        const res = await api.post('/user/register', form.value);
        if (res.data && res.data.success) {
          message.success('注册成功，请登录');
          router.push('/user/login');
        } else {
          message.error(res.data.message || '注册失败');
        }
      } catch (err: any) {
        console.error(err);
        let msg = '注册请求失败';
        if (err?.response?.data?.message) {
          msg = err.response.data.message;
        } else if (err?.message) {
          msg = err.message;
        } else if (typeof err === 'object') {
          msg = JSON.stringify(err);
        }
        message.error(msg);
      }
    })
    .catch((err: any) => {
      console.error('表单校验失败:', err);
      // 校验失败时弹窗提示具体原因
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
