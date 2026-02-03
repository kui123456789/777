<template>
  <div class="tab-nav">
    <!-- 标签按钮（包含正文） -->
    <button
      v-for="tab in allTabs"
      :key="tab.id"
      :class="['tab-btn', { active: modelValue === tab.id, 'content-btn': tab.id === 'content' }]"
      @click="$emit('update:modelValue', tab.id)"
    >
      <i :class="['fa-solid', tab.icon]"></i>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const props = defineProps<{
  modelValue: string;
  tabs: Tab[];
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();

// 在 tabs 前面添加"正文"标签
const allTabs = computed(() => [{ id: 'content', label: '正文', icon: 'fa-book-open' }, ...props.tabs]);
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex;
  background: #2a2a2a;
  border-bottom: 1px solid #4a4a4a;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
  }
}

.tab-btn {
  flex: 1;
  min-width: 80px;
  padding: 10px 12px;
  background: transparent;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #d0d0d0;
  }

  &.active {
    color: #d4a84b;
    border-bottom-color: #d4a84b;
    background: rgba(212, 168, 75, 0.1);
  }

  &.content-btn {
    border-right: 1px solid #3a3a3a;

    &.active {
      color: #5a9de0;
      border-bottom-color: #5a9de0;
      background: rgba(90, 157, 224, 0.1);
    }

    &:not(.active):hover {
      color: #7ab5f0;
      background: rgba(90, 157, 224, 0.05);
    }
  }

  i {
    font-size: 16px;
  }

  .tab-label {
    font-size: 11px;
    font-weight: 500;
  }
}
</style>
