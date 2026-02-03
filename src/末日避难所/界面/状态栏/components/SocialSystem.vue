<template>
  <div class="social-system">
    <div v-if="Object.keys(data.派系).length === 0" class="empty-state">
      <i class="fa-solid fa-users-slash"></i>
      <p>暂无已知派系</p>
    </div>

    <div v-else class="faction-list">
      <div v-for="(faction, name) in data.派系" :key="name" class="faction-card">
        <div class="faction-header">
          <span class="faction-name">{{ name }}</span>
          <span class="faction-population">
            <i class="fa-solid fa-user"></i>
            {{ faction.人数占比 }}%
          </span>
        </div>

        <div class="faction-body">
          <div class="faction-ideology">
            <i class="fa-solid fa-bullseye"></i>
            {{ faction.宗旨 }}
          </div>

          <div class="faction-leader">
            <i class="fa-solid fa-user-tie"></i>
            领导人: {{ faction.领导人 }}
          </div>

          <div class="faction-relation">
            <div class="relation-header">
              <span>好感度</span>
              <span :class="['relation-value', getRelationClass(faction.好感度)]">
                {{ faction.好感度 > 0 ? '+' : '' }}{{ faction.好感度 }}
              </span>
            </div>
            <div class="relation-bar">
              <div class="relation-fill" :style="getRelationStyle(faction.好感度)"></div>
              <div class="relation-center"></div>
            </div>
            <div class="relation-status">
              <span :class="['status-tag', getRelationClass(faction.好感度)]">
                {{ faction.观感 }}
              </span>
            </div>
          </div>
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

function getRelationClass(value: number): string {
  if (value >= 50) return 'excellent';
  if (value >= 20) return 'good';
  if (value >= -20) return 'neutral';
  if (value >= -50) return 'poor';
  return 'hostile';
}

function getRelationStyle(value: number) {
  const normalized = (value + 100) / 2; // Convert -100~100 to 0~100
  const color =
    value >= 50 ? '#4caf50' : value >= 20 ? '#8bc34a' : value >= -20 ? '#9e9e9e' : value >= -50 ? '#ff9800' : '#f44336';

  return {
    width: `${normalized}%`,
    background: color,
  };
}
</script>

<style lang="scss" scoped>
.social-system {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;

  i {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

.faction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faction-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid #3a3a3a;
  overflow: hidden;
}

.faction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(212, 168, 75, 0.15);
  border-bottom: 1px solid #3a3a3a;
}

.faction-name {
  font-size: 14px;
  font-weight: 600;
  color: #d4a84b;
}

.faction-population {
  font-size: 12px;
  color: #a0a0a0;

  i {
    margin-right: 4px;
  }
}

.faction-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faction-ideology,
.faction-leader {
  font-size: 12px;
  color: #c0c0c0;

  i {
    width: 16px;
    margin-right: 6px;
    color: #a0a0a0;
  }
}

.faction-relation {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid #333;
}

.relation-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 4px;

  span:first-child {
    color: #888;
  }
}

.relation-value {
  font-weight: 600;

  &.excellent {
    color: #4caf50;
  }
  &.good {
    color: #8bc34a;
  }
  &.neutral {
    color: #9e9e9e;
  }
  &.poor {
    color: #ff9800;
  }
  &.hostile {
    color: #f44336;
  }
}

.relation-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.relation-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.relation-center {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background: #666;
  transform: translateX(-50%);
}

.relation-status {
  margin-top: 6px;
  text-align: right;
}

.status-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;

  &.excellent {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }
  &.good {
    background: rgba(139, 195, 74, 0.2);
    color: #8bc34a;
  }
  &.neutral {
    background: rgba(158, 158, 158, 0.2);
    color: #9e9e9e;
  }
  &.poor {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
  }
  &.hostile {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }
}
</style>
