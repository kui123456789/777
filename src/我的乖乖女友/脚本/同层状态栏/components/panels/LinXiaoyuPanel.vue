<template>
  <div class="panel-content linxiaoyu-panel">
    <div class="info-block">
      <div class="block-title">林小雨状态</div>
      <div class="handwritten-text">
        <div class="row">
          <span class="label">当前状态:</span>
          <span class="value status-tag">{{ statusData.当前状态 }}</span>
        </div>
        <div class="row">
          <span class="label">年龄:</span>
          <span class="value">{{ statusData.年龄 }}岁</span>
        </div>
        <div class="row">
          <span class="label">兄控度:</span>
          <ProgressBar
            :value="statusData.兄控度"
            type="favor"
            :draggable="true"
            @update:value="v => emit('updateValue', '林小雨状态.兄控度', v)"
            @change="v => emit('valueChanged', '林小雨状态.兄控度', v)"
          />
        </div>
        <div class="row">
          <span class="label">心情:</span>
          <ProgressBar :value="statusData.心情" type="mood" />
        </div>
        <div class="row">
          <span class="label">零花钱:</span>
          <span class="value money">¥{{ statusData.零花钱 }}</span>
        </div>
        <div class="row status-tags">
          <span v-if="!statusData.是否处女" class="tag deflowered">已破处</span>
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
      title="身体发育"
      :body-parts="bodyData"
      @show-detail="(title, content) => emit('showDetail', title, content)"
    />

    <!-- 快捷操作 -->
    <div class="info-block">
      <QuickActionsLin
        :brother-complex="statusData.兄控度"
        :mood="statusData.心情"
        :pocket-money="statusData.零花钱"
        @action-executed="actionId => emit('actionExecuted', actionId)"
        @dialog-selected="option => emit('dialogSelected', option)"
      />
    </div>

    <!-- 林小雨背包 -->
    <div class="info-block">
      <InventoryGrid :inventory="inventoryData" @item-click="item => emit('showDetail', item.name, item.data.描述)" />
    </div>

    <!-- 成就系统 -->
    <div class="info-block">
      <AchievementSystemLin
        :brother-complex="statusData.兄控度"
        :mood="statusData.心情"
        :pocket-money="statusData.零花钱"
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
import QuickActionsLin from '../QuickActionsLin.vue';
import TrendChart from '../TrendChart.vue';
import AchievementSystemLin from '../AchievementSystemLin.vue';

interface TrendPoint {
  label: string;
  time: string;
  values: Record<string, number>;
}

const props = defineProps<{
  statusData: Schema['林小雨状态'];
  bodyData: Schema['林小雨身体'];
  inventoryData: Schema['林小雨背包'];
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
  { label: '兄控', value: props.statusData.兄控度 ?? 15, max: 100 },
  { label: '心情', value: props.statusData.心情 ?? 80, max: 100 },
  { label: '撒娇', value: getSpoiledValue(props.statusData.当前状态), max: 100 },
  { label: '依赖', value: getDependencyValue(props.statusData.兄控度), max: 100 },
  { label: '活泼', value: 75, max: 100 }, // 固定值表示性格特征
]);

// 根据状态计算撒娇值
function getSpoiledValue(state: string): number {
  const stateValues: Record<string, number> = {
    娇纵: 85,
    撒娇: 90,
    乖巧: 50,
    委屈: 70,
    生气: 40,
    开心: 65,
  };
  return stateValues[state] ?? 60;
}

// 根据兄控度计算依赖值
function getDependencyValue(brotherComplex: number): number {
  return Math.min(100, brotherComplex * 1.5 + 20);
}
</script>

<style lang="scss" scoped>
.linxiaoyu-panel {
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

  .status-tag {
    background: linear-gradient(135deg, #f39c12, #e67e22);
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

:global(.dark-mode) .linxiaoyu-panel {
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
  color: #f5b041;
  border-bottom-color: #f5b041;
}
</style>
