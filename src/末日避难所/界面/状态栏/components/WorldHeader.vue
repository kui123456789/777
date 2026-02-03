<template>
  <div class="world-header">
    <div class="header-left">
      <div class="shelter-name">
        <i class="fa-solid fa-vault"></i>
        {{ data.避难所.避难所名称 }}
      </div>
      <div class="disaster-info">
        <span class="disaster-type">{{ data.世界.灾难本质 }}</span>
        <span class="timeline">{{ data.世界.时间线节点 }}</span>
      </div>
    </div>
    <div class="header-right">
      <div class="datetime">
        <div class="date">
          <i class="fa-regular fa-calendar"></i>
          {{ data.世界.当前日期 }}
        </div>
        <div class="time">
          <i class="fa-regular fa-clock"></i>
          {{ data.世界.当前时间 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const data = computed(() => store.data);
</script>

<style lang="scss" scoped>
.world-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(90deg, #1a4a6e 0%, #2d5a7e 100%);
  border-bottom: 2px solid #4a4a4a;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shelter-name {
  font-size: 18px;
  font-weight: bold;
  color: #d4a84b;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 20px;
  }
}

.disaster-info {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.disaster-type {
  color: #ff6b35;
  font-weight: 500;
}

.timeline {
  color: #a0a0a0;
}

.header-right {
  text-align: right;
}

.datetime {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: #c0c0c0;

  i {
    margin-right: 4px;
    opacity: 0.7;
  }
}
</style>
