<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click="emit('close')">
        <div ref="modalRef" class="modal-content" :class="{ 'dark-mode': isDark }" @click.stop>
          <div class="modal-header">
            <span class="modal-title">{{ title }}</span>
            <span class="close-btn" @click="emit('close')">×</span>
          </div>
          <div class="modal-body">
            <pre>{{ content }}</pre>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import gsap from 'gsap';

const props = defineProps<{
  visible: boolean;
  title: string;
  content: string;
  isDark?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const modalRef = ref<HTMLElement | null>(null);

watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      nextTick(() => {
        if (modalRef.value) {
          gsap.from(modalRef.value, {
            scale: 0.7,
            opacity: 0,
            duration: 0.3,
            ease: 'back.out(1.7)',
          });
        }
      });
    }
  },
);
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-family: 'Caveat', 'Ma Shan Zheng', 'Comic Sans MS', cursive, sans-serif;

  &.dark-mode {
    background: #34495e;
    color: #ecf0f1;

    .modal-title {
      color: #ecf0f1;
    }

    .modal-body {
      color: #bdc3c7;
    }

    .close-btn {
      color: #bdc3c7;

      &:hover {
        color: #ecf0f1;
      }
    }
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.close-btn {
  font-size: 24px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
}

.modal-body {
  font-size: 16px;
  color: #555;
  line-height: 1.6;

  pre {
    white-space: pre-wrap;
    font-family: inherit;
    margin: 0;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
