<template>
  <div :style="containerStyle" @mousedown="onDragStart" @touchstart="onDragStart">
    <div :style="barStyle">
      <span :style="valueStyle">{{ displayValue }}</span>
    </div>
    <div v-if="isDragging" :style="indicatorStyle">{{ dragValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import gsap from 'gsap';

const props = defineProps<{
  value: number;
  maxValue?: number;
  type?: 'favor' | 'stamina' | 'submit' | 'mood' | 'negative';
  draggable?: boolean;
  showPercent?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: number): void;
  (e: 'change', value: number): void;
}>();

const isDragging = ref(false);
const dragValue = ref(0);
const animatedValue = ref(props.value);

watch(
  () => props.value,
  newVal => {
    gsap.to(animatedValue, {
      value: newVal,
      duration: 0.5,
      ease: 'power2.out',
    });
  },
);

const maxValue = computed(() => props.maxValue ?? 100);

const displayValue = computed(() => {
  if (props.showPercent) {
    return `${Math.round(animatedValue.value)}%`;
  }
  return Math.round(animatedValue.value);
});

const percentage = computed(() => {
  const absValue = Math.abs(animatedValue.value);
  return Math.min(100, (absValue / maxValue.value) * 100);
});

// 根据类型获取背景渐变色
const barBackground = computed(() => {
  switch (props.type) {
    case 'favor':
      return 'linear-gradient(90deg, #f39c12, #e74c3c)';
    case 'stamina':
      if (props.value >= 70) return 'linear-gradient(90deg, #2ecc71, #27ae60)';
      if (props.value >= 40) return 'linear-gradient(90deg, #f39c12, #e67e22)';
      return 'linear-gradient(90deg, #e74c3c, #c0392b)';
    case 'submit':
      return 'linear-gradient(90deg, #9b59b6, #8e44ad)';
    case 'mood':
      return 'linear-gradient(90deg, #3498db, #2980b9)';
    case 'negative':
      return 'linear-gradient(90deg, #95a5a6, #7f8c8d)';
    default:
      return 'linear-gradient(90deg, #f39c12, #e74c3c)';
  }
});

// 容器样式 - 内联
const containerStyle = computed(() => ({
  flex: '1',
  maxWidth: '120px',
  height: '18px',
  background: '#ecf0f1',
  borderRadius: '9px',
  position: 'relative' as const,
  overflow: 'visible',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
  cursor: props.draggable ? 'pointer' : 'default',
  userSelect: 'none' as const,
  WebkitUserSelect: 'none' as const,
  touchAction: props.draggable ? 'none' : 'auto',
  border: '1px solid rgba(0,0,0,0.1)',
}));

// 进度条样式 - 内联
const barStyle = computed(() => ({
  width: `${percentage.value}%`,
  height: '100%',
  borderRadius: '9px',
  background: props.value < 0 ? 'linear-gradient(90deg, #95a5a6, #7f8c8d)' : barBackground.value,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative' as const,
  overflow: 'hidden',
  minWidth: '0',
}));

// 数值显示样式 - 内联
const valueStyle = computed(() => ({
  fontSize: '11px',
  fontWeight: 'bold' as const,
  color: 'white',
  textShadow: '0 0 3px rgba(0,0,0,0.8)',
  position: 'absolute' as const,
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '5',
  pointerEvents: 'none' as const,
  whiteSpace: 'nowrap' as const,
}));

// 拖动指示器样式 - 内联
const indicatorStyle = computed(() => ({
  position: 'absolute' as const,
  top: '-26px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#2c3e50',
  color: 'white',
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 'bold' as const,
  whiteSpace: 'nowrap' as const,
  zIndex: '100',
  pointerEvents: 'none' as const,
}));

// 拖动逻辑
function onDragStart(event: MouseEvent | TouchEvent) {
  if (!props.draggable) return;

  if (event.cancelable) event.preventDefault();

  const container = event.currentTarget as HTMLElement;
  if (!container) return;

  // 获取正确的 document（组件挂载到父窗口，所以需要使用父窗口的 document）
  const targetDoc = container.ownerDocument || document;

  isDragging.value = true;

  const updateValue = (clientX: number) => {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    dragValue.value = percentage;
    emit('update:value', percentage);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    updateValue(clientX);
  };

  const handleEnd = () => {
    targetDoc.removeEventListener('mousemove', handleMove);
    targetDoc.removeEventListener('mouseup', handleEnd);
    targetDoc.removeEventListener('touchmove', handleMove);
    targetDoc.removeEventListener('touchend', handleEnd);
    isDragging.value = false;
    emit('change', dragValue.value);
  };

  // 初始化
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  updateValue(clientX);

  // 在正确的 document 上添加事件监听器
  targetDoc.addEventListener('mousemove', handleMove);
  targetDoc.addEventListener('mouseup', handleEnd);
  targetDoc.addEventListener('touchmove', handleMove);
  targetDoc.addEventListener('touchend', handleEnd);
}
</script>
