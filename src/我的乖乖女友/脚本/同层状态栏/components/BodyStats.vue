<template>
  <div class="info-block body-stats-block">
    <div class="block-title">{{ title }}</div>
    <div class="body-parts-grid">
      <div
        v-for="(part, name) in bodyParts"
        :key="name"
        class="body-part-card"
        @click="showPartDetail(String(name), part)"
      >
        <div class="part-header">
          <span class="part-icon">{{ getPartIcon(String(name)) }}</span>
          <span class="part-name">{{ name }}</span>
        </div>
        <div class="part-description">{{ part.描述 }}</div>
        <div class="part-state">
          <span class="state-label">状态:</span>
          <span class="state-value">{{ part.状态 }}</span>
        </div>
        <div class="sensitivity-row">
          <span class="sensitivity-label">敏感度</span>
          <div class="sensitivity-bar-container">
            <div class="sensitivity-bar" :style="getSensitivityStyle(part.敏感度)"></div>
          </div>
          <span class="sensitivity-value" :style="{ color: getSensitivityColor(part.敏感度) }">{{ part.敏感度 }}%</span>
        </div>
        <div v-if="part.内射量 !== undefined && part.内射量 > 0" class="injection-info">
          <span class="injection-icon">💧</span>
          <span class="injection-value">{{ part.内射量 }}ml</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BodyPart {
  描述: string;
  状态: string;
  特征?: string;
  敏感度: number;
  内射量?: number;
}

const props = defineProps<{
  title: string;
  bodyParts: Record<string, BodyPart>;
}>();

const emit = defineEmits<{
  showDetail: [title: string, content: string];
}>();

// 根据部位名称返回图标
function getPartIcon(name: string): string {
  const iconMap: Record<string, string> = {
    乳房: '🌸',
    胸部: '💗',
    乳头: '🔴',
    下体: '🌺',
    小穴: '🌷',
    臀部: '🍑',
    大腿: '🦵',
    嘴唇: '👄',
    舌头: '👅',
    肛门: '⭕',
  };
  return iconMap[name] || '✨';
}

// 根据敏感度返回渐变颜色
function getSensitivityColor(value: number): string {
  if (value <= 30) return '#27ae60'; // 绿色 - 低敏感
  if (value <= 60) return '#f39c12'; // 橙色 - 中敏感
  if (value <= 80) return '#e67e22'; // 深橙 - 较高
  return '#e74c3c'; // 红色 - 高敏感
}

// 敏感度进度条样式
function getSensitivityStyle(value: number): Record<string, string> {
  const color = getSensitivityColor(value);
  const percentage = Math.min(100, Math.max(0, value));
  return {
    width: `${percentage}%`,
    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
  };
}

function formatBodyPart(part: BodyPart): string {
  let text = `描述: ${part.描述}\n状态: ${part.状态}`;
  if (part.特征) {
    text += `\n特征: ${part.特征}`;
  }
  text += `\n敏感度: ${part.敏感度}%`;
  if (part.内射量 !== undefined) {
    text += `\n内射量: ${part.内射量}ml`;
  }
  return text;
}

function showPartDetail(name: string, part: BodyPart) {
  emit('showDetail', name, formatBodyPart(part));
}
</script>

<style lang="scss" scoped>
.body-stats-block {
  margin-bottom: 20px;
}

.block-title {
  font-size: 18px;
  font-weight: bold;
  color: #c0392b;
  margin-bottom: 12px;
  display: inline-block;
  border-bottom: 2px solid #c0392b;
  transform: rotate(-2deg);
}

.body-parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.body-part-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 250, 250, 0.9));
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #e74c3c, #f39c12);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: #e74c3c;
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.15);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
}

.part-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.part-icon {
  font-size: 16px;
}

.part-name {
  font-weight: bold;
  font-size: 14px;
  color: #2c3e50;
}

.part-description {
  font-size: 12px;
  color: #34495e;
  margin-bottom: 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.part-state {
  font-size: 11px;
  margin-bottom: 8px;
  display: flex;
  gap: 4px;
}

.state-label {
  color: #7f8c8d;
}

.state-value {
  color: #555;
  font-weight: 500;
}

.sensitivity-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sensitivity-label {
  font-size: 10px;
  color: #7f8c8d;
  white-space: nowrap;
}

.sensitivity-bar-container {
  flex: 1;
  height: 6px;
  background: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.sensitivity-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease-out;
}

.sensitivity-value {
  font-size: 11px;
  font-weight: bold;
  min-width: 32px;
  text-align: right;
}

.injection-info {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed #e0e0e0;
}

.injection-icon {
  font-size: 12px;
}

.injection-value {
  font-size: 11px;
  color: #3498db;
  font-weight: 500;
}

// 暗黑模式
:global(.dark-mode) .body-stats-block {
  .block-title {
    color: #ff6b6b;
    border-bottom-color: #ff6b6b;
  }

  .body-part-card {
    background: linear-gradient(135deg, rgba(45, 52, 54, 0.95), rgba(30, 39, 46, 0.9));
    border-color: #566573;

    &::before {
      background: linear-gradient(90deg, #ff6b6b, #feca57);
    }

    &:hover {
      border-color: #ff6b6b;
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.2);
    }
  }

  .part-name {
    color: #ecf0f1;
  }

  .part-description {
    color: #bdc3c7;
  }

  .state-label {
    color: #95a5a6;
  }

  .state-value {
    color: #dfe6e9;
  }

  .sensitivity-label {
    color: #95a5a6;
  }

  .sensitivity-bar-container {
    background: #34495e;
  }

  .injection-info {
    border-top-color: #566573;
  }

  .injection-value {
    color: #5dade2;
  }
}

/* 响应式优化 */
@media (max-width: 360px) {
  .body-parts-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }

  .body-part-card {
    padding: 10px;
  }

  .part-header {
    margin-bottom: 6px;
  }

  .part-icon {
    font-size: 14px;
  }

  .part-name {
    font-size: 12px;
  }

  .part-description {
    font-size: 11px;
    -webkit-line-clamp: 1;
  }

  .sensitivity-row {
    gap: 4px;
  }

  .sensitivity-label {
    font-size: 9px;
  }

  .sensitivity-value {
    font-size: 10px;
    min-width: 28px;
  }
}
</style>
