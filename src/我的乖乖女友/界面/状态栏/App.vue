<template>
  <div class="status-container" :class="{ collapsed: isCollapsed }">
    <!-- 折叠/展开按钮 -->
    <div class="collapse-toggle" @click="toggleCollapse">
      <span class="toggle-icon">{{ isCollapsed ? '📖' : '📕' }}</span>
      <span class="toggle-text">{{ isCollapsed ? '展开状态栏' : '收起' }}</span>
    </div>

    <div
      v-show="!isCollapsed"
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
            <div class="icon-btn refresh-btn" title="刷新数据" @click="refreshData">
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
        class="tab-content"
        @touchstart="onContentTouchStart"
        @touchend="onContentTouchEnd"
      >
        <!-- 状态区域 -->
        <div class="info-block">
          <div class="block-title">我的状态</div>
          <div class="handwritten-text">
            <div class="row">
              <span class="label">关系:</span>
              <span
                class="value relationship-badge"
                :style="{ background: getRelationshipColor(data.姜林.关系状态) }"
                >{{ data.姜林.关系状态 }}</span
              >
            </div>
            <div class="row">
              <span class="label">年龄:</span>
              <span class="value">{{ data.姜林.年龄 }}岁</span>
            </div>
            <div class="row">
              <span class="label">好感度:</span>
              <div
                ref="favorProgressRef"
                class="progress-container draggable"
                @mousedown="startDrag($event, '姜林.好感度', favorProgressRef)"
                @touchstart="startDrag($event, '姜林.好感度', favorProgressRef)"
              >
                <div class="progress-bar favor-bar" :style="{ width: `${data.姜林.好感度}%` }">
                  <span class="progress-value">{{ data.姜林.好感度 }}</span>
                </div>
                <div v-if="isDragging && currentDragPath === '姜林.好感度'" class="drag-indicator">
                  {{ dragValue }}
                </div>
              </div>
            </div>
            <div class="row">
              <span class="label">心情:</span>
              <span class="value interactive-btn" @click="showDetail('心情', data.姜林.基础状态.心情)">
                <span class="mood-icon">{{ getMoodIcon(data.姜林.基础状态.心情) }}</span>
                <span class="circle-highlight">{{ data.姜林.基础状态.心情 }}</span>
              </span>
            </div>
            <div class="row">
              <span class="label">状态:</span>
              <span class="value">{{ data.姜林.基础状态.当前状态 }}</span>
            </div>
            <div class="row">
              <span class="label">体力:</span>
              <div class="progress-container">
                <div
                  class="progress-bar stamina-bar"
                  :class="getStaminaClass(data.姜林.基础状态.体力)"
                  :style="{ width: `${data.姜林.基础状态.体力}%` }"
                >
                  <span class="progress-value">{{ data.姜林.基础状态.体力 }}%</span>
                </div>
              </div>
            </div>
            <div class="row">
              <span class="label">小金库:</span>
              <span
                class="value money interactive-btn"
                @click="
                  showDetail(
                    '财务状况',
                    `现金: ¥${Number(data.姜林.财务.现金).toFixed(1)}\n欠债: ¥${Number(data.姜林.财务.欠债).toFixed(1)}\n打工收入: ¥${Number(data.姜林.财务.打工收入).toFixed(1)}`,
                  )
                "
                >¥{{ Number(data.姜林.财务.现金).toFixed(1) }}</span
              >
            </div>
            <div v-if="data.姜林.财务.欠债 > 0" class="row">
              <span class="label">欠债:</span>
              <span class="value debt">¥{{ Number(data.姜林.财务.欠债).toFixed(1) }}</span>
            </div>
          </div>
        </div>

        <!-- 身体数据 -->
        <div class="info-block">
          <div class="block-title">身体记录</div>
          <div class="handwritten-text">
            <div class="row">
              <span class="label">腿长:</span>
              <span class="value">{{ data.姜林.身体.腿长 }}</span>
            </div>
            <div class="row">
              <span class="label">大腿围:</span>
              <span class="value">{{ data.姜林.身体.大腿围 }}</span>
            </div>
            <div class="privacy-box">
              <div class="interactive-btn" @click="showDetail('乳房', data.姜林.身体.私密部位.乳房)">
                乳房: {{ data.姜林.身体.私密部位.乳房 }}
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('胸部状态', data.姜林.身体.私密部位.胸部)"
              >
                胸部: {{ data.姜林.身体.私密部位.胸部 }}
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('乳头状态', data.姜林.身体.私密部位.乳头状态)"
              >
                乳头: {{ data.姜林.身体.私密部位.乳头状态 }}
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('下体状态', data.姜林.身体.私密部位.下体)"
              >
                下体: {{ data.姜林.身体.私密部位.下体 }}
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('小穴状态', data.姜林.身体.私密部位.小穴)"
              >
                小穴: {{ data.姜林.身体.私密部位.小穴 }}
              </div>
            </div>
          </div>
        </div>

        <!-- 背包物品 -->
        <div class="info-block">
          <div class="block-title">随身物品</div>
          <div class="inventory-filter">
            <input v-model="inventoryFilter" type="text" placeholder="搜索物品..." class="filter-input" />
            <span class="filter-icon">🔍</span>
            <div class="sort-btn" title="切换排序" @click="toggleSortOrder">
              {{ inventorySortOrder === 'name' ? '🔤' : '🔢' }}
            </div>
          </div>
          <div class="inventory-grid">
            <template v-if="processedInventory(data.姜林.背包).length > 0">
              <div
                v-for="item in processedInventory(data.姜林.背包)"
                :key="item.name"
                class="item-card interactive-btn"
                @click="showDetail(item.name, item.data.描述)"
              >
                <div class="item-name">{{ item.name }}</div>
                <div class="item-count">x{{ item.data.数量 }}</div>
                <div class="item-desc">{{ item.data.描述 }}</div>
              </div>
            </template>
            <div v-else class="empty-inventory">口袋空空的...</div>
          </div>
        </div>
      </div>

      <!-- 沈婉清面板 -->
      <div
        v-if="currentTab === '沈婉清'"
        class="tab-content"
        @touchstart="onContentTouchStart"
        @touchend="onContentTouchEnd"
      >
        <div class="info-block">
          <div class="block-title">沈婉清状态</div>
          <div class="handwritten-text">
            <div class="row">
              <span class="label">关系:</span>
              <span class="value">{{ data.沈婉清状态.关系 }}</span>
            </div>
            <div class="row">
              <span class="label">年龄:</span>
              <span class="value">{{ data.沈婉清状态.年龄 }}岁</span>
            </div>
            <div class="row">
              <span class="label">当前状态:</span>
              <span class="value">{{ data.沈婉清状态.当前状态 }}</span>
            </div>
            <div class="row">
              <span class="label">屈从度:</span>
              <div
                ref="shenSubmitRef"
                class="progress-container draggable"
                @mousedown="startDrag($event, '沈婉清状态.屈从度', shenSubmitRef)"
                @touchstart="startDrag($event, '沈婉清状态.屈从度', shenSubmitRef)"
              >
                <div class="progress-bar submit-bar" :style="{ width: `${data.沈婉清状态.屈从度}%` }">
                  <span class="progress-value">{{ data.沈婉清状态.屈从度 }}</span>
                </div>
                <div v-if="isDragging && currentDragPath === '沈婉清状态.屈从度'" class="drag-indicator">
                  {{ dragValue }}
                </div>
              </div>
            </div>
            <div class="row">
              <span class="label">好感度:</span>
              <div
                ref="shenProgressRef"
                class="progress-container draggable"
                @mousedown="startDrag($event, '沈婉清状态.好感度', shenProgressRef)"
                @touchstart="startDrag($event, '沈婉清状态.好感度', shenProgressRef)"
              >
                <div
                  class="progress-bar"
                  :class="data.沈婉清状态.好感度 < 0 ? 'negative-bar' : 'favor-bar'"
                  :style="{ width: `${Math.abs(data.沈婉清状态.好感度)}%` }"
                >
                  <span class="progress-value">{{ data.沈婉清状态.好感度 }}</span>
                </div>
                <div v-if="isDragging && currentDragPath === '沈婉清状态.好感度'" class="drag-indicator">
                  {{ dragValue }}
                </div>
              </div>
            </div>
            <div class="row">
              <span class="label">心情:</span>
              <div class="progress-container">
                <div class="progress-bar favor-bar" :style="{ width: `${data.沈婉清状态.心情}%` }">
                  <span class="progress-value">{{ data.沈婉清状态.心情 }}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <span class="label">存款:</span>
              <span class="value money">¥{{ data.沈婉清状态.存款 }}</span>
            </div>
          </div>
        </div>

        <div class="info-block">
          <div class="block-title">身体开发</div>
          <div class="handwritten-text">
            <div class="privacy-box">
              <div class="interactive-btn" @click="showDetail('胸部', formatBodyPart(data.沈婉清身体.胸部))">
                胸部: {{ data.沈婉清身体.胸部.描述 }} - {{ data.沈婉清身体.胸部.状态 }} ({{
                  data.沈婉清身体.胸部.敏感度
                }}%)
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('下体', formatBodyPart(data.沈婉清身体.下体))"
              >
                下体: {{ data.沈婉清身体.下体.描述 }} - {{ data.沈婉清身体.下体.状态 }} ({{
                  data.沈婉清身体.下体.敏感度
                }}%)
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('臀部', formatBodyPart(data.沈婉清身体.臀部))"
              >
                臀部: {{ data.沈婉清身体.臀部.描述 }} - {{ data.沈婉清身体.臀部.状态 }} ({{
                  data.沈婉清身体.臀部.敏感度
                }}%)
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('口腔', formatBodyPart(data.沈婉清身体.口腔))"
              >
                口腔: {{ data.沈婉清身体.口腔.描述 }} - {{ data.沈婉清身体.口腔.状态 }} ({{
                  data.沈婉清身体.口腔.敏感度
                }}%)
              </div>
            </div>
          </div>
        </div>

        <div class="info-block">
          <div class="block-title">随身物品</div>
          <div class="inventory-filter">
            <input v-model="inventoryFilter" type="text" placeholder="搜索物品..." class="filter-input" />
            <span class="filter-icon">🔍</span>
            <div class="sort-btn" title="切换排序" @click="toggleSortOrder">
              {{ inventorySortOrder === 'name' ? '🔤' : '🔢' }}
            </div>
          </div>
          <div class="inventory-grid">
            <template v-if="processedInventory(data.沈婉清背包).length > 0">
              <div
                v-for="item in processedInventory(data.沈婉清背包)"
                :key="item.name"
                class="item-card interactive-btn"
                @click="showDetail(item.name, item.data.描述)"
              >
                <div class="item-name">{{ item.name }}</div>
                <div class="item-count">x{{ item.data.数量 }}</div>
                <div class="item-desc">{{ item.data.描述 }}</div>
              </div>
            </template>
            <div v-else class="empty-inventory">口袋空空的...</div>
          </div>
        </div>
      </div>

      <!-- 林小雨面板 -->
      <div
        v-if="currentTab === '林小雨'"
        class="tab-content"
        @touchstart="onContentTouchStart"
        @touchend="onContentTouchEnd"
      >
        <div class="info-block">
          <div class="block-title">林小雨状态</div>
          <div class="handwritten-text">
            <div class="row">
              <span class="label">当前状态:</span>
              <span class="value">{{ data.林小雨状态.当前状态 }}</span>
            </div>
            <div class="row">
              <span class="label">年龄:</span>
              <span class="value">{{ data.林小雨状态.年龄 }}岁</span>
            </div>
            <div class="row">
              <span class="label">兄控度:</span>
              <div
                ref="linProgressRef"
                class="progress-container draggable"
                @mousedown="startDrag($event, '林小雨状态.兄控度', linProgressRef)"
                @touchstart="startDrag($event, '林小雨状态.兄控度', linProgressRef)"
              >
                <div class="progress-bar favor-bar" :style="{ width: `${data.林小雨状态.兄控度}%` }">
                  <span class="progress-value">{{ data.林小雨状态.兄控度 }}</span>
                </div>
                <div v-if="isDragging && currentDragPath === '林小雨状态.兄控度'" class="drag-indicator">
                  {{ dragValue }}
                </div>
              </div>
            </div>
            <div class="row">
              <span class="label">心情:</span>
              <div class="progress-container">
                <div class="progress-bar favor-bar" :style="{ width: `${data.林小雨状态.心情}%` }">
                  <span class="progress-value">{{ data.林小雨状态.心情 }}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <span class="label">零花钱:</span>
              <span class="value money">¥{{ data.林小雨状态.零花钱 }}</span>
            </div>
          </div>
        </div>

        <div class="info-block">
          <div class="block-title">身体发育</div>
          <div class="handwritten-text">
            <div class="privacy-box">
              <div class="interactive-btn" @click="showDetail('胸部', formatBodyPart(data.林小雨身体.胸部))">
                胸部: {{ data.林小雨身体.胸部.描述 }} - {{ data.林小雨身体.胸部.状态 }} ({{
                  data.林小雨身体.胸部.敏感度
                }}%)
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('下体', formatBodyPart(data.林小雨身体.下体))"
              >
                下体: {{ data.林小雨身体.下体.描述 }} - {{ data.林小雨身体.下体.状态 }} ({{
                  data.林小雨身体.下体.敏感度
                }}%)
              </div>
              <div
                class="interactive-btn"
                style="margin-top: 4px"
                @click="showDetail('臀部', formatBodyPart(data.林小雨身体.臀部))"
              >
                臀部: {{ data.林小雨身体.臀部.描述 }} - {{ data.林小雨身体.臀部.状态 }} ({{
                  data.林小雨身体.臀部.敏感度
                }}%)
              </div>
            </div>
          </div>
        </div>

        <div class="info-block">
          <div class="block-title">随身物品</div>
          <div class="inventory-filter">
            <input v-model="inventoryFilter" type="text" placeholder="搜索物品..." class="filter-input" />
            <span class="filter-icon">🔍</span>
            <div class="sort-btn" title="切换排序" @click="toggleSortOrder">
              {{ inventorySortOrder === 'name' ? '🔤' : '🔢' }}
            </div>
          </div>
          <div class="inventory-grid">
            <template v-if="processedInventory(data.林小雨背包).length > 0">
              <div
                v-for="item in processedInventory(data.林小雨背包)"
                :key="item.name"
                class="item-card interactive-btn"
                @click="showDetail(item.name, item.data.描述)"
              >
                <div class="item-name">{{ item.name }}</div>
                <div class="item-count">x{{ item.data.数量 }}</div>
                <div class="item-desc">{{ item.data.描述 }}</div>
              </div>
            </template>
            <div v-else class="empty-inventory">口袋空空的...</div>
          </div>
        </div>
      </div>

      <div class="note-doodle">✏️</div>

      <!-- 详情模态框 -->
      <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <span class="modal-title">{{ modalTitle }}</span>
            <span class="close-btn" @click="closeModal">×</span>
          </div>
          <div class="modal-body">
            <pre>{{ modalContent }}</pre>
          </div>
        </div>
      </div>

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
          <div class="menu-divider"></div>
          <div class="menu-item danger" @click="handleMenuAction('reset')">⚠️ 重置数据</div>
        </div>
      </transition>

      <!-- 正文内容模态框 -->
      <div v-if="contentVisible" class="content-overlay" @click="closeContent">
        <div class="content-modal" @click.stop>
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
import { useDataStore } from './store';
import gsap from 'gsap';
import { klona } from 'klona';
import { Schema } from '../../schema';
import initvar from '../../世界书/变量/initvar.yaml';

