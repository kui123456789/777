import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';
import { klona } from 'klona';

// 设置 Schema
const SettingsSchema = z.object({
  // 音效设置
  soundEnabled: z.boolean().default(true),
  soundVolume: z.number().min(0).max(1).default(0.5),
  // 震动设置
  vibrationEnabled: z.boolean().default(true),
  // 动画设置
  animationsEnabled: z.boolean().default(true),
});

type Settings = z.infer<typeof SettingsSchema>;

// 获取脚本 ID
function getSettingsScriptId(): string {
  try {
    return getScriptId();
  } catch {
    return 'status-bar-settings';
  }
}

// 加载设置
function loadSettings(): Settings {
  try {
    const raw = getVariables({ type: 'script', script_id: getSettingsScriptId() });
    const parsed = SettingsSchema.safeParse(raw);
    if (parsed.success) {
      return parsed.data;
    }
  } catch (e) {
    console.warn('[设置] 加载失败，使用默认值:', e);
  }
  return SettingsSchema.parse({});
}

// 保存设置
function saveSettings(settings: Settings): void {
  try {
    replaceVariables(klona(settings), { type: 'script', script_id: getSettingsScriptId() });
  } catch (e) {
    console.warn('[设置] 保存失败:', e);
  }
}

export const useSettingsStore = defineStore('status-bar-settings', () => {
  const settings = ref<Settings>(loadSettings());

  // 自动保存
  watchEffect(() => {
    saveSettings(settings.value);
  });

  // 切换音效
  function toggleSound() {
    settings.value.soundEnabled = !settings.value.soundEnabled;
  }

  // 设置音量
  function setVolume(volume: number) {
    settings.value.soundVolume = Math.max(0, Math.min(1, volume));
  }

  // 切换震动
  function toggleVibration() {
    settings.value.vibrationEnabled = !settings.value.vibrationEnabled;
  }

  // 切换动画
  function toggleAnimations() {
    settings.value.animationsEnabled = !settings.value.animationsEnabled;
  }

  // 重置设置
  function resetSettings() {
    settings.value = SettingsSchema.parse({});
  }

  return {
    settings,
    toggleSound,
    setVolume,
    toggleVibration,
    toggleAnimations,
    resetSettings,
  };
});
