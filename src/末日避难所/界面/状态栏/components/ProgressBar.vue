<template>
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: `${value}%`, background: color }">
      <span class="progress-value">{{ value }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number;
  color?: string;
}>();
</script>

<style lang="scss" scoped>
.progress-bar {
  flex: 1;
  height: 18px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 9px;
  overflow: hidden;
  border: 1px solid #3a3a3a;
}

.progress-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  transition: width 0.3s ease;
  min-width: 40px;
}

.progress-value {
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
