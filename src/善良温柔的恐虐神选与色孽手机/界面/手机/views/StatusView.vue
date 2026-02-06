<template>
  <div class="app-container flex h-full flex-col overflow-y-auto p-2 pt-2">
    <!-- System & Controls -->
    <SystemBar />
    <ControlPanel />

    <!-- Character Grid -->
    <div class="char-grid mb-6 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      <CharacterCard name="鹿忻" :char-data="store.data.鹿忻" />
      <CharacterCard name="鹿晴" :char-data="store.data.鹿晴" />
      <CharacterCard name="戎华" :char-data="store.data.戎华" />
      <RobotCard name="林曦" :char-data="store.data.林曦" />
    </div>

    <!-- Navigation Grid -->
    <div class="mt-auto grid grid-cols-4 gap-x-2 gap-y-4 pb-4">
      <AppIcon
        v-for="app in apps"
        :key="app.id"
        :icon="app.icon"
        :label="app.label"
        :active="app.id === 'xray' ? isXRayActive : app.id === 'softbody' ? isSoftBodyActive : false"
        @click="handleAppClick(app)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SystemBar from '../components/status/SystemBar.vue';
import ControlPanel from '../components/status/ControlPanel.vue';
import CharacterCard from '../components/status/CharacterCard.vue';
import RobotCard from '../components/status/RobotCard.vue';
import AppIcon from '../components/home/AppIcon.vue';
import { useDataStore, syncAllDataToLatest } from '../store';
import { usePhoneNavigation, type PhoneView } from '../navigation';

const store = useDataStore();
const { navigateTo } = usePhoneNavigation();

// Accessors for toggles
const isXRayActive = computed({
  get: () => store.data.林海.手机功能.透视开启,
  set: val => (store.data.林海.手机功能.透视开启 = val),
});
const isSoftBodyActive = computed({
  get: () => store.data.林海.手机功能.身体柔韧化开启,
  set: val => (store.data.林海.手机功能.身体柔韧化开启 = val),
});

// Navigation Apps
const apps: { id: string; icon: string; label: string; toggle?: boolean; target?: PhoneView }[] = [
  { id: 'remote', icon: '🎮', label: '远程操控', target: '远程操控' },
  { id: 'hypno', icon: '🌀', label: '催眠', target: '催眠' },
  { id: 'inventory', icon: '🎒', label: '背包', target: '背包' },
  { id: 'shop', icon: '🛒', label: '商店', target: '商店' },
  { id: 'world', icon: '🌐', label: '世界', target: '世界信息' },
  { id: 'xray', icon: '👁️', label: '透视', toggle: true },
  { id: 'softbody', icon: '🫠', label: '肉体软化', toggle: true },
  { id: 'settings', icon: '⚙️', label: '设置', target: '设置' },
];

const handleAppClick = (app: (typeof apps)[number]) => {
  if (app.id === 'xray') {
    isXRayActive.value = !isXRayActive.value;
    // 同步到最新楼层
    syncAllDataToLatest(store);
  } else if (app.id === 'softbody') {
    isSoftBodyActive.value = !isSoftBodyActive.value;
    // 同步到最新楼层
    syncAllDataToLatest(store);
  } else if (app.target) {
    navigateTo(app.target);
  }
};
</script>

<style lang="scss">
.app-container {
  scrollbar-width: thin;
  scrollbar-color: var(--primary) transparent;
}
</style>
