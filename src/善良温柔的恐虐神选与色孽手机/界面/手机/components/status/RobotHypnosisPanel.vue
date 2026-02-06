<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { gsap } from 'gsap';

const props = defineProps<{
  data: {
    指令覆盖深度: number;
    服从协议强度: number;
    自主判断抑制: number;
    植入指令: Record<string, { 内容: string; 强度: number; 触发词?: string; 激活状态: boolean }>;
    系统警告等级: number;
  };
}>();

const isOpen = ref(false);
const contentRef = ref<HTMLElement | null>(null);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

// 动画处理
watch(isOpen, async val => {
  await nextTick();
  if (val) {
    gsap.fromTo(
      contentRef.value,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' },
    );
  } else {
    gsap.to(contentRef.value, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
  }
});

const isCritical = computed(() => props.data.系统警告等级 >= 3);
const warningColor = computed(() => {
  const level = props.data.系统警告等级;
  if (level === 0) return 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]';
  if (level === 1) return 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.6)]';
  if (level === 2) return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.7)]';
  return 'bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)] animate-pulse';
});

const hasDirectives = computed(() => Object.keys(props.data.植入指令 || {}).length > 0);
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded border bg-slate-900/90 font-mono text-xs backdrop-blur transition-colors duration-300"
    :class="[
      isCritical
        ? 'border-red-500/80 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
        : 'border-cyan-900/60 hover:border-cyan-500/50',
    ]"
  >
    <!-- Header -->
    <div
      class="flex cursor-pointer items-center justify-between bg-slate-950/50 px-3 py-2 transition-colors hover:bg-cyan-900/20"
      @click="toggle"
    >
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-cyan-500 transition-transform duration-300" :class="{ 'rotate-90': isOpen }">
          ▶
        </span>
        <span class="font-bold tracking-wider" :class="isCritical ? 'text-red-400' : 'text-cyan-400'"> 协议覆写 </span>
      </div>

      <!-- Mini Status Lights (Visible when collapsed) -->
      <div class="flex gap-1">
        <div
          v-for="i in 4"
          :key="i"
          class="h-1.5 w-1.5 rounded-full border border-slate-700 bg-slate-800"
          :class="{
            [warningColor]: i <= props.data.系统警告等级 + 1,
          }"
        ></div>
      </div>
    </div>

    <!-- Collapsible Content -->
    <div ref="contentRef" class="h-0 overflow-hidden opacity-0">
      <div class="border-t border-cyan-900/30 p-3">
        <!-- Metrics Section -->
        <div class="mb-4 space-y-3">
          <!-- Metric 1 -->
          <div>
            <div class="mb-1 flex justify-between text-[10px] text-cyan-300/80">
              <span>覆写深度</span>
              <span>{{ props.data.指令覆盖深度 }}%</span>
            </div>
            <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                class="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-500"
                :style="{ width: `${props.data.指令覆盖深度}%` }"
              ></div>
            </div>
          </div>

          <!-- Metric 2 -->
          <div>
            <div class="mb-1 flex justify-between text-[10px] text-cyan-300/80">
              <span>服从协议</span>
              <span>{{ props.data.服从协议强度 }}%</span>
            </div>
            <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                class="absolute top-0 left-0 h-full bg-cyan-600 shadow-[0_0_8px_rgba(8,145,178,0.6)] transition-all duration-500"
                :style="{ width: `${props.data.服从协议强度}%` }"
              ></div>
            </div>
          </div>

          <!-- Metric 3 -->
          <div>
            <div class="mb-1 flex justify-between text-[10px] text-cyan-300/80">
              <span :class="{ 'font-bold text-red-400': props.data.自主判断抑制 > 80 }">
                判断抑制
                <span v-if="props.data.自主判断抑制 > 80" class="ml-1 animate-pulse">[警告]</span>
              </span>
              <span :class="{ 'text-red-400': props.data.自主判断抑制 > 80 }">{{ props.data.自主判断抑制 }}%</span>
            </div>
            <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                class="absolute top-0 left-0 h-full transition-all duration-500"
                :class="
                  props.data.自主判断抑制 > 80 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-blue-500'
                "
                :style="{ width: `${props.data.自主判断抑制}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Directives List -->
        <div>
          <div
            class="mb-2 flex items-center border-b border-cyan-900/30 pb-1 text-[10px] font-bold tracking-wider text-slate-400"
          >
            <span>> 激活指令</span>
          </div>

          <div v-if="!hasDirectives" class="py-2 text-center text-slate-500 italic">未发现指令</div>

          <div v-else class="space-y-2">
            <div
              v-for="(directive, key) in props.data.植入指令"
              :key="key"
              class="group relative overflow-hidden rounded border border-cyan-900/40 bg-slate-950/60 p-2 transition-all hover:border-cyan-500/40"
            >
              <!-- Active Indicator Strip -->
              <div
                class="absolute top-0 left-0 h-full w-0.5 transition-colors"
                :class="directive.激活状态 ? 'bg-cyan-500 shadow-[0_0_5px_cyan]' : 'bg-slate-700'"
              ></div>

              <div class="pl-2">
                <div class="mb-1 flex items-start justify-between">
                  <span class="font-bold text-cyan-100">{{ directive.内容 }}</span>
                  <span
                    class="ml-2 rounded border px-1 py-0.5 text-[9px]"
                    :class="
                      directive.激活状态
                        ? 'border-cyan-500/50 bg-cyan-900/20 text-cyan-300'
                        : 'border-slate-700 bg-slate-800 text-slate-500'
                    "
                  >
                    {{ directive.激活状态 ? '激活' : '待机' }}
                  </span>
                </div>

                <div class="flex items-center gap-3 text-[10px] text-slate-400">
                  <div class="flex items-center gap-1">
                    <span>强度:</span>
                    <div class="flex gap-0.5">
                      <div
                        v-for="n in 5"
                        :key="n"
                        class="h-1 w-2 rounded-sm"
                        :class="n <= Math.ceil(directive.强度 / 20) ? 'bg-cyan-500' : 'bg-slate-800'"
                      ></div>
                    </div>
                  </div>
                  <div v-if="directive.触发词">
                    <span class="text-slate-500">触发:</span>
                    <span class="ml-1 text-cyan-300/80">[{{ directive.触发词 }}]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar customization for directives list if needed */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}
::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.3);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.5);
}
</style>
