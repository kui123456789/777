<template>
  <div class="radar-chart-container">
    <svg :width="svgSize" :height="svgSize" :viewBox="`0 0 ${svgSize} ${svgSize}`">
      <!-- 背景网格 -->
      <g class="grid">
        <polygon
          v-for="level in 5"
          :key="level"
          :points="getGridPoints(level / 5)"
          class="grid-line"
          :style="{ opacity: 0.15 + level * 0.12 }"
        />
      </g>

      <!-- 轴线 -->
      <g class="axes">
        <line
          v-for="(axis, index) in axes"
          :key="index"
          :x1="center"
          :y1="center"
          :x2="getPointX(index, 1)"
          :y2="getPointY(index, 1)"
          class="axis-line"
        />
      </g>

      <!-- 数据区域 -->
      <polygon :points="dataPoints" class="data-area" />
      <polygon :points="dataPoints" class="data-border" />

      <!-- 数据点 -->
      <circle
        v-for="(value, index) in normalizedValues"
        :key="'point-' + index"
        :cx="getPointX(index, value)"
        :cy="getPointY(index, value)"
        r="5"
        class="data-point"
      />

      <!-- 标签背景 + 标签 -->
      <g v-for="(axis, index) in axes" :key="'label-group-' + index">
        <!-- 标签背景 -->
        <rect
          :x="getLabelBgX(index, axis.label)"
          :y="getLabelY(index) - 12"
          :width="axis.label.length * 14 + 8"
          height="20"
          rx="4"
          class="label-bg"
        />
        <!-- 标签文字 -->
        <text
          :x="getLabelX(index)"
          :y="getLabelY(index)"
          class="axis-label"
          :text-anchor="getTextAnchor(index)"
          dominant-baseline="middle"
        >
          {{ axis.label }}
        </text>
        <!-- 数值 -->
        <text
          :x="getLabelX(index)"
          :y="getLabelY(index) + 14"
          class="axis-value"
          :text-anchor="getTextAnchor(index)"
          dominant-baseline="middle"
        >
          {{ Math.round(axis.value) }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  axes: Array<{ label: string; value: number; max?: number }>;
  size?: number;
}>();

// 增加边距给标签留空间
const labelPadding = 50;
const size = computed(() => props.size ?? 200);
const svgSize = computed(() => size.value + labelPadding * 2);
const center = computed(() => svgSize.value / 2);
const radius = computed(() => size.value * 0.35);

const normalizedValues = computed(() => {
  return props.axes.map(axis => {
    const max = axis.max ?? 100;
    return Math.min(1, Math.max(0, axis.value / max));
  });
});

function getAngle(index: number): number {
  return (Math.PI * 2 * index) / props.axes.length - Math.PI / 2;
}

function getPointX(index: number, scale: number): number {
  return center.value + radius.value * scale * Math.cos(getAngle(index));
}

function getPointY(index: number, scale: number): number {
  return center.value + radius.value * scale * Math.sin(getAngle(index));
}

function getGridPoints(scale: number): string {
  return props.axes.map((_, i) => `${getPointX(i, scale)},${getPointY(i, scale)}`).join(' ');
}

const dataPoints = computed(() => {
  return normalizedValues.value.map((v, i) => `${getPointX(i, v)},${getPointY(i, v)}`).join(' ');
});

function getLabelX(index: number): number {
  const angle = getAngle(index);
  const offset = radius.value + 28;
  return center.value + offset * Math.cos(angle);
}

function getLabelY(index: number): number {
  const angle = getAngle(index);
  const offset = radius.value + 28;
  return center.value + offset * Math.sin(angle);
}

function getLabelBgX(index: number, label: string): number {
  const x = getLabelX(index);
  const anchor = getTextAnchor(index);
  const width = label.length * 14 + 8;
  if (anchor === 'middle') return x - width / 2;
  if (anchor === 'end') return x - width;
  return x;
}

function getTextAnchor(index: number): string {
  const angle = getAngle(index);
  if (Math.abs(Math.cos(angle)) < 0.15) return 'middle';
  return Math.cos(angle) > 0 ? 'start' : 'end';
}
</script>

<style lang="scss" scoped>
.radar-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.grid-line {
  fill: none;
  stroke: #95a5a6;
  stroke-width: 1;
}

.axis-line {
  stroke: #bdc3c7;
  stroke-width: 1;
}

.data-area {
  fill: rgba(231, 76, 60, 0.25);
  transition: all 0.5s ease;
}

.data-border {
  fill: none;
  stroke: #e74c3c;
  stroke-width: 2.5;
  transition: all 0.5s ease;
}

.data-point {
  fill: #e74c3c;
  stroke: white;
  stroke-width: 2;
  transition: all 0.3s ease;

  &:hover {
    r: 7;
    fill: #c0392b;
  }
}

.label-bg {
  fill: rgba(255, 255, 255, 0.85);
  stroke: none;
}

.axis-label {
  font-size: 13px;
  font-weight: 600;
  fill: #2c3e50;
  font-family: 'Caveat', 'PingFang SC', sans-serif;
}

.axis-value {
  font-size: 11px;
  font-weight: 500;
  fill: #e74c3c;
  font-family: 'Caveat', 'PingFang SC', sans-serif;
}

:global(.dark-mode) .radar-chart-container {
  .grid-line {
    stroke: #566573;
  }

  .axis-line {
    stroke: #7f8c8d;
  }

  .data-area {
    fill: rgba(255, 118, 117, 0.25);
  }

  .data-border {
    stroke: #ff7675;
  }

  .data-point {
    fill: #ff7675;
  }

  .label-bg {
    fill: rgba(45, 52, 54, 0.9);
  }

  .axis-label {
    fill: #ecf0f1;
  }

  .axis-value {
    fill: #ff7675;
  }
}

/* 响应式优化 */
@media (max-width: 360px) {
  .radar-chart-container {
    padding: 5px;
  }

  .axis-label {
    font-size: 11px;
  }

  .axis-value {
    font-size: 9px;
  }
}
</style>
