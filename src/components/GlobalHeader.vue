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
            <a-col flex="80px">
                <div class="user-login-status">
                    <a-button type="primary" href="/user/login">登录</a-button>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
<script setup>
import { h, ref } from 'vue';
import { HomeOutlined, CrownOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const doMenuClick = ({ key }) => {
    router.push({
        path: key,
    });
};

const current = ref(['']);

router.afterEach((to) => {
    current.value = [to.path];
});

const items = ref([
    {
        key: '/',
        icon: () => h(HomeOutlined),
        label: '主页',
        title: '主页',
    },
    {
        key: '/user/login',
        label: '用户登录',
        title: '用户登录',
    },
    {
        key: '/user/register',
        label: '用户注册',
        title: '用户注册',
    },
    {
        key: '/admin/userManage',
        icon: () => h(CrownOutlined),
        label: '用户管理',
        title: '用户管理',
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
]);
</script>
<style scoped>
.title-bar {
    display: flex;
    align-items: center;
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