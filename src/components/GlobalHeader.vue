<template>
    <div id="globalHeader">
        <a-row :wrap="false">
            <a-col flex="200px">
                <div class="title-bar">
                    <img src="@/assets/logo.png" alt="logo" class="logo" />
                    <div class="title">语雀消息推送</div>
                </div>
            </a-col>
            <a-col flex="auto">
                <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick" />
            </a-col>
            <a-col flex="160px">
                <div class="user-login-status btn-group">
                    <template v-if="isLogin">
                        <span class="welcome-user">欢迎 {{ username }} 用户</span>
                        <a-button @click="logout">退出</a-button>
                    </template>
                    <template v-else>
                        <a-button type="primary" @click="() => router.push('/user/login')" style="margin-top: 16px;">登录</a-button>
                        <a-button @click="() => router.push('/user/register')" style="margin-top: 16px;">注册</a-button>
                    </template>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue';
import { HomeOutlined, CrownOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const doMenuClick = ({ key }: { key: string }) => {
    router.push({
        path: key,
    });
};

const current = ref<string[]>([router.currentRoute.value.path]);
router.afterEach((to) => {
    current.value = [to.path];
});

const items = [
    {
        key: '/',
        icon: () => h(HomeOutlined),
        label: '主页',
        title: '主页',
    },
    {
        key: '/subscriptions',
        icon: () => h(CrownOutlined),
        label: '订阅管理',
        title: '订阅管理',
    },
    {
        key: 'others',
        label: h(
            'a',
            {
                href: 'https://nova.yuque.com/r/organizations/homepage',
                target: '_blank',
            },
            '关于我们',
        ),
        title: '关于我们',
    },
];

const username = ref(localStorage.getItem('username') || '用户');
const isLogin = ref(!!localStorage.getItem('token'));

function updateLoginState() {
    isLogin.value = !!localStorage.getItem('token');
    username.value = localStorage.getItem('username') || '用户';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    updateLoginState();
    router.push('/user/login');
}

// 监听路由变化，防止手动跳转后状态不同步
router.afterEach(() => {
    updateLoginState();
});
</script>

<style scoped>
.title-bar {
    display: flex;
    align-items: center;
}

.btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin: 0;
}
.welcome-user {
    margin-right: 0;
    font-weight: 500;
    font-size: 16px;
    color: #1890ff;
    white-space: nowrap;
}

.logo {
    width: 55px;
    height: 55px;
}

.title {
    font-size: 18px;
    margin-left: 16px;
    color: black;
}
</style>