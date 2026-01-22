<template>
  <div class="shelter-status">
    <!-- 基础生存资源 -->
    <div class="section">
      <h3 class="section-title">
        <i class="fa-solid fa-battery-half"></i>
        基础生存资源
      </h3>
      <div class="resource-grid">
        <ResourceBar
          v-for="(res, key) in resources"
          :key="key"
          :label="res.label"
          :icon="res.icon"
          :current="data.避难所.基础生存资源[key].当前值"
          :max="data.避难所.基础生存资源[key].上限"
          :color="res.color"
        />
      </div>
    </div>

    <!-- 环境指标 -->
    <div class="section">
      <h3 class="section-title">
        <i class="fa-solid fa-chart-line"></i>
        环境指标
      </h3>
      <div class="indicator-grid">
        <div class="indicator">
          <span class="indicator-label">科技等级</span>
          <span class="indicator-value tech">{{ data.避难所.环境指标.科技等级 }}</span>
        </div>
        <div class="indicator">
          <span class="indicator-label">卫生度</span>
          <ProgressBar :value="data.避难所.环境指标.卫生度" color="#4a7c59" />
        </div>
        <div class="indicator">
          <span class="indicator-label">精神健康度</span>
          <ProgressBar :value="data.避难所.环境指标.精神健康度" color="#6a5acd" />
        </div>
      </div>
    </div>

    <!-- 社会制度滑块 -->
    <div class="section">
      <h3 class="section-title">
        <i class="fa-solid fa-scale-balanced"></i>
        社会制度
      </h3>
      <div class="policy-grid">
        <PolicySlider
          v-for="policy in policies"
          :key="policy.key"
          :label-left="policy.leftLabel"
          :label-right="policy.rightLabel"
          :value="data.避难所.社会制度[policy.key]"
        />
      </div>
    </div>

    <!-- 宏观属性 -->
    <div class="section">
      <h3 class="section-title">
        <i class="fa-solid fa-landmark"></i>
        宏观属性
      </h3>
      <div class="macro-grid">
        <div class="macro-item">
          <i class="fa-solid fa-crown"></i>
          <span class="macro-label">统治力</span>
          <span class="macro-value">{{ data.避难所.宏观属性.统治力 }}</span>
        </div>
        <div class="macro-item">
          <i class="fa-solid fa-shield-halved"></i>
          <span class="macro-label">防御等级</span>
          <span class="macro-value">{{ data.避难所.宏观属性.防御等级 }}</span>
        </div>
        <div class="macro-item">
          <i class="fa-solid fa-eye-slash"></i>
          <span class="macro-label">隐蔽度</span>
          <span class="macro-value">{{ data.避难所.宏观属性.隐蔽度 }}</span>
        </div>
        <div class="macro-item secret">
          <i class="fa-solid fa-flask"></i>
          <span class="macro-label">秘密实验</span>
          <span class="macro-value">{{ data.避难所.宏观属性.秘密实验进度 }}%</span>
        </div>
      </div>
      <div v-if="data.避难所.宏观属性.隐藏目的 !== '无'" class="hidden-purpose">
        <i class="fa-solid fa-user-secret"></i>
        隐藏目的: {{ data.避难所.宏观属性.隐藏目的 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';
import PolicySlider from './PolicySlider.vue';
import ProgressBar from './ProgressBar.vue';
import ResourceBar from './ResourceBar.vue';

const store = useDataStore();
const data = computed(() => store.data);

const resources = {
  电力: { label: '电力', icon: 'fa-bolt', color: '#ffd700' },
  水源: { label: '水源', icon: 'fa-droplet', color: '#4fc3f7' },
  食物: { label: '食物', icon: 'fa-utensils', color: '#8bc34a' },
  人口: { label: '人口', icon: 'fa-users', color: '#ff9800' },
};

const policies = [
  { key: '分配方法' as const, leftLabel: '公平', rightLabel: '效率' },
  { key: '信息管控' as const, leftLabel: '言论自由', rightLabel: '统一思想' },
  { key: '社会伦理' as const, leftLabel: '人性', rightLabel: '生存' },
  { key: '治安手段' as const, leftLabel: '重教化', rightLabel: '重刑罚' },
];
</script>

<style lang="scss" scoped>
.shelter-status {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #3a3a3a;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #d4a84b;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 14px;
  }
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.indicator-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.indicator-label {
  font-size: 12px;
  color: #a0a0a0;
  min-width: 80px;
}

.indicator-value {
  font-size: 12px;
  font-weight: 500;

  &.tech {
    color: #4fc3f7;
    background: rgba(79, 195, 247, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
  }
}

.policy-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.macro-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.macro-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;

  i {
    font-size: 14px;
    color: #d4a84b;
    width: 20px;
    text-align: center;
  }

  &.secret {
    i {
      color: #8b3a3a;
    }
  }
}

.macro-label {
  font-size: 11px;
  color: #a0a0a0;
  flex: 1;
}

.macro-value {
  font-size: 14px;
  font-weight: bold;
  color: #e0e0e0;
}

.hidden-purpose {
  margin-top: 10px;
  padding: 8px;
  background: rgba(139, 58, 58, 0.2);
  border: 1px solid #8b3a3a;
  border-radius: 4px;
  font-size: 12px;
  color: #ff6b6b;

  i {
    margin-right: 6px;
  }
}
</style>
