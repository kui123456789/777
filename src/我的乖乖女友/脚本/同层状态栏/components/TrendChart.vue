<template>
  <div class="trend-chart" :class="{ 'dark-mode': isDark }">
    <div class="chart-header">
      <span class="chart-title">📈 {{ title }}</span>
      <div class="time-selector">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          class="period-btn"
          :class="{ active: selectedPeriod === period.value }"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <div class="chart-container">
      <svg :viewBox="`0 0 ${width} ${height}`" class="trend-svg">
        <!-- 背景网格 -->
        <g class="grid-lines">
          <line
            v-for="i in 5"
            :key="'h' + i"
            :x1="padding"
            :y1="padding + (chartHeight / 4) * (i - 1)"
            :x2="width - padding"
            :y2="padding + (chartHeight / 4) * (i - 1)"
            class="grid-line"
          />
          <line
            v-for="i in displayData.length"
            :key="'v' + i"
            :x1="getX(i - 1)"
            :y1="padding"
            :x2="getX(i - 1)"
            :y2="height - padding"
            class="grid-line vertical"
          />
        </g>

        <!-- Y轴标签 -->
        <g class="y-labels">
          <text
            v-for="i in 5"
            :key="'y' + i"
            :x="padding - 5"
            :y="padding + (chartHeight / 4) * (i - 1) + 4"
            class="axis-label"
          >
            {{ Math.round(100 - 25 * (i - 1)) }}
          </text>
        </g>

        <!-- 数据线和区域 -->
        <g v-for="(series, idx) in activeSeries" :key="series.key">
          <!-- 填充区域 -->
          <path :d="getAreaPath(series.key)" :fill="series.color" fill-opacity="0.1" class="area-fill" />
          <!-- 趋势线 -->
          <path
            :d="getLinePath(series.key)"
            :stroke="series.color"
            stroke-width="2"
            fill="none"
            class="trend-line"
            :style="{ animationDelay: `${idx * 0.2}s` }"
          />
          <!-- 数据点 -->
          <g class="data-points">
            <circle
              v-for="(point, i) in getSeriesData(series.key)"
              :key="i"
              :cx="getX(i)"
              :cy="getY(point.value)"
              r="4"
              :fill="series.color"
              class="data-point"
              @mouseenter="showTooltip($event, point, series)"
              @mouseleave="hideTooltip"
            />
          </g>
        </g>

        <!-- X轴标签 -->
        <g class="x-labels">
          <text
            v-for="(point, i) in displayData"
            :key="'x' + i"
            :x="getX(i)"
            :y="height - padding + 15"
            class="axis-label x-label"
          >
            {{ point.label }}
          </text>
        </g>
      </svg>

      <!-- 图例 -->
      <div class="chart-legend">
        <div
          v-for="series in allSeries"
          :key="series.key"
          class="legend-item"
          :class="{ inactive: !series.active }"
          @click="toggleSeries(series.key)"
        >
          <span class="legend-color" :style="{ background: series.color }"></span>
          <span class="legend-label">{{ series.label }}</span>
        </div>
      </div>
    </div>

    <!-- 工具提示 -->
    <transition name="fade">
      <div v-if="tooltip.visible" class="chart-tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
        <div class="tooltip-title">{{ tooltip.series }}</div>
        <div class="tooltip-value">{{ tooltip.value }}</div>
        <div class="tooltip-time">{{ tooltip.time }}</div>
      </div>
    </transition>

    <!-- 变化统计 -->
    <div class="trend-stats">
      <div v-for="series in activeSeries" :key="series.key" class="stat-item">
        <span class="stat-label">{{ series.label }}</span>
        <span class="stat-change" :class="getTrendClass(series.key)">
          {{ getTrendIcon(series.key) }} {{ getTrendValue(series.key) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TrendPoint {
  label: string;
  time: string;
  values: Record<string, number>;
}

interface SeriesConfig {
  key: string;
  label: string;
  color: string;
  active: boolean;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    data: TrendPoint[];
    isDark?: boolean;
  }>(),
  {
    title: '数值趋势',
    isDark: false,
  },
);

// 图表尺寸
const width = 320;
const height = 200;
const padding = 30;
const chartWidth = width - padding * 2;
const chartHeight = height - padding * 2;

// 时间周期选择
const timePeriods = [
  { label: '近5轮', value: 5 },
  { label: '近10轮', value: 10 },
  { label: '全部', value: -1 },
];
const selectedPeriod = ref(5);

// 系列配置
const allSeries = ref<SeriesConfig[]>([
  { key: '好感度', label: '好感度', color: '#e74c3c', active: true },
  { key: '心情', label: '心情', color: '#3498db', active: true },
  { key: '体力', label: '体力', color: '#2ecc71', active: false },
]);

const activeSeries = computed(() => allSeries.value.filter(s => s.active));

// 显示数据（根据时间周期过滤）
const displayData = computed(() => {
  if (selectedPeriod.value === -1 || props.data.length <= selectedPeriod.value) {
    return props.data;
  }
  return props.data.slice(-selectedPeriod.value);
});

// 切换系列显示
function toggleSeries(key: string) {
  const series = allSeries.value.find(s => s.key === key);
  if (series) {
    series.active = !series.active;
  }
}

// 获取某个系列的数据
function getSeriesData(key: string) {
  return displayData.value.map(point => ({
    label: point.label,
    time: point.time,
    value: point.values[key] ?? 0,
  }));
}

// 坐标计算
function getX(index: number): number {
  const count = displayData.value.length;
  if (count <= 1) return padding + chartWidth / 2;
  return padding + (index / (count - 1)) * chartWidth;
}

function getY(value: number): number {
  // 假设值范围 0-100
  const clampedValue = Math.max(0, Math.min(100, value));
  return padding + (1 - clampedValue / 100) * chartHeight;
}

// 生成线条路径
function getLinePath(key: string): string {
  const points = getSeriesData(key);
  if (points.length === 0) return '';

  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`).join(' ');
}

// 生成填充区域路径
function getAreaPath(key: string): string {
  const points = getSeriesData(key);
  if (points.length === 0) return '';

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`).join(' ');

  // 闭合到底部
  return `${linePath} L ${getX(points.length - 1)} ${height - padding} L ${padding} ${height - padding} Z`;
}

