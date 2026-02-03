<template>
  <div class="quick-actions">
    <div class="actions-header">
      <span class="header-icon">👸</span>
      <span class="header-title">对沈婉清操作</span>
    </div>

    <div class="actions-grid">
      <div
        v-for="action in availableActions"
        :key="action.id"
        class="action-btn"
        :class="{ disabled: action.disabled }"
        :title="action.tooltip"
        @click="executeAction(action, $event)"
      >
        <span class="action-icon">{{ action.icon }}</span>
        <span class="action-label">{{ action.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue';
import { useAnimations } from '../composables/useAnimations';
import { useAudioManager } from '../composables/useAudioManager';
import { useHaptic } from '../composables/useHaptic';

interface Action {
  id: string;
  icon: string;
  label: string;
  tooltip: string;
  disabled?: boolean;
  handler: () => void;
}

interface DialogOption {
  id: string;
  icon: string;
  text: string;
  effect: string;
  type: 'positive' | 'neutral' | 'negative';
  prompt: string;
}

const props = defineProps<{
  submission: number;
  relationStatus: string;
  goodwill: number;
}>();

const emit = defineEmits<{
  (e: 'action-executed', actionId: string): void;
  (e: 'dialog-selected', option: DialogOption): void;
}>();

const { buttonBounce } = useAnimations();
const { playSound } = useAudioManager();
const { clickFeedback } = useHaptic();

const showDialogOptions = ref(false);
let dialogContainer: HTMLDivElement | null = null;

// 对话选项
const dialogOptions: DialogOption[] = [
  {
    id: 'threaten',
    icon: '😈',
    text: '威胁她',
    effect: '屈从度+5，好感度-10',
    type: 'negative',
    prompt: '用威胁的语气命令她',
  },
  {
    id: 'mock',
    icon: '😏',
    text: '嘲讽',
    effect: '屈从度+3，好感度-5',
    type: 'negative',
    prompt: '嘲讽她高傲的态度',
  },
  {
    id: 'neutral',
    icon: '😐',
    text: '冷漠对待',
    effect: '无变化',
    type: 'neutral',
    prompt: '用冷漠的态度对待',
  },
  {
    id: 'comfort',
    icon: '🤝',
    text: '安抚',
    effect: '好感度+5，屈从度-2',
    type: 'positive',
    prompt: '尝试安抚她的情绪',
  },
  {
    id: 'praise',
    icon: '💐',
    text: '赞美',
    effect: '好感度+3',
    type: 'positive',
    prompt: '真诚地赞美她',
  },
];

// 快捷操作定义
const actions = computed<Action[]>(() => [
  {
    id: 'intimidate',
    icon: '👊',
    label: '威压',
    tooltip: '用气势压迫她',
    disabled: props.submission >= 80,
    handler: () => {
      toastr.info('你释放出强大的气场...');
      emit('action-executed', 'intimidate');
    },
  },
  {
    id: 'humiliate',
    icon: '😈',
    label: '羞辱',
    tooltip: '当众羞辱她',
    disabled: props.submission < 30,
    handler: () => {
      if (props.submission < 30) {
        toastr.warning('她的屈从度太低，会激烈反抗');
        return;
      }
      toastr.info('你公开羞辱了她...');
      emit('action-executed', 'humiliate');
    },
  },
  {
    id: 'talk',
    icon: '💬',
    label: '对话',
    tooltip: '选择对话方式',
    handler: () => {
      showDialogOptions.value = true;
    },
  },
  {
    id: 'command',
    icon: '📢',
    label: '命令',
    tooltip: '发号施令',
    disabled: props.submission < 50,
    handler: () => {
      if (props.submission < 50) {
        toastr.warning('屈从度不足，她不听命令');
        return;
      }
      toastr.success('她顺从地执行了命令');
      emit('action-executed', 'command');
    },
  },
  {
    id: 'blackmail',
    icon: '📷',
    label: '抓把柄',
    tooltip: '收集她的把柄',
    handler: () => {
      toastr.info('你在寻找她的弱点...');
      emit('action-executed', 'blackmail');
    },
  },
  {
    id: 'strip',
    icon: '👗',
    label: '扒衣',
    tooltip: '撕扯她的衣服',
    disabled: props.submission < 60 && props.relationStatus !== '奴隶',
    handler: () => {
      if (props.submission < 60 && props.relationStatus !== '奴隶') {
        toastr.error('她强烈反抗！');
        return;
      }
      toastr.success('你粗暴地扯开了她的衣服...');
      emit('action-executed', 'strip');
    },
  },
  {
    id: 'touch',
    icon: '✋',
    label: '抚摸',
    tooltip: '抚摸她的身体',
    disabled: props.submission < 40 && props.relationStatus !== '玩物',
    handler: () => {
      if (props.submission < 40 && props.relationStatus !== '玩物') {
        toastr.warning('她挣扎着躲开了');
        return;
      }
      toastr.info('你的手在她身上游走...');
      emit('action-executed', 'touch');
    },
  },
  {
    id: 'violate',
    icon: '💔',
    label: '侵犯',
    tooltip: '强行侵犯她',
    disabled: props.submission < 70 && props.relationStatus !== '奴隶',
    handler: () => {
      if (props.submission < 70 && props.relationStatus !== '奴隶') {
        toastr.error('她拼命反抗，无法得逞！');
        return;
      }
      toastr.warning('你强行侵犯了她...');
      emit('action-executed', 'violate');
    },
  },
]);

const availableActions = computed(() => actions.value);

function executeAction(action: Action, event: MouseEvent) {
  if (action.disabled) {
    toastr.warning('当前无法执行此操作');
    playSound('error');
    return;
  }
  const btn = event.currentTarget as HTMLElement;
  // 播放点击音效和震动反馈
  playSound('click');
  clickFeedback();
  if (btn) buttonBounce(btn);
  action.handler();
}

function selectDialogOption(option: DialogOption) {
  showDialogOptions.value = false;
  emit('dialog-selected', option);

  if (option.type === 'positive') {
    toastr.success(`选择了: ${option.text}`);
  } else if (option.type === 'negative') {
    toastr.warning(`选择了: ${option.text}`);
  } else {
    toastr.info(`选择了: ${option.text}`);
  }
}

function closeDialog() {
  showDialogOptions.value = false;
}

// 创建对话框 HTML
function createDialogHTML(): string {
  const optionsHTML = dialogOptions
    .map(
      option => `
    <div class="dialog-option ${option.type}" data-option-id="${option.id}">
      <span class="option-icon">${option.icon}</span>
      <div class="option-content">
        <div class="option-text">${option.text}</div>
        <div class="option-effect">${option.effect}</div>
      </div>
    </div>
  `,
    )
    .join('');

  return `
    <div class="dialog-modal-overlay">
      <div class="dialog-modal">
        <div class="dialog-header" style="background: linear-gradient(135deg, #9b59b6, #8e44ad);">
          <span class="dialog-title">👸 选择对沈婉清的态度</span>
          <button class="close-btn" type="button">✕</button>
        </div>
        <div class="dialog-list">
          ${optionsHTML}
        </div>
      </div>
    </div>
  `;
}

// 显示对话框
function showDialog() {
  if (dialogContainer) return;

  dialogContainer = window.parent.document.createElement('div');
  dialogContainer.innerHTML = createDialogHTML();
  dialogContainer.style.cssText =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999; pointer-events: auto;';
  window.parent.document.body.appendChild(dialogContainer);

  // 添加样式
  const style = window.parent.document.createElement('style');
  style.id = 'quick-actions-shen-dialog-style';
  style.textContent = `
    .dialog-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: dialogFadeIn 0.2s ease;
    }
    @keyframes dialogFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .dialog-modal {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
      overflow: hidden;
      animation: dialogScaleIn 0.25s ease;
    }
    @keyframes dialogScaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      color: white;
    }
    .dialog-title {
      font-size: 18px;
      font-weight: bold;
    }
    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      color: white;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.4);
      border-color: white;
      transform: scale(1.1);
    }
    .dialog-list {
      padding: 12px;
      max-height: 350px;
      overflow-y: auto;
    }
    .dialog-option {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 8px;
      border: 2px solid transparent;
    }
    .dialog-option:hover {
      transform: translateX(5px);
    }
    .dialog-option:last-child {
      margin-bottom: 0;
    }
    .dialog-option.positive {
      background: rgba(39, 174, 96, 0.15);
      border-left: 4px solid #27ae60;
    }
    .dialog-option.positive:hover {
      background: rgba(39, 174, 96, 0.25);
      border-color: #27ae60;
    }
    .dialog-option.neutral {
      background: rgba(52, 152, 219, 0.15);
      border-left: 4px solid #3498db;
    }
    .dialog-option.neutral:hover {
      background: rgba(52, 152, 219, 0.25);
      border-color: #3498db;
    }
    .dialog-option.negative {
      background: rgba(155, 89, 182, 0.15);
      border-left: 4px solid #9b59b6;
    }
    .dialog-option.negative:hover {
      background: rgba(155, 89, 182, 0.25);
      border-color: #9b59b6;
    }
    .option-icon {
      font-size: 28px;
    }
    .option-content {
      flex: 1;
    }
    .option-text {
      font-weight: bold;
      color: #1a1a2e;
      font-size: 15px;
      margin-bottom: 4px;
    }
    .option-effect {
      font-size: 13px;
      color: #555;
      font-weight: 500;
    }
    /* Dark mode support */
    body.dark-mode .dialog-modal {
      background: #2d3436;
    }
    body.dark-mode .dialog-option.positive {
      background: rgba(39, 174, 96, 0.2);
    }
    body.dark-mode .dialog-option.positive:hover {
      background: rgba(39, 174, 96, 0.35);
    }
    body.dark-mode .dialog-option.neutral {
      background: rgba(52, 152, 219, 0.2);
    }
    body.dark-mode .dialog-option.neutral:hover {
      background: rgba(52, 152, 219, 0.35);
    }
    body.dark-mode .dialog-option.negative {
      background: rgba(155, 89, 182, 0.2);
    }
    body.dark-mode .dialog-option.negative:hover {
      background: rgba(155, 89, 182, 0.35);
    }
    body.dark-mode .option-text {
      color: #ecf0f1;
    }
    body.dark-mode .option-effect {
      color: #bdc3c7;
    }
  `;
  if (!window.parent.document.getElementById('quick-actions-shen-dialog-style')) {
    window.parent.document.head.appendChild(style);
  }

  // 绑定事件
  const overlay = dialogContainer.querySelector('.dialog-modal-overlay');
  const closeBtn = dialogContainer.querySelector('.close-btn');
  const options = dialogContainer.querySelectorAll('.dialog-option');

  overlay?.addEventListener('click', e => {
    if (e.target === overlay) {
      closeDialog();
    }
  });

  closeBtn?.addEventListener('click', () => {
    closeDialog();
  });

  options.forEach(optionEl => {
    optionEl.addEventListener('click', () => {
      const optionId = optionEl.getAttribute('data-option-id');
      const option = dialogOptions.find(o => o.id === optionId);
      if (option) {
        selectDialogOption(option);
      }
    });
  });
}

// 隐藏对话框
function hideDialog() {
  if (dialogContainer) {
    dialogContainer.remove();
    dialogContainer = null;
  }
}

// 监听对话框显示状态
watch(showDialogOptions, show => {
  if (show) {
    showDialog();
  } else {
    hideDialog();
  }
});

// 组件卸载时清理
onUnmounted(() => {
  hideDialog();
  const style = window.parent.document.getElementById('quick-actions-shen-dialog-style');
  if (style) {
    style.remove();
  }
});
</script>

<style lang="scss" scoped>
.quick-actions {
  position: relative;
}

.actions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #9b59b6;

  .header-icon {
    font-size: 18px;
  }

  .header-title {
    font-size: 16px;
    font-weight: bold;
    color: #2c3e50;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  background: linear-gradient(135deg, #fff, #f8f9fa);
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:hover:not(.disabled) {
    transform: translateY(-3px);
    border-color: #9b59b6;
    box-shadow: 0 5px 15px rgba(155, 89, 182, 0.2);

    .action-icon {
      transform: scale(1.2);
    }
  }

  &:active:not(.disabled) {
    transform: translateY(0);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(0.5);
  }
}

.action-icon {
  font-size: 24px;
  transition: transform 0.3s;
}

.action-label {
  font-size: 11px;
  color: #2c3e50;
  text-align: center;
  font-weight: 500;
}

:global(.dark-mode) .quick-actions {
  .actions-header {
    .header-title {
      color: #ecf0f1;
    }
  }

  .action-btn {
    background: linear-gradient(135deg, #34495e, #2c3e50);
    border-color: #566573;

    &:hover:not(.disabled) {
      border-color: #af7ac5;
      box-shadow: 0 5px 15px rgba(175, 122, 197, 0.3);
    }
  }

  .action-label {
    color: #ecf0f1;
  }
}

@media (max-width: 360px) {
  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
