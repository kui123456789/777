<template>
  <div class="status-container tavern-inline-status-bar" :class="{ collapsed: isCollapsed }">
    <!-- 折叠/展开按钮 -->
    <div class="collapse-toggle" @click="toggleCollapse">
      <span class="toggle-icon">{{ isCollapsed ? '📖' : '📕' }}</span>
      <span class="toggle-text">{{ isCollapsed ? '展开状态栏' : '收起' }}</span>
    </div>

    <div
      v-show="!isCollapsed"
      ref="paperRef"
      class="notebook-paper glass-effect"
      :class="{ 'dark-mode': isDarkTheme }"
      @contextmenu.prevent="showContextMenu"
    >
      <div class="tape"></div>

      <!-- 头部信息 -->
      <div class="header">
        <div class="title-row">
          <div class="title">角色状态记录</div>
          <div class="action-btns">
            <div class="icon-btn content-btn" title="查看正文" @click="toggleContent">
              <span>📖</span>
            </div>
            <div class="icon-btn theme-btn" :title="isDarkTheme ? '切换日间模式' : '切换夜间模式'" @click="toggleTheme">
              <span>{{ isDarkTheme ? '☀️' : '🌙' }}</span>
            </div>
            <div ref="refreshBtnRef" class="icon-btn refresh-btn" title="刷新数据" @click="refreshData">
              <span>🔄</span>
            </div>
          </div>
        </div>
        <div class="info-text">{{ data.世界.当前日期 }} {{ data.世界.当前时间 }} @ {{ data.世界.当前地点 }}</div>
        <div class="info-text weather">
          <span class="weather-icon">{{ getWeatherIcon(data.世界.天气) }}</span>
          {{ data.世界.天气 }}
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="tabs">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          class="tab-item"
          :class="{ active: currentTab === tab.name }"
          @click="currentTab = tab.name"
        >
          <span class="tab-avatar">{{ tab.avatar }}</span>
          <span class="tab-name">{{ tab.name }}</span>
        </div>
      </div>

      <!-- 姜林面板 -->
      <div
        v-if="currentTab === '姜林'"
        ref="tabContentRef"
        class="tab-content"
        @touchstart="onContentTouchStart"
        @touchend="onContentTouchEnd"
      >
        <JiangLinPanel
          :data="data.姜林"
          :is-dark="isDarkTheme"
          :trend-history="trendHistory"
          @show-detail="showDetail"
          @update-value="setDataValue"
          @value-changed="watchValueChange"
          @action-executed="handleActionExecuted"
          @dialog-selected="handleDialogSelected"
          @update-money="handleMoneyUpdate"
          @achievement-unlocked="handleAchievementUnlocked"
        />
      </div>

      <!-- 沈婉清面板 -->
      <div
        v-if="currentTab === '沈婉清'"
        ref="tabContentRef"
        class="tab-content"
        @touchstart="onContentTouchStart"
        @touchend="onContentTouchEnd"
      >
        <ShenWanqingPanel
          :status-data="data.沈婉清状态"
          :body-data="data.沈婉清身体"
          :inventory-data="data.沈婉清背包"
          :trend-history="shenTrendHistory"
          :is-dark="isDarkTheme"
          @show-detail="showDetail"
          @update-value="setDataValue"
          @value-changed="watchValueChange"
          @action-executed="handleShenActionExecuted"
          @dialog-selected="handleShenDialogSelected"
        />
      </div>

      <!-- 林小雨面板 -->
      <div
        v-if="currentTab === '林小雨'"
        ref="tabContentRef"
        class="tab-content"
        @touchstart="onContentTouchStart"
        @touchend="onContentTouchEnd"
      >
        <LinXiaoyuPanel
          :status-data="data.林小雨状态"
          :body-data="data.林小雨身体"
          :inventory-data="data.林小雨背包"
          :trend-history="linTrendHistory"
          :is-dark="isDarkTheme"
          @show-detail="showDetail"
          @update-value="setDataValue"
          @value-changed="watchValueChange"
          @action-executed="handleLinActionExecuted"
          @dialog-selected="handleLinDialogSelected"
        />
      </div>

      <!-- 状态变化飘字 -->
      <TransitionGroup name="float" tag="div" class="floating-container">
        <div
          v-for="float in floatingTexts"
          :key="float.id"
          class="floating-text"
          :class="float.type"
          :style="{ left: float.x + '%' }"
        >
          {{ float.text }}
        </div>
      </TransitionGroup>

      <div class="note-doodle">✏️</div>

      <!-- 事件通知 -->
      <EventNotification
        :visible="showEventNotification"
        :title="currentEvent?.title ?? ''"
        :message="currentEvent?.message ?? ''"
        :type="currentEvent?.type ?? 'neutral'"
        :is-dark="isDarkTheme"
        @close="hideEvent"
      />

      <!-- 详情模态框 -->
      <DetailModal
        :visible="modalVisible"
        :title="modalTitle"
        :content="modalContent"
        :is-dark="isDarkTheme"
        @close="closeModal"
      />

      <!-- 设置模态框 -->
      <SettingsModal :visible="settingsModalVisible" :is-dark="isDarkTheme" @close="settingsModalVisible = false" />

      <!-- 数值输入模态框 -->
      <div v-if="inputModalVisible" class="modal-overlay" @click="closeInputModal">
        <div class="modal-content input-modal" @click.stop>
          <div class="modal-header">
            <span class="modal-title">修改数值</span>
            <span class="close-btn" @click="closeInputModal">×</span>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <label>当前值: </label>
              <input
                ref="numberInputRef"
                v-model.number="inputValue"
                type="number"
                class="value-input"
                @keyup.enter="saveInputValue"
              />
            </div>
            <p class="input-hint">输入新数值并点击确定</p>
            <div class="modal-actions">
              <button class="action-btn confirm" @click="saveInputValue">确定</button>
              <button class="action-btn cancel" @click="closeInputModal">取消</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右键菜单 -->
      <transition name="fade">
        <div
          v-if="contextMenuVisible"
          class="context-menu"
          :style="{ top: menuY + 'px', left: menuX + 'px' }"
          @click.stop
        >
          <div class="menu-item" @click="handleMenuAction('refresh')">🔄 刷新数据</div>
          <div class="menu-item" @click="handleMenuAction('theme')">
            {{ isDarkTheme ? '☀️ 日间模式' : '🌙 夜间模式' }}
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item" @click="handleMenuAction('snapshot')">📸 新建快照</div>
          <div class="menu-item" @click="handleMenuAction('history')">📜 查看历史</div>
          <div class="menu-item" @click="handleMenuAction('export')">💾 导出存档</div>
          <div class="menu-item" @click="handleMenuAction('import')">📂 导入存档</div>
          <div class="menu-divider"></div>
          <div class="menu-item" @click="handleMenuAction('settings')">⚙️ 设置</div>
          <div class="menu-divider"></div>
          <div class="menu-item danger" @click="handleMenuAction('reset')">⚠️ 重置数据</div>
        </div>
      </transition>

      <!-- 正文内容模态框 -->
      <div v-if="contentVisible" class="content-overlay" @click="closeContent">
        <div ref="contentModalRef" class="content-modal" @click.stop>
          <div class="content-header">
            <span class="modal-title">正文内容</span>
            <span class="close-btn" @click="closeContent">×</span>
          </div>
          <div class="modal-body content-body">
            <div v-if="formattedContent" v-html="formattedContent"></div>
            <div v-else class="empty-tip">暂无正文内容</div>
          </div>
        </div>
      </div>

      <!-- 历史记录模态框 -->
      <div v-if="historyVisible" class="modal-overlay" @click="historyVisible = false">
        <div class="modal-content history-modal" @click.stop>
          <div class="modal-header">
            <span class="modal-title">历史记录 & 快照</span>
            <span class="close-btn" @click="historyVisible = false">×</span>
          </div>
          <div class="modal-body scrollable">
            <div class="history-section">
              <h3>快照存档</h3>
              <div v-if="snapshots.length === 0" class="empty-tip">暂无快照</div>
              <div v-else class="snapshot-list">
                <div v-for="(snap, index) in snapshots" :key="index" class="snapshot-item">
                  <span class="snap-time">{{ snap.time }}</span>
                  <button class="restore-btn" @click="restoreSnapshot(index)">恢复</button>
                  <button class="delete-btn" @click="deleteSnapshot(index)">×</button>
                </div>
              </div>
            </div>

            <div class="history-section" style="margin-top: 20px">
              <h3>变更日志</h3>
              <div v-if="historyLogs.length === 0" class="empty-tip">暂无记录</div>
              <div v-else class="log-list">
                <div v-for="(log, index) in historyLogs" :key="index" class="log-item">
                  <span class="log-time">{{ log.time }}</span>
                  <span class="log-content">{{ log.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimations } from './composables/useAnimations';
import { useRandomEvents } from './composables/useRandomEvents';
import { Schema } from '../../schema';
import initvar from '../../世界书/变量/initvar.yaml';
import { useDataStore } from './store';
import JiangLinPanel from './components/panels/JiangLinPanel.vue';
import ShenWanqingPanel from './components/panels/ShenWanqingPanel.vue';
import LinXiaoyuPanel from './components/panels/LinXiaoyuPanel.vue';
import DetailModal from './components/DetailModal.vue';
import EventNotification from './components/EventNotification.vue';
import SettingsModal from './components/SettingsModal.vue';
import { useDataExport } from './composables/useDataExport';

console.log('[我的乖乖女友-同层状态栏] App setup starting...');
const dataStore = useDataStore();
const data = toRef(() => dataStore.data);
const { celebrationBurst, starBurst } = useAnimations();
const { checkJiangLinEvents, checkShenEvents, checkLinEvents } = useRandomEvents();

// 事件通知状态
const showEventNotification = ref(false);
const currentEvent = ref<{
  title: string;
  message: string;
  type: 'positive' | 'negative' | 'neutral' | 'special';
} | null>(null);

function showEvent(event: { title: string; message: string; type: 'positive' | 'negative' | 'neutral' | 'special' }) {
  currentEvent.value = event;
  showEventNotification.value = true;
}

function hideEvent() {
  showEventNotification.value = false;
  currentEvent.value = null;
}

// 辅助函数：用于在模板中安全调用 _.set
function setDataValue(path: string, value: number) {
  _.set(dataStore.data, path, value);
}
console.log('[我的乖乖女友-同层状态栏] Data store initialized:', data.value);

const currentTab = ref('姜林');
const modalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const isCollapsed = ref(false);
const isDarkTheme = ref(false);

// 切换主题
function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value;
  gsap.fromTo('.notebook-paper', { filter: 'brightness(1.5)' }, { filter: 'brightness(1)', duration: 0.5 });
}

