<template>
  <div v-if="hasWarnings" class="warning-bar">
    <div class="warning-scroll">
      <div v-for="(warning, index) in allWarnings" :key="index" :class="['warning-item', warning.type]">
        <i :class="['fa-solid', warning.icon]"></i>
        <span>{{ warning.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const data = computed(() => store.data);

interface Warning {
  type: 'critical' | 'warning' | 'info' | 'buff';
  icon: string;
  text: string;
}

const allWarnings = computed(() => {
  const warnings: Warning[] = [];

  // 资源警告
  const 资源 = data.value.避难所.基础生存资源;

  if (资源.电力.当前值 / 资源.电力.上限 < 0.1) {
    warnings.push({ type: 'critical', icon: 'fa-bolt', text: '电力严重不足！' });
  } else if (资源.电力.当前值 / 资源.电力.上限 < 0.2) {
    warnings.push({ type: 'warning', icon: 'fa-bolt', text: '电力紧缺' });
  }

  if (资源.水源.当前值 / 资源.水源.上限 < 0.1) {
    warnings.push({ type: 'critical', icon: 'fa-droplet', text: '水源严重不足！' });
  } else if (资源.水源.当前值 / 资源.水源.上限 < 0.2) {
    warnings.push({ type: 'warning', icon: 'fa-droplet', text: '水源紧缺' });
  }

  if (资源.食物.当前值 / 资源.食物.上限 < 0.1) {
    warnings.push({ type: 'critical', icon: 'fa-utensils', text: '食物严重不足！' });
  } else if (资源.食物.当前值 / 资源.食物.上限 < 0.2) {
    warnings.push({ type: 'warning', icon: 'fa-utensils', text: '食物紧缺' });
  }

  // 人口过载警告
  if (资源.人口.当前值 >= 资源.人口.上限) {
    warnings.push({ type: 'warning', icon: 'fa-users', text: '人口已达上限' });
  }

  // 环境指标警告
  const 环境 = data.value.避难所.环境指标;

  if (环境.卫生度 < 20) {
    warnings.push({ type: 'warning', icon: 'fa-virus', text: '卫生状况恶劣' });
  }

  if (环境.精神健康度 < 20) {
    warnings.push({ type: 'warning', icon: 'fa-brain', text: '士气低落' });
  }

  // 统治力警告
  if (data.value.避难所.宏观属性.统治力 < 20) {
    warnings.push({ type: 'critical', icon: 'fa-crown', text: '统治力过低，暴动风险！' });
  }

  // 社会制度极端值 Buff
  const 社会 = data.value.避难所.社会制度;

  if (社会.信息管控 >= 95) {
    warnings.push({ type: 'buff', icon: 'fa-brain', text: '【蜂巢思维】生效' });
  }

  if (社会.社会伦理 >= 95) {
    warnings.push({ type: 'buff', icon: 'fa-snowflake', text: '【冷酷生存】生效' });
  }

  if (社会.社会伦理 <= 5) {
    warnings.push({ type: 'buff', icon: 'fa-dove', text: '【理想主义】生效' });
  }

  if (社会.治安手段 >= 95) {
    warnings.push({ type: 'buff', icon: 'fa-gavel', text: '【铁腕统治】生效' });
  }

  // 追随者状态警告
  for (const [, follower] of Object.entries(data.value.追随者)) {
    if (follower.状态 === '死亡') {
      warnings.push({ type: 'info', icon: 'fa-skull', text: `${follower.姓名} 已死亡` });
    } else if (follower.状态 === '崩溃') {
      warnings.push({ type: 'warning', icon: 'fa-face-dizzy', text: `${follower.姓名} 精神崩溃` });
    } else if (follower.状态 === '生病') {
      warnings.push({ type: 'info', icon: 'fa-virus', text: `${follower.姓名} 生病中` });
    } else if (follower.忠诚度 < 20) {
      warnings.push({ type: 'warning', icon: 'fa-heart-crack', text: `${follower.姓名} 忠诚度过低` });
    }
  }

  // 派系关系警告
  for (const [name, faction] of Object.entries(data.value.派系)) {
    if (faction.好感度 <= -80) {
      warnings.push({ type: 'critical', icon: 'fa-face-angry', text: `${name}派系敌对！` });
    } else if (faction.好感度 <= -50) {
      warnings.push({ type: 'warning', icon: 'fa-face-frown', text: `${name}派系不满` });
    }
  }

  return warnings;
});

const hasWarnings = computed(() => allWarnings.value.length > 0);
</script>

<style lang="scss" scoped>
.warning-bar {
  background: linear-gradient(90deg, #2a1a1a 0%, #1a1a2a 100%);
  border-top: 1px solid #4a4a4a;
  padding: 8px 12px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
  }
}

.warning-scroll {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  animation: pulse 2s infinite;

  i {
    font-size: 12px;
  }

  &.critical {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
    border: 1px solid rgba(244, 67, 54, 0.4);
    animation: pulse-critical 1s infinite;
  }

  &.warning {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
    border: 1px solid rgba(255, 152, 0, 0.4);
  }

  &.info {
    background: rgba(158, 158, 158, 0.2);
    color: #9e9e9e;
    border: 1px solid rgba(158, 158, 158, 0.4);
    animation: none;
  }

  &.buff {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
    border: 1px solid rgba(76, 175, 80, 0.4);
    animation: none;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes pulse-critical {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}
</style>
