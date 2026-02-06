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
  <StatusCard class="bg-gradient-to-br from-purple-500/10 to-violet-500/10">
    <div class="mb-4 flex items-center gap-4">
      <CharacterAvatar name="沈婉清" color="bg-purple-500/40" />
      <div class="min-w-0 flex-1">
        <h3 class="truncate text-lg font-bold text-white">沈婉清</h3>
        <div class="truncate text-xs text-white/60">{{ data.沈婉清状态.关系 }}</div>
      </div>
      <div class="ml-auto flex gap-2">
        <StatBadge label="心情" :value="data.沈婉清状态.心情" />
        <StatBadge label="状态" :value="data.沈婉清状态.当前状态" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-3 transition hover:bg-white/10">
        <span class="text-xs text-white/60">屈从度</span>
        <ProgressRing :model-value="data.沈婉清状态.屈从度" color="text-purple-400" />
      </div>
      <div
        class="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"
      >
        <span class="text-xs text-white/60">好感度</span>
        <span :class="['text-xl font-bold', data.沈婉清状态.好感度 < 0 ? 'text-red-400' : 'text-green-400']">
          {{ data.沈婉清状态.好感度 }}
        </span>
      </div>
    </div>

    <!-- Status Badges -->
    <div class="mt-4 flex flex-wrap gap-2">
      <span
        class="rounded bg-white/5 px-2 py-1 text-xs"
        :class="data.沈婉清状态.是否处女 ? 'text-pink-300' : 'text-gray-400'"
      >
        {{ data.沈婉清状态.是否处女 ? '处女' : '非处女' }}
      </span>
      <span
        class="rounded bg-white/5 px-2 py-1 text-xs"
        :class="data.沈婉清状态.是否怀孕 ? 'text-yellow-300' : 'text-gray-400'"
      >
        {{ data.沈婉清状态.是否怀孕 ? '已怀孕' : '未怀孕' }}
      </span>
      <span class="rounded bg-white/5 px-2 py-1 text-xs text-green-300"> 存款: ¥{{ data.沈婉清状态.存款 }} </span>
    </div>

    <!-- Body Data Toggle -->
    <button
      class="mt-4 w-full border-t border-white/10 py-2 text-xs text-white/50 transition hover:text-white/80"
      @click="showBody = !showBody"
    >
      {{ showBody ? '▲ 收起身体数据' : '▼ 展开身体数据' }}
    </button>

    <!-- Body Data Panel -->
    <Transition name="slide">
      <div v-if="showBody" class="mt-3 space-y-2">
        <div class="space-y-3 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
          <!-- 胸部 -->
          <div class="space-y-1">
            <div class="text-xs font-bold text-purple-300">胸部</div>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div class="flex justify-between">
                <span class="text-white/50">描述</span>
                <span class="text-white/80">{{ data.沈婉清身体.胸部.描述 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">状态</span>
                <span class="text-white/80">{{ data.沈婉清身体.胸部.状态 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">特征</span>
                <span class="text-white/80">{{ data.沈婉清身体.胸部.特征 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">敏感度</span>
                <span class="text-white/80">{{ data.沈婉清身体.胸部.敏感度 }}</span>
              </div>
            </div>
          </div>

          <!-- 下体 -->
          <div class="space-y-1">
            <div class="text-xs font-bold text-purple-300">下体</div>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div class="flex justify-between">
                <span class="text-white/50">描述</span>
                <span class="text-white/80">{{ data.沈婉清身体.下体.描述 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">状态</span>
                <span class="text-white/80">{{ data.沈婉清身体.下体.状态 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">特征</span>
                <span class="text-white/80">{{ data.沈婉清身体.下体.特征 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">敏感度</span>
                <span class="text-white/80">{{ data.沈婉清身体.下体.敏感度 }}</span>
              </div>
              <div class="col-span-2 flex justify-between">
                <span class="text-white/50">内射量</span>
                <span class="text-white/80">{{ data.沈婉清身体.下体.内射量 }}</span>
              </div>
            </div>
          </div>

          <!-- 臀部 -->
          <div class="space-y-1">
            <div class="text-xs font-bold text-purple-300">臀部</div>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div class="flex justify-between">
                <span class="text-white/50">描述</span>
                <span class="text-white/80">{{ data.沈婉清身体.臀部.描述 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">状态</span>
                <span class="text-white/80">{{ data.沈婉清身体.臀部.状态 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">特征</span>
                <span class="text-white/80">{{ data.沈婉清身体.臀部.特征 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">敏感度</span>
                <span class="text-white/80">{{ data.沈婉清身体.臀部.敏感度 }}</span>
              </div>
            </div>
          </div>

          <!-- 口腔 -->
          <div class="space-y-1">
            <div class="text-xs font-bold text-purple-300">口腔</div>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div class="flex justify-between">
                <span class="text-white/50">描述</span>
                <span class="text-white/80">{{ data.沈婉清身体.口腔.描述 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">状态</span>
                <span class="text-white/80">{{ data.沈婉清身体.口腔.状态 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">敏感度</span>
                <span class="text-white/80">{{ data.沈婉清身体.口腔.敏感度 }}</span>
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