// 提取正文内容
function extractContent(): string {
  try {
    const currentMsgId = getLastMessageId();
    const messages = getChatMessages(currentMsgId);
    if (messages.length > 0) {
      const messageContent = messages[0].message;
      const match = messageContent.match(/<maintext>([\s\S]*?)<\/maintext>/i);
      if (match) {
        return match[1].trim();
      }
    }
  } catch (e) {
    console.error('[正文提取] 错误:', e);
  }
  return '';
}

// 切换正文显示
function toggleContent() {
  contentText.value = extractContent();
  if (!contentText.value) {
    toastr.warning('当前消息没有正文内容');
    return;
  }
  contentVisible.value = true;
  nextTick(() => {
    if (!contentModalRef.value) return;
    gsap.from(contentModalRef.value, {
      scale: 0.7,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

function closeContent() {
  contentVisible.value = false;
}

const formattedContent = computed(() => {
  return contentText.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
});

// Element refs for GSAP
const paperRef = ref<HTMLElement | null>(null);
const refreshBtnRef = ref<HTMLElement | null>(null);
const contentModalRef = ref<HTMLElement | null>(null);
const tabContentRef = ref<HTMLElement | null>(null);

// 输入模态框状态
const inputModalVisible = ref(false);
const inputValue = ref(0);
const editingPath = ref('');
const numberInputRef = ref<HTMLInputElement | null>(null);

// 标签页配置
const tabs = [
  { name: '姜林', avatar: '👧' },
  { name: '沈婉清', avatar: '👸' },
  { name: '林小雨', avatar: '🧒' },
];

// 数值变化的旧值记录
const oldValues = ref<Record<string, number>>({});

function toggleCollapse() {
  if (isCollapsed.value) {
    isCollapsed.value = false;
    nextTick(() => {
      if (paperRef.value) {
        gsap.from(paperRef.value, {
          duration: 0.5,
          height: 0,
          opacity: 0,
          ease: 'back.out(1.2)',
        });
      }
    });
  } else {
    isCollapsed.value = true;
  }
}

// 刷新数据
function refreshData() {
  if (refreshBtnRef.value) {
    gsap.to(refreshBtnRef.value, {
      rotation: 360,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(refreshBtnRef.value, { rotation: 0 });
      },
    });
  }

  try {
    const rawData = getVariables({ type: 'message', message_id: getLastMessageId() });
    const freshData = Schema.parse(_.get(rawData, 'stat_data') || {});
    Object.keys(freshData).forEach(key => {
      dataStore.data[key] = freshData[key];
    });
    addHistoryLog('刷新了数据');
    toastr.success('数据已从酒馆同步');
  } catch (e) {
    console.error('Refresh error:', e);
    toastr.error('数据刷新失败');
  }
}

function showDetail(title: string, content: string) {
  modalTitle.value = title;
  modalContent.value = content;
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function getWeatherIcon(weather: string): string {
  const weatherMap: Record<string, string> = {
    晴: '☀️',
    多云: '⛅',
    阴: '☁️',
    雨: '🌧️',
    小雨: '🌦️',
    大雨: '⛈️',
    雪: '❄️',
    雾: '🌫️',
    风: '💨',
  };
  return weatherMap[weather] || '🌤️';
}

// 监听数值变化并高亮 + 触发庆祝特效
function watchValueChange(path: string, value: number) {
  if (typeof value === 'number') {
    const oldValue = oldValues.value[path] || 0;
    if (value > oldValue && value - oldValue >= 5 && value >= 50) {
      if (paperRef.value) celebrationBurst(paperRef.value);
    }
    if (path.includes('好感度') && value >= 100 && oldValue < 100) {
      if (paperRef.value) celebrationBurst(paperRef.value);
      toastr.success('好感度已满！💖');
    }
    if (path.includes('好感度') && value >= 100 && oldValue < 100) {
      if (paperRef.value) celebrationBurst(paperRef.value);
      toastr.success('好感度已满！💖');
    }
    oldValues.value[path] = value;
  }
}

// Confetti 特效 (已移除，使用 celebrationBurst)

// 上下文菜单状态
const contextMenuVisible = ref(false);
const menuX = ref(0);
const menuY = ref(0);

// 历史记录和快照
const historyVisible = ref(false);
const snapshots = ref<{ time: string; data: unknown }[]>([]);
const historyLogs = ref<{ time: string; message: string }[]>([]);

// 正文相关状态
const contentVisible = ref(false);
const contentText = ref('');

// 设置模态框状态
const settingsModalVisible = ref(false);

function showContextMenu(event: MouseEvent) {
  event.preventDefault();
  contextMenuVisible.value = true;
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  const closeMenu = () => {
    contextMenuVisible.value = false;
    document.removeEventListener('click', closeMenu);
  };
  setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

function handleMenuAction(action: string) {
  contextMenuVisible.value = false;

  switch (action) {
    case 'refresh':
      refreshData();
      break;
    case 'theme':
      toggleTheme();
      break;
    case 'snapshot':
      createSnapshot();
      break;
    case 'history':
      historyVisible.value = true;
      break;
    case 'reset':
      if (confirm('确定要重置所有数据吗？此操作无法撤销！')) {
        try {
          const defaultData = Schema.parse(initvar);
          Object.assign(dataStore.data, klona(defaultData));
          addHistoryLog('重置了所有数据');
          toastr.success('数据已重置为初始值');
        } catch (e) {
          console.error('Reset error:', e);
          toastr.error('重置失败');
        }
      }
      break;
    case 'export': {
      const { exportData } = useDataExport();
      const result = exportData(dataStore.data);
      if (result.success) {
        toastr.success('数据已导出');
      } else {
        toastr.error('导出失败: ' + result.error);
      }
      break;
    }
    case 'import': {
      const { importData } = useDataExport();
      importData(
        importedData => {
          Object.assign(dataStore.data, klona(importedData));
          addHistoryLog('导入了存档数据');
          toastr.success('数据导入成功');
        },
        error => {
          toastr.error(error);
        },
      );
      break;
    }
    case 'settings':
      settingsModalVisible.value = true;
      break;
  }
}

function createSnapshot() {
  const time = new Date().toLocaleTimeString();
  snapshots.value.unshift({
    time,
    data: klona(dataStore.data),
  });
  if (snapshots.value.length > 5) snapshots.value.pop();
  addHistoryLog('创建了新快照');
  toastr.success('快照已保存');
}

function restoreSnapshot(index: number) {
  if (confirm('确定要恢复到此快照吗？当前未保存的更改将丢失。')) {
    const snapshot = snapshots.value[index];
    Object.assign(dataStore.data, klona(snapshot.data));
    addHistoryLog(`恢复了快照: ${snapshot.time}`);
    toastr.success('数据已恢复');
    historyVisible.value = false;
  }
}

function deleteSnapshot(index: number) {
  snapshots.value.splice(index, 1);
  toastr.info('快照已删除');
}

function addHistoryLog(message: string) {
  historyLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
  });
  if (historyLogs.value.length > 20) historyLogs.value.pop();
}

// 历史趋势数据
interface TrendPoint {
  label: string;
  time: string;
  values: Record<string, number>;
}
const trendHistory = ref<TrendPoint[]>([]);
const shenTrendHistory = ref<TrendPoint[]>([]);
const linTrendHistory = ref<TrendPoint[]>([]);
const maxHistoryPoints = 20;

function getMoodValue(mood: string): number {
  const moodValues: Record<string, number> = {
    开心: 90,
    高兴: 85,
    快乐: 85,
    兴奋: 95,
    满足: 80,
    期待: 75,
    平静: 60,
    享受: 85,
    无聊: 40,
    困惑: 45,
    紧张: 35,
    害羞: 50,
    警惕: 30,
    害怕: 20,
    恐惧: 10,
    愤怒: 15,
    生气: 20,
    悲伤: 25,
    伤心: 20,
    厌恶: 15,
    羞耻: 30,
    屈辱: 20,
    疲惫: 35,
    痛苦: 15,
    傲慢: 55,
  };
  return moodValues[mood] ?? 50;
}

function recordTrendPoint() {
  const now = new Date();
  const point: TrendPoint = {
    label: `#${trendHistory.value.length + 1}`,
    time: now.toLocaleTimeString(),
    values: {
      好感度: data.value?.姜林?.好感度 ?? 0,
      心情: getMoodValue(data.value?.姜林?.基础状态?.心情 ?? '平静'),
      体力: data.value?.姜林?.基础状态?.体力 ?? 0,
    },
  };
  trendHistory.value.push(point);
  if (trendHistory.value.length > maxHistoryPoints) {
    trendHistory.value.shift();
  }
}

function recordShenTrendPoint() {
  const now = new Date();
  const point: TrendPoint = {
    label: `#${shenTrendHistory.value.length + 1}`,
    time: now.toLocaleTimeString(),
    values: {
      屈从度: data.value?.沈婉清状态?.屈从度 ?? 0,
      好感度: Math.max(0, (data.value?.沈婉清状态?.好感度 ?? 0) + 100) / 2, // 转换 -100~100 到 0~100
      心情: data.value?.沈婉清状态?.心情 ?? 50,
    },
  };
  shenTrendHistory.value.push(point);
  if (shenTrendHistory.value.length > maxHistoryPoints) {
    shenTrendHistory.value.shift();
  }
}

function recordLinTrendPoint() {
  const now = new Date();
  const point: TrendPoint = {
    label: `#${linTrendHistory.value.length + 1}`,
    time: now.toLocaleTimeString(),
    values: {
      兄控度: data.value?.林小雨状态?.兄控度 ?? 15,
      心情: data.value?.林小雨状态?.心情 ?? 80,
    },
  };
  linTrendHistory.value.push(point);
  if (linTrendHistory.value.length > maxHistoryPoints) {
    linTrendHistory.value.shift();
  }
}

// 状态变化飘字
const floatingTexts = ref<Array<{ id: number; text: string; x: number; y: number; type: 'up' | 'down' }>>([]);
let floatId = 0;

function showFloatingText(text: string, type: 'up' | 'down' = 'up') {
  const id = floatId++;
  const x = 50 + Math.random() * 30 - 15;
  const y = 50;
  floatingTexts.value.push({ id, text, x, y, type });
  setTimeout(() => {
    const idx = floatingTexts.value.findIndex(f => f.id === id);
    if (idx !== -1) floatingTexts.value.splice(idx, 1);
  }, 2000);
}

// 监听好感度变化显示飘字
watch(
  () => data.value?.姜林?.好感度,
  (newVal, oldVal) => {
    if (newVal !== undefined && oldVal !== undefined && newVal !== oldVal) {
      const diff = newVal - oldVal;
      if (diff > 0) {
        showFloatingText(`好感度 +${diff}`, 'up');
      } else {
        showFloatingText(`好感度 ${diff}`, 'down');
      }
      recordTrendPoint();
      // 检查随机事件
      const event = checkJiangLinEvents(newVal);
      if (event) showEvent(event);
    }
  },
);

watch(
  () => data.value?.沈婉清状态?.屈从度,
  (newVal, oldVal) => {
    if (newVal !== undefined && oldVal !== undefined && newVal !== oldVal) {
      recordShenTrendPoint();
      // 检查随机事件
      const event = checkShenEvents(newVal);
      if (event) showEvent(event);
    }
  },
);

watch(
  () => data.value?.林小雨状态?.兄控度,
  (newVal, oldVal) => {
    if (newVal !== undefined && oldVal !== undefined && newVal !== oldVal) {
      recordLinTrendPoint();
      // 检查随机事件
      const event = checkLinEvents(newVal);
      if (event) showEvent(event);
    }
  },
);

// 快捷操作处理
function handleActionExecuted(actionId: string) {
  addHistoryLog(`执行了操作: ${actionId}`);

  // 根据不同操作产生不同效果
  switch (actionId) {
    case 'give_money': {
      // 给姜林10元零花钱 - 增加姜林现金，增加好感度
      const currentCash = data.value?.姜林?.财务?.现金 ?? 0;
      _.set(dataStore.data, '姜林.财务.现金', currentCash + 10);
      adjustGoodwill(2); // 好感度+2
      showFloatingText('现金 +¥10', 'up');
      break;
    }
    case 'buy_gift': {
      // 买礼物 - 好感度+5，添加礼物到背包
      adjustGoodwill(5);
      addItemToBag('小礼物', '一份精心挑选的礼物', 1);
      showFloatingText('好感度 +5', 'up');
      break;
    }
    case 'comfort': {
      // 安慰 - 好感度+3，改善心情
      adjustGoodwill(3);
      _.set(dataStore.data, '姜林.基础状态.心情', '开心');
      showFloatingText('好感度 +3', 'up');
      break;
    }
    case 'praise': {
      // 夸奖 - 好感度+2
      adjustGoodwill(2);
      showFloatingText('好感度 +2', 'up');
      break;
    }
    case 'invite': {
      // 约会 - 好感度+8，体力-10
      adjustGoodwill(8);
      const currentStamina = data.value?.姜林?.基础状态?.体力 ?? 100;
      _.set(dataStore.data, '姜林.基础状态.体力', Math.max(0, currentStamina - 10));
      _.set(dataStore.data, '姜林.基础状态.心情', '开心');
      showFloatingText('好感度 +8', 'up');
      break;
    }
    case 'hold_hand': {
      // 牵手 - 好感度+5
      adjustGoodwill(5);
      _.set(dataStore.data, '姜林.基础状态.心情', '害羞');
      showFloatingText('好感度 +5', 'up');
      break;
    }
    case 'kiss': {
      // 亲吻 - 好感度+10
      adjustGoodwill(10);
      _.set(dataStore.data, '姜林.基础状态.心情', '害羞');
      showFloatingText('好感度 +10', 'up');
      if (paperRef.value) celebrationBurst(paperRef.value);
      break;
    }
  }

  recordTrendPoint();
}

// 调整好感度并联动更新关系
function adjustGoodwill(delta: number) {
  const current = data.value?.姜林?.好感度 ?? 0;
  const newValue = Math.max(0, Math.min(100, current + delta));
  _.set(dataStore.data, '姜林.好感度', newValue);
  updateRelationship(newValue);
}

// 添加物品到背包
function addItemToBag(name: string, desc: string, count: number) {
  const bag = data.value?.姜林?.背包 ?? {};
  if (bag[name]) {
    bag[name].数量 += count;
  } else {
    bag[name] = { 描述: desc, 数量: count };
  }
  _.set(dataStore.data, '姜林.背包', { ...bag });
}

function handleDialogSelected(option: { text: string; effect: string; id?: string; type?: string }) {
  addHistoryLog(`选择了对话: ${option.text}`);

  // 根据对话选项产生效果
  const optionId = option.id || option.text;
  switch (optionId) {
    case 'gentle': // 温柔地说话
      adjustGoodwill(2);
      showFloatingText('好感度 +2', 'up');
      break;
    case 'joke': // 讲个笑话
      adjustGoodwill(1);
      _.set(dataStore.data, '姜林.基础状态.心情', '开心');
      showFloatingText('好感度 +1', 'up');
      break;
    case 'serious': // 认真询问
      // 中性选项，无效果变化
      break;
    case 'flirt': {
      // 调情 - 取决于好感度
      const goodwill = data.value?.姜林?.好感度 ?? 0;
      if (goodwill >= 40) {
        adjustGoodwill(3);
        _.set(dataStore.data, '姜林.基础状态.心情', '害羞');
        showFloatingText('好感度 +3', 'up');
      } else {
        adjustGoodwill(-5);
        _.set(dataStore.data, '姜林.基础状态.心情', '生气');
        showFloatingText('好感度 -5', 'down');
      }
      break;
    }
    case 'cold': // 冷淡回应
      adjustGoodwill(-2);
      _.set(dataStore.data, '姜林.基础状态.心情', '伤心');
      showFloatingText('好感度 -2', 'down');
      break;
  }

  recordTrendPoint();
}

function handleMoneyUpdate(delta: number) {
  const currentMoney = data.value?.姜林?.财务?.现金 ?? 0;
  _.set(dataStore.data, '姜林.财务.现金', currentMoney + delta);
}

function handleAchievementUnlocked(achievement: { name: string }) {
  addHistoryLog(`解锁成就: ${achievement.name}`);
  if (paperRef.value) celebrationBurst(paperRef.value);
}

// ========== 沈婉清快捷操作处理 ==========
function handleShenActionExecuted(actionId: string) {
  addHistoryLog(`对沈婉清执行了操作: ${actionId}`);

  switch (actionId) {
    case 'intimidate': {
      // 威压 - 屈从度+5
      adjustShenSubmission(5);
      showFloatingText('屈从度 +5', 'up');
      break;
    }
    case 'humiliate': {
      // 羞辱 - 屈从度+10，好感度-15
      adjustShenSubmission(10);
      adjustShenGoodwill(-15);
      showFloatingText('屈从度 +10', 'up');
      break;
    }
    case 'command': {
      // 命令 - 屈从度+3
      adjustShenSubmission(3);
      showFloatingText('屈从度 +3', 'up');
      break;
    }
    case 'blackmail': {
      // 抓把柄 - 屈从度+8
      adjustShenSubmission(8);
      showFloatingText('屈从度 +8', 'up');
      break;
    }
    case 'strip': {
      // 扒衣 - 屈从度+15，更新身体状态
      adjustShenSubmission(15);
      showFloatingText('屈从度 +15', 'up');
      if (paperRef.value) celebrationBurst(paperRef.value);
      break;
    }
    case 'touch': {
      // 抚摸 - 屈从度+5，敏感度增加
      adjustShenSubmission(5);
      const currentSensitivity = data.value?.沈婉清身体?.胸部?.敏感度 ?? 0;
      _.set(dataStore.data, '沈婉清身体.胸部.敏感度', Math.min(100, currentSensitivity + 5));
      showFloatingText('屈从度 +5', 'up');
      break;
    }
    case 'violate': {
      // 侵犯 - 屈从度+20，更新处女状态
      adjustShenSubmission(20);
      _.set(dataStore.data, '沈婉清状态.是否处女', false);
      _.set(dataStore.data, '沈婉清状态.当前状态', '崩坏');
      showFloatingText('屈从度 +20', 'up');
      if (paperRef.value) celebrationBurst(paperRef.value);
      break;
    }
  }

  recordShenTrendPoint();
}

function handleShenDialogSelected(option: { text: string; id?: string; type?: string }) {
  addHistoryLog(`对沈婉清选择了: ${option.text}`);

  const optionId = option.id || option.text;
  switch (optionId) {
    case 'threaten': // 威胁
      adjustShenSubmission(5);
      adjustShenGoodwill(-10);
      showFloatingText('屈从度 +5', 'up');
      break;
    case 'mock': // 嘲讽
      adjustShenSubmission(3);
      adjustShenGoodwill(-5);
      showFloatingText('屈从度 +3', 'up');
      break;
    case 'neutral': // 冷漠对待
      // 无变化
      break;
    case 'comfort': // 安抚
      adjustShenGoodwill(5);
      adjustShenSubmission(-2);
      showFloatingText('好感度 +5', 'up');
      break;
    case 'praise': // 赞美
      adjustShenGoodwill(3);
      showFloatingText('好感度 +3', 'up');
      break;
  }

  recordShenTrendPoint();
}

// 调整沈婉清屈从度
function adjustShenSubmission(delta: number) {
  const current = data.value?.沈婉清状态?.屈从度 ?? 0;
  const newValue = Math.max(0, Math.min(100, current + delta));
  _.set(dataStore.data, '沈婉清状态.屈从度', newValue);
  updateShenRelation(newValue);
}

// 调整沈婉清好感度
function adjustShenGoodwill(delta: number) {
  const current = data.value?.沈婉清状态?.好感度 ?? -50;
  const newValue = Math.max(-100, Math.min(100, current + delta));
  _.set(dataStore.data, '沈婉清状态.好感度', newValue);
}

// 更新沈婉清关系状态
function updateShenRelation(submission: number) {
  let newRelation = '';
  if (submission >= 80) {
    newRelation = '玩物';
  } else if (submission >= 50) {
    newRelation = '奴隶';
  } else if (submission >= 20) {
    newRelation = '敌人';
  } else {
    newRelation = '同学';
  }

  const currentRelation = _.get(dataStore.data, '沈婉清状态.关系');
  if (currentRelation !== newRelation) {
    _.set(dataStore.data, '沈婉清状态.关系', newRelation);
  }
}

// ========== 林小雨快捷操作处理 ==========
function handleLinActionExecuted(actionId: string) {
  addHistoryLog(`对林小雨执行了操作: ${actionId}`);

  switch (actionId) {
    case 'give_pocket_money': {
      // 给零花钱 - 兄控度+3，零花钱+20
      adjustLinBrotherComplex(3);
      const currentMoney = data.value?.林小雨状态?.零花钱 ?? 200;
      _.set(dataStore.data, '林小雨状态.零花钱', currentMoney + 20);
      showFloatingText('兄控度 +3', 'up');
      break;
    }
    case 'buy_snacks': {
      // 买零食 - 兄控度+2，心情+10
      adjustLinBrotherComplex(2);
      adjustLinMood(10);
      showFloatingText('兄控度 +2', 'up');
      break;
    }
    case 'pat_head': {
      // 摸头 - 兄控度+2，心情+5
      adjustLinBrotherComplex(2);
      adjustLinMood(5);
      showFloatingText('兄控度 +2', 'up');
      break;
    }
    case 'hug': {
      // 拥抱 - 兄控度+5，心情+10
      adjustLinBrotherComplex(5);
      adjustLinMood(10);
      showFloatingText('兄控度 +5', 'up');
      break;
    }
    case 'play_game': {
      // 陪玩 - 兄控度+3，心情+15
      adjustLinBrotherComplex(3);
      adjustLinMood(15);
      showFloatingText('心情 +15', 'up');
      break;
    }
    case 'help_homework': {
      // 辅导作业 - 兄控度+2
      adjustLinBrotherComplex(2);
      showFloatingText('兄控度 +2', 'up');
      break;
    }
    case 'secret_touch': {
      // 偷偷摸 - 兄控度+8，敏感度增加
      adjustLinBrotherComplex(8);
      const currentSensitivity = data.value?.林小雨身体?.胸部?.敏感度 ?? 10;
      _.set(dataStore.data, '林小雨身体.胸部.敏感度', Math.min(100, currentSensitivity + 5));
      showFloatingText('兄控度 +8', 'up');
      break;
    }
  }

  recordLinTrendPoint();
}

function handleLinDialogSelected(option: { text: string; id?: string; type?: string }) {
  addHistoryLog(`对林小雨选择了: ${option.text}`);

  const optionId = option.id || option.text;
  switch (optionId) {
    case 'pamper': // 宠溺地说
      adjustLinBrotherComplex(3);
      adjustLinMood(10);
      showFloatingText('兄控度 +3', 'up');
      break;
    case 'tease': // 逗弄她
      adjustLinMood(5);
      showFloatingText('心情 +5', 'up');
      break;
    case 'scold': // 训斥
      adjustLinMood(-15);
      adjustLinBrotherComplex(-5);
      showFloatingText('心情 -15', 'down');
      break;
    case 'ignore': // 不理她
      adjustLinMood(-10);
      adjustLinBrotherComplex(2); // 反而会更粘人
      showFloatingText('心情 -10', 'down');
      break;
    case 'praise': // 表扬
      adjustLinMood(15);
      adjustLinBrotherComplex(2);
      showFloatingText('心情 +15', 'up');
      break;
  }

  recordLinTrendPoint();
}

// 调整林小雨兄控度
function adjustLinBrotherComplex(delta: number) {
  const current = data.value?.林小雨状态?.兄控度 ?? 15;
  const newValue = Math.max(0, Math.min(100, current + delta));
  _.set(dataStore.data, '林小雨状态.兄控度', newValue);
}

// 调整林小雨心情
function adjustLinMood(delta: number) {
  const current = data.value?.林小雨状态?.心情 ?? 80;
  const newValue = Math.max(0, Math.min(100, current + delta));
  _.set(dataStore.data, '林小雨状态.心情', newValue);
}

// 联动更新关系状态
function updateRelationship(goodwill: number) {
  const currentRelation = _.get(dataStore.data, '姜林.关系状态');
  if (currentRelation === '从属') return;

  let newRelation = '';
  if (goodwill >= 80) {
    newRelation = '恋人';
  } else if (goodwill >= 60) {
    newRelation = '暧昧';
  } else if (goodwill >= 30) {
    newRelation = '朋友';
  } else {
    newRelation = '陌生人';
  }

  if (currentRelation !== newRelation) {
    _.set(dataStore.data, '姜林.关系状态', newRelation);
  }
}

// 标签页切换动画
watch(currentTab, () => {
  nextTick(() => {
    if (tabContentRef.value) {
      gsap.from(tabContentRef.value, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  });
});

// 监听重要数据变化记录日志
watch(
  () => dataStore.data?.姜林?.关系状态,
  (newVal, oldVal) => {
    if (newVal && oldVal && newVal !== oldVal) {
      addHistoryLog(`关系状态由 "${oldVal}" 变为 "${newVal}"`);
    }
  },
);

// 监听消息接收，自动刷新正文
eventOn(tavern_events.MESSAGE_RECEIVED, () => {
  if (contentVisible.value) {
    contentText.value = extractContent();
  }
});

// 触摸滑动切换标签
const touchStartX = ref(0);
const touchStartY = ref(0);

function onContentTouchStart(e: TouchEvent) {
  if ((e.target as HTMLElement).closest('.draggable')) return;
  touchStartX.value = e.changedTouches[0].screenX;
  touchStartY.value = e.changedTouches[0].screenY;
}

function onContentTouchEnd(e: TouchEvent) {
  if ((e.target as HTMLElement).closest('.draggable')) return;

  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  const deltaX = touchEndX - touchStartX.value;
  const deltaY = touchEndY - touchStartY.value;

  if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > 50) {
    const currentIndex = tabs.findIndex(t => t.name === currentTab.value);
    if (deltaX < 0) {
      if (currentIndex < tabs.length - 1) {
        currentTab.value = tabs[currentIndex + 1].name;
      }
    } else if (currentIndex > 0) {
      currentTab.value = tabs[currentIndex - 1].name;
    }
  }
}

// 数值输入模态框逻辑
function closeInputModal() {
  inputModalVisible.value = false;
  editingPath.value = '';
}

function saveInputValue() {
  if (editingPath.value) {
    _.set(dataStore.data, editingPath.value, inputValue.value);
    watchValueChange(editingPath.value, inputValue.value);
    if (editingPath.value === '姜林.好感度') {
      updateRelationship(inputValue.value);
    }
    toastr.success('数值已更新');
  }
  closeInputModal();
}
</script>

<style lang="scss" scoped>
.status-container {
  width: 100%;

  &.collapsed {
    .collapse-toggle {
      background: rgba(253, 251, 247, 0.9);
      border-radius: 8px;
      padding: 8px 16px;
    }
  }
}

.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  font-size: 14px;
  color: #7f8c8d;
  transition: all 0.3s;

  &:hover {
    color: #2c3e50;
  }

  .toggle-icon {
    font-size: 18px;
  }

  .toggle-text {
    font-family: 'Caveat', 'Ma Shan Zheng', 'Comic Sans MS', cursive, sans-serif;
  }
}

.notebook-paper {
  width: 100%;
  background-color: rgba(253, 251, 247, 0.9);
  background-image: linear-gradient(#e1e1e1 1px, transparent 1px), linear-gradient(90deg, #e1e1e1 1px, transparent 1px);
  background-size: 20px 20px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 0 0 5px rgba(255, 255, 255, 0.3) inset;
  position: relative;
  padding: 40px 30px;
  border-radius: 12px;
  transform: rotate(-0.5deg);
  margin: 0 auto;
  transition: all 0.5s ease;

  &.glass-effect {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  &.dark-mode {
    background-color: rgba(44, 62, 80, 0.9);
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    color: #ecf0f1;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.4),
      0 0 0 5px rgba(255, 255, 255, 0.05) inset;

    .title {
      color: #ecf0f1;
      text-shadow: 0 0 5px rgba(236, 240, 241, 0.3);
    }

    .info-text {
      color: #95a5a6;
    }

    .collapse-toggle {
      color: #bdc3c7;
      &:hover {
        color: #ecf0f1;
      }
    }

    .tab-item {
      color: #95a5a6;
      &:hover {
        color: #ecf0f1;
      }
      &.active {
        color: #ff7675;
        border-bottom-color: #ff7675;
      }
    }
  }
}

.tape {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
  width: 120px;
  height: 35px;
  background-color: rgba(255, 255, 200, 0.6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.header {
  text-align: center;
  margin-bottom: 15px;
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 10px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(231, 76, 60, 0.05));
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
  position: relative;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  letter-spacing: 2px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
}

.action-btns {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon-btn {
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
  padding: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

.info-text {
  font-size: 12px;
  color: #7f8c8d;

  &.weather {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 11px;
  }
}

.weather-icon {
  font-size: 14px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #bdc3c7;
  flex-wrap: wrap;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  color: #7f8c8d;
  position: relative;
  transition: all 0.3s;
  border-radius: 8px 8px 0 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: transparent;
    transition: all 0.3s;
  }

  &:hover {
    color: #2c3e50;
    transform: translateY(-2px);
    background: rgba(0, 0, 0, 0.03);
  }

  &.active {
    color: #c0392b;

    &::before {
      background: linear-gradient(90deg, #e74c3c, #c0392b);
      box-shadow: 0 -2px 5px rgba(231, 76, 60, 0.3);
    }

    .tab-avatar {
      transform: scale(1.2) rotate(10deg);
    }
  }
}

.tab-avatar {
  font-size: 18px;
  transition: transform 0.3s;
}

.tab-name {
  font-size: 14px;
}

.note-doodle {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0.2;
  font-size: 40px;
  pointer-events: none;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-family: 'Caveat', 'Ma Shan Zheng', 'Comic Sans MS', cursive, sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.close-btn {
  font-size: 24px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
}

.modal-body {
  font-size: 16px;
  color: #555;
  line-height: 1.6;

  pre {
    white-space: pre-wrap;
    font-family: inherit;
    margin: 0;
  }
}

/* 输入框样式 */
.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.value-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 18px;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: #3498db;
  }
}

.input-hint {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;

  &.confirm {
    background: #27ae60;
    color: white;
    &:hover {
      background: #219150;
    }
  }

  &.cancel {
    background: #95a5a6;
    color: white;
    &:hover {
      background: #7f8c8d;
    }
  }
}

/* Confetti 动画 */
:global(.confetti) {
  position: absolute;
  width: 10px;
  height: 10px;
  z-index: 1000;
  pointer-events: none;
}

/* 上下文菜单 */
.context-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 8px 0;
  z-index: 2000;
  min-width: 160px;
  border: 1px solid #eee;

  .menu-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    color: #2c3e50;
    transition: background 0.2s;

    &:hover {
      background: #f5f5f5;
    }

    &.danger {
      color: #e74c3c;
      &:hover {
        background: #fdedec;
      }
    }
  }

  .menu-divider {
    height: 1px;
    background: #eee;
    margin: 4px 0;
  }
}

.dark-mode .context-menu {
  background: #34495e;
  border-color: #46637f;

  .menu-item {
    color: #ecf0f1;
    &:hover {
      background: #2c3e50;
    }

    &.danger {
      color: #ff7675;
      &:hover {
        background: rgba(231, 76, 60, 0.2);
      }
    }
  }

  .menu-divider {
    background: #46637f;
  }
}

/* 历史记录模态框 */
.history-modal {
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  .modal-body.scrollable {
    overflow-y: auto;
    flex: 1;
    padding-right: 5px;
  }

  h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    color: #3498db;
    border-bottom: 2px solid #eee;
    padding-bottom: 5px;
  }

  .snapshot-item,
  .log-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    background: #f9f9f9;
    margin-bottom: 6px;

    &:hover {
      background: #f0f0f0;
    }
  }

  .snap-time,
  .log-time {
    font-family: monospace;
    color: #7f8c8d;
    font-size: 12px;
    margin-right: 10px;
  }

  .log-content {
    flex: 1;
    font-size: 14px;
  }

  .restore-btn {
    margin-left: auto;
    padding: 2px 8px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    &:hover {
      background: #2980b9;
    }
  }

  .delete-btn {
    margin-left: 8px;
    background: transparent;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    &:hover {
      color: #c0392b;
    }
  }
}

.dark-mode .history-modal {
  h3 {
    color: #5dade2;
    border-bottom-color: #566573;
  }
  .snapshot-item,
  .log-item {
    background: rgba(255, 255, 255, 0.05);
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  .snap-time,
  .log-time {
    color: #95a5a6;
  }
  .log-content {
    color: #bdc3c7;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 正文覆盖层样式 */
.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border-radius: 12px;
  overflow: hidden;
}

/* 正文模态框样式 */
.content-modal {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .content-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .modal-title {
      color: white;
      font-size: 18px;
    }

    .close-btn {
      color: white;
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .content-body {
    flex: 1;
    overflow-y: auto;
    line-height: 1.8;
    padding: 20px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #bdc3c7;
      border-radius: 4px;

      &:hover {
        background: #95a5a6;
      }
    }
  }
}

.dark-mode .content-modal {
  background: #34495e;

  .content-body {
    color: #bdc3c7;
  }

  .content-body::-webkit-scrollbar-track {
    background: #2c3e50;
  }

  .content-body::-webkit-scrollbar-thumb {
    background: #566573;

    &:hover {
      background: #7f8c8d;
    }
  }
}

.content-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

/* 状态变化飘字 */
.floating-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 100;
}

.floating-text {
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  animation: floatUp 2s ease-out forwards;

  &.up {
    color: #27ae60;
  }

  &.down {
    color: #e74c3c;
  }
}

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-30px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(0.8);
  }
}

.float-enter-active {
  animation: floatUp 2s ease-out;
}

.float-leave-active {
  animation: floatUp 2s ease-out;
}

/* 响应式优化 */
@media (max-width: 480px) {
  .notebook-paper {
    padding: 20px 12px;
    border-radius: 8px;
  }

  .tabs {
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .tab-item {
    padding: 6px 10px;
    font-size: 13px;
    min-width: 0;
    flex: 1 1 auto;
    text-align: center;

    &.active {
      flex-grow: 1.2;
    }
  }

  .content-modal {
    width: 95%;
    max-width: none;
    padding: 16px;
  }
}

@media (max-width: 360px) {
  .notebook-paper {
    padding: 15px 10px;
  }

  .tabs {
    gap: 3px;
  }

  .tab-item {
    padding: 5px 8px;
    font-size: 12px;
  }

  .floating-text {
    font-size: 14px;
  }
}

/* 触摸友好优化 */
@media (hover: none) and (pointer: coarse) {
  .tab-item {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content-btn {
    min-height: 44px;
    padding: 12px 24px;
  }
}
</style>
