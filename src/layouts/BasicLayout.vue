<template>
    <div id="basicLayout">
        <a-layout>
            <a-layout-header class="header">
                <GlobalHeader />
            </a-layout-header>
            <a-layout-content class="content">
                <router-view />
            </a-layout-content>
            <a-layout-footer class="footer">
                <a href="https://nova.yuque.com/r/organizations/homepage" target="_blank">
                    Yueque Message Pusher ©2025 Created by NOVA
                </a>
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';
</script>

<style scoped>
#basicLayout .footer {
    background: #efefef;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
}

#basicLayout .content {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
}

#basicLayout .header {
    background: white;
    padding-inline: 20px;
    color: unset;
    margin-bottom: 20px;
}
</style>