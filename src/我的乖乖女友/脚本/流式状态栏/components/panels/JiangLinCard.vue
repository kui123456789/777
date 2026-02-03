<script setup lang="ts">
import { ref } from 'vue';
import { Schema } from '../../../schema';
import ProgressRing from '../ProgressRing.vue';
import StatBadge from '../StatBadge.vue';
import StatusCard from '../StatusCard.vue';
import CharacterAvatar from '../CharacterAvatar.vue';

defineProps<{
  data: Schema;
}>();

const showBody = ref(false);
</script>

<template>
  <StatusCard class="bg-gradient-to-br from-pink-500/10 to-rose-500/10">
    <div class="flex items-center gap-4 mb-4">
      <CharacterAvatar name="姜林" color="bg-pink-500/40" />
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-white truncate">姜林</h3>
        <div class="text-xs text-white/60 truncate">{{ data.姜林.关系状态 }}</div>
      </div>
      <div class="ml-auto flex gap-2">
        <StatBadge label="心情" :value="data.姜林.基础状态.心情" />
        <StatBadge label="现金" :value="`¥${data.姜林.财务.现金}`" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col items-center gap-2 bg-white/5 p-3 rounded-xl transition hover:bg-white/10">
        <span class="text-xs text-white/60">好感度</span>
        <ProgressRing :model-value="data.姜林.好感度" color="text-pink-400" />
      </div>
      <div class="flex flex-col items-center gap-2 bg-white/5 p-3 rounded-xl transition hover:bg-white/10">
        <span class="text-xs text-white/60">体力</span>
        <ProgressRing :model-value="data.姜林.基础状态.体力" color="text-rose-400" />
      </div>
    </div>

    <!-- Body Data Toggle -->
    <button
      @click="showBody = !showBody"
      class="w-full mt-4 py-2 text-xs text-white/50 hover:text-white/80 transition border-t border-white/10"
    >
      {{ showBody ? '▲ 收起身体数据' : '▼ 展开身体数据' }}
    </button>

    <!-- Body Data Panel -->
    <Transition name="slide">
      <div v-if="showBody" class="mt-3 space-y-2">
        <!-- Basic Body -->
        <div class="flex gap-2 text-xs">
          <span class="bg-white/5 px-2 py-1 rounded">腿长: {{ data.姜林.身体.腿长 }}</span>
          <span class="bg-white/5 px-2 py-1 rounded">大腿围: {{ data.姜林.身体.大腿围 }}</span>
        </div>

        <!-- Private Parts -->
        <div class="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 space-y-2">
          <div class="text-xs font-bold text-pink-300 mb-2">私密部位</div>
          <div class="grid grid-cols-1 gap-1.5 text-xs">
            <div class="flex justify-between">
              <span class="text-white/50">乳房</span>
              <span class="text-white/80">{{ data.姜林.身体.私密部位.乳房 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/50">胸部</span>
              <span class="text-white/80">{{ data.姜林.身体.私密部位.胸部 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/50">乳头</span>
              <span class="text-white/80">{{ data.姜林.身体.私密部位.乳头状态 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/50">下体</span>
              <span class="text-white/80">{{ data.姜林.身体.私密部位.下体 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/50">小穴</span>
              <span class="text-white/80">{{ data.姜林.身体.私密部位.小穴 }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </StatusCard>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
