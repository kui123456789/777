<template>
  <Transition name="event-slide">
    <div v-if="visible" class="event-notification" :class="[event?.type, { 'dark-mode': isDark }]">
      <div class="event-icon">{{ event?.icon }}</div>
      <div class="event-content">
        <div class="event-title">{{ event?.title }}</div>
        <div class="event-desc">{{ event?.description }}</div>
      </div>
      <div class="event-close" @click="$emit('close')">×</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface GameEvent {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'special';
  icon: string;
  title: string;
  description: string;
  character: '姜林' | '沈婉清' | '林小雨';
}

defineProps<{
  visible: boolean;
  event: GameEvent | null;
  isDark?: boolean;
}>();

defineEmits<{
  close: [];
}>();
</script>

<style lang="scss" scoped>
.event-notification {
  position: fixed;
  top: 60px;
  right: 20px;
  max-width: 320px;
  padding: 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  z-index: 2000;
  border-left: 4px solid #3498db;

  &.positive {
    border-left-color: #27ae60;
    .event-icon {
      background: rgba(39, 174, 96, 0.1);
    }
  }

  &.negative {
    border-left-color: #e74c3c;
    .event-icon {
      background: rgba(231, 76, 60, 0.1);
    }
  }

  &.neutral {
    border-left-color: #95a5a6;
    .event-icon {
      background: rgba(149, 165, 166, 0.1);
    }
  }

  &.special {
    border-left-color: #9b59b6;
    .event-icon {
      background: rgba(155, 89, 182, 0.1);
    }
  }

  &.dark-mode {
    background: #2c3e50;
    color: #ecf0f1;

    .event-desc {
      color: #95a5a6;
    }
    .event-close {
      color: #95a5a6;
      &:hover {
        color: #ecf0f1;
      }
    }
  }
}

.event-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 4px;
}

.event-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.event-close {
  font-size: 20px;
  cursor: pointer;
  color: #999;
  line-height: 1;
  padding: 4px;

  &:hover {
    color: #333;
  }
}

.event-slide-enter-active {
  animation: slideIn 0.4s ease-out;
}

.event-slide-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .event-notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
