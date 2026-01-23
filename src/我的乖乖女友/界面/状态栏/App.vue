<template>
  <div class="notebook-paper">
    <div class="tape"></div>

    <!-- 头部信息 -->
    <div class="header">
      <div class="title">角色状态记录</div>
      <div class="info-text">{{ data.世界.当前日期 }} {{ data.世界.当前时间 }} @ {{ data.世界.当前地点 }}</div>
      <div class="info-text" style="font-size: 11px">{{ data.世界.天气 }}</div>
    </div>

    <!-- 标签页导航 -->
    <div class="tabs">
      <div class="tab-item" :class="{ active: currentTab === '姜林' }" @click="currentTab = '姜林'">姜林</div>
      <div class="tab-item" :class="{ active: currentTab === '沈婉清' }" @click="currentTab = '沈婉清'">沈婉清</div>
      <div class="tab-item" :class="{ active: currentTab === '林小雨' }" @click="currentTab = '林小雨'">林小雨</div>
    </div>

    <!-- 姜林面板 -->
    <div v-if="currentTab === '姜林'" class="tab-content">
      <!-- 状态区域 -->
      <div class="info-block">
        <div class="block-title">我的状态</div>
        <div class="handwritten-text">
          <div class="row">
            <span class="label">关系:</span>
            <span class="value">{{ data.姜林.关系状态 }}</span>
          </div>
          <div class="row">
            <span class="label">好感度:</span>
            <span class="value favor">{{ data.姜林.好感度 }}</span>
          </div>
          <div class="score-mark">{{ data.姜林.好感度 }}分</div>
          <div class="row">
            <span class="label">心情:</span>
            <span class="value interactive-btn" @click="showDetail('心情', data.姜林.基础状态.心情)">
              <span class="circle-highlight">{{ data.姜林.基础状态.心情 }}</span>
            </span>
          </div>
          <div class="row">
            <span class="label">状态:</span>
            <span class="value">{{ data.姜林.基础状态.当前状态 }}</span>
          </div>
          <div class="row">
            <span class="label">体力:</span>
            <span class="value">{{ data.姜林.基础状态.体力 }}%</span>
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
            <div class="interactive-btn" @click="showDetail('胸部状态', data.姜林.身体.私密部位.胸部)">
              胸部: {{ data.姜林.身体.私密部位.胸部 }}
            </div>
            <div
              class="interactive-btn"
              style="margin-top: 4px"
              @click="showDetail('下体状态', data.姜林.身体.私密部位.下体)"
            >
              下体: {{ data.姜林.身体.私密部位.下体 }}
            </div>
          </div>
        </div>
      </div>

      <!-- 背包物品 -->
      <div class="info-block">
        <div class="block-title">随身物品</div>
        <div class="inventory-grid">
          <template v-if="Object.keys(data.姜林.背包).length > 0">
            <div
              v-for="(item, name) in data.姜林.背包"
              :key="name"
              class="item-card interactive-btn"
              @click="showDetail(String(name), item.描述)"
            >
              <div class="item-name">{{ name }}</div>
              <div class="item-count">x{{ item.数量 }}</div>
              <div class="item-desc">{{ item.描述 }}</div>
            </div>
          </template>
          <div v-else class="empty-inventory">口袋空空的...</div>
        </div>
      </div>
    </div>

    <!-- 沈婉清面板 -->
    <div v-if="currentTab === '沈婉清'" class="tab-content">
      <div class="info-block">
        <div class="block-title">沈婉清状态</div>
        <div class="handwritten-text">
          <div class="row">
            <span class="label">关系:</span>
            <span class="value">{{ data.沈婉清状态.关系 }}</span>
          </div>
          <div class="row">
            <span class="label">当前状态:</span>
            <span class="value">{{ data.沈婉清状态.当前状态 }}</span>
          </div>
          <div class="row">
            <span class="label">屈从度:</span>
            <span class="value debt">{{ data.沈婉清状态.屈从度 }}</span>
          </div>
          <div class="row">
            <span class="label">好感度:</span>
            <span class="value favor">{{ data.沈婉清状态.好感度 }}</span>
          </div>
          <div class="row">
            <span class="label">心情:</span>
            <span class="value">{{ data.沈婉清状态.心情 }}</span>
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
        <div class="inventory-grid">
          <template v-if="Object.keys(data.沈婉清背包).length > 0">
            <div
              v-for="(item, name) in data.沈婉清背包"
              :key="name"
              class="item-card interactive-btn"
              @click="showDetail(String(name), item.描述)"
            >
              <div class="item-name">{{ name }}</div>
              <div class="item-count">x{{ item.数量 }}</div>
              <div class="item-desc">{{ item.描述 }}</div>
            </div>
          </template>
          <div v-else class="empty-inventory">口袋空空的...</div>
        </div>
      </div>
    </div>

    <!-- 林小雨面板 -->
    <div v-if="currentTab === '林小雨'" class="tab-content">
      <div class="info-block">
        <div class="block-title">林小雨状态</div>
        <div class="handwritten-text">
          <div class="row">
            <span class="label">当前状态:</span>
            <span class="value">{{ data.林小雨状态.当前状态 }}</span>
          </div>
          <div class="row">
            <span class="label">兄控度:</span>
            <span class="value favor">{{ data.林小雨状态.兄控度 }}</span>
          </div>
          <div class="row">
            <span class="label">心情:</span>
            <span class="value">{{ data.林小雨状态.心情 }}</span>
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
        <div class="inventory-grid">
          <template v-if="Object.keys(data.林小雨背包).length > 0">
            <div
              v-for="(item, name) in data.林小雨背包"
              :key="name"
              class="item-card interactive-btn"
              @click="showDetail(String(name), item.描述)"
            >
              <div class="item-name">{{ name }}</div>
              <div class="item-count">x{{ item.数量 }}</div>
              <div class="item-desc">{{ item.描述 }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

const dataStore = useDataStore() as any;
const data = computed(() => dataStore.data);

const currentTab = ref('姜林');
const modalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

function showDetail(title: string, content: string) {
  modalTitle.value = title;
  modalContent.value = content;
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function formatBodyPart(part: any) {
  let text = `描述: ${part.描述}\n状态: ${part.状态}\n特征: ${part.特征}\n敏感度: ${part.敏感度}`;
  if (part.内射量 !== undefined) {
    text += `\n内射量: ${part.内射量}`;
  }
  return text;
}
</script>

<style lang="scss" scoped>
.notebook-paper {
  width: 100%;
  max-width: 500px;
  background-color: #fdfbf7;
  background-image: linear-gradient(#e1e1e1 1px, transparent 1px), linear-gradient(90deg, #e1e1e1 1px, transparent 1px);
  background-size: 20px 20px;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.1),
    0 0 0 10px rgba(255, 255, 255, 0.5) inset;
  position: relative;
  padding: 40px 30px;
  border-radius: 5px;
  transform: rotate(-1deg);
  margin: 0 auto;
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
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  letter-spacing: 2px;
}

.info-text {
  font-size: 12px;
  color: #7f8c8d;
}

/* 标签页样式 */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #bdc3c7;
}

.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  color: #7f8c8d;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;

  &:hover {
    color: #2c3e50;
  }

  &.active {
    color: #c0392b;
    border-bottom-color: #c0392b;
  }
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
  justify-content: space-between;
  margin-bottom: 5px;
}

