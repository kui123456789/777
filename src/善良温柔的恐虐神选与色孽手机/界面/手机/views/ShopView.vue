<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore, syncLinHaiDataToLatest } from '../store';
import BackButton from '../components/common/BackButton.vue';
import { gsap } from 'gsap';
import type { ShopItem } from '@/善良温柔的恐虐神选与色孽手机/schema';

const store = useDataStore();

// 色孽点余额
const balance = computed(() => store.data.林海.色孽点);

// 商品分类
type Category = '特殊' | '消耗品' | '装备';
const selectedCategory = ref<Category>('特殊');

const categories: { id: Category; icon: string; label: string }[] = [
  { id: '特殊', icon: '✨', label: '特殊' },
  { id: '消耗品', icon: '💊', label: '消耗品' },
  { id: '装备', icon: '🔧', label: '装备' },
];

// 基础商品数据 (静态商品 - 根据世界书设定)
const baseShopItems: ShopItem[] = [
  // 特殊类
  {
    id: 'custom_robot',
    name: '定制机器人',
    description: '可完全定制外观和功能的高级机器人伴侣，支持多种模式',
    price: 5,
    icon: '🤖',
    category: '特殊',
  },
  {
    id: 'teleport_ring',
    name: '传送环',
    description: '可将目标瞬间传送到指定位置的神秘戒指',
    price: 0.2,
    icon: '💍',
    category: '特殊',
  },
  // 装备类
  {
    id: 'xray_glasses',
    name: '透视眼镜',
    description: '增强透视能力，可看穿衣物和墙壁的特殊眼镜',
    price: 0.5,
    icon: '👓',
    category: '装备',
  },
  // 消耗品类
  {
    id: 'dragon_tiger_pill',
    name: '龙虎倍力丸',
    description: '大幅提升体力和持久力，效果持续一段时间',
    price: 0.5,
    icon: '💪',
    category: '消耗品',
    stackable: true,
  },
  {
    id: 'spring_moon_powder',
    name: '春月迷情散',
    description: '使目标陷入迷乱状态，大幅提升敏感度',
    price: 0.1,
    icon: '🌙',
    category: '消耗品',
    stackable: true,
  },
  {
    id: 'revival_pill',
    name: '一转还魂丹',
    description: '可使死亡目标复活的神奇丹药（3枚装）',
    price: 0.1,
    icon: '💊',
    category: '消耗品',
    stackable: true,
    quantity: 3,
  },
];

// 合并静态商品 + AI解锁的动态商品
const allShopItems = computed<ShopItem[]>(() => {
  const dynamicItems = Object.values(store.data.林海.解锁商品 || {});
  return [...baseShopItems, ...dynamicItems];
});

// 当前分类的商品
const currentItems = computed(() => allShopItems.value.filter(item => item.category === selectedCategory.value));

// 选中的商品
const selectedItem = ref<ShopItem | null>(null);

// 购买成功动画状态
const purchaseSuccess = ref(false);

// 选择商品
const selectItem = (item: ShopItem) => {
  selectedItem.value = selectedItem.value?.id === item.id ? null : item;
};

// 是否能购买
const canAfford = (price: number) => balance.value >= price;

// 获取背包中物品数量 (使用中文名称查询)
const getOwnedCount = (itemName: string) => {
  const item = store.data.林海.背包[itemName];
  return item?.数量 ?? 0;
};

// 购买商品
const purchaseItem = async (item: ShopItem) => {
  if (!canAfford(item.price)) return;

  // 扣除色孽点 (修复浮点数精度问题)
  store.data.林海.色孽点 = Math.round((store.data.林海.色孽点 - item.price) * 1000) / 1000;

  // 添加到背包 (使用中文名称作为键名)
  const quantity = item.quantity ?? 1;
  if (store.data.林海.背包[item.name]) {
    store.data.林海.背包[item.name].数量 += quantity;
  } else {
    store.data.林海.背包[item.name] = {
      数量: quantity,
      描述: item.description,
    };
  }

  // 同步到最新楼层 (关键修复：解决 AI 生成新楼层时变量不同步问题)
  await syncLinHaiDataToLatest(store);

  // 播放购买成功动画
  purchaseSuccess.value = true;
  gsap.fromTo(
    '.purchase-btn',
    { scale: 1 },
    {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        purchaseSuccess.value = false;
      },
    },
  );

  console.log('购买成功:', item.name, 'x', quantity);
};

// 关闭详情
const closeDetail = () => {
  selectedItem.value = null;
};

// 格式化价格显示
const formatPrice = (price: number) => {
  return price >= 1 ? price.toFixed(0) : price.toFixed(1);
};
</script>

