<template>
  <div class="overseer-panel">
    <!-- 基本信息 -->
    <div class="section">
      <div class="overseer-header">
        <div class="avatar">
          <i class="fa-solid fa-user-astronaut"></i>
        </div>
        <div class="basic-info">
          <div class="name">{{ data.监督者.姓名 }}</div>
          <div class="location">
            <i class="fa-solid fa-location-dot"></i>
            {{ data.监督者.当前位置 }}
          </div>
        </div>
        <div class="action-points">
          <div class="ap-label">行动点</div>
          <div class="ap-value">
            <span class="current">{{ data.监督者.行动点数 }}</span>
            <span class="separator">/</span>
            <span class="max">{{ data.监督者.行动点数上限 }}</span>
          </div>
          <div class="ap-pips">
            <span
              v-for="i in data.监督者.行动点数上限"
              :key="i"
              :class="['pip', { filled: i <= data.监督者.行动点数 }]"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <!-- S.P.E.C.I.A.L 属性 -->
    <div class="section">
      <h3 class="section-title">
        <i class="fa-solid fa-dna"></i>
        S.P.E.C.I.A.L 属性
      </h3>
      <div class="special-grid">
        <div v-for="(attr, key) in specialAttrs" :key="key" class="special-item">
          <div class="special-letter">{{ attr.letter }}</div>
          <div class="special-info">
            <div class="special-name">{{ attr.name }}</div>
            <div class="special-bar">
              <div
                class="special-fill"
                :style="{
                  width: `${(data.监督者.SPECIAL[key] / 10) * 100}%`,
                  background: attr.color,
                }"
              ></div>
            </div>
          </div>
          <div class="special-value" :style="{ color: attr.color }">
            {{ data.监督者.SPECIAL[key] }}
          </div>
        </div>
      </div>
      <div class="luck-bonus">
        <i class="fa-solid fa-clover"></i>
        气运加成: +{{ Math.floor(data.监督者.SPECIAL.气运 * 0.33) }}% 全域检定
      </div>
    </div>

    <!-- 特质 -->
    <div class="section">
      <h3 class="section-title">
        <i class="fa-solid fa-certificate"></i>
        特质 (Perks)
      </h3>

      <div v-if="Object.keys(data.监督者.特质).length === 0" class="empty-hint">尚未获得任何特质</div>

      <div v-else class="perk-list">
        <div v-for="(perk, name) in data.监督者.特质" :key="name" class="perk-item">
          <div class="perk-icon">
            <i class="fa-solid fa-award"></i>
          </div>
          <div class="perk-info">
            <div class="perk-name">{{ name }}</div>
            <div class="perk-effect">{{ perk.效果 }}</div>
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

const specialAttrs = {
  威慑力: { letter: 'S', name: '威慑力 (Strength)', color: '#e53935' },
  洞察力: { letter: 'P', name: '洞察力 (Perception)', color: '#8bc34a' },
  抗压值: { letter: 'E', name: '抗压值 (Endurance)', color: '#ffd54f' },
  统御力: { letter: 'C', name: '统御力 (Charisma)', color: '#ff9800' },
  科研力: { letter: 'I', name: '科研力 (Intelligence)', color: '#4fc3f7' },
  反应力: { letter: 'A', name: '反应力 (Agility)', color: '#9c27b0' },
  气运: { letter: 'L', name: '气运 (Luck)', color: '#4caf50' },
} as const;
</script>

<style lang="scss" scoped>
.overseer-panel {
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

.overseer-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1a4a6e 0%, #2d5a7e 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #d4a84b;

  i {
    font-size: 28px;
    color: #d4a84b;
  }
}

.basic-info {
  flex: 1;
}

.name {
  font-size: 20px;
  font-weight: bold;
  color: #e0e0e0;
  margin-bottom: 4px;
}

.location {
  font-size: 12px;
  color: #888;

  i {
    margin-right: 4px;
    color: #4fc3f7;
  }
}

.action-points {
  text-align: center;
  padding: 8px 16px;
  background: rgba(212, 168, 75, 0.1);
  border-radius: 6px;
  border: 1px solid #d4a84b;
}

.ap-label {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.ap-value {
  font-size: 20px;
  font-weight: bold;
  margin: 2px 0;

  .current {
    color: #ffd700;
  }

  .separator {
    color: #666;
    margin: 0 2px;
  }

  .max {
    color: #888;
  }
}

.ap-pips {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.pip {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #333;
  border: 2px solid #555;

  &.filled {
    background: #ffd700;
    border-color: #ffa000;
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
  }
}

.special-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.special-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.special-letter {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #d4a84b;
  border: 1px solid #444;
}

.special-info {
  flex: 1;
}

.special-name {
  font-size: 11px;
  color: #888;
  margin-bottom: 2px;
}

.special-bar {
  height: 6px;
  background: #2a2a2a;
  border-radius: 3px;
  overflow: hidden;
}

.special-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.special-value {
  width: 24px;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
}

.luck-bonus {
  margin-top: 12px;
  padding: 8px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
  font-size: 12px;
  color: #4caf50;
  text-align: center;

  i {
    margin-right: 6px;
  }
}

.empty-hint {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 12px;
  font-style: italic;
}

.perk-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.perk-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  border: 1px solid #333;
}

.perk-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 168, 75, 0.2);
  border-radius: 50%;

  i {
    font-size: 14px;
    color: #d4a84b;
  }
}

.perk-info {
  flex: 1;
}

.perk-name {
  font-size: 12px;
  font-weight: 600;
  color: #e0e0e0;
}

.perk-effect {
  font-size: 10px;
  color: #888;
}
</style>
