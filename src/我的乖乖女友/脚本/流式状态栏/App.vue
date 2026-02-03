<script setup lang="ts">
import { useStreamingData } from './composables/useStreamingData';
import { useDataStore } from './store';
import StreamingIndicator from './components/StreamingIndicator.vue';
import JiangLinCard from './components/panels/JiangLinCard.vue';
import ShenWanqingCard from './components/panels/ShenWanqingCard.vue';
import LinXiaoyuCard from './components/panels/LinXiaoyuCard.vue';
import MessageContent from './components/MessageContent.vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const context = useStreamingData();
const store = useDataStore(context.message_id);
const { data } = storeToRefs(store);

const tabs = ['姜林', '沈婉清', '林小雨'] as const;
const activeTab = ref<(typeof tabs)[number]>('姜林');

// Theme mapping for active tab styling
const themes = {
  姜林: 'text-pink-300 border-pink-500/30 bg-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.3)]',
  沈婉清: 'text-purple-300 border-purple-500/30 bg-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
  林小雨: 'text-sky-300 border-sky-500/30 bg-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.3)]',
};

const components = {
  姜林: JiangLinCard,
  沈婉清: ShenWanqingCard,
  林小雨: LinXiaoyuCard,
};
</script>

<template>
  <div class="w-full font-sans text-gray-200 select-none overflow-hidden">
    <!-- Message Content Section (上方) -->
    <MessageContent
      :message="context.message"
      :message-id="context.message_id"
      :during-streaming="context.during_streaming"
    />

    <!-- Status Bar Section (下方) -->
    <div class="my-2 max-w-xl mx-auto">
      <!-- Streaming State -->
      <Transition name="fade" mode="out-in">
        <div v-if="context.during_streaming" key="streaming">
          <StreamingIndicator />
        </div>

        <!-- Finished State -->
        <div v-else key="content" class="flex flex-col gap-3">
          <!-- Tabs -->
          <div class="flex gap-2 p-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/5">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 border',
                activeTab === tab
                  ? themes[tab] + ' scale-[1.02]'
                  : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/5',
              ]"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Panel -->
          <Transition name="slide-up" mode="out-in">
            <component :is="components[activeTab]" :data="data" :key="activeTab" />
          </Transition>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
  filter: blur(4px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
  filter: blur(4px);
}
</style>
