<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore, syncLinHaiDataToLatest } from '../store';
import BackButton from '../components/common/BackButton.vue';

const store = useDataStore();

// 目标选择弹窗状态
const showTargetSelect = ref(false);
const targetSelectTitle = ref('');
const availableTargets = ref<string[]>([]);
const pendingItemAction = ref<string | null>(null);

// 输入弹窗状态
const showInputModal = ref(false);
const inputModalTitle = ref('');
const inputModalPlaceholder = ref('');
const inputValue = ref('');
const pendingInputAction = ref<string | null>(null);

// 可选目标角色列表
const allCharacters = ['鹿忻', '鹿晴', '戎华', '林曦'];

// 当前选中的物品
const selectedItem = ref<string | null>(null);

// 背包物品列表
const inventoryItems = computed(() => {
  const bag = store.data.林海.背包;
  return Object.entries(bag).map(([name, item]) => ({
    name,
    count: item.数量,
    description: item.描述 || '暂无描述',
  }));
});

// 背包是否为空
const isEmpty = computed(() => inventoryItems.value.length === 0);

// 选中物品详情
const selectedDetail = computed(() => {
  if (!selectedItem.value) return null;
  return inventoryItems.value.find(item => item.name === selectedItem.value) || null;
});

// 点击物品
const selectItem = (name: string) => {
  selectedItem.value = selectedItem.value === name ? null : name;
};

// 关闭详情
const closeDetail = () => {
  selectedItem.value = null;
};

// 关闭目标选择
const closeTargetSelect = () => {
  showTargetSelect.value = false;
  pendingItemAction.value = null;
  targetSelectTitle.value = '';
  availableTargets.value = [];
};

// 关闭输入弹窗
const closeInputModal = () => {
  showInputModal.value = false;
  pendingInputAction.value = null;
  inputModalTitle.value = '';
  inputModalPlaceholder.value = '';
  inputValue.value = '';
};

// 确认输入
const confirmInput = async () => {
  if (!pendingInputAction.value || !inputValue.value.trim()) return;

  const destination = inputValue.value.trim();
  const action = pendingInputAction.value;

  // 先关闭弹窗，保存必要数据
  closeInputModal();

  switch (action) {
    case '传送环':
      console.log('[传送环] 正在传送到:', destination);
      await consumeItem('传送环');
      // 使用 triggerSlash 发送消息并触发 AI 回复
      await triggerSlash(`/send name=系统 [林海使用传送环，将所有人传送到：${destination}]`);
      await triggerSlash('/trigger await=true');
      console.log('[传送环] 传送完成');
      return;
  }
};

// 消耗物品
const consumeItem = async (itemName: string) => {
  const item = store.data.林海.背包[itemName];
  if (!item) return;

  item.数量 -= 1;
  if (item.数量 <= 0) {
    delete store.data.林海.背包[itemName];
    selectedItem.value = null;
  }

  // 同步到最新楼层
  await syncLinHaiDataToLatest(store);
};

// 选择目标
const selectTarget = async (target: string) => {
  if (!pendingItemAction.value) return;

  const itemName = pendingItemAction.value;

  switch (itemName) {
    case '春月迷情散': {
      // 增加目标敏感度
      const targetData = store.data[target as keyof typeof store.data];
      if (targetData && '敏感度' in targetData) {
        const sensitivity = targetData.敏感度 as Record<string, number>;
        Object.keys(sensitivity).forEach(key => {
          sensitivity[key] += 10;
        });
        console.log(`使用了春月迷情散，${target}的所有敏感度+10`);
      }
      break;
    }
    case '一转还魂丹': {
      // 复活角色
      const char = store.data[target as keyof typeof store.data];
      if (char && '实时状态' in char) {
        char.实时状态.是否死亡 = false;
        console.log(`使用了一转还魂丹，复活了${target}`);
      }
      break;
    }
  }

  // 消耗物品并同步
  await consumeItem(itemName);
  closeTargetSelect();
};

