<template>
  <div class="quick-actions">
    <div class="actions-header">
      <span class="header-icon">⚡</span>
      <span class="header-title">快捷操作</span>
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
        <span v-if="action.cost" class="action-cost">{{ action.cost }}</span>
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
  cost?: string;
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
  money: number;
  relationStatus: string;
  goodwill: number;
}>();

const emit = defineEmits<{
  (e: 'action-executed', actionId: string): void;
  (e: 'dialog-selected', option: DialogOption): void;
  (e: 'update-money', delta: number): void;
}>();

const { buttonBounce } = useAnimations();
const { playSound } = useAudioManager();
const { clickFeedback } = useHaptic();

const showDialogOptions = ref(false);

// 对话框 DOM 元素（挂载到 body）
let dialogContainer: HTMLDivElement | null = null;

// 对话选项
const dialogOptions: DialogOption[] = [
  {
    id: 'gentle',
    icon: '😊',
    text: '温柔地说话',
    effect: '好感度+2',
    type: 'positive',
    prompt: '用温柔的语气与对方交流',
  },
  {
    id: 'joke',
    icon: '😄',
    text: '讲个笑话',
    effect: '心情+5，好感度+1',
    type: 'positive',
    prompt: '尝试用幽默的方式活跃气氛',
  },
  {
    id: 'serious',
    icon: '🤔',
    text: '认真询问',
    effect: '获得更多信息',
    type: 'neutral',
    prompt: '用认真的态度询问对方',
  },
  {
    id: 'flirt',
    icon: '😏',
    text: '调情',
    effect: '好感度+3 或 -5',
    type: 'neutral',
    prompt: '尝试与对方调情（需要一定好感度基础）',
  },
  {
    id: 'cold',
    icon: '😐',
    text: '冷淡回应',
    effect: '好感度-2',
    type: 'negative',
    prompt: '用冷淡的态度回应',
  },
];

// 快捷操作定义
const actions = computed<Action[]>(() => [
  {
    id: 'give_money',
    icon: '💵',
    label: '给零花钱',
    tooltip: '给姜林一些零花钱',
    cost: '¥10',
    disabled: props.money < 10,
    handler: () => {
      emit('update-money', -10);
      toastr.success('给了姜林10元零花钱');
      emit('action-executed', 'give_money');
    },
  },
  {
    id: 'buy_gift',
    icon: '🎁',
    label: '买礼物',
    tooltip: '花钱买个小礼物',
    cost: '¥50',
    disabled: props.money < 50,
    handler: () => {
      emit('update-money', -50);
      toastr.success('买了一份精美的礼物');
      emit('action-executed', 'buy_gift');
    },
  },
  {
    id: 'chat',
    icon: '💬',
    label: '聊天',
    tooltip: '选择对话方式',
    handler: () => {
      showDialogOptions.value = true;
    },
  },
  {
    id: 'comfort',
    icon: '🤗',
    label: '安慰',
    tooltip: '安慰对方',
    handler: () => {
      toastr.info('你轻声安慰了她...');
      emit('action-executed', 'comfort');
    },
  },
  {
    id: 'praise',
    icon: '👏',
    label: '夸奖',
    tooltip: '夸奖对方',
    handler: () => {
      toastr.info('你真诚地夸奖了她');
      emit('action-executed', 'praise');
    },
  },
  {
    id: 'invite',
    icon: '🎬',
    label: '约会',
    tooltip: '邀请外出约会',
    disabled: props.goodwill < 30,
    handler: () => {
      if (props.goodwill < 30) {
        toastr.warning('好感度不足，对方拒绝了你');
        return;
      }
      toastr.success('约会邀请发送成功！');
      emit('action-executed', 'invite');
    },
  },
  {
    id: 'hold_hand',
    icon: '🤝',
    label: '牵手',
    tooltip: '尝试牵手',
    disabled: props.goodwill < 50,
    handler: () => {
      if (props.goodwill < 50) {
        toastr.warning('时机不对，她躲开了');
        return;
      }
      toastr.success('你轻轻握住了她的手...');
      emit('action-executed', 'hold_hand');
    },
  },
  {
    id: 'kiss',
    icon: '💋',
    label: '亲吻',
    tooltip: '尝试亲吻',
    disabled: props.relationStatus !== '恋人' && props.relationStatus !== '从属',
    handler: () => {
      if (props.relationStatus !== '恋人' && props.relationStatus !== '从属') {
        toastr.error('你们的关系还没有到这一步！');
        return;
      }
      toastr.success('一个甜蜜的吻...');
      emit('action-executed', 'kiss');
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

  // 根据选项类型显示提示
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
        <div class="dialog-header">
          <span class="dialog-title">💬 选择对话方式</span>
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
  style.id = 'quick-actions-dialog-style';
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
      background: linear-gradient(135deg, #667eea, #764ba2);
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
      background: rgba(231, 76, 60, 0.15);
      border-left: 4px solid #e74c3c;
    }
    .dialog-option.negative:hover {
      background: rgba(231, 76, 60, 0.25);
      border-color: #e74c3c;
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
      background: rgba(231, 76, 60, 0.2);
    }
    body.dark-mode .dialog-option.negative:hover {
      background: rgba(231, 76, 60, 0.35);
    }
    body.dark-mode .option-text {
      color: #ecf0f1;
    }
    body.dark-mode .option-effect {
      color: #bdc3c7;
    }
  `;
  if (!window.parent.document.getElementById('quick-actions-dialog-style')) {
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
  const style = window.parent.document.getElementById('quick-actions-dialog-style');
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
  border-bottom: 2px solid #3498db;

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
    border-color: #3498db;
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2);

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

.action-cost {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #27ae60;
  color: white;
  font-size: 9px;
  padding: 2px 5px;
  border-radius: 8px;
  font-weight: bold;
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
      border-color: #5dade2;
      box-shadow: 0 5px 15px rgba(93, 173, 226, 0.3);
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
