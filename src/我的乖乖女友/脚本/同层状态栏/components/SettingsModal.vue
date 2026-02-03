<template>
  <transition name="modal-fade">
    <div v-if="visible" class="settings-overlay" @click="$emit('close')">
      <div class="settings-modal" :class="{ 'dark-mode': isDark }" @click.stop>
        <div class="settings-header">
          <span class="settings-title">⚙️ 设置</span>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>

        <div class="settings-body">
          <!-- 音效设置 -->
          <div class="settings-section">
            <h3 class="section-title">🔊 音效</h3>

            <div class="setting-item">
              <label class="setting-label">启用音效</label>
              <div
                class="toggle-switch"
                :class="{ active: settingsStore.settings.soundEnabled }"
                @click="settingsStore.toggleSound()"
              >
                <div class="toggle-slider"></div>
              </div>
            </div>

            <div class="setting-item" :class="{ disabled: !settingsStore.settings.soundEnabled }">
              <label class="setting-label">音量</label>
              <div class="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="settingsStore.settings.soundVolume * 100"
                  :disabled="!settingsStore.settings.soundEnabled"
                  class="volume-slider"
                  @input="onVolumeChange"
                />
                <span class="volume-value">{{ Math.round(settingsStore.settings.soundVolume * 100) }}%</span>
              </div>
            </div>
          </div>

          <!-- 震动设置 -->
          <div class="settings-section">
            <h3 class="section-title">📳 震动</h3>

            <div class="setting-item">
              <label class="setting-label">启用震动反馈</label>
              <div
                class="toggle-switch"
                :class="{ active: settingsStore.settings.vibrationEnabled }"
                @click="settingsStore.toggleVibration()"
              >
                <div class="toggle-slider"></div>
              </div>
            </div>

            <div v-if="!isVibrationSupported" class="setting-hint warning">⚠️ 当前设备不支持震动功能</div>
          </div>

          <!-- 动画设置 -->
          <div class="settings-section">
            <h3 class="section-title">✨ 动画</h3>

            <div class="setting-item">
              <label class="setting-label">启用动画效果</label>
              <div
                class="toggle-switch"
                :class="{ active: settingsStore.settings.animationsEnabled }"
                @click="settingsStore.toggleAnimations()"
              >
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="settings-actions">
            <button class="action-btn reset" @click="handleReset">🔄 重置设置</button>
            <button class="action-btn test" @click="testSound">🔔 测试音效</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../settingsStore';
import { useAudioManager } from '../composables/useAudioManager';
import { useHaptic } from '../composables/useHaptic';

defineProps<{
  visible: boolean;
  isDark: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const settingsStore = useSettingsStore();
const { playSound, setVolume } = useAudioManager();
const { isSupported: isVibrationSupported, clickFeedback } = useHaptic();

function onVolumeChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const volume = parseInt(target.value, 10) / 100;
  settingsStore.setVolume(volume);
  setVolume(volume);
}

function handleReset() {
  if (confirm('确定要重置所有设置为默认值吗？')) {
    settingsStore.resetSettings();
    toastr.success('设置已重置');
  }
}

function testSound() {
  if (settingsStore.settings.soundEnabled) {
    playSound('success');
    if (settingsStore.settings.vibrationEnabled) {
      clickFeedback();
    }
    toastr.info('测试音效已播放');
  } else {
    toastr.warning('音效已禁用');
  }
}
</script>

<style lang="scss" scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.settings-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.dark-mode {
    background: #2d3436;
    color: #ecf0f1;

    .settings-header {
      background: linear-gradient(135deg, #34495e, #2c3e50);
    }

    .settings-section {
      border-color: #566573;
    }

    .section-title {
      color: #ecf0f1;
    }

    .setting-label {
      color: #bdc3c7;
    }

    .toggle-switch {
      background: #566573;

      &.active {
        background: #27ae60;
      }
    }

    .volume-slider {
      background: #566573;

      &::-webkit-slider-thumb {
        background: #ecf0f1;
      }
    }

    .action-btn {
      background: #566573;
      color: #ecf0f1;

      &:hover {
        background: #7f8c8d;
      }
    }
  }
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.settings-title {
  font-size: 18px;
  font-weight: bold;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
}

.settings-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.settings-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 16px;
  }
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 12px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.setting-label {
  font-size: 14px;
  color: #555;
}

.toggle-switch {
  width: 48px;
  height: 26px;
  background: #ccc;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    background: #27ae60;

    .toggle-slider {
      transform: translateX(22px);
    }
  }
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-slider {
  width: 120px;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    background: #667eea;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.volume-value {
  font-size: 12px;
  color: #7f8c8d;
  min-width: 35px;
}

.setting-hint {
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;

  &.warning {
    background: rgba(243, 156, 18, 0.1);
    color: #f39c12;
    border: 1px solid rgba(243, 156, 18, 0.3);
  }
}

.settings-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &.reset {
    background: #e74c3c;
    color: white;

    &:hover {
      background: #c0392b;
    }
  }

  &.test {
    background: #3498db;
    color: white;

    &:hover {
      background: #2980b9;
    }
  }
}

// 动画
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .settings-modal,
.modal-fade-leave-active .settings-modal {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .settings-modal,
.modal-fade-leave-to .settings-modal {
  transform: scale(0.9);
}
</style>
