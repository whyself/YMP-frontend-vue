<template>
  <div style="max-width:900px;margin:40px auto;">
    <h1 style="text-align:center;">我的订阅管理</h1>
    <div style="margin-top:24px;">
      <div v-for="item in subscriptions" :key="item.title" style="margin-bottom:16px;">
            <a-card style="height:48px;display:flex;align-items:center;">
              <div style="display:flex;align-items:center;gap:32px;width:100%;height:100%;">
                <div style="font-size:15px;font-weight:bold;width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  {{ item.title }}
                </div>
                <div style="color:#555;width:100px;white-space:nowrap;font-size:14px;">
                  <b>作者：</b>{{ item.author ? item.author : '所有' }}
                </div>
                <div style="color:#555;width:300px;white-space:nowrap;font-size:14px;">
                  <b>包含子文档：</b>{{ item.single ? '否' : '是' }}
                </div>
                <div style="flex:1;"></div>
                <a-popconfirm
                  title="确定要取消该订阅吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="() => handleUnsubscribe(item)"
                >
                  <a-button type="text" shape="circle" style="color:#ff4d4f;margin-right:8px;">
                    <CloseOutlined style="font-size:20px;vertical-align:middle;" />
                  </a-button>
                </a-popconfirm>
              </div>
            </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import myAxios from '../requests';
import { h } from 'vue';
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons-vue';
// 取消订阅
async function handleUnsubscribe(item: SubscriptionItem) {
  const email = localStorage.getItem('email') || '';
  if (!email) {
    message.error('未获取到当前用户邮箱');
    return;
  }
  try {
    await myAxios.post('/unsubscribe', {
      email: email,
      title: item.title,
      docUuid: item.docUuid,
      single: item.single,
      author: item.author,
    });
    console.log(email, item.docUuid, item.title, item.single, item.author);
    message.success('取消订阅成功');
    // 刷新订阅列表
    fetchSubscriptions();
  } catch (e) {
    message.error('取消订阅失败');
  }
}

interface SubscriptionItem {
  title: string;
  author: string;
  single: boolean;
  docUuid: string;
}

const subscriptions = ref<SubscriptionItem[]>([]);

async function fetchSubscriptions() {
  const email = localStorage.getItem('email') || '';
  if (!email) {
    message.error('未获取到当前用户邮箱');
    return;
  }
  try {
    const res = await myAxios.get('/subscriptions', { params: { email } });
    subscriptions.value = res.data || [];
  } catch (e) {
    message.error('获取订阅信息失败');
  }
}

onMounted(() => {
  fetchSubscriptions();
});
</script>

<style scoped>
</style>
