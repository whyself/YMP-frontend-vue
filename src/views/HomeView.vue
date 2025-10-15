<template>
  <div style="max-width:1500px;margin:40px auto;">
    <h1 style="text-align:center;">欢迎来到语雀消息推送系统主页</h1>
    <p style="text-align:center;">你已成功登录，可以在此管理和订阅个性化文档推送。</p>
    <div style="display:flex;align-items:center;margin-bottom:12px;">
      <div v-if="parentStack.length > 1">
        <a-button type="default" @click="goBack">返回上一级</a-button>
      </div>
    </div>
    <a-row :gutter="16" style="margin-top:8px;">
      <a-col :span="6" v-for="doc in currentDocs" :key="doc.uuid">
          <a-card :hoverable="true" style="margin-bottom:24px;cursor:pointer;" @click="doc.children && doc.children.length > 0 && showChildren(doc.uuid)">
            <template #title>
              <span>{{ doc.title }}</span>
            </template>
            <template v-if="doc.type !== 'TITLE' && doc.type !== 'KNOWLEDGE_BASE'">
              <p><b>作者：</b>{{ doc.author }}</p>
              <p><b>摘要：</b>{{ doc.description }}</p>
              <p><b>字数：</b>{{ doc.wordCount }}</p>
              <p><b>发布时间：</b>{{ formatTime(doc.publishedAt) }}</p>
            </template>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <a-button size="small" @click.stop="openSubscribe(doc)">订阅</a-button>
              <span v-if="typeof doc.size === 'number' && doc.size > 0" style="color:#888;font-size:14px;word-break:break-all;white-space:normal;">包含 {{ doc.size }} 个文档</span>
            </div>
            <!-- 订阅弹窗表单 -->
            <a-modal
              v-if="subscribeVisible && subscribeDoc && subscribeDoc.uuid === doc.uuid"
              v-model:open="subscribeVisible"
              title="订阅文档"
              @ok="handleSubscribe"
              @cancel="closeSubscribe"
              ok-text="确认订阅"
              cancel-text="取消"
            >
              <div>
                <a-checkbox v-model:checked="subscribeForm.tick">包含子文档</a-checkbox>
              </div>
              <div style="margin:12px 0;">
                <a-input v-model:value="subscribeForm.author" placeholder="填写订阅作者（可选）" allow-clear />
              </div>
              <div style="color:#888;font-size:13px;">订阅将发送到当前账号邮箱</div>
            </a-modal>
          </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';

// 订阅弹窗相关
const subscribeVisible = ref(false);
const subscribeDoc = ref<DocTreeItem|null>(null);
const subscribeForm = ref({
  tick: true,
  author: ''
});

function openSubscribe(doc: DocTreeItem) {
  subscribeDoc.value = doc;
  console.log('打开订阅弹窗', doc);
  subscribeForm.value = { tick: true, author: '' };
  subscribeVisible.value = true;
}
function closeSubscribe() {
  subscribeVisible.value = false;
  subscribeDoc.value = null;
}
async function handleSubscribe() {
  if (!subscribeDoc.value) return;
  // 获取当前用户邮箱
  console.log('订阅文档', subscribeDoc.value);
  const email = localStorage.getItem('email') || '';
  if (!email) {
    message.error('未获取到当前用户邮箱');
    return;
  }
  try {
    await myAxios.post('/subscribe', {
      email: email,
      title: subscribeDoc.value.title,
      docUuid: subscribeDoc.value.uuid,
      single: !subscribeForm.value.tick,
      author: subscribeForm.value.author || ''
    });
    message.success('订阅成功');
    closeSubscribe();
  } catch (e) {
    message.error('订阅失败');
  }
}
import myAxios from '../requests';
import { timePickerProps } from 'ant-design-vue/es/time-picker/time-picker';

interface DocTreeItem {
  _id: string;
  uuid: string;
  parentUuid: string;
  title: string;
  author: string;
  description: string;
  wordCount: number;
  publishedAt: string;
  children: string[]; // uuid数组
  type: string;
  slug: string;
  size: number;
}

const docList = ref<DocTreeItem[]>([]);
const parentStack = ref<string[]>([]); // 路径栈，初始只含Root uuid


// 当前要展示的文档列表：parentStack栈顶uuid的children对应的文档
const currentDocs = computed(() => {
  if (!parentStack.value.length) return [];
  const parentUuid = parentStack.value[parentStack.value.length - 1];
  const parentDoc = docList.value.find(doc => doc.uuid === parentUuid);
  if (!parentDoc || !parentDoc.children || !parentDoc.children.length) return [];
  return docList.value.filter(doc => parentDoc.children.includes(doc.uuid));
});

function formatTime(iso: string) {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleString();
}

function showChildren(uuid: string) {
  parentStack.value.push(uuid);
}
function goBack() {
  if (parentStack.value.length > 1) parentStack.value.pop();
}

onMounted(async () => {
  try {
    const res = await myAxios.get('/docTree');
    docList.value = res.data.data || [];
    // 自动找到Root文档的uuid作为初始parentUuid
    const root = docList.value.find(doc => doc.type === 'Root');
    if (root) {
      parentStack.value = [root.uuid];
    } else if (docList.value.length) {
      parentStack.value = [docList.value[0].uuid];
    }
  } catch (e) {
    docList.value = [];
  }
});
</script>

<style scoped>
@media (max-width: 600px) {
  .ant-row {
    flex-direction: column !important;
  }
  .ant-col {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }
  .ant-card {
    font-size: 13px !important;
    padding: 6px 4px !important;
  }
}
</style>
