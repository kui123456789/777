<template>
  <div class="inventory-section">
    <div class="block-title">随身物品</div>
    <div class="inventory-filter">
      <input v-model="filter" type="text" placeholder="搜索物品..." class="filter-input" />
      <span class="filter-icon">🔍</span>
      <div class="sort-btn" title="切换排序" @click="toggleSort">
        {{ sortOrder === 'name' ? '🔤' : '🔢' }}
      </div>
    </div>
    <div class="inventory-grid">
      <template v-if="processedItems.length > 0">
        <div
          v-for="item in processedItems"
          :key="item.name"
          class="item-card interactive-btn"
          @click="$emit('item-click', item)"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-count">x{{ item.data.数量 }}</div>
          <div class="item-desc">{{ item.data.描述 }}</div>
        </div>
      </template>
      <div v-else class="empty-inventory">口袋空空的...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InventoryItem {
  描述: string;
  数量: number;
}

const props = defineProps<{
  inventory: Record<string, InventoryItem>;
}>();

defineEmits<{
  (e: 'item-click', item: { name: string; data: InventoryItem }): void;
}>();

const filter = ref('');
const sortOrder = ref<'name' | 'count'>('name');

function toggleSort() {
  sortOrder.value = sortOrder.value === 'name' ? 'count' : 'name';
  toastr.info(`排序方式: ${sortOrder.value === 'name' ? '名称' : '数量'}`);
}

const processedItems = computed(() => {
  if (!props.inventory) return [];

  let items = Object.entries(props.inventory).map(([name, data]) => ({ name, data }));

  // 过滤
  if (filter.value) {
    const f = filter.value.toLowerCase();
    items = items.filter(item => item.name.toLowerCase().includes(f) || item.data.描述.toLowerCase().includes(f));
  }

  // 排序
  items.sort((a, b) => {
    if (sortOrder.value === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b.data.数量 - a.data.数量;
    }
  });

  return items;
});
</script>

<style lang="scss" scoped>
.inventory-section {
  margin-top: 10px;
}

.block-title {
  font-size: 18px;
  font-weight: bold;
  color: #c0392b;
  margin-bottom: 8px;
  display: inline-block;
  border-bottom: 2px solid #c0392b;
  transform: rotate(-2deg);
}

.inventory-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  position: relative;
}

.filter-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #bdc3c7;
  border-radius: 15px;
  font-size: 12px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
}

.filter-icon {
  position: absolute;
  right: 45px;
  font-size: 12px;
  opacity: 0.5;
}

.sort-btn {
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.item-card {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    border-color: #3498db;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}

.item-name {
  font-weight: bold;
  font-size: 12px;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-count {
  font-size: 10px;
  color: #7f8c8d;
}

.item-desc {
  font-size: 10px;
  color: #95a5a6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.empty-inventory {
  grid-column: 1 / -1;
  text-align: center;
  color: #95a5a6;
  font-style: italic;
  padding: 20px;
}

:global(.dark-mode) .inventory-section {
  .block-title {
    color: #ff6b6b;
    border-bottom-color: #ff6b6b;
  }

  .filter-input {
    background: rgba(255, 255, 255, 0.1);
    border-color: #566573;
    color: #ecf0f1;

    &::placeholder {
      color: #7f8c8d;
    }
  }

  .item-card {
    background: rgba(255, 255, 255, 0.05);
    border-color: #566573;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #5dade2;
    }

    .item-name {
      color: #ecf0f1;
    }

    .item-count {
      color: #bdc3c7;
    }
  }

  .empty-inventory {
    color: #7f8c8d;
  }
}

/* 响应式优化 */
@media (max-width: 360px) {
  .inventory-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 6px;
  }

  .item-card {
    padding: 6px;
  }

  .item-name {
    font-size: 11px;
  }

  .item-count {
    font-size: 9px;
  }

  .item-desc {
    font-size: 9px;
  }

  .filter-input {
    padding: 5px 8px;
    font-size: 11px;
  }

  .filter-icon {
    right: 40px;
    font-size: 11px;
  }
}
</style>