// 使用物品
const useItem = async () => {
  if (!selectedItem.value) return;

  const itemName = selectedItem.value;
  const item = store.data.林海.背包[itemName];
  if (!item || item.数量 <= 0) return;

  // 根据物品名称执行不同效果
  switch (itemName) {
    case '透视眼镜':
      if (store.data.林海.手机功能) {
        store.data.林海.手机功能.透视开启 = true;
        console.log('透视眼镜已开启');
        // 透视眼镜通常不消耗，或者消耗一次性？题目未明确说是开关还是消耗品。
        // 既然在背包里，通常是消耗品或者装备。题目说 "store.data.林海.手机功能.透视开启 = true"
        // 假设是一次性开启道具，消耗掉。
        await consumeItem(itemName);
      }
      break;

    case '龙虎倍力丸':
      // 增加所有角色体力 +20
      allCharacters.forEach(charName => {
        const char = store.data[charName as keyof typeof store.data];
        if (char && '体力' in char) {
          char.体力 += 20;
        }
      });
      console.log('使用了龙虎倍力丸，全员体力+20');
      await consumeItem(itemName);
      break;

    case '春月迷情散':
      pendingItemAction.value = itemName;
      targetSelectTitle.value = '选择使用目标';
      availableTargets.value = [...allCharacters]; // 所有角色可选
      showTargetSelect.value = true;
      // 物品消耗在 selectTarget 中处理
      break;

    case '一转还魂丹':
      // 检查哪些角色已死亡
      {
        const deadChars = allCharacters.filter(charName => {
          const char = store.data[charName as keyof typeof store.data];
          return char && '实时状态' in char && char.实时状态.是否死亡 === true;
        });

        if (deadChars.length === 0) {
          // 如果没有死亡角色，可能无法使用或者提示
          console.log('没有需要复活的角色');
          // 这里可以选择提示用户，或者不消耗物品
          // 简单起见，暂不消耗
          return;
        }

        pendingItemAction.value = itemName;
        targetSelectTitle.value = '选择复活目标';
        availableTargets.value = deadChars;
        showTargetSelect.value = true;
      }
      break;

    case '传送环':
      // 弹出输入框让用户输入传送目的地
      pendingInputAction.value = itemName;
      inputModalTitle.value = '传送目的地';
      inputModalPlaceholder.value = '输入要传送到的地点...';
      inputValue.value = '';
      showInputModal.value = true;
      break;

    case '定制机器人':
      // 使用 triggerSlash 发送消息并触发 AI 回复
      await triggerSlash('/send name=系统 [林海激活了定制机器人林曦，机器人缓缓启动，LED眼睛亮起...]');
      await triggerSlash('/trigger await=true');
      await consumeItem(itemName);
      break;

    default:
      // 默认效果：仅消耗（原有逻辑）
      console.log('使用了普通物品:', itemName);
      await consumeItem(itemName);
      break;
  }
};

// 丢弃物品
const discardItem = async () => {
  if (!selectedItem.value) return;
  const itemName = selectedItem.value;
  await consumeItem(itemName);
  console.log('丢弃物品:', itemName);
};
</script>

