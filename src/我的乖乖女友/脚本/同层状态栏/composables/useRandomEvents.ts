import { ref } from 'vue';

export interface GameEvent {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'special';
  icon: string;
  title: string;
  description: string;
  character: '姜林' | '沈婉清' | '林小雨';
}

export function useRandomEvents() {
  const currentEvent = ref<GameEvent | null>(null);
  const eventVisible = ref(false);
  const triggeredEvents = ref<Set<string>>(new Set());

  // 姜林事件定义
  const jianglinEvents: GameEvent[] = [
    {
      id: 'jl_goodwill_30',
      type: 'positive',
      icon: '💕',
      title: '姜林的微笑',
      description: '姜林看你的眼神变得柔和了起来...',
      character: '姜林',
    },
    {
      id: 'jl_goodwill_60',
      type: 'special',
      icon: '💖',
      title: '心动的瞬间',
      description: '姜林的脸微微泛红，不敢直视你的眼睛...',
      character: '姜林',
    },
    {
      id: 'jl_goodwill_80',
      type: 'special',
      icon: '💗',
      title: '确定心意',
      description: '姜林紧紧握住你的手，眼中满是深情...',
      character: '姜林',
    },
  ];

  // 沈婉清事件定义
  const shenEvents: GameEvent[] = [
    {
      id: 'shen_submit_30',
      type: 'neutral',
      icon: '😰',
      title: '动摇的傲慢',
      description: '沈婉清的眼神中闪过一丝恐惧...',
      character: '沈婉清',
    },
    {
      id: 'shen_submit_50',
      type: 'special',
      icon: '⛓️',
      title: '屈服的开始',
      description: '沈婉清低下了她高傲的头...',
      character: '沈婉清',
    },
    {
      id: 'shen_submit_80',
      type: 'special',
      icon: '👠',
      title: '完全堕落',
      description: '沈婉清已经彻底臣服于你...',
      character: '沈婉清',
    },
  ];

  // 林小雨事件定义
  const linEvents: GameEvent[] = [
    {
      id: 'lin_complex_30',
      type: 'positive',
      icon: '🥰',
      title: '粘人的妹妹',
      description: '小雨拉着你的衣角不肯撒手...',
      character: '林小雨',
    },
    {
      id: 'lin_complex_50',
      type: 'special',
      icon: '💕',
      title: '无法离开',
      description: '小雨只想和哥哥待在一起...',
      character: '林小雨',
    },
    {
      id: 'lin_complex_70',
      type: 'special',
      icon: '💖',
      title: '独占欲望',
      description: '小雨不想让任何人接近哥哥...',
      character: '林小雨',
    },
  ];

  function showEvent(event: GameEvent) {
    currentEvent.value = event;
    eventVisible.value = true;

    // 5秒后自动关闭
    setTimeout(() => {
      hideEvent();
    }, 5000);
  }

  function hideEvent() {
    eventVisible.value = false;
    setTimeout(() => {
      currentEvent.value = null;
    }, 300);
  }

  // 检查并触发姜林事件
  function checkJianglinEvents(goodwill: number) {
    if (goodwill >= 30 && !triggeredEvents.value.has('jl_goodwill_30')) {
      triggeredEvents.value.add('jl_goodwill_30');
      showEvent(jianglinEvents[0]);
    } else if (goodwill >= 60 && !triggeredEvents.value.has('jl_goodwill_60')) {
      triggeredEvents.value.add('jl_goodwill_60');
      showEvent(jianglinEvents[1]);
    } else if (goodwill >= 80 && !triggeredEvents.value.has('jl_goodwill_80')) {
      triggeredEvents.value.add('jl_goodwill_80');
      showEvent(jianglinEvents[2]);
    }
  }

  // 检查并触发沈婉清事件
  function checkShenEvents(submission: number) {
    if (submission >= 30 && !triggeredEvents.value.has('shen_submit_30')) {
      triggeredEvents.value.add('shen_submit_30');
      showEvent(shenEvents[0]);
    } else if (submission >= 50 && !triggeredEvents.value.has('shen_submit_50')) {
      triggeredEvents.value.add('shen_submit_50');
      showEvent(shenEvents[1]);
    } else if (submission >= 80 && !triggeredEvents.value.has('shen_submit_80')) {
      triggeredEvents.value.add('shen_submit_80');
      showEvent(shenEvents[2]);
    }
  }

  // 检查并触发林小雨事件
  function checkLinEvents(brotherComplex: number) {
    if (brotherComplex >= 30 && !triggeredEvents.value.has('lin_complex_30')) {
      triggeredEvents.value.add('lin_complex_30');
      showEvent(linEvents[0]);
    } else if (brotherComplex >= 50 && !triggeredEvents.value.has('lin_complex_50')) {
      triggeredEvents.value.add('lin_complex_50');
      showEvent(linEvents[1]);
    } else if (brotherComplex >= 70 && !triggeredEvents.value.has('lin_complex_70')) {
      triggeredEvents.value.add('lin_complex_70');
      showEvent(linEvents[2]);
    }
  }

  // 重置已触发的事件（用于重置游戏）
  function resetTriggeredEvents() {
    triggeredEvents.value.clear();
  }

  return {
    currentEvent,
    eventVisible,
    showEvent,
    hideEvent,
    checkJianglinEvents,
    checkShenEvents,
    checkLinEvents,
    triggeredEvents,
    resetTriggeredEvents,
  };
}