.label {
  font-weight: bold;
  color: #555;
}

.value {
  color: #2980b9;

  &.interactive-btn {
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    &:hover {
      transform: scale(1.05);
      text-shadow: 0 0 5px rgba(41, 128, 185, 0.3);
    }

    &::after {
      content: '(查看)';
      font-size: 12px;
      color: #999;
      position: absolute;
      right: -40px;
      top: 2px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover::after {
      opacity: 1;
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

.circle-highlight {
  border: 2px solid #e74c3c;
  border-radius: 50% 60% 40% 70% / 60% 50% 70% 40%;
  padding: 2px 8px;
  display: inline-block;
}

.score-mark {
  font-size: 32px;
  color: #e74c3c;
  position: absolute;
  right: 20px;
  top: -10px;
  transform: rotate(15deg);
  font-weight: bold;
  opacity: 0.2;
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

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 5px;
}

.item-card {
  border: 2px dashed #bdc3c7;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.5);

  &.interactive-btn {
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.02);
      background: rgba(255, 255, 255, 0.8);
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
  grid-column: span 2;
  text-align: center;
  color: #bdc3c7;
  padding: 20px;
}

.inventory-list {
  margin-top: 5px;
}

.inventory-item {
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
  padding-left: 10px;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #95a5a6;
  }
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
</style>