<template>
  <div class="shop-view flex min-h-full w-full flex-col bg-gradient-to-b from-[#0a050f] via-[#1a0a20] to-[#0a050f]">
    <!-- Header -->
    <header class="flex items-center gap-3 border-b border-pink-500/20 bg-black/40 px-4 py-3 backdrop-blur-md">
      <BackButton />
      <div class="flex flex-1 items-center gap-2">
        <span class="text-2xl">🛒</span>
        <h1 class="text-lg font-bold tracking-wider text-white">色孽商店</h1>
      </div>
      <!-- 余额显示 -->
      <div
        class="balance-display flex items-center gap-2 rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-3 py-1.5"
      >
        <span class="text-lg">💎</span>
        <span class="font-mono text-sm font-bold text-pink-300">{{ balance }}</span>
      </div>
    </header>

    <!-- 分类标签 -->
    <nav class="category-tabs flex gap-2 border-b border-white/5 bg-black/20 px-4 py-3">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="category-btn flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all"
        :class="[
          selectedCategory === cat.id
            ? 'border border-pink-400/50 bg-pink-500/30 text-pink-300'
            : 'border border-white/10 bg-black/30 text-gray-400 hover:border-pink-400/30',
        ]"
        @click="selectedCategory = cat.id"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ cat.label }}</span>
      </button>
    </nav>

    <main class="flex-1 overflow-y-auto p-4">
      <!-- 商品网格 -->
      <div class="item-grid grid grid-cols-2 gap-3">
        <button
          v-for="item in currentItems"
          :key="item.id"
          class="shop-item group relative rounded-xl border p-4 text-left transition-all duration-300"
          :class="[
            selectedItem?.id === item.id
              ? 'border-pink-400 bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
              : 'border-white/10 bg-black/40 hover:border-pink-400/50',
          ]"
          @click="selectItem(item)"
        >
          <!-- 商品图标 -->
          <div
            class="item-icon mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
            :class="[
              selectedItem?.id === item.id ? 'bg-pink-500/30' : 'bg-gradient-to-br from-pink-500/20 to-purple-500/10',
            ]"
          >
            {{ item.icon }}
          </div>

          <!-- 商品名称 -->
          <p
            class="item-name mb-1 truncate text-center text-sm font-medium"
            :class="[selectedItem?.id === item.id ? 'text-pink-300' : 'text-gray-200']"
          >
            {{ item.name }}
          </p>

          <!-- 价格 -->
          <div class="price flex items-center justify-center gap-1">
            <span class="text-xs">💎</span>
            <span
              class="font-mono text-sm font-bold"
              :class="[canAfford(item.price) ? 'text-pink-400' : 'text-red-400']"
            >
              {{ formatPrice(item.price) }}
            </span>
          </div>

          <!-- 已拥有数量 -->
          <div
            v-if="getOwnedCount(item.name) > 0"
            class="owned absolute top-2 right-2 rounded border border-cyan-400/30 bg-cyan-500/30 px-1.5 py-0.5 text-[10px] text-cyan-300"
          >
            x{{ getOwnedCount(item.name) }}
          </div>
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="currentItems.length === 0" class="empty-state py-12 text-center">
        <p class="mb-4 text-4xl opacity-50">🛒</p>
        <p class="text-gray-500">该分类暂无商品</p>
      </div>
    </main>

    <!-- 商品详情面板 -->
    <Transition name="slide-up">
      <div
        v-if="selectedItem"
        class="detail-panel fixed right-0 bottom-0 left-0 z-50 border-t border-pink-500/30 bg-gradient-to-t from-black via-black/95 to-black/90 p-4 backdrop-blur-xl"
      >
        <!-- 关闭按钮 -->
        <button
          class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-white/20 hover:text-white"
          @click="closeDetail"
        >
          ✕
        </button>

        <div class="flex gap-4">
          <!-- 商品图标 -->
          <div
            class="detail-icon flex h-16 w-16 items-center justify-center rounded-xl border border-pink-500/30 bg-gradient-to-br from-pink-500/30 to-purple-500/20 text-3xl"
          >
            {{ selectedItem.icon }}
          </div>

          <!-- 商品信息 -->
          <div class="flex-1">
            <h3 class="mb-1 text-lg font-bold text-pink-300">
              {{ selectedItem.name }}
            </h3>
            <p class="mb-2 text-sm leading-relaxed text-gray-400">
              {{ selectedItem.description }}
            </p>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <span class="text-sm">💎</span>
                <span
                  class="font-mono text-lg font-bold"
                  :class="[canAfford(selectedItem.price) ? 'text-pink-400' : 'text-red-400']"
                >
                  {{ formatPrice(selectedItem.price) }}
                </span>
              </div>
              <span v-if="getOwnedCount(selectedItem.name) > 0" class="text-xs text-cyan-400">
                已拥有: {{ getOwnedCount(selectedItem.name) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 购买按钮 -->
        <button
          class="purchase-btn mt-4 w-full rounded-xl py-3 text-sm font-bold transition-all"
          :class="[
            canAfford(selectedItem.price)
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:from-pink-400 hover:to-purple-400'
              : 'cursor-not-allowed bg-gray-700 text-gray-400',
          ]"
          :disabled="!canAfford(selectedItem.price)"
          @click="purchaseItem(selectedItem)"
        >
          {{ canAfford(selectedItem.price) ? '购买' : '余额不足' }}
        </button>
      </div>
    </Transition>

    <!-- 背景装饰 -->
    <div class="bg-effects pointer-events-none">
      <div class="sparkles"></div>
      <div class="gradient-orb"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shop-view {
  position: relative;
}

/* 余额显示动画 */
.balance-display {
  animation: balance-glow 2s ease-in-out infinite alternate;
}

@keyframes balance-glow {
  from {
    box-shadow: 0 0 5px rgba(236, 72, 153, 0.3);
  }
  to {
    box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
  }
}

/* 分类按钮 */
.category-btn {
  flex-shrink: 0;
}

/* 商品卡片悬停 */
.shop-item {
  &:hover .item-icon {
    animation: item-bounce 0.5s ease;
  }
}

@keyframes item-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

/* 详情面板滑入动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 购买按钮悬停效果 */
.purchase-btn:not(:disabled):hover {
  transform: scale(1.02);
}

.purchase-btn:not(:disabled):active {
  transform: scale(0.98);
}

/* 背景效果 */
.bg-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;

  .sparkles {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  }

  .gradient-orb {
    position: absolute;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
    filter: blur(40px);
  }
}

/* 确保内容在背景上层 */
header,
nav,
main,
.detail-panel {
  position: relative;
  z-index: 1;
}

/* 详情面板安全区域 */
.detail-panel {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
}
</style>
