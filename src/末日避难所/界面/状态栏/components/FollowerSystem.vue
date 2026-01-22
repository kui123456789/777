<template>
  <div class="follower-system">
    <div v-if="Object.keys(data.追随者).length === 0" class="empty-state">
      <i class="fa-solid fa-user-slash"></i>
      <p>尚无追随者</p>
    </div>

    <div v-else class="follower-list">
      <div
        v-for="(follower, id) in data.追随者"
        :key="id"
        :class="['follower-card', { dead: follower.状态 === '死亡' }]"
      >
        <!-- 头部信息 -->
        <div class="follower-header">
          <div class="avatar">
            <i
              :class="[
                'fa-solid',
                follower.性别 === '男' ? 'fa-mars' : follower.性别 === '女' ? 'fa-venus' : 'fa-genderless',
              ]"
            ></i>
          </div>
          <div class="basic-info">
            <div class="name">{{ follower.姓名 }}</div>
            <div class="meta">{{ follower.年龄 }}岁 · {{ follower.性别 }}</div>
          </div>
          <div :class="['status-badge', follower.状态.toLowerCase()]">
            {{ follower.状态 }}
          </div>
        </div>

        <!-- 核心数值 -->
        <div class="stats-section">
          <div class="stat-item">
            <i class="fa-solid fa-sword"></i>
            <span class="stat-label">武力</span>
            <span class="stat-value">{{ follower.武力 }}</span>
          </div>
          <div class="stat-item">
            <i class="fa-solid fa-briefcase"></i>
            <span class="stat-label">管理</span>
            <span class="stat-value">{{ follower.管理 }}</span>
          </div>
          <div class="stat-item">
            <i class="fa-solid fa-compass"></i>
            <span class="stat-label">探索</span>
            <span class="stat-value">{{ follower.探索生存 }}</span>
          </div>
        </div>

        <!-- 生存状态 -->
        <div class="survival-section">
          <div class="survival-row">
            <div class="survival-item">
              <span class="survival-label">
                <i class="fa-solid fa-heart"></i>
                生命
              </span>
              <div class="hp-bar">
                <div class="hp-fill" :style="{ width: `${follower.生命值}%` }"></div>
              </div>
              <span class="survival-value">{{ follower.生命值 }}</span>
            </div>
          </div>
          <div class="survival-row-inline">
            <div class="mini-stat">
              <i class="fa-solid fa-shield"></i>
              <span>防护 {{ follower.防护等级 }}</span>
            </div>
            <div class="mini-stat">
              <i class="fa-solid fa-handshake"></i>
              <span>忠诚 {{ follower.忠诚度 }}%</span>
            </div>
          </div>
        </div>

        <!-- 装备栏 -->
        <div class="equipment-section">
          <div class="equipment-title">装备栏</div>
          <div class="equipment-slots">
            <div class="slot">
              <i class="fa-solid fa-gun"></i>
              <span :class="{ empty: follower.装备栏.武器位 === '空' }">
                {{ follower.装备栏.武器位 }}
              </span>
            </div>
            <div class="slot">
              <i class="fa-solid fa-vest"></i>
              <span :class="{ empty: follower.装备栏.防具位 === '空' }">
                {{ follower.装备栏.防具位 }}
              </span>
            </div>
            <div class="slot">
              <i class="fa-solid fa-ring"></i>
              <span :class="{ empty: follower.装备栏.饰品工具位 === '空' }">
                {{ follower.装备栏.饰品工具位 }}
              </span>
            </div>
          </div>
        </div>

        <!-- 特质 -->
        <div v-if="Object.keys(follower.特质).length > 0" class="perks-section">
          <div class="perk-list">
            <span v-for="(perk, perkName) in follower.特质" :key="perkName" class="perk-tag" :title="perk.效果">
              {{ perkName }}
            </span>
          </div>
        </div>

        <!-- 描述 -->
        <div v-if="follower.描述" class="description">
          {{ follower.描述 }}
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
.follower-system {
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

.follower-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.follower-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid #3a3a3a;
  overflow: hidden;

  &.dead {
    opacity: 0.5;
    filter: grayscale(80%);
  }
}

.follower-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #333;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2d5a7e 0%, #1a4a6e 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 18px;
    color: #d4a84b;
  }
}

.basic-info {
  flex: 1;
}

.name {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
}

.meta {
  font-size: 11px;
  color: #888;
}

.status-badge {
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;

  &.健康 {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  &.生病 {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
  }

  &.崩溃 {
    background: rgba(156, 39, 176, 0.2);
    color: #9c27b0;
  }

  &.死亡 {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #333;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  i {
    font-size: 14px;
    color: #d4a84b;
  }
}

.stat-label {
  font-size: 10px;
  color: #888;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #e0e0e0;
}

.survival-section {
  padding: 12px;
  border-bottom: 1px solid #333;
}

.survival-row {
  margin-bottom: 8px;
}

.survival-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.survival-label {
  font-size: 11px;
  color: #888;
  min-width: 50px;

  i {
    margin-right: 4px;
    color: #e53935;
  }
}

.hp-bar {
  flex: 1;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

.hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #e53935 0%, #4caf50 100%);
  transition: width 0.3s ease;
}

.survival-value {
  font-size: 12px;
  font-weight: 600;
  color: #e0e0e0;
  min-width: 30px;
  text-align: right;
}

.survival-row-inline {
  display: flex;
  justify-content: space-around;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #a0a0a0;

  i {
    color: #4fc3f7;
  }
}

.equipment-section {
  padding: 12px;
  border-bottom: 1px solid #333;
}

.equipment-title {
  font-size: 11px;
  color: #888;
  margin-bottom: 8px;
}

.equipment-slots {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  font-size: 11px;

  i {
    width: 16px;
    text-align: center;
    color: #888;
  }

  span {
    color: #c0c0c0;

    &.empty {
      color: #555;
      font-style: italic;
    }
  }
}

.perks-section {
  padding: 12px;
  border-bottom: 1px solid #333;
}

.perk-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.perk-tag {
  font-size: 10px;
  padding: 3px 8px;
  background: rgba(212, 168, 75, 0.15);
  border: 1px solid rgba(212, 168, 75, 0.3);
  border-radius: 12px;
  color: #d4a84b;
  cursor: help;
}

.description {
  padding: 12px;
  font-size: 11px;
  color: #888;
  font-style: italic;
  line-height: 1.4;
}
</style>
