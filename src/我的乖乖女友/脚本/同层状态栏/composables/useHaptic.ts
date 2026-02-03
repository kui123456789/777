export function useHaptic() {
  // 检测是否支持震动 API
  const isSupported = 'vibrate' in navigator;

  // 触发震动
  function vibrate(pattern: number | number[] = 50) {
    if (!isSupported) return false;

    try {
      return navigator.vibrate(pattern);
    } catch (e) {
      console.warn('Vibration failed:', e);
      return false;
    }
  }

  // 预定义的震动模式
  const patterns = {
    click: 30,
    success: [50, 30, 50],
    achievement: [100, 50, 100, 50, 200],
    error: [100, 30, 100],
    notification: [50, 50, 50],
  };

  // 点击反馈
  function clickFeedback() {
    vibrate(patterns.click);
  }

  // 成功反馈
  function successFeedback() {
    vibrate(patterns.success);
  }

  // 成就解锁反馈
  function achievementFeedback() {
    vibrate(patterns.achievement);
  }

  // 错误反馈
  function errorFeedback() {
    vibrate(patterns.error);
  }

  return {
    isSupported,
    vibrate,
    clickFeedback,
    successFeedback,
    achievementFeedback,
    errorFeedback,
  };
}
