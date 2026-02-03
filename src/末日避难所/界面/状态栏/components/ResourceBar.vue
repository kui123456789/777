<template>
  <div class="resource-bar">
    <div class="resource-header">
      <i :class="['fa-solid', icon]" :style="{ color }"></i>
      <span class="resource-label">{{ label }}</span>
      <span class="resource-value">{{ current }} / {{ max }}</span>
    </div>
    <div class="bar-container">
      <div
        class="bar-fill"
        :style="{
          width: `${percentage}%`,
          background: getBarColor(),
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  icon: string;
  current: number;
  max: number;
  color: string;
}>();

const percentage = computed(() => (props.current / props.max) * 100);

function getBarColor() {
  const pct = percentage.value;
  if (pct < 10) return '#f44336'; // 严重警告红色
  if (pct < 20) return '#ff5722'; // 警告橙红
  if (pct < 30) return '#ff9800'; // 警告橙色
  return props.color;
}
</script>

<style lang="scss" scoped>
.resource-bar {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 8px;
  border: 1px solid #333;
}

.resource-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;

  i {
    font-size: 12px;
  }
}

.resource-label {
  font-size: 11px;
  color: #a0a0a0;
  flex: 1;
}

.resource-value {
  font-size: 11px;
  font-weight: 600;
  color: #e0e0e0;
}

.bar-container {
  height: 8px;
  background: #1a1a1a;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition:
    width 0.3s ease,
    background 0.3s ease;
  box-shadow: 0 0 8px currentColor;
}
</style>
