<template>
  <div class="facility-inventory">
    <!-- 设施区域 -->
    <div class="section">
      <h3 class="section-title">
        <i class="fa-solid fa-industry"></i>
        设施区域
      </h3>

      <div v-if="Object.keys(data.设施与库存.设施区域).length === 0" class="empty-hint">尚未建造任何设施</div>

      <div v-else class="facility-grid">
        <div
          v-for="(facility, name) in data.设施与库存.设施区域"
          :key="name"
          :class="['facility-card', facility.状态.toLowerCase()]"
        >
          <div class="facility-header">
            <span class="facility-name">{{ name }}</span>
            <span :class="['status-badge', facility.状态.toLowerCase()]">
              {{ facility.状态 }}
            </span>
          </div>
          <div class="facility-body">
            <div class="facility-level">
              <i class="fa-solid fa-star"></i>
              Lv.{{ facility.等级 }}
            </div>
            <div class="facility-effect">{{ facility.效果 }}</div>
            <div v-if="facility.说明" class="facility-desc">{{ facility.说明 }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 仓库系统 -->
    <div class="section">
      <h3 class="section-title">
        <i class="fa-solid fa-box-open"></i>
        仓库系统
        <span class="item-count">({{ Object.keys(data.设施与库存.仓库系统).length }}种物品)</span>
      </h3>

      <div v-if="Object.keys(data.设施与库存.仓库系统).length === 0" class="empty-hint">仓库为空</div>

      <div v-else class="inventory-list">
        <div v-for="(item, name) in groupedItems" :key="name" class="item-group">
          <h4 class="group-title">{{ name }}</h4>
          <div class="item-grid">
            <div v-for="(itemData, itemName) in item" :key="itemName" class="item-card">
              <div class="item-icon">
                <i :class="['fa-solid', getItemIcon(itemData.类型)]"></i>
              </div>
              <div class="item-info">
                <div class="item-name">{{ itemName }}</div>
                <div class="item-effect">{{ itemData.效果 || '无特殊效果' }}</div>
              </div>
              <div class="item-quantity">x{{ itemData.数量 }}</div>
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

// 按类型分组物品
const groupedItems = computed(() => {
  const groups: Record<string, Record<string, (typeof data.value.设施与库存.仓库系统)[string]>> = {};

  for (const [name, item] of Object.entries(data.value.设施与库存.仓库系统)) {
    const type = item.类型;
    if (!groups[type]) {
      groups[type] = {};
    }
    groups[type][name] = item;
  }

  return groups;
});

function getItemIcon(type: string): string {
  const icons: Record<string, string> = {
    武器: 'fa-gun',
    防具: 'fa-shield',
    饰品: 'fa-gem',
    消耗品: 'fa-flask',
    材料: 'fa-cubes',
    杂项: 'fa-box',
  };
  return icons[type] || 'fa-box';
}
</script>

<style lang="scss" scoped>
.facility-inventory {
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

  .item-count {
    font-size: 11px;
    font-weight: normal;
    color: #888;
    margin-left: auto;
  }
}

.empty-hint {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 12px;
  font-style: italic;
}

.facility-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.facility-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #444;
  transition: border-color 0.2s;

  &:hover {
    border-color: #666;
  }

  &.损坏 {
    border-color: #8b3a3a;
    background: rgba(139, 58, 58, 0.1);
  }

  &.停用 {
    opacity: 0.6;
  }

  &.升级中 {
    border-color: #4fc3f7;
  }
}

.facility-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.3);
}

.facility-name {
  font-size: 12px;
  font-weight: 600;
  color: #e0e0e0;
}

.status-badge {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 3px;

  &.正常 {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  &.损坏 {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  &.停用 {
    background: rgba(158, 158, 158, 0.2);
    color: #9e9e9e;
  }

  &.升级中 {
    background: rgba(79, 195, 247, 0.2);
    color: #4fc3f7;
  }
}

.facility-body {
  padding: 8px 10px;
}

.facility-level {
  font-size: 11px;
  color: #ffd700;
  margin-bottom: 4px;

  i {
    margin-right: 4px;
  }
}

.facility-effect {
  font-size: 11px;
  color: #8bc34a;
  margin-bottom: 4px;
}

.facility-desc {
  font-size: 10px;
  color: #888;
  font-style: italic;
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-group {
  .group-title {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 500;
    color: #a0a0a0;
    padding-bottom: 4px;
    border-bottom: 1px solid #333;
  }
}

.item-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  border: 1px solid #333;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
}

.item-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;

  i {
    font-size: 14px;
    color: #d4a84b;
  }
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 12px;
  font-weight: 500;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-effect {
  font-size: 10px;
  color: #888;
}

.item-quantity {
  font-size: 14px;
  font-weight: 600;
  color: #ffd700;
  padding: 4px 8px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 4px;
}
</style>
