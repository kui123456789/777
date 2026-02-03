<template>
  <div class="quick-actions">
    <div class="actions-header">
      <span class="header-icon">🧒</span>
      <span class="header-title">与小雨互动</span>
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
  brotherComplex: number;
  mood: number;
  pocketMoney: number;
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
    id: 'pamper',
    icon: '🥰',
    text: '宠溺地说',
    effect: '兄控度+3，心情+10',
    type: 'positive',
    prompt: '用宠溺的语气和她说话',
  },
  {
    id: 'tease',
    icon: '😜',
    text: '逗弄她',
    effect: '心情+5，有趣的反应',
    type: 'positive',
    prompt: '故意逗弄她看她可爱的反应',
  },
  {
    id: 'scold',
    icon: '😠',
    text: '训斥',
    effect: '心情-15，兄控度-5',
    type: 'negative',
    prompt: '严厉地训斥她',
  },
  {
    id: 'ignore',
    icon: '😶',
    text: '不理她',
    effect: '心情-10，兄控度+2',
    type: 'negative',
    prompt: '故意不理睬她',
  },
  {
    id: 'praise',
    icon: '👍',
    text: '表扬',
    effect: '心情+15，兄控度+2',
    type: 'positive',
    prompt: '真诚地表扬她',
  },
];

// 快捷操作定义
const actions = computed<Action[]>(() => [
  {
    id: 'give_pocket_money',
    icon: '💰',
    label: '给零花钱',
    tooltip: '给小雨零花钱',
    cost: '¥20',
    handler: () => {
      toastr.success('给了小雨20元零花钱');
      emit('action-executed', 'give_pocket_money');
    },
  },
  {
    id: 'buy_snacks',
    icon: '🍰',
    label: '买零食',
    tooltip: '给她买好吃的',
    cost: '¥15',
    handler: () => {
      toastr.success('给小雨买了她最爱的零食');
      emit('action-executed', 'buy_snacks');
    },
  },
  {
    id: 'talk',
    icon: '💬',
    label: '聊天',
    tooltip: '选择说话方式',
    handler: () => {
      showDialogOptions.value = true;
    },
  },
  {
    id: 'pat_head',
    icon: '🤚',
    label: '摸头',
    tooltip: '摸摸她的头',
    handler: () => {
      toastr.info('你温柔地摸了摸她的头');
      emit('action-executed', 'pat_head');
    },
  },
  {
    id: 'hug',
    icon: '🤗',
    label: '拥抱',
    tooltip: '给她一个拥抱',
    handler: () => {
      toastr.info('小雨开心地抱住了你');
      emit('action-executed', 'hug');
    },
  },
  {
    id: 'play_game',
    icon: '🎮',
    label: '陪玩',
    tooltip: '陪她玩游戏',
    handler: () => {
      toastr.success('你们一起开心地玩了一会儿');
      emit('action-executed', 'play_game');
    },
  },
  {
    id: 'help_homework',
    icon: '📚',
    label: '辅导作业',
    tooltip: '帮她写作业',
    handler: () => {
      toastr.info('你耐心地辅导她写作业');
      emit('action-executed', 'help_homework');
    },
  },
  {
    id: 'secret_touch',
    icon: '🙈',
    label: '偷偷摸',
    tooltip: '趁她不注意...',
    disabled: props.brotherComplex < 40,
    handler: () => {
      if (props.brotherComplex < 40) {
        toastr.warning('她警觉地躲开了');
        return;
      }
      toastr.warning('你趁机...');
      emit('action-executed', 'secret_touch');
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
        <div class="dialog-header" style="background: linear-gradient(135deg, #f39c12, #e67e22);">
          <span class="dialog-title">🧒 和小雨说话</span>
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
  style.id = 'quick-actions-lin-dialog-style';
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
      background: rgba(243, 156, 18, 0.15);
      border-left: 4px solid #f39c12;
    }
    .dialog-option.positive:hover {
      background: rgba(243, 156, 18, 0.25);
      border-color: #f39c12;
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
      background: rgba(243, 156, 18, 0.2);
    }
    body.dark-mode .dialog-option.positive:hover {
      background: rgba(243, 156, 18, 0.35);
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
  if (!window.parent.document.getElementById('quick-actions-lin-dialog-style')) {
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
  const style = window.parent.document.getElementById('quick-actions-lin-dialog-style');
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
  border-bottom: 2px solid #f39c12;

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
    border-color: #f39c12;
    box-shadow: 0 5px 15px rgba(243, 156, 18, 0.2);

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
      border-color: #f5b041;
      box-shadow: 0 5px 15px rgba(245, 176, 65, 0.3);
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
