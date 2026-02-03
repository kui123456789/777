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
  <StatusCard class="bg-gradient-to-br from-sky-500/10 to-cyan-500/10">
    <div class="flex items-center gap-4 mb-4">
      <CharacterAvatar name="林小雨" color="bg-sky-500/40" />
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-white truncate">林小雨</h3>
        <div class="text-xs text-white/60 truncate">妹妹</div>
      </div>
      <div class="ml-auto flex gap-2">
        <StatBadge label="心情" :value="data.林小雨状态.心情" />
        <StatBadge label="零花钱" :value="`¥${data.林小雨状态.零花钱}`" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col items-center gap-2 bg-white/5 p-3 rounded-xl transition hover:bg-white/10">
        <span class="text-xs text-white/60">兄控度</span>
        <ProgressRing :model-value="data.林小雨状态.兄控度" color="text-sky-400" />
      </div>
      <div
        class="flex flex-col items-center justify-center gap-2 bg-white/5 p-3 rounded-xl transition hover:bg-white/10"
      >
        <span class="text-xs text-white/60">当前状态</span>
        <span class="text-lg font-bold text-sky-300">{{ data.林小雨状态.当前状态 }}</span>
      </div>
    </div>

    <!-- Status Badges -->
    <div class="flex gap-2 mt-4 flex-wrap">
      <span
        class="text-xs px-2 py-1 bg-white/5 rounded"
        :class="data.林小雨状态.是否处女 ? 'text-pink-300' : 'text-gray-400'"
      >
        {{ data.林小雨状态.是否处女 ? '处女' : '非处女' }}
      </span>
      <span class="text-xs px-2 py-1 bg-white/5 rounded text-white/60"> 年龄: {{ data.林小雨状态.年龄 }}岁 </span>
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
        <div class="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3 space-y-3">
          <!-- 胸部 -->
          <div class="space-y-1">
            <div class="text-xs font-bold text-sky-300">胸部</div>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div class="flex justify-between">
                <span class="text-white/50">描述</span>
                <span class="text-white/80">{{ data.林小雨身体.胸部.描述 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">状态</span>
                <span class="text-white/80">{{ data.林小雨身体.胸部.状态 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">特征</span>
                <span class="text-white/80">{{ data.林小雨身体.胸部.特征 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">敏感度</span>
                <span class="text-white/80">{{ data.林小雨身体.胸部.敏感度 }}</span>
              </div>
            </div>
          </div>

          <!-- 下体 -->
          <div class="space-y-1">
            <div class="text-xs font-bold text-sky-300">下体</div>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div class="flex justify-between">
                <span class="text-white/50">描述</span>
                <span class="text-white/80">{{ data.林小雨身体.下体.描述 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">状态</span>
                <span class="text-white/80">{{ data.林小雨身体.下体.状态 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">特征</span>
                <span class="text-white/80">{{ data.林小雨身体.下体.特征 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">敏感度</span>
                <span class="text-white/80">{{ data.林小雨身体.下体.敏感度 }}</span>
              </div>
            </div>
          </div>

          <!-- 臀部 -->
          <div class="space-y-1">
            <div class="text-xs font-bold text-sky-300">臀部</div>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div class="flex justify-between">
                <span class="text-white/50">描述</span>
                <span class="text-white/80">{{ data.林小雨身体.臀部.描述 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">状态</span>
                <span class="text-white/80">{{ data.林小雨身体.臀部.状态 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">特征</span>
                <span class="text-white/80">{{ data.林小雨身体.臀部.特征 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">敏感度</span>
                <span class="text-white/80">{{ data.林小雨身体.臀部.敏感度 }}</span>
              </div>
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
