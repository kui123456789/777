<template>
  <div class="character-card glass-panel mb-2 border-l-2 p-3" :class="borderColorClass">
    <!-- Header -->
    <div class="header mb-2 flex items-start justify-between">
      <div class="name-block">
        <div class="neon-text text-lg leading-none font-bold tracking-wide">{{ name }}</div>
        <div class="mt-1 text-[10px] text-gray-500 uppercase">{{ statusText }}</div>
      </div>
      <div class="stats-mini text-right">
        <div class="font-mono text-xs" :class="staminaClass">体力: {{ charData.体力 }}%</div>
        <div class="font-mono text-xs text-pink-400">好感: {{ charData.好感度 }}%</div>
        <!-- 戎华专属: 星怒值 -->
        <div v-if="hasStarRage" class="font-mono text-xs text-yellow-500">星怒: {{ charData.星怒值 }}</div>
      </div>
    </div>

    <!-- Pulse/Status Visualization -->
    <div class="status-viz relative mb-3 h-1 w-full overflow-hidden rounded-full bg-gray-800">
      <div
        class="animate-scan absolute h-full w-1/3 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"
        :class="statusColorClass"
      ></div>
    </div>

    <!-- Sensitivity Grid -->
    <SenseGrid :sense-data="charData.敏感度" />

    <!-- Capacity/Fullness -->
    <CapacityBox :data="charData.身体容纳" />

    <!-- Deep Physiology Panel -->
    <DeepPhysiologyPanel :data="charData.深层生理" class="mt-2" />

    <!-- Hypnosis Panel -->
    <HypnosisPanel :data="charData.催眠状态" class="mt-2" />

    <!-- Orgasm Stats -->
    <div class="orgasm-stats mt-2 flex justify-between border-t border-gray-800 pt-2 text-[10px] text-gray-500">
      <span
        >高潮累计: <b class="text-gray-300">{{ charData.高潮统计.累计次数 }}</b></span
      >
      <span
        >最大强度: <b class="text-gray-300">{{ charData.高潮统计.单次最高幅度 }}%</b></span
      >
    </div>

    <!-- Clothing Toggle -->
    <div class="clothing-section mt-2">
      <div
        class="flex cursor-pointer items-center gap-1 text-[10px] text-cyan-600 transition-colors hover:text-cyan-400"
        @click="toggleClothing"
      >
        <span>{{ showClothing ? '▼' : '▶' }} 服装扫描</span>
      </div>
      <div
        ref="clothingListRef"
        class="clothing-list mt-1 grid grid-cols-2 gap-1 overflow-hidden border-l border-gray-700 pl-2"
      >
        <div v-for="(desc, part) in charData.着装" :key="part" class="text-[10px] text-gray-400">
          <span class="mr-1 text-gray-600">{{ part }}:</span>
          <span>{{ desc }}</span>
        </div>
        <div v-if="Object.keys(charData.着装).length === 0" class="text-[10px] text-red-500 italic">裸露</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SenseGrid from './SenseGrid.vue';
import CapacityBox from './CapacityBox.vue';
import DeepPhysiologyPanel from './DeepPhysiologyPanel.vue';
import HypnosisPanel from './HypnosisPanel.vue';
import { useClothingToggle } from '../../composables/useClothingToggle';

const props = defineProps<{
  name: string;
  charData: {
    体力: number;
    好感度: number;
    当前状态: string;
    敏感度: Record<string, number>;
    高潮统计: { 单次最高幅度: number; 累计次数: number };
    身体容纳: Record<string, unknown>;
    着装: Record<string, string>;
    星怒值?: number; // 戎华专属
    深层生理: {
      心跳: number;
      呼吸频率: number;
      体温: number;
      荷尔蒙: { 多巴胺: number; 内啡肽: number; 肾上腺素: number; 催产素: number };
      神经反应度: number;
      肌肉紧张度: number;
      瞳孔扩张: number;
    };
    催眠状态: {
      催眠深度: number;
      暗示接受度: number;
      抵抗力: number;
      意识模糊度: number;
      植入暗示: Record<string, { 内容: string; 强度: number; 触发词?: string; 激活状态: boolean }>;
      累计催眠次数: number;
    };
  };
}>();

// 使用 composable 处理着装展开/收起动画
const { showClothing, clothingListRef, toggleClothing } = useClothingToggle();

// 戎华专属: 星怒值
const hasStarRage = computed(() => props.name === '戎华' && props.charData.星怒值 !== undefined);

const staminaClass = computed(() => {
  const hp = props.charData.体力;
  if (hp < 30) return 'text-red-500 blink';
  if (hp < 60) return 'text-yellow-500';
  return 'text-green-500';
});

const statusText = computed(() => props.charData.当前状态);

const borderColorClass = computed(() => {
  if (props.name === '戎华') return 'border-yellow-500'; // RongHua special
  return 'border-purple-500';
});

const statusColorClass = computed(() => {
  if (props.charData.当前状态.includes('高潮') || props.charData.当前状态.includes('崩溃')) return 'text-red-500';
  return 'text-cyan-500';
});
</script>

<style scoped>
.animate-scan {
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(350%);
  }
}

.blink {
  animation: pulse-red 1s infinite;
}

@keyframes pulse-red {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