// 趋势计算
function getTrendValue(key: string): string {
  const points = getSeriesData(key);
  if (points.length < 2) return '0';

  const first = points[0].value;
  const last = points[points.length - 1].value;
  const diff = last - first;

  return diff >= 0 ? `+${diff.toFixed(0)}` : diff.toFixed(0);
}

function getTrendClass(key: string): string {
  const points = getSeriesData(key);
  if (points.length < 2) return '';

  const first = points[0].value;
  const last = points[points.length - 1].value;

  if (last > first) return 'positive';
  if (last < first) return 'negative';
  return 'neutral';
}

function getTrendIcon(key: string): string {
  const points = getSeriesData(key);
  if (points.length < 2) return '➡️';

  const first = points[0].value;
  const last = points[points.length - 1].value;

  if (last > first) return '📈';
  if (last < first) return '📉';
  return '➡️';
}

// 工具提示
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  series: '',
  value: '',
  time: '',
});

function showTooltip(event: MouseEvent, point: { label: string; time: string; value: number }, series: SeriesConfig) {
  const rect = (event.target as SVGElement).getBoundingClientRect();
  tooltip.value = {
    visible: true,
    x: rect.left + rect.width / 2,
    y: rect.top - 10,
    series: series.label,
    value: point.value.toFixed(0),
    time: point.time,
  };
}

function hideTooltip() {
  tooltip.value.visible = false;
}
</script>

<style lang="scss" scoped>
.trend-chart {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &.dark-mode {
    background: rgba(44, 62, 80, 0.8);
    color: #ecf0f1;

    .chart-title {
      color: #ecf0f1;
    }

    .period-btn {
      background: rgba(255, 255, 255, 0.1);
      color: #bdc3c7;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: #3498db;
        color: white;
      }
    }

    .grid-line {
      stroke: rgba(255, 255, 255, 0.1);
    }

    .axis-label {
      fill: #95a5a6;
    }

    .legend-label {
      color: #bdc3c7;
    }

    .chart-tooltip {
      background: #2c3e50;
      border-color: #34495e;
    }

    .stat-item {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

.time-selector {
  display: flex;
  gap: 5px;
}

.period-btn {
  padding: 4px 10px;
  border: none;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.05);
  color: #7f8c8d;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: #3498db;
    color: white;
  }
}

.chart-container {
  position: relative;
}

.trend-svg {
  width: 100%;
  height: auto;
}

.grid-line {
  stroke: rgba(0, 0, 0, 0.08);
  stroke-width: 1;

  &.vertical {
    stroke-dasharray: 2, 2;
  }
}

.axis-label {
  font-size: 10px;
  fill: #7f8c8d;
  text-anchor: end;

  &.x-label {
    text-anchor: middle;
  }
}

.trend-line {
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: drawLine 1s ease-out forwards;
}

@keyframes drawLine {
  from {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.area-fill {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.data-point {
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    r: 6;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.inactive {
    opacity: 0.4;

    .legend-color {
      background: #bdc3c7 !important;
    }
  }
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  font-size: 12px;
  color: #2c3e50;
}

.chart-tooltip {
  position: fixed;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transform: translate(-50%, -100%);
  pointer-events: none;

  .tooltip-title {
    font-size: 12px;
    color: #7f8c8d;
  }

  .tooltip-value {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
  }

  .tooltip-time {
    font-size: 10px;
    color: #95a5a6;
  }
}

.trend-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
}

.stat-change {
  font-size: 16px;
  font-weight: bold;

  &.positive {
    color: #27ae60;
  }

  &.negative {
    color: #e74c3c;
  }

  &.neutral {
    color: #95a5a6;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式优化 */
@media (max-width: 360px) {
  .trend-chart {
    padding: 12px;
  }

  .chart-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .time-selector {
    width: 100%;
    justify-content: space-between;
  }

  .period-btn {
    flex: 1;
    text-align: center;
  }

  .chart-legend {
    gap: 8px;
    flex-wrap: wrap;
  }

  .legend-item {
    padding: 3px 6px;
  }

  .trend-stats {
    flex-wrap: wrap;
    gap: 8px;
  }

  .stat-item {
    flex: 1 1 auto;
    min-width: 80px;
  }
}
</style>
