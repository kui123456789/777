<template>
  <div class="system-bar glass-panel mb-2 flex items-center justify-between px-4 py-2">
    <div class="left-info flex gap-4 font-mono text-sm text-cyan-400">
      <div class="time flex items-center gap-1">
        <span class="icon">🕒</span>
        <span>{{ world.当前时间 }}</span>
      </div>
      <div class="date flex items-center gap-1">
        <span>{{ world.日期 }}</span>
      </div>
      <div class="location flex items-center gap-1 text-purple-300">
        <span class="icon">📍</span>
        <span>{{ world.当前地点 }}</span>
      </div>
    </div>

    <div class="right-info">
      <div class="points neon-text flex items-center gap-2">
        <span class="text-xs text-gray-400">色孽点</span>
        <div class="points-display relative">
          <span ref="pointsRef" class="font-mono text-xl font-bold text-pink-500">{{ displayPoints }}</span>
          <!-- Glow effect when points change -->
          <div
            v-if="isGlowing"
            class="animate-ping-once pointer-events-none absolute inset-0 rounded bg-pink-500/30"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
import { computed, ref, watch, onMounted } from 'vue';
import { useIntervalFn } from '@vueuse/core';
import { gsap } from 'gsap';

const store = useDataStore();
const world = computed(() => store.data.世界);

// 色孽点：优先从最新楼层读取，确保随剧情更新
const latestPoints = ref(0);

// 定期从最新楼层同步色孽点
const syncLatestPoints = () => {
  try {
    const latestData = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
    const points = _.get(latestData, 'stat_data.林海.色孽点', 0);
    if (typeof points === 'number' && !isNaN(points)) {
      latestPoints.value = points;
    }
  } catch (e) {
    // 回退到 store 的值
    latestPoints.value = store.data.林海.色孽点;
  }
};

// 每 500ms 同步一次（比默认 2s 更及时）
useIntervalFn(syncLatestPoints, 500);

const displayPoints = ref(0);
const isGlowing = ref(false);
const pointsRef = ref<HTMLElement | null>(null);

// Initialize on mount
onMounted(() => {
  syncLatestPoints();
  displayPoints.value = latestPoints.value;
});

// Animate points when they change
watch(
  () => latestPoints.value,
  (newPoints, oldPoints) => {
    if (newPoints === oldPoints) return;

    // Trigger glow effect
    isGlowing.value = true;
    setTimeout(() => {
      isGlowing.value = false;
    }, 500);

    // Animate number counting (保留1位小数)
    gsap.to(displayPoints, {
      value: newPoints,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        displayPoints.value = Math.round(displayPoints.value * 10) / 10;
      },
    });

    // Scale bounce animation on the text
    if (pointsRef.value) {
      const direction = newPoints > (oldPoints ?? 0) ? 1.2 : 0.9;
      gsap.fromTo(
        pointsRef.value,
        { scale: direction },
        {
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
        },
      );

      // Color flash for increase
      if (newPoints > (oldPoints ?? 0)) {
        gsap.fromTo(
          pointsRef.value,
          { color: '#ffffff', textShadow: '0 0 20px #ff1493' },
          { color: '#ec4899', textShadow: '0 0 5px #d500f9, 0 0 10px #d500f9', duration: 0.5 },
        );
      }
    }
  },
);
</script>

<style scoped lang="scss">
.system-bar {
  border-bottom: 2px solid var(--primary);
  background: linear-gradient(90deg, rgba(10, 5, 16, 0.9) 0%, rgba(20, 10, 30, 0.95) 50%, rgba(10, 5, 16, 0.9) 100%);
}
.icon {
  filter: drop-shadow(0 0 2px var(--secondary));
}

.points-display {
  display: inline-block;
  position: relative;
}

.animate-ping-once {
  animation: ping-once 0.5s ease-out forwards;
}

@keyframes ping-once {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
