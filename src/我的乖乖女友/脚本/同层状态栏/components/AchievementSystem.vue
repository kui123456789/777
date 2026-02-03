<template>
  <div class="achievement-system">
    <div class="achievement-header">
      <span class="header-icon">🏆</span>
      <span class="header-title">成就系统</span>
      <span class="achievement-count">{{ unlockedCount }}/{{ achievements.length }}</span>
    </div>

    <div class="achievement-list">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        class="achievement-item"
        :class="{ unlocked: achievement.unlocked, secret: achievement.secret && !achievement.unlocked }"
        @click="showAchievementDetail(achievement)"
      >
        <div class="achievement-icon">
          {{ achievement.secret && !achievement.unlocked ? '❓' : achievement.icon }}
        </div>
        <div class="achievement-info">
          <div class="achievement-name">
            {{ achievement.secret && !achievement.unlocked ? '???' : achievement.name }}
          </div>
          <div class="achievement-desc">
            {{ achievement.secret && !achievement.unlocked ? '达成条件未知' : achievement.description }}
          </div>
          <div v-if="!achievement.unlocked && achievement.progress !== undefined" class="achievement-progress">
            <div class="progress-bar" :style="{ width: achievement.progress + '%' }"></div>
            <span class="progress-text">{{ achievement.progress }}%</span>
          </div>
        </div>
        <div v-if="achievement.unlocked" class="unlock-badge">
          <span class="badge-icon">✓</span>
          <span class="badge-time">{{ achievement.unlockTime }}</span>
        </div>
      </div>
    </div>

    <!-- 成就解锁动画 -->
    <transition name="achievement-popup">
      <div v-if="showUnlockPopup" class="unlock-popup">
        <div class="popup-content">
          <div class="popup-icon">{{ currentUnlock?.icon }}</div>
          <div class="popup-text">
            <div class="popup-title">成就解锁!</div>
            <div class="popup-name">{{ currentUnlock?.name }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { useAudioManager } from '../composables/useAudioManager';
import { useHaptic } from '../composables/useHaptic';

const { playAchievementSound } = useAudioManager();
const { achievementFeedback } = useHaptic();

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockTime?: string;
  secret?: boolean;
  progress?: number;
  condition: () => boolean;
}

const props = defineProps<{
  goodwill: number;
  relationStatus: string;
  money: number;
}>();

const emit = defineEmits<{
  (e: 'achievement-unlocked', achievement: Achievement): void;
}>();

const showUnlockPopup = ref(false);
const currentUnlock = ref<Achievement | null>(null);

// 成就定义
const achievements = ref<Achievement[]>([
  {
    id: 'first_meet',
    name: '初次相遇',
    description: '与姜林第一次对话',
    icon: '👋',
    unlocked: true,
    unlockTime: '刚开始',
    condition: () => true,
  },
  {
    id: 'friend_zone',
    name: '朋友圈',
    description: '与姜林成为朋友',
    icon: '🤝',
    unlocked: false,
    progress: 0,
    condition: () => props.goodwill >= 30,
  },
  {
    id: 'heart_flutter',
    name: '心动时刻',
    description: '进入暧昧关系',
    icon: '💓',
    unlocked: false,
    progress: 0,
    condition: () => props.goodwill >= 60,
  },
  {
    id: 'lovers',
    name: '恋人未满',
    description: '正式成为恋人',
    icon: '💕',
    unlocked: false,
    progress: 0,
    condition: () => props.relationStatus === '恋人',
  },
  {
    id: 'max_love',
    name: '爱情满满',
    description: '好感度达到100',
    icon: '💖',
    unlocked: false,
    progress: 0,
    condition: () => props.goodwill >= 100,
  },
  {
    id: 'rich_guy',
    name: '小富翁',
    description: '存款超过1000元',
    icon: '💰',
    unlocked: false,
    progress: 0,
    condition: () => props.money >= 1000,
  },
  {
    id: 'secret_ending',
    name: '???',
    description: '达成隐藏条件',
    icon: '🌟',
    unlocked: false,
    secret: true,
    condition: () => props.relationStatus === '从属',
  },
]);

const unlockedCount = computed(() => achievements.value.filter(a => a.unlocked).length);

// 更新成就进度
function updateAchievementProgress() {
  achievements.value.forEach(achievement => {
    if (achievement.unlocked) return;

    // 计算进度
    if (achievement.id === 'friend_zone') {
      achievement.progress = Math.min(100, Math.round((props.goodwill / 30) * 100));
    } else if (achievement.id === 'heart_flutter') {
      achievement.progress = Math.min(100, Math.round((props.goodwill / 60) * 100));
    } else if (achievement.id === 'max_love') {
      achievement.progress = props.goodwill;
    } else if (achievement.id === 'rich_guy') {
      achievement.progress = Math.min(100, Math.round((props.money / 1000) * 100));
    }

    // 检查是否解锁
    if (achievement.condition()) {
      unlockAchievement(achievement);
    }
  });
}

