<template>
  <div class="panel-content jianglin-panel">
    <!-- 状态区域 -->
    <div class="info-block">
      <div class="block-title">我的状态</div>
      <div class="handwritten-text">
        <div class="row">
          <span class="label">关系:</span>
          <span class="value relationship-badge" :style="{ background: getRelationshipColor(data.关系状态) }">{{
            data.关系状态
          }}</span>
        </div>
        <div class="row">
          <span class="label">年龄:</span>
          <span class="value">{{ data.年龄 }}岁</span>
        </div>
        <div class="row">
          <span class="label">好感度:</span>
          <ProgressBar
            :value="data.好感度 ?? 0"
            type="favor"
            :draggable="true"
            @update:value="v => emit('updateValue', '姜林.好感度', v)"
            @change="v => emit('valueChanged', '姜林.好感度', v)"
          />
        </div>
        <div class="row">
          <span class="label">心情:</span>
          <span class="value interactive-btn" @click="showMoodDetail">
            <span class="mood-icon">{{ getMoodIcon(data.基础状态.心情) }}</span>
            <span class="circle-highlight">{{ data.基础状态.心情 }}</span>
          </span>
        </div>
        <div class="row">
          <span class="label">状态:</span>
          <span class="value">{{ data.基础状态.当前状态 }}</span>
        </div>
        <div class="row">
          <span class="label">体力:</span>
          <ProgressBar :value="data.基础状态.体力" type="stamina" :show-percent="true" />
        </div>
        <div class="row">
          <span class="label">小金库:</span>
          <span class="value money interactive-btn" @click="showFinanceDetail"
            >¥{{ Number(data.财务.现金).toFixed(1) }}</span
          >
        </div>
        <div v-if="data.财务.欠债 > 0" class="row">
          <span class="label">欠债:</span>
          <span class="value debt">¥{{ Number(data.财务.欠债).toFixed(1) }}</span>
        </div>
      </div>
    </div>

    <!-- 身体数据 -->
    <div class="info-block">
      <div class="block-title">身体记录</div>
      <div class="handwritten-text">
        <div class="row">
          <span class="label">腿长:</span>
          <span class="value">{{ data.身体.腿长 }}</span>
        </div>
        <div class="row">
          <span class="label">大腿围:</span>
          <span class="value">{{ data.身体.大腿围 }}</span>
        </div>
        <div class="privacy-box">
          <div class="interactive-btn" @click="emit('showDetail', '乳房', data.身体.私密部位.乳房)">
            乳房: {{ data.身体.私密部位.乳房 }}
          </div>
          <div
            class="interactive-btn"
            style="margin-top: 4px"
            @click="emit('showDetail', '胸部状态', data.身体.私密部位.胸部)"
          >
            胸部: {{ data.身体.私密部位.胸部 }}
          </div>
          <div
            class="interactive-btn"
            style="margin-top: 4px"
            @click="emit('showDetail', '乳头状态', data.身体.私密部位.乳头状态)"
          >
            乳头: {{ data.身体.私密部位.乳头状态 }}
          </div>
          <div
            class="interactive-btn"
            style="margin-top: 4px"
            @click="emit('showDetail', '下体状态', data.身体.私密部位.下体)"
          >
            下体: {{ data.身体.私密部位.下体 }}
          </div>
          <div
            class="interactive-btn"
            style="margin-top: 4px"
            @click="emit('showDetail', '小穴状态', data.身体.私密部位.小穴)"
          >
            小穴: {{ data.身体.私密部位.小穴 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 情绪雷达图 -->
    <div class="info-block">
      <div class="block-title">情绪状态</div>
      <RadarChart :axes="emotionRadarData" :size="220" />
    </div>

    <!-- 快捷操作 -->
    <div class="info-block">
      <QuickActions
        :money="data.财务?.现金 ?? 0"
        :relation-status="data.关系状态 ?? '陌生人'"
        :goodwill="data.好感度 ?? 0"
        @action-executed="actionId => emit('actionExecuted', actionId)"
        @dialog-selected="option => emit('dialogSelected', option)"
        @update-money="delta => emit('updateMoney', delta)"
      />
    </div>

    <!-- 成就系统 -->
    <div class="info-block">
      <AchievementSystem
        :goodwill="data.好感度 ?? 0"
        :relation-status="data.关系状态 ?? '陌生人'"
        :money="data.财务?.现金 ?? 0"
        @achievement-unlocked="achievement => emit('achievementUnlocked', achievement)"
      />
    </div>

    <!-- 趋势图 -->
    <div v-if="trendHistory.length >= 2" class="info-block">
      <TrendChart title="数值趋势" :data="trendHistory" :is-dark="isDark" />
    </div>

    <!-- 背包物品 -->
    <div class="info-block">
      <InventoryGrid :inventory="data.背包" @item-click="item => emit('showDetail', item.name, item.data.描述)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';
import ProgressBar from '../../ProgressBar.vue';
import RadarChart from '../RadarChart.vue';
import AchievementSystem from '../AchievementSystem.vue';
import QuickActions from '../QuickActions.vue';
import TrendChart from '../TrendChart.vue';
import InventoryGrid from '../InventoryGrid.vue';

interface TrendPoint {
  label: string;
  time: string;
  values: Record<string, number>;
}

const props = defineProps<{
  data: Schema['姜林'];
  isDark: boolean;
  trendHistory: TrendPoint[];
}>();

const emit = defineEmits<{
  showDetail: [title: string, content: string];
  updateValue: [path: string, value: number];
  valueChanged: [path: string, value: number];
  actionExecuted: [actionId: string];
  dialogSelected: [option: { id: string; text: string; effect: string; type: string }];
  updateMoney: [delta: number];
  achievementUnlocked: [achievement: { name: string }];
}>();

// 根据心情返回对应的 emoji
function getMoodIcon(mood: string): string {
  const moodMap: Record<string, string> = {
    开心: '😊',
    高兴: '😄',
    快乐: '😃',
    兴奋: '🤩',
    紧张: '😰',
    害羞: '😳',
    害怕: '😨',
    恐惧: '😱',
    愤怒: '😠',
    生气: '😤',
    悲伤: '😢',
    伤心: '😭',
    平静: '😌',
    无聊: '😑',
    困惑: '🤔',
    惊讶: '😲',
    厌恶: '🤢',
    羞耻: '😖',
    期待: '🥺',
    满足: '😌',
    疲惫: '😫',
    痛苦: '😣',
    享受: '😋',
    傲慢: '😏',
    警惕: '👀',
    屈辱: '😓',
  };
  return moodMap[mood] || '😐';
}

// 根据关系返回徽章颜色
function getRelationshipColor(relation: string): string {
  const colorMap: Record<string, string> = {
    陌生人: 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
    朋友: 'linear-gradient(135deg, #3498db, #2980b9)',
    暧昧: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    恋人: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    从属: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
  };
  return colorMap[relation] || 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
}

// 心情转数值
function getMoodValue(mood: string): number {
  const moodValues: Record<string, number> = {
    开心: 90,
    高兴: 85,
    快乐: 85,
    兴奋: 95,
    满足: 80,
    期待: 75,
    平静: 60,
    享受: 85,
    无聊: 40,
    困惑: 45,
    紧张: 35,
    害羞: 50,
    警惕: 30,
    害怕: 20,
    恐惧: 10,
    愤怒: 15,
    生气: 20,
    悲伤: 25,
    伤心: 20,
    厌恶: 15,
    羞耻: 30,
    屈辱: 20,
    疲惫: 35,
    痛苦: 15,
    傲慢: 55,
  };
  return moodValues[mood] ?? 50;
}

// 亲密度计算
function getIntimacyValue(): number {
  const relation = props.data.关系状态;
  const goodwill = props.data.好感度 ?? 0;
  const relationBonus: Record<string, number> = {
    陌生人: 0,
    朋友: 20,
    暧昧: 40,
    恋人: 60,
    从属: 80,
  };
  return Math.min(100, (relationBonus[relation] ?? 0) + goodwill * 0.3);
}

// 情绪雷达图数据
const emotionRadarData = computed(() => [
  { label: '好感', value: props.data.好感度 ?? 0, max: 100 },
  { label: '心情', value: getMoodValue(props.data.基础状态?.心情 ?? '平静'), max: 100 },
  { label: '体力', value: props.data.基础状态?.体力 ?? 0, max: 100 },
  { label: '信任', value: Math.min(100, (props.data.好感度 ?? 0) * 0.8 + 20), max: 100 },
  { label: '亲密', value: getIntimacyValue(), max: 100 },
]);

function showMoodDetail() {
  emit('showDetail', '心情', props.data.基础状态.心情);
}

function showFinanceDetail() {
  emit(
    'showDetail',
    '财务状况',
    `现金: ¥${Number(props.data.财务.现金).toFixed(1)}\n欠债: ¥${Number(props.data.财务.欠债).toFixed(1)}\n打工收入: ¥${Number(props.data.财务.打工收入).toFixed(1)}`,
  );
}
</script>

<style lang="scss" scoped>
.jianglin-panel {
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 8px;
    background-color: transparent !important;
  }

  .label {
    font-weight: bold;
    color: #555;
    min-width: 60px;
  }

  .value {
    color: #2980b9;

    &.interactive-btn {
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        transform: scale(1.05);
        text-shadow: 0 0 5px rgba(41, 128, 185, 0.3);
      }
    }

    &.money {
      color: #27ae60;
    }

    &.debt {
      color: #c0392b;
    }
  }

  .relationship-badge {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .mood-icon {
    font-size: 18px;
  }

  .circle-highlight {
    border: 2px solid #e74c3c;
    border-radius: 50% 60% 40% 70% / 60% 50% 70% 40%;
    padding: 2px 8px;
    display: inline-block;
  }

  .privacy-box {
    font-size: 14px;
    color: #34495e;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(250, 250, 250, 0.6));
    padding: 12px;
    margin-top: 8px;
    border-left: 4px solid #e74c3c;
    border-radius: 0 8px 8px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .interactive-btn {
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 8px 10px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid transparent;
      color: #2c3e50;
      font-weight: 500;

      &:hover {
        background: rgba(231, 76, 60, 0.08);
        border-color: rgba(231, 76, 60, 0.2);
        transform: translateX(4px);
        color: #c0392b;
      }

      &:active {
        transform: translateX(2px);
      }
    }
  }
}

.info-block {
  margin-bottom: 20px;
  position: relative;
  background-color: transparent !important;
  box-shadow: none !important;
}

.block-title {
  font-size: 18px;
  font-weight: bold;
  color: #c0392b;
  margin-bottom: 8px;
  display: inline-block;
  border-bottom: 2px solid #c0392b;
  transform: rotate(-2deg);
}

.handwritten-text {
  font-size: 16px;
  line-height: 1.6;
  margin-left: 10px;
  background-color: transparent !important;
}

:global(.dark-mode) .jianglin-panel {
  .label {
    color: #bdc3c7;
  }

  .value {
    color: #5dade2;
  }

  .value.money {
    color: #58d68d;
  }

  .value.debt {
    color: #ff6b6b;
  }

  .privacy-box {
    background: linear-gradient(135deg, rgba(45, 52, 54, 0.8), rgba(30, 39, 46, 0.6));
    border-left-color: #ff6b6b;
    color: #ecf0f1;

    .interactive-btn {
      background: rgba(255, 255, 255, 0.05);
      color: #dfe6e9;

      &:hover {
        background: rgba(255, 107, 107, 0.1);
        border-color: rgba(255, 107, 107, 0.3);
        color: #ff6b6b;
      }
    }
  }
}

:global(.dark-mode) .block-title {
  color: #ff6b6b;
  border-bottom-color: #ff6b6b;
}
</style>
