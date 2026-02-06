import { ref } from 'vue';

// 音效类型
export type SoundType = 'click' | 'success' | 'achievement' | 'error' | 'notification';

// 音效数据（使用 base64 编码的简短音效或 Web Audio API 生成）
const soundConfigs: Record<SoundType, { frequency: number; duration: number; type: OscillatorType }> = {
  click: { frequency: 800, duration: 50, type: 'square' },
  success: { frequency: 523, duration: 150, type: 'sine' }, // C5
  achievement: { frequency: 659, duration: 200, type: 'sine' }, // E5
  error: { frequency: 200, duration: 100, type: 'sawtooth' },
  notification: { frequency: 440, duration: 100, type: 'sine' }, // A4
};

export function useAudioManager() {
  const isMuted = ref(false);
  const volume = ref(0.3); // 0-1
  let audioContext: AudioContext | null = null;

  // 懒加载 AudioContext（需要用户交互后才能创建）
  function getAudioContext(): AudioContext {
    if (!audioContext) {
       
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  }

  // 播放音效
  function playSound(type: SoundType) {
    if (isMuted.value) return;

    try {
      const ctx = getAudioContext();
      const config = soundConfigs[type];

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = config.type;
      oscillator.frequency.value = config.frequency;

      gainNode.gain.value = volume.value;
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration / 1000);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration / 1000);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  // 播放成就解锁音效（多音符序列）
  function playAchievementSound() {
    if (isMuted.value) return;

    try {
      const ctx = getAudioContext();
      const notes = [523, 659, 784]; // C5, E5, G5

      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        const startTime = ctx.currentTime + i * 0.1;
        gainNode.gain.setValueAtTime(volume.value, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
      });
    } catch (e) {
      console.warn('Achievement sound failed:', e);
    }
  }

  // 切换静音
  function toggleMute() {
    isMuted.value = !isMuted.value;
  }

  // 设置音量
  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v));
  }

  return {
    isMuted,
    volume,
    playSound,
    playAchievementSound,
    toggleMute,
    setVolume,
  };
}