<template>
  <div
    class="inventory-view flex min-h-full w-full flex-col bg-gradient-to-b from-[#0a0a15] via-[#1a0b2e] to-[#0a0a15]"
  >
    <!-- Header -->
    <header
      class="flex items-center gap-3 border-b border-[var(--theme-color)]/20 bg-black/40 px-4 py-3 backdrop-blur-md"
    >
      <BackButton />
      <div class="flex flex-1 items-center gap-2">
        <span class="text-2xl">🎒</span>
        <h1 class="text-lg font-bold tracking-wider text-white">背包</h1>
      </div>
      <!-- 物品计数 -->
      <div class="flex items-center gap-2 rounded-full border border-[var(--theme-secondary)]/30 bg-black/30 px-3 py-1">
        <span class="text-xs text-[var(--theme-secondary)]">物品</span>
        <span class="font-mono text-sm text-white">{{ inventoryItems.length }}</span>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 overflow-y-auto p-4">
      <!-- 空背包提示 -->
      <div v-if="isEmpty" class="empty-state flex h-full flex-col items-center justify-center py-12">
        <div class="icon-container relative mb-6">
          <div class="text-6xl opacity-50">🎒</div>
          <div class="pulse-ring"></div>
        </div>
        <p class="mb-2 text-lg text-[var(--theme-secondary)]/70">背包空空如也</p>
        <p class="text-sm text-gray-500">探索世界，收集道具吧</p>
      </div>

      <!-- 物品网格 -->
      <div v-else class="item-grid grid grid-cols-3 gap-3">
        <button
          v-for="item in inventoryItems"
          :key="item.name"
          class="item-card group relative rounded-xl border p-3 transition-all duration-300"
          :class="[
            selectedItem === item.name
              ? 'border-[var(--theme-color)] bg-[var(--theme-color)]/20 shadow-[0_0_20px_rgba(255,0,255,0.3)]'
              : 'border-white/10 bg-black/40 hover:border-[var(--theme-color)]/50 hover:bg-black/60',
          ]"
          @click="selectItem(item.name)"
        >
          <!-- 物品图标占位 -->
          <div
            class="item-icon mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg text-2xl transition-transform duration-300 group-hover:scale-110"
            :class="[
              selectedItem === item.name
                ? 'bg-[var(--theme-color)]/30'
                : 'bg-gradient-to-br from-[var(--theme-secondary)]/20 to-[var(--theme-color)]/10',
            ]"
          >
            📦
          </div>

          <!-- 物品名称 -->
          <p
            class="item-name truncate text-center text-xs font-medium transition-colors"
            :class="[selectedItem === item.name ? 'text-[var(--theme-color)]' : 'text-gray-300 group-hover:text-white']"
          >
            {{ item.name }}
          </p>

          <!-- 数量标签 -->
          <div
            class="count-badge absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold"
            :class="[
              selectedItem === item.name
                ? 'bg-[var(--theme-color)] text-black'
                : 'bg-[var(--theme-secondary)] text-black',
            ]"
          >
            {{ item.count }}
          </div>

          <!-- 选中指示器 -->
          <div
            v-if="selectedItem === item.name"
            class="selected-indicator pointer-events-none absolute inset-0 rounded-xl"
          ></div>
        </button>
      </div>
    </main>

    <!-- 物品详情面板 -->
    <Transition name="slide-up">
      <div
        v-if="selectedDetail"
        class="detail-panel fixed right-0 bottom-0 left-0 z-50 border-t border-[var(--theme-color)]/30 bg-gradient-to-t from-black via-black/95 to-black/90 p-4 backdrop-blur-xl"
      >
        <!-- 关闭按钮 -->
        <button
          class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-white/20 hover:text-white"
          @click="closeDetail"
        >
          ✕
        </button>

        <div class="flex gap-4">
          <!-- 物品图标 -->
          <div
            class="detail-icon flex h-16 w-16 items-center justify-center rounded-xl border border-[var(--theme-color)]/30 bg-gradient-to-br from-[var(--theme-color)]/30 to-[var(--theme-secondary)]/20 text-3xl"
          >
            📦
          </div>

          <!-- 物品信息 -->
          <div class="flex-1">
            <h3 class="mb-1 text-lg font-bold text-[var(--theme-color)]">
              {{ selectedDetail.name }}
            </h3>
            <div class="mb-2 flex items-center gap-2">
              <span class="text-xs text-gray-500">持有数量</span>
              <span class="font-mono text-sm text-[var(--theme-secondary)]">×{{ selectedDetail.count }}</span>
            </div>
            <p class="text-sm leading-relaxed text-gray-400">
              {{ selectedDetail.description }}
            </p>
          </div>
        </div>

        <!-- 操作按钮区 -->
        <div class="action-buttons mt-4 flex gap-3">
          <button
            class="flex-1 rounded-lg border border-[var(--theme-color)]/50 bg-[var(--theme-color)]/20 py-2.5 text-sm font-medium text-[var(--theme-color)] transition-colors hover:bg-[var(--theme-color)]/30"
            @click="useItem"
          >
            使用
          </button>
          <button
            class="flex-1 rounded-lg border border-white/20 bg-white/5 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            @click="discardItem"
          >
            丢弃
          </button>
        </div>
      </div>
    </Transition>

    <!-- 目标选择弹窗 -->
    <Transition name="fade">
      <div
        v-if="showTargetSelect"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        @click.self="closeTargetSelect"
      >
        <div class="w-full max-w-sm rounded-2xl border border-[var(--theme-color)]/30 bg-[#1a0b2e]/90 p-6 shadow-2xl">
          <h3 class="mb-6 text-center text-xl font-bold text-white">{{ targetSelectTitle }}</h3>

          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="target in availableTargets"
              :key="target"
              class="rounded-xl border border-white/10 bg-white/5 py-4 text-center transition-all hover:border-[var(--theme-color)] hover:bg-[var(--theme-color)]/20 active:scale-95"
              @click="selectTarget(target)"
            >
              <div class="mb-1 text-2xl">👤</div>
              <span class="text-sm font-medium text-gray-200">{{ target }}</span>
            </button>
          </div>

          <button
            class="mt-6 w-full rounded-lg bg-white/10 py-3 text-sm font-medium text-gray-400 hover:bg-white/20 hover:text-white"
            @click="closeTargetSelect"
          >
            取消
          </button>
        </div>
      </div>
    </Transition>

    <!-- 输入弹窗 -->
    <Transition name="fade">
      <div
        v-if="showInputModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        @click.self="closeInputModal"
      >
        <div class="w-full max-w-sm rounded-2xl border border-[var(--theme-color)]/30 bg-[#1a0b2e]/90 p-6 shadow-2xl">
          <h3 class="mb-4 text-center text-xl font-bold text-white">{{ inputModalTitle }}</h3>

          <input
            v-model="inputValue"
            type="text"
            :placeholder="inputModalPlaceholder"
            class="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white placeholder-gray-500 transition-colors outline-none focus:border-[var(--theme-color)] focus:bg-black/60"
            @keyup.enter="confirmInput"
          />

          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-lg border border-[var(--theme-color)]/50 bg-[var(--theme-color)]/20 py-3 text-sm font-medium text-[var(--theme-color)] transition-colors hover:bg-[var(--theme-color)]/30"
              @click="confirmInput"
            >
              确认
            </button>
            <button
              class="flex-1 rounded-lg bg-white/10 py-3 text-sm font-medium text-gray-400 hover:bg-white/20 hover:text-white"
              @click="closeInputModal"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 背景装饰 -->
    <div class="bg-decor pointer-events-none">
      <div class="grid-overlay"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inventory-view {
  position: relative;
}

/* 空状态动画 */
.empty-state {
  .icon-container {
    position: relative;

    .pulse-ring {
      position: absolute;
      inset: -20px;
      border: 2px solid var(--theme-secondary);
      border-radius: 50%;
      opacity: 0.3;
      animation: pulse-expand 2s ease-out infinite;
    }
  }
}

@keyframes pulse-expand {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 物品卡片选中指示器 */
.selected-indicator {
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border: 2px solid var(--theme-color);
    border-radius: inherit;
    animation: selected-pulse 1.5s ease-out infinite;
  }
}

@keyframes selected-pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
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

/* 背景网格装饰 */
.bg-decor {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 0, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 0, 255, 0.03) 1px, transparent 1px);
    background-size: 30px 30px;
  }
}

/* 确保内容在装饰上层 */
header,
main,
.detail-panel {
  position: relative;
  z-index: 1;
}

/* 物品网格响应式 */
@media (min-width: 400px) {
  .item-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 详情面板安全区域 */
.detail-panel {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
