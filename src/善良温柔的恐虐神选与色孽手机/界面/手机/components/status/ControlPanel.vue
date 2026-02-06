<template>
  <div class="control-panel glass-panel mb-2 p-3">
    <h3 class="mb-2 border-b border-gray-700 pb-1 text-xs tracking-widest text-gray-400 uppercase">
      Cyberdeck // 林海
    </h3>

    <div class="mb-3 grid grid-cols-2 gap-2">
      <button class="toggle-btn" :class="{ active: phone.透视开启 }" @click="toggle('透视开启')">
        <div class="status-indicator"></div>
        <span>透视模组</span>
      </button>

      <button class="toggle-btn" :class="{ active: phone.身体柔韧化开启 }" @click="toggle('身体柔韧化开启')">
        <div class="status-indicator"></div>
        <span>肉体软化</span>
      </button>

      <button class="toggle-btn" :class="{ active: phone.远程操控开启 }" @click="toggle('远程操控开启')">
        <div class="status-indicator"></div>
        <span>远程接管</span>
      </button>

      <div class="hypnosis-status flex items-center justify-center rounded border border-gray-700 bg-black/40 text-xs">
        <span v-if="phone.催眠目标" class="animate-pulse text-pink-500"> 目标: {{ phone.催眠目标 }} </span>
        <span v-else class="text-gray-600">无目标</span>
      </div>
    </div>

    <!-- Inventory Preview (Mini) -->
    <div class="inventory-mini mt-2">
      <div class="mb-1 flex items-center justify-between">
        <span class="text-[10px] text-gray-500">背包存储</span>
        <span class="font-mono text-[10px] text-cyan-600">{{ Object.keys(inventory).length }} 物品</span>
      </div>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="(item, name) in inventory"
          :key="name"
          class="inventory-tag rounded border border-gray-700 bg-gray-900 px-1 text-[10px] text-gray-300"
        >
          {{ name }} x{{ item.数量 }}
        </span>
        <span v-if="Object.keys(inventory).length === 0" class="text-[10px] text-gray-600 italic">空</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore, syncAllDataToLatest } from '../../store';
import { computed } from 'vue';

const store = useDataStore();
const phone = computed(() => store.data.林海.手机功能);
const inventory = computed(() => store.data.林海.背包);

type BooleanKeys = '透视开启' | '身体柔韧化开启' | '远程操控开启';

const toggle = (key: BooleanKeys) => {
  phone.value[key] = !phone.value[key];
  // 同步到最新楼层
  syncAllDataToLatest(store);
};
</script>

<style scoped lang="scss">
.toggle-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 700;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.9) 0%, rgba(10, 10, 20, 0.95) 100%);
  border: 2px solid rgba(0, 229, 255, 0.4);
  color: rgba(0, 229, 255, 0.8);
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.15);

  &:hover {
    border-color: var(--secondary);
    color: var(--secondary);
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(10, 10, 20, 0.95) 100%);
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
    transform: scale(1.02);
  }

  &.active {
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(10, 30, 40, 0.95) 100%);
    border-color: var(--secondary);
    color: #fff;
    box-shadow:
      0 0 15px rgba(0, 229, 255, 0.5),
      inset 0 0 10px rgba(0, 229, 255, 0.1);

    .status-indicator {
      background: var(--secondary);
      box-shadow: 0 0 8px var(--secondary);
    }
  }
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 229, 255, 0.4);
  transition: all 0.3s ease;
  box-shadow: 0 0 4px rgba(0, 229, 255, 0.3);
}

.hypnosis-status {
  padding: 0.5rem 0.75rem;
  border: 2px solid rgba(255, 0, 255, 0.3) !important;
  background: linear-gradient(135deg, rgba(30, 10, 40, 0.9) 0%, rgba(10, 10, 20, 0.95) 100%) !important;
  box-shadow: 0 0 8px rgba(255, 0, 255, 0.15);
}

.inventory-tag {
  white-space: nowrap;
}
</style>