function unlockAchievement(achievement: Achievement) {
  achievement.unlocked = true;
  achievement.unlockTime = new Date().toLocaleDateString();
  achievement.progress = 100;

  // 显示解锁动画
  currentUnlock.value = achievement;
  showUnlockPopup.value = true;

  // 播放成就音效和震动反馈
  playAchievementSound();
  achievementFeedback();

  setTimeout(() => {
    showUnlockPopup.value = false;
  }, 3000);

  emit('achievement-unlocked', achievement);
  toastr.success(`解锁成就: ${achievement.name}!`);
}

function showAchievementDetail(achievement: Achievement) {
  if (achievement.secret && !achievement.unlocked) {
    toastr.info('这是一个隐藏成就，继续探索吧！');
    return;
  }

  const status = achievement.unlocked ? '已解锁' : `进度: ${achievement.progress || 0}%`;
  toastr.info(`${achievement.name}\n${achievement.description}\n${status}`);
}

// 监听属性变化
watch(
  [() => props.goodwill, () => props.relationStatus, () => props.money],
  () => {
    updateAchievementProgress();
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.achievement-system {
  position: relative;
}

.achievement-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f39c12;

  .header-icon {
    font-size: 20px;
  }

  .header-title {
    font-size: 16px;
    font-weight: bold;
    color: #2c3e50;
  }

  .achievement-count {
    margin-left: auto;
    font-size: 14px;
    color: #7f8c8d;
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 8px;
    border-radius: 10px;
  }
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #bdc3c7;
    border-radius: 2px;
  }
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border: 2px solid #ecf0f1;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateX(5px);
    border-color: #f39c12;
    background: rgba(255, 255, 255, 0.8);
  }

  &.unlocked {
    border-color: #27ae60;
    background: linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(46, 204, 113, 0.1));

    .achievement-icon {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
    }
  }

  &.secret {
    border-style: dashed;
    border-color: #9b59b6;

    .achievement-icon {
      background: linear-gradient(135deg, #9b59b6, #8e44ad);
    }
  }
}

.achievement-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #bdc3c7, #95a5a6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-weight: bold;
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 12px;
  color: #7f8c8d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.achievement-progress {
  margin-top: 4px;
  height: 6px;
  background: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
  position: relative;

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #f39c12, #e67e22);
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  .progress-text {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8px;
    color: #7f8c8d;
  }
}

.unlock-badge {
  display: flex;
  flex-direction: column;
  align-items: center;

  .badge-icon {
    width: 24px;
    height: 24px;
    background: #27ae60;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .badge-time {
    font-size: 10px;
    color: #95a5a6;
    margin-top: 2px;
  }
}

.unlock-popup {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  .popup-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: linear-gradient(135deg, #f39c12, #e67e22);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(243, 156, 18, 0.4);
    color: white;
  }

  .popup-icon {
    font-size: 36px;
  }

  .popup-title {
    font-size: 12px;
    opacity: 0.9;
  }

  .popup-name {
    font-size: 18px;
    font-weight: bold;
  }
}

.achievement-popup-enter-active {
  animation: popIn 0.5s ease;
}

.achievement-popup-leave-active {
  animation: popOut 0.5s ease;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-50px) scale(0.5);
  }
  50% {
    transform: translateX(-50%) translateY(10px) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes popOut {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px) scale(0.8);
  }
}

:global(.dark-mode) .achievement-system {
  .achievement-header {
    .header-title {
      color: #ecf0f1;
    }
    .achievement-count {
      background: rgba(255, 255, 255, 0.1);
      color: #bdc3c7;
    }
  }

  .achievement-item {
    background: rgba(255, 255, 255, 0.05);
    border-color: #566573;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.unlocked {
      background: linear-gradient(135deg, rgba(39, 174, 96, 0.2), rgba(46, 204, 113, 0.2));
    }
  }

  .achievement-name {
    color: #ecf0f1;
  }

  .achievement-desc {
    color: #95a5a6;
  }

  .achievement-progress {
    background: #34495e;
  }
}

/* 响应式优化 */
@media (max-width: 360px) {
  .achievement-header {
    flex-wrap: wrap;

    .header-title {
      font-size: 14px;
    }

    .achievement-count {
      font-size: 12px;
    }
  }

  .achievement-item {
    padding: 8px;
    gap: 8px;
  }

  .achievement-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .achievement-name {
    font-size: 12px;
  }

  .achievement-desc {
    font-size: 10px;
  }

  .unlock-badge {
    .badge-icon {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }

    .badge-time {
      font-size: 8px;
    }
  }
}
</style>
