<template>
  <div class="policy-slider">
    <div class="labels">
      <span class="label-left">{{ labelLeft }}</span>
      <span class="label-right">{{ labelRight }}</span>
    </div>
    <div class="slider-track">
      <div class="slider-fill" :style="{ width: `${value}%` }"></div>
      <div class="slider-marker" :style="{ left: `${value}%` }">
        <span class="marker-value">{{ value }}</span>
      </div>
    </div>
    <div class="extreme-indicators">
      <span v-if="value <= 10" class="extreme left">极端</span>
      <span v-if="value >= 90" class="extreme right">极端</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  labelLeft: string;
  labelRight: string;
  value: number;
}>();
</script>

<style lang="scss" scoped>
.policy-slider {
  padding: 4px 0;
}

.labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.label-left,
.label-right {
  font-size: 11px;
  color: #a0a0a0;
}

.label-left {
  color: #4fc3f7;
}

.label-right {
  color: #ff6b35;
}

.slider-track {
  height: 8px;
  background: linear-gradient(90deg, #4fc3f7 0%, #4a4a4a 50%, #ff6b35 100%);
  border-radius: 4px;
  position: relative;
}

.slider-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px 0 0 4px;
}

.slider-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 0 2px #d4a84b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-value {
  font-size: 8px;
  font-weight: bold;
  color: #333;
}

.extreme-indicators {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  min-height: 14px;
}

.extreme {
  font-size: 9px;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 2px;
  animation: pulse 1.5s infinite;

  &.left {
    color: #4fc3f7;
    background: rgba(79, 195, 247, 0.2);
  }

  &.right {
    color: #ff6b35;
    background: rgba(255, 107, 53, 0.2);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
