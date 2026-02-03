<template>
  <div class="panel-content shenwanqing-panel">
    <div class="info-block">
      <div class="block-title">沈婉清状态</div>
      <div class="handwritten-text">
        <div class="row">
          <span class="label">关系:</span>
          <span class="value relationship-badge" :style="{ background: getRelationColor(statusData.关系) }">{{
            statusData.关系
          }}</span>
        </div>
        <div class="row">
          <span class="label">年龄:</span>
          <span class="value">{{ statusData.年龄 }}岁</span>
        </div>
        <div class="row">
          <span class="label">当前状态:</span>
          <span class="value status-tag">{{ statusData.当前状态 }}</span>
        </div>
        <div class="row">
          <span class="label">屈从度:</span>
          <ProgressBar
            :value="statusData.屈从度"
            type="submit"
            :draggable="true"
            @update:value="v => emit('updateValue', '沈婉清状态.屈从度', v)"
            @change="v => emit('valueChanged', '沈婉清状态.屈从度', v)"
          />
        </div>
        <div class="row">
          <span class="label">好感度:</span>
          <ProgressBar
            :value="statusData.好感度"
            :type="statusData.好感度 < 0 ? 'negative' : 'favor'"
            :draggable="true"
            @update:value="v => emit('updateValue', '沈婉清状态.好感度', v)"
            @change="v => emit('valueChanged', '沈婉清状态.好感度', v)"
          />
        </div>
        <div class="row">
          <span class="label">心情:</span>
          <ProgressBar :value="statusData.心情" type="mood" />
        </div>
        <div class="row">
          <span class="label">存款:</span>
          <span class="value money">¥{{ statusData.存款 }}</span>
        </div>
        <div class="row status-tags">
          <span v-if="!statusData.是否处女" class="tag deflowered">已破处</span>
          <span v-if="statusData.是否怀孕" class="tag pregnant">已怀孕</span>
        </div>
      </div>
    </div>

    <!-- 情绪雷达图 -->
    <div class="info-block">
      <div class="block-title">情绪状态</div>
      <RadarChart :axes="emotionRadarData" :size="220" />
    </div>

    <!-- 数值趋势 -->
    <div v-if="trendHistory && trendHistory.length >= 2" class="info-block">
      <TrendChart title="数值趋势" :data="trendHistory" :is-dark="isDark" />
    </div>

    <BodyStats
      title="身体开发"
      :body-parts="bodyData"
      @show-detail="(title, content) => emit('showDetail', title, content)"
    />

    <!-- 快捷操作 -->
    <div class="info-block">
      <QuickActionsShen
        :submission="statusData.屈从度"
        :relation-status="statusData.关系"
        :goodwill="statusData.好感度"
        @action-executed="actionId => emit('actionExecuted', actionId)"
        @dialog-selected="option => emit('dialogSelected', option)"
      />
    </div>

    <!-- 沈婉清背包 -->
    <div class="info-block">
      <InventoryGrid :inventory="inventoryData" @item-click="item => emit('showDetail', item.name, item.data.描述)" />
    </div>

    <!-- 成就系统 -->
    <div class="info-block">
      <AchievementSystemShen
        :submission="statusData.屈从度"
        :goodwill="statusData.好感度"
        :relation-status="statusData.关系"
        :is-virgin="statusData.是否处女"
        @achievement-unlocked="achievement => emit('achievementUnlocked', achievement)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';
import ProgressBar from '../../ProgressBar.vue';
import BodyStats from '../BodyStats.vue';
import InventoryGrid from '../InventoryGrid.vue';
import RadarChart from '../RadarChart.vue';
import QuickActionsShen from '../QuickActionsShen.vue';
import TrendChart from '../TrendChart.vue';
import AchievementSystemShen from '../AchievementSystemShen.vue';

interface TrendPoint {
  label: string;
  time: string;
  values: Record<string, number>;
}

const props = defineProps<{
  statusData: Schema['沈婉清状态'];
  bodyData: Schema['沈婉清身体'];
  inventoryData: Schema['沈婉清背包'];
  trendHistory?: TrendPoint[];
  isDark?: boolean;
}>();

const emit = defineEmits<{
  showDetail: [title: string, content: string];
  updateValue: [path: string, value: number];
  valueChanged: [path: string, value: number];
  actionExecuted: [actionId: string];
  dialogSelected: [option: { id: string; text: string; effect: string; type: string }];
  achievementUnlocked: [achievement: { name: string }];
}>();

// 情绪雷达图数据
const emotionRadarData = computed(() => [
  { label: '屈从', value: props.statusData.屈从度 ?? 0, max: 100 },
  { label: '好感', value: Math.max(0, (props.statusData.好感度 ?? 0) + 100) / 2, max: 100 }, // 转换 -100~100 到 0~100
  { label: '心情', value: props.statusData.心情 ?? 50, max: 100 },
  { label: '傲慢', value: getArroganceValue(props.statusData.当前状态), max: 100 },
  { label: '恐惧', value: getFearValue(props.statusData.当前状态), max: 100 },
]);

// 根据状态计算傲慢值
function getArroganceValue(state: string): number {
  const stateValues: Record<string, number> = {
    傲慢: 90,
    震惊: 60,
    妥协: 40,
    恐惧: 20,
    崩坏: 10,
  };
  return stateValues[state] ?? 50;
}

// 根据状态计算恐惧值
function getFearValue(state: string): number {
  const stateValues: Record<string, number> = {
    傲慢: 10,
    震惊: 30,
    妥协: 50,
    恐惧: 80,
    崩坏: 95,
  };
  return stateValues[state] ?? 30;
}

function getRelationColor(relation: string): string {
  const colorMap: Record<string, string> = {
    同学: 'linear-gradient(135deg, #3498db, #2980b9)',
    敌人: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    奴隶: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    玩物: 'linear-gradient(135deg, #e91e63, #c2185b)',
  };
  return colorMap[relation] || 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
}
</script>

<style lang="scss" scoped>
.shenwanqing-panel {
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
    min-width: 70px;
  }

  .value {
    color: #2980b9;

    &.money {
      color: #27ae60;
      font-weight: bold;
    }
  }

  .relationship-badge {
    color: white;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .status-tag {
    background: linear-gradient(135deg, #9b59b6, #8e44ad);
    color: white;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 12px;
  }

  .status-tags {
    justify-content: flex-start;
    gap: 6px;
    margin-top: 4px;
  }

  .tag {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    color: white;

    &.deflowered {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
    }

    &.pregnant {
      background: linear-gradient(135deg, #f39c12, #e67e22);
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

:global(.dark-mode) .shenwanqing-panel {
  .label {
    color: #bdc3c7;
  }

  .value {
    color: #5dade2;
  }

  .value.money {
    color: #58d68d;
  }
}

:global(.dark-mode) .block-title {
  color: #ff6b6b;
  border-bottom-color: #ff6b6b;
}
</style>