const dataStore = useDataStore();
const data = toRef(() => dataStore.data);

const currentTab = ref('姜林');
const modalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const isCollapsed = ref(false);
const isDarkTheme = ref(false); // 主题状态

// 切换主题
function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value;
  if (isDarkTheme.value) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  // 主题切换动画
  gsap.fromTo('.notebook-paper', { filter: 'brightness(1.5)' }, { filter: 'brightness(1)', duration: 0.5 });
}

// 提取正文内容
function extractContent(): string {
  try {
    const currentMsgId = getCurrentMessageId();
    console.log('[正文提取] 当前消息ID:', currentMsgId);

    const messages = getChatMessages(currentMsgId);
    console.log('[正文提取] 获取到的消息数量:', messages.length);

    if (messages.length > 0) {
      const messageContent = messages[0].message;
      console.log('[正文提取] 消息内容长度:', messageContent.length);
      console.log('[正文提取] 消息内容预览:', messageContent.substring(0, 200));

      // 检查是否包含 maintext 标签
      const hasMaintext =
        messageContent.includes('<maintext>') ||
        messageContent.includes('<Maintext>') ||
        messageContent.includes('<MAINTEXT>');
      console.log('[正文提取] 是否包含maintext标签:', hasMaintext);

      // 检查是否包含旧的 content 标签
      const hasContent =
        messageContent.includes('<content>') ||
        messageContent.includes('<Content>') ||
        messageContent.includes('<CONTENT>');
      console.log('[正文提取] 是否包含content标签:', hasContent);

      const match = messageContent.match(/<maintext>([\s\S]*?)<\/maintext>/i);
      console.log('[正文提取] 正则匹配结果:', match ? '匹配成功' : '匹配失败');

      if (match) {
        console.log('[正文提取] 提取到的正文长度:', match[1].length);
        return match[1].trim();
      } else {
        console.warn('[正文提取] 未找到maintext标签，请检查AI输出是否使用了正确的标签');
      }
    } else {
      console.warn('[正文提取] 未获取到消息内容');
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

  // 弹窗动画
  nextTick(() => {
    const modal = document.querySelector('.content-modal');
    gsap.from(modal, {
      scale: 0.7,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

// 关闭正文弹窗
function closeContent() {
  contentVisible.value = false;
}

// 格式化正文内容
const formattedContent = computed(() => {
  return contentText.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
});

// 拖动相关状态
const isDragging = ref(false);
const currentDragPath = ref('');
const dragValue = ref(0);
const favorProgressRef = ref<HTMLElement | null>(null);
const shenProgressRef = ref<HTMLElement | null>(null);
const shenSubmitRef = ref<HTMLElement | null>(null);
const linProgressRef = ref<HTMLElement | null>(null);

// 输入模态框状态
const inputModalVisible = ref(false);
const inputValue = ref(0);
const editingPath = ref('');
const numberInputRef = ref<HTMLInputElement | null>(null);

// 标签页配置（带头像）
const tabs = [
  { name: '姜林', avatar: '👧' },
  { name: '沈婉清', avatar: '👸' },
  { name: '林小雨', avatar: '🧒' },
];

// 物品筛选状态
const inventoryFilter = ref('');

// 数值变化高亮
const highlightedFields = ref<Set<string>>(new Set());
// 数值变化的旧值记录，用于计算增减和动画
const oldValues = ref<Record<string, number>>({});

function toggleCollapse() {
  if (isCollapsed.value) {
    // 展开：先切换状态让元素可见
    isCollapsed.value = false;
    // 等待 DOM 更新后再执行动画
    nextTick(() => {
      const element = document.querySelector('.notebook-paper');
      if (element) {
        gsap.from(element, {
          duration: 0.5,
          height: 0,
          opacity: 0,
          ease: 'back.out(1.2)',
        });
      }
    });
  } else {
    // 收起：直接切换状态
    isCollapsed.value = true;
  }
}

// 刷新数据
function refreshData() {
  const btn = document.querySelector('.refresh-btn');
  gsap.to(btn, {
    rotation: 360,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => {
      gsap.set(btn, { rotation: 0 });
    },
  });

  try {
    // 从酒馆变量重新读取数据
    const rawData = getVariables({ type: 'message', message_id: getCurrentMessageId() });
    // MVU 数据存储在 stat_data 字段中
    const freshData = Schema.parse(_.get(rawData, 'stat_data') || {});

    // 逐字段赋值以触发 Vue 响应式系统
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

  // 模态框弹入动画
  nextTick(() => {
    const modal = document.querySelector('.modal-content');
    gsap.from(modal, {
      scale: 0.7,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  });
}

function closeModal() {
  modalVisible.value = false;
}

function formatBodyPart(part: { 描述: string; 状态: string; 特征?: string; 敏感度: number; 内射量?: number }) {
  let text = `描述: ${part.描述}\n状态: ${part.状态}`;
  if (part.特征) {
    text += `\n特征: ${part.特征}`;
  }
  text += `\n敏感度: ${part.敏感度}`;
  if (part.内射量 !== undefined) {
    text += `\n内射量: ${part.内射量}`;
  }
  return text;
}

// 根据心情返回对应的 emoji
function getMoodIcon(mood: string): string {
  const moodMap: Record<string, string> = {
    开心: '😊',
    高兴: '😄',
    快乐: '😃',
    兴奋: '🤩',
    紧张: '😰',
    害羞: '😳',
    害怕: '😨',
    恐惧: '😱',
    愤怒: '😠',
    生气: '😤',
    悲伤: '😢',
    伤心: '😭',
    平静: '😌',
    无聊: '😑',
    困惑: '🤔',
    惊讶: '😲',
    厌恶: '🤢',
    羞耻: '😖',
    期待: '🥺',
    满足: '😌',
    疲惫: '😫',
    痛苦: '😣',
    享受: '😋',
    傲慢: '😏',
    警惕: '👀',
    屈辱: '😓',
  };
  return moodMap[mood] || '😐';
}

// 根据天气返回对应的 emoji
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

// 根据体力值返回样式类
function getStaminaClass(stamina: number): string {
  if (stamina >= 70) return 'high';
  if (stamina >= 40) return 'medium';
  return 'low';
}

// 根据关系返回徽章颜色
function getRelationshipColor(relation: string): string {
  const colorMap: Record<string, string> = {
    陌生人: 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
    朋友: 'linear-gradient(135deg, #3498db, #2980b9)',
    暧昧: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    恋人: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    从属: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
  };
  return colorMap[relation] || 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
}

// 监听数值变化并高亮 + 触发庆祝特效
function watchValueChange(path: string, value: any) {
  const key = `${currentTab.value}.${path}`;

  // 检查是否是大额好感度增加 (增加 > 5 且 最终值 > 50)
  if (typeof value === 'number') {
    const oldValue = oldValues.value[path] || 0;
    if (value > oldValue && value - oldValue >= 5 && value >= 50) {
      triggerConfetti();
    }
    // 满值庆祝
    if (path.includes('好感度') && value >= 100 && oldValue < 100) {
      triggerConfetti();
      toastr.success('好感度已满！💖');
    }
    oldValues.value[path] = value;
  }

  highlightedFields.value.add(key);
  setTimeout(() => {
    highlightedFields.value.delete(key);
  }, 1000);
}

// 简单的 Confetti 特效 (DOM 版本)
function triggerConfetti() {
  const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'];
  const container = document.querySelector('.notebook-paper');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(confetti);

    gsap.to(confetti, {
      y: 500 + Math.random() * 200,
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 720,
      opacity: 0,
      duration: 2 + Math.random() * 2,
      ease: 'power1.out',
      onComplete: () => {
        if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
      },
    });
  }
}

// 物品排序和过滤
const inventorySortOrder = ref<'name' | 'count'>('name');

function toggleSortOrder() {
  inventorySortOrder.value = inventorySortOrder.value === 'name' ? 'count' : 'name';
  toastr.info(`排序方式: ${inventorySortOrder.value === 'name' ? '名称' : '数量'}`);
}

function processedInventory(inventory: Record<string, any>) {
  if (!inventory) return [];

  // 1. 转换为数组
  let items = Object.entries(inventory).map(([name, data]) => ({ name, data }));

  // 2. 过滤
  if (inventoryFilter.value) {
    const filter = inventoryFilter.value.toLowerCase();
    items = items.filter(
      item => item.name.toLowerCase().includes(filter) || item.data.描述.toLowerCase().includes(filter),
    );
  }

  // 3. 排序
  items.sort((a, b) => {
    if (inventorySortOrder.value === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b.data.数量 - a.data.数量;
    }
  });

  return items;
}

// 上下文菜单状态
const contextMenuVisible = ref(false);
const menuX = ref(0);
const menuY = ref(0);

// 历史记录和快照
const historyVisible = ref(false);
const snapshots = ref<{ time: string; data: any }[]>([]);
const historyLogs = ref<{ time: string; message: string }[]>([]);

// 正文相关状态
const contentVisible = ref(false);
const contentText = ref('');

function showContextMenu(event: MouseEvent) {
  event.preventDefault(); // 确保阻止默认菜单
  contextMenuVisible.value = true;
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  // 点击其他地方关闭
  const closeMenu = () => {
    contextMenuVisible.value = false;
    document.removeEventListener('click', closeMenu);
  };
  // 延迟添加监听器，防止立即触发
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
  }
}

function createSnapshot() {
  const time = new Date().toLocaleTimeString();
  snapshots.value.unshift({
    time,
    data: klona(dataStore.data),
  });

  // 限制快照数量
  if (snapshots.value.length > 5) snapshots.value.pop();

  addHistoryLog('创建了新快照');
  toastr.success('快照已保存');
}

function restoreSnapshot(index: number) {
  if (confirm('确定要恢复到此快照吗？当前未保存的更改将丢失。')) {
    const snapshot = snapshots.value[index];
    // 更新 store 数据
    // 注意：这里直接替换 dataStore.data 的属性
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

// 联动更新关系状态
function updateRelationship(goodwill: number) {
  const currentRelation = _.get(dataStore.data, '姜林.关系状态');

  // 如果是从属关系，不自动调整（这是最高级关系，需要剧情触发解除）
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

// 拖动功能实现
function startDrag(event: MouseEvent | TouchEvent, path: string, containerRef: HTMLElement | null) {
  if (!containerRef) return;

  // 阻止默认事件以防止滚动等干扰
  if (event.cancelable) event.preventDefault();

  isDragging.value = true;
  currentDragPath.value = path;

  let isLongPress = false;
  // 长按 800ms 后触发输入框
  const longPressTimer = setTimeout(() => {
    isLongPress = true;
    cleanupListeners();
    isDragging.value = false;
    currentDragPath.value = '';
    const currentVal = _.get(dataStore.data, path);
    openInputModal(path, currentVal);
  }, 800);

  const updateValue = (clientX: number) => {
    if (isLongPress || !containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    dragValue.value = percentage;

    // 实时更新数据
    _.set(dataStore.data, path, percentage);

    // 联动更新关系状态
    if (path === '姜林.好感度') {
      updateRelationship(percentage);
    }

    // 触发高亮效果
    watchValueChange(path, percentage);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    // 一旦移动，取消长按判定（除非这里可加一个抖动阈值，这简化处理）
    // 为了简单起见，只要移动了就算是在调整数值，清除长按定时器
    clearTimeout(longPressTimer);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    updateValue(clientX);
  };

  const cleanupListeners = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('touchend', handleEnd);
  };

  const handleEnd = () => {
    clearTimeout(longPressTimer);
    cleanupListeners();

    if (!isLongPress) {
      isDragging.value = false;
      currentDragPath.value = '';

      // 拖动结束时的动画
      const progressBar = containerRef.querySelector('.progress-bar') as HTMLElement;
      if (progressBar) {
        gsap.from(progressBar, {
          scale: 1.05,
          duration: 0.2,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    }
  };

  // 初始化位置
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  updateValue(clientX);

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchmove', handleMove);
  document.addEventListener('touchend', handleEnd);
}

// 标签页切换动画
watch(currentTab, () => {
  const content = document.querySelector('.tab-content');
  if (content) {
    gsap.from(content, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.out',
    });
  }
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
  // 如果是拖动条，不处理滑动
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

  // 判断是水平滑动还是垂直滚动：水平距离 > 垂直距离 * 1.5 且水平距 > 50px
  if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > 50) {
    const currentIndex = tabs.findIndex(t => t.name === currentTab.value);
    if (deltaX < 0 && currentIndex < tabs.length - 1) {
      // 向左滑，下一页
      currentTab.value = tabs[currentIndex + 1].name;
    } else if (deltaX > 0 && currentIndex > 0) {
      // 向右滑上一页
      currentTab.value = tabs[currentIndex - 1].name;
    }
  }
}

// 数值输入模态框逻辑
function openInputModal(path: string, val: number) {
  editingPath.value = path;
  inputValue.value = val;
  inputModalVisible.value = true;
  nextTick(() => {
    numberInputRef.value?.focus();
  });
}

function closeInputModal() {
  inputModalVisible.value = false;
  editingPath.value = '';
}

function saveInputValue() {
  if (editingPath.value) {
    _.set(dataStore.data, editingPath.value, inputValue.value);
    watchValueChange(editingPath.value, inputValue.value);

    // 特殊联动
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
    .label {
      color: #bdc3c7;
    }
    .value {
      color: #5dade2;
      text-shadow: 0 0 3px rgba(93, 173, 226, 0.3);
    }
    .value.favor {
      color: #ff7675;
    }
    .value.money {
      color: #58d68d;
    }
    .value.debt {
      color: #ff6b6b;
    }
    .info-text {
      color: #95a5a6;
    }
    .item-card {
      background: rgba(255, 255, 255, 0.05);
      border-color: #566573;
      .item-name {
        color: #ecf0f1;
      }
      .item-count {
        color: #bdc3c7;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    .modal-content {
      background: #34495e;
      color: #ecf0f1;
    }
    .modal-title {
      color: #ecf0f1;
    }
    .modal-body {
      color: #bdc3c7;
    }
    .close-btn {
      color: #bdc3c7;
      &:hover {
        color: #ecf0f1;
      }
    }
    .collapse-toggle {
      color: #bdc3c7;
      &:hover {
        color: #ecf0f1;
      }
    }
    .privacy-box {
      background: rgba(255, 255, 255, 0.05);
      border-left-color: #566573;
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

/* 标签页样式 */
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

.info-block {
  margin-bottom: 20px;
  position: relative;
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
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.label {
  font-weight: bold;
  color: #555;
  min-width: 60px;
}

.value {
  color: #2980b9;

  &.interactive-btn {
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      transform: scale(1.05);
      text-shadow: 0 0 5px rgba(41, 128, 185, 0.3);
    }
  }

  &.favor {
    color: #e74c3c;
  }

  &.money {
    color: #27ae60;
  }

  &.debt {
    color: #c0392b;
  }
}

.relationship-badge {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.mood-icon {
  font-size: 18px;
}

.circle-highlight {
  border: 2px solid #e74c3c;
  border-radius: 50% 60% 40% 70% / 60% 50% 70% 40%;
  padding: 2px 8px;
  display: inline-block;
}

/* 进度条样式 */
.progress-container {
  flex: 1;
  max-width: 150px;
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: visible;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &.draggable {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;

    &:hover {
      box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.1),
        0 0 0 2px rgba(231, 76, 60, 0.3);
    }

    &:active {
      box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.1),
        0 0 0 3px rgba(231, 76, 60, 0.5);
    }
  }
}

.drag-indicator {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #2c3e50;
  }
}

.progress-bar {
  height: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.5s ease-out;
  position: relative;
  overflow: hidden; /* 确保流体效果不溢出 */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-20deg) translateX(-150%);
    animation: shimmer 2s infinite;
  }

  &.favor-bar {
    background: linear-gradient(90deg, #f39c12, #e74c3c);
  }

  &.stamina-bar {
    &.high {
      background: linear-gradient(90deg, #2ecc71, #27ae60);
    }
    &.medium {
      background: linear-gradient(90deg, #f39c12, #e67e22);
    }
    &.low {
      background: linear-gradient(90deg, #e74c3c, #c0392b);
    }
  }

  &.submit-bar {
    background: linear-gradient(90deg, #9b59b6, #8e44ad);
  }

  &.negative-bar {
    background: linear-gradient(90deg, #95a5a6, #7f8c8d);
  }
}

@keyframes shimmer {
  0% {
    transform: skewX(-20deg) translateX(-150%);
  }
  100% {
    transform: skewX(-20deg) translateX(150%);
  }
}

.progress-value {
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.privacy-box {
  font-size: 14px;
  color: #7f8c8d;
  background: rgba(0, 0, 0, 0.02);
  padding: 8px;
  margin-top: 5px;
  border-left: 3px solid #95a5a6;

  .interactive-btn {
    cursor: pointer;
    transition: background-color 0.2s;
    padding: 4px;
    border-radius: 4px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 5px;
}

.inventory-filter {
  position: relative;
  margin-bottom: 10px;

  .filter-input {
    width: 100%;
    padding: 6px 30px 6px 12px;
    border: 1px solid #bdc3c7;
    border-radius: 15px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s;

    &:focus {
      background: #fff;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
  }

  .filter-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #95a5a6;
    pointer-events: none;
  }
}

.item-card {
  border: 2px dashed #bdc3c7;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.5);
  transform-style: preserve-3d;
  transition: all 0.5s;

  &.interactive-btn {
    cursor: pointer;

    &:hover {
      transform: translateY(-5px) rotateX(10deg);
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      border-style: solid;
      border-color: #3498db;
    }
  }
}

.item-name {
  font-weight: bold;
  color: #2c3e50;
}

.item-count {
  text-align: right;
  font-size: 12px;
  color: #7f8c8d;
}

.item-desc {
  font-size: 12px;
  color: #95a5a6;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-inventory {
  grid-column: 1 / -1;
  text-align: center;
  color: #bdc3c7;
  padding: 20px;
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

/* 排序按钮 */
.sort-btn {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
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
    /* 移除负边距，让它自然填充顶部 */
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
    /* 移除最大高度限制，使用 flex: 1 填满剩余空间 */
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

/* 响应式优化 */
@media (max-width: 400px) {
  .notebook-paper {
    padding: 30px 15px;
  }

  .tabs {
    gap: 4px;
  }

  .tab-item {
    padding: 6px 10px;
  }

  .inventory-grid {
    grid-template-columns: 1fr;
  }

  .progress-container {
    max-width: 100px;
  }
}
</style>
