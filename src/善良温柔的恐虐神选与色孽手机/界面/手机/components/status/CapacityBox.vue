<template>
  <div class="capacity-box mt-2 text-xs">
    <div class="mb-1 flex items-center justify-between text-gray-500">
      <span>身体状态</span>
      <span v-if="data.腹部隆起" class="blink font-bold text-red-500">⚠ 怀孕/满载</span>
    </div>

    <!-- Liquid Levels -->
    <div class="liquids mb-2 grid grid-cols-2 gap-2">
      <div class="liquid-meter">
        <div class="mb-0.5 flex justify-between">
          <span class="text-[10px] text-pink-300">子宫</span>
          <span class="font-mono text-[10px]">{{ getWombVolume }}ml</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div
            class="h-full bg-pink-500 transition-all duration-500"
            :style="{ width: `${Math.min(getWombVolume / 20, 100)}%` }"
          ></div>
        </div>
      </div>

      <div class="liquid-meter">
        <div class="mb-0.5 flex justify-between">
          <span class="text-[10px] text-yellow-600">肠道</span>
          <span class="font-mono text-[10px]">{{ getBowelVolume }}ml</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div
            class="h-full bg-yellow-600 transition-all duration-500"
            :style="{ width: `${Math.min(getBowelVolume / 20, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Foreign Objects -->
    <div v-if="hasObjects" class="foreign-objects rounded border border-red-900/30 bg-red-900/10 p-2">
      <div class="mb-1 text-[10px] text-red-400">⚠ 检测到物体</div>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="(desc, name) in data.异物"
          :key="name"
          class="rounded border border-red-800 bg-red-950 px-1.5 py-0.5 text-[10px] text-red-200"
        >
          {{ name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    子宫精液量?: number;
    人造子宫精液量?: number;
    肠道精液量?: number;
    腹部隆起?: boolean;
    异物?: Record<string, string>;
  };
}>();

const getWombVolume = computed(() => {
  return props.data.子宫精液量 || props.data.人造子宫精液量 || 0;
});

const getBowelVolume = computed(() => {
  return props.data.肠道精液量 || 0;
});

const hasObjects = computed(() => {
  return props.data.异物 && Object.keys(props.data.异物).length > 0;
});
</script>

<style scoped>
.blink {
  animation: blinker 1.5s linear infinite;
}
@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
