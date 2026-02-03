<template>
  <div class="shelter-panel">
    <!-- 顶部：世界环境信息（仅非正文标签时显示） -->
    <WorldHeader v-if="activeTab !== 'content'" />

    <!-- 标签导航 -->
    <TabNav v-model="activeTab" :tabs="tabs" />

    <!-- 内容区域 -->
    <div :class="['content-area', { 'content-tab': activeTab === 'content' }]">
      <template v-if="activeTab === 'content'">
        <ContentPanel />
      </template>
      <template v-else-if="activeTab === 'shelter'">
        <ShelterStatus />
      </template>
      <template v-else-if="activeTab === 'social'">
        <SocialSystem />
      </template>
      <template v-else-if="activeTab === 'facility'">
        <FacilityInventory />
      </template>
      <template v-else-if="activeTab === 'overseer'">
        <OverseerPanel />
      </template>
      <template v-else-if="activeTab === 'follower'">
        <FollowerSystem />
      </template>
    </div>

    <!-- 底部警告栏（仅非正文标签时显示） -->
    <WarningBar v-if="activeTab !== 'content'" />
  </div>
</template>

<script setup lang="ts">
import ContentPanel from './components/ContentPanel.vue';
import FacilityInventory from './components/FacilityInventory.vue';
import FollowerSystem from './components/FollowerSystem.vue';
import OverseerPanel from './components/OverseerPanel.vue';
import ShelterStatus from './components/ShelterStatus.vue';
import SocialSystem from './components/SocialSystem.vue';
import TabNav from './components/TabNav.vue';
import WarningBar from './components/WarningBar.vue';
import WorldHeader from './components/WorldHeader.vue';

const tabs = [
  { id: 'shelter', label: '避难所', icon: 'fa-house' },
  { id: 'social', label: '派系', icon: 'fa-users' },
  { id: 'facility', label: '设施', icon: 'fa-industry' },
  { id: 'overseer', label: '监督者', icon: 'fa-user-tie' },
  { id: 'follower', label: '追随者', icon: 'fa-user-group' },
];

const activeTab = useLocalStorage<string>('shelter_status:active_tab', 'shelter');
</script>

<style lang="scss" scoped>
.shelter-panel {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #4a4a4a;
  border-radius: 8px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  font-family: var(--font-display);
  color: var(--c-vault-light);
  font-size: 13px;
  line-height: 1.4;
  overflow: hidden;
}

.content-area {
  padding: 12px 16px;
  min-height: 200px;
  background: rgba(0, 0, 0, 0.2);

  &.content-tab {
    padding: 0;
  }
}
</style>
