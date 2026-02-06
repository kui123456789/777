<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { useDataStore, setupMessageListeners } from './store';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

// 消息事件监听清理函数
let cleanupListeners: (() => void) | null = null;

onMounted(() => {
  // 注册消息事件监听，当 AI 生成/更新消息时自动刷新数据
  cleanupListeners = setupMessageListeners(store);
});

onUnmounted(() => {
  // 清理事件监听
  if (cleanupListeners) {
    cleanupListeners();
  }
});

// 折叠状态
const isCollapsed = ref(false);
const phoneRef = ref<HTMLElement | null>(null);

// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Track navigation direction for slide animation
const transitionName = ref('slide-left');

// Watch route changes to determine direction
watch(
  () => route.path,
  (to, from) => {
    // Going to home = slide right (going back)
    // Going from home = slide left (going forward)
    if (to === '/') {
      transitionName.value = 'slide-right';
    } else if (from === '/') {
      transitionName.value = 'slide-left';
    } else {
      // Default to fade for same-level navigation
      transitionName.value = 'fade';
    }
  },
);

// Listen for back navigation
router.beforeEach((to, from, next) => {
  const historyState = window.history.state;
  if (historyState && historyState.back === to.path) {
    transitionName.value = 'slide-right';
  }
  next();
});
</script>

<template>
  <!-- 折叠时显示的小图标 -->
  <Transition name="icon-fade">
    <div v-if="isCollapsed" class="collapsed-icon" title="展开西伯纽斯手机" @click="toggleCollapse">
      <div class="icon-inner">
        <span class="icon-emoji">📱</span>
        <div class="icon-glow"></div>
        <div class="icon-pulse"></div>
      </div>
      <span class="icon-label">手机</span>
    </div>
  </Transition>

  <!-- 手机主界面 -->
  <Transition name="phone-collapse">
    <div v-show="!isCollapsed" ref="phoneRef" class="phone-wrapper">
      <!-- 折叠按钮 -->
      <button class="collapse-btn" title="收起手机" @click="toggleCollapse">
        <span class="collapse-icon">⏷</span>
        <span class="collapse-text">收起</span>
      </button>

      <div
        class="phone-container relative min-h-full w-full bg-gradient-to-br from-[#0a0a15] via-[#1a0b2e] to-[#0a0a15]"
      >
        <!-- Background Grid Pattern -->
        <div
          class="pointer-events-none absolute inset-0 opacity-5"
          style="
            background-image:
              linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          "
        ></div>

        <!-- Top Glow -->
        <div
          class="pointer-events-none absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-[var(--theme-color)]/10 to-transparent"
        ></div>

        <!-- Router View with Transitions -->
        <RouterView v-slot="{ Component, route: currentRoute }">
          <Transition :name="transitionName" mode="out-in">
            <component :is="Component" :key="currentRoute.path" />
          </Transition>
        </RouterView>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.phone-wrapper {
  width: 100%;
  min-height: 100%;
  position: relative;
}

.phone-container {
  overflow-x: hidden;
}

/* 折叠按钮 - 更大更醒目 */
.collapse-btn {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 8px 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.25) 0%, rgba(10, 10, 21, 0.9) 100%);
  border: 2px solid var(--theme-color);
  color: var(--theme-color);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);
  box-shadow:
    0 0 12px rgba(255, 0, 255, 0.4),
    inset 0 0 8px rgba(255, 0, 255, 0.1);
  animation: collapse-btn-glow 2s ease-in-out infinite alternate;
}

@keyframes collapse-btn-glow {
  0% {
    box-shadow:
      0 0 12px rgba(255, 0, 255, 0.4),
      inset 0 0 8px rgba(255, 0, 255, 0.1);
  }
  100% {
    box-shadow:
      0 0 20px rgba(255, 0, 255, 0.6),
      inset 0 0 12px rgba(255, 0, 255, 0.2);
  }
}

.collapse-btn:hover {
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.4) 0%, rgba(30, 10, 50, 0.95) 100%);
  border-color: #ff66ff;
  color: #fff;
  box-shadow:
    0 0 25px rgba(255, 0, 255, 0.7),
    inset 0 0 15px rgba(255, 0, 255, 0.3);
  transform: translateX(-50%) scale(1.05);
}

.collapse-btn:active {
  transform: translateX(-50%) scale(0.98);
}

.collapse-icon {
  font-size: 16px;
  line-height: 1;
  transition: transform 0.3s ease;
}

.collapse-btn:hover .collapse-icon {
  transform: translateY(2px);
}

.collapse-text {
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* 折叠后的小图标 */
.collapsed-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collapsed-icon:hover {
  transform: scale(1.1);
}

.collapsed-icon:hover .icon-inner {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.6);
}

.icon-inner {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a0b2e 0%, #0a0a15 100%);
  border: 2px solid var(--theme-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
  transition: all 0.3s ease;
}

.icon-emoji {
  font-size: 24px;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  background: linear-gradient(45deg, var(--theme-color), var(--theme-secondary));
  opacity: 0.3;
  filter: blur(8px);
  z-index: 0;
}

.icon-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 16px;
  border: 2px solid var(--theme-color);
  animation: icon-pulse 2s ease-out infinite;
  z-index: 0;
}

@keyframes icon-pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.4);
  }
}

.icon-label {
  font-size: 10px;
  color: rgba(255, 0, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

/* 过渡动画 */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s ease;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.phone-collapse-enter-active,
.phone-collapse-leave-active {
  transition: all 0.4s ease;
  transform-origin: top right;
}

.phone-collapse-enter-from,
.phone-collapse-leave-to {
  opacity: 0;
  transform: scale(0.1);
}
</style>
