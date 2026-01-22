<template>
  <div class="shelter-panel">
    <!-- 顶部：世界环境信息 -->
    <div class="world-header">
      <div class="header-left">
        <div class="shelter-name">
          <i class="fa-solid fa-vault"></i>
          {{ data.避难所.避难所名称 }}
        </div>
        <div class="disaster-info">
          <span class="disaster-type">{{ data.世界.灾难本质 }}</span>
          <span class="timeline">{{ data.世界.时间线节点 }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="datetime">
          <div class="date">
            <i class="fa-regular fa-calendar"></i>
            {{ data.世界.当前日期 }}
          </div>
          <div class="time">
            <i class="fa-regular fa-clock"></i>
            {{ data.世界.当前时间 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 标签导航 -->
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <i :class="['fa-solid', tab.icon]"></i>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 避难所状态 -->
      <div v-if="activeTab === 'shelter'" class="shelter-status">
        <div class="section">
          <h3 class="section-title">
            <i class="fa-solid fa-battery-half"></i>
            基础生存资源
          </h3>
          <div class="resource-grid">
            <div v-for="(res, key) in resources" :key="key" class="resource-bar">
              <div class="resource-header">
                <i :class="['fa-solid', res.icon]" :style="{ color: res.color }"></i>
                <span class="resource-label">{{ res.label }}</span>
                <span class="resource-value">
                  {{ data.避难所.基础生存资源[key].当前值 }} / {{ data.避难所.基础生存资源[key].上限 }}
                </span>
              </div>
              <div class="bar-container">
                <div
                  class="bar-fill"
                  :style="{
                    width: `${(data.避难所.基础生存资源[key].当前值 / data.避难所.基础生存资源[key].上限) * 100}%`,
                    background: res.color,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">
            <i class="fa-solid fa-chart-line"></i>
            环境指标
          </h3>
          <div class="indicator-grid">
            <div class="indicator">
              <span class="indicator-label">科技等级</span>
              <span class="indicator-value tech">{{ data.避难所.环境指标.科技等级 }}</span>
            </div>
            <div class="indicator">
              <span class="indicator-label">卫生度</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${data.避难所.环境指标.卫生度}%`, background: '#4a7c59' }">
                  <span class="progress-value">{{ data.避难所.环境指标.卫生度 }}%</span>
                </div>
              </div>
            </div>
            <div class="indicator">
              <span class="indicator-label">精神健康</span>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${data.避难所.环境指标.精神健康度}%`, background: '#6a5acd' }"
                >
                  <span class="progress-value">{{ data.避难所.环境指标.精神健康度 }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">
            <i class="fa-solid fa-scale-balanced"></i>
            社会制度
          </h3>
          <div class="policy-grid">
            <div v-for="policy in policies" :key="policy.key" class="policy-slider">
              <div class="policy-labels">
                <span class="label-left">{{ policy.leftLabel }}</span>
                <span class="label-right">{{ policy.rightLabel }}</span>
              </div>
              <div class="slider-track">
                <div class="slider-fill" :style="{ width: `${data.避难所.社会制度[policy.key]}%` }"></div>
                <div class="slider-marker" :style="{ left: `${data.避难所.社会制度[policy.key]}%` }">
                  <span class="marker-value">{{ data.避难所.社会制度[policy.key] }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">
            <i class="fa-solid fa-landmark"></i>
            宏观属性
          </h3>
          <div class="macro-grid">
            <div class="macro-item">
              <i class="fa-solid fa-crown"></i>
              <span class="macro-label">统治力</span>
              <span class="macro-value">{{ data.避难所.宏观属性.统治力 }}</span>
            </div>
            <div class="macro-item">
              <i class="fa-solid fa-shield-halved"></i>
              <span class="macro-label">防御等级</span>
              <span class="macro-value">{{ data.避难所.宏观属性.防御等级 }}</span>
            </div>
            <div class="macro-item">
              <i class="fa-solid fa-eye-slash"></i>
              <span class="macro-label">隐蔽度</span>
              <span class="macro-value">{{ data.避难所.宏观属性.隐蔽度 }}</span>
            </div>
            <div class="macro-item secret">
              <i class="fa-solid fa-flask"></i>
              <span class="macro-label">秘密实验</span>
              <span class="macro-value">{{ data.避难所.宏观属性.秘密实验进度 }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 派系 -->
      <div v-else-if="activeTab === 'social'" class="social-system">
        <div v-for="(faction, name) in data.派系" :key="name" class="faction-card">
          <div class="faction-header">
            <span class="faction-name">{{ name }}</span>
            <span class="faction-population">
              <i class="fa-solid fa-user"></i>
              {{ faction.人数占比 }}%
            </span>
          </div>
          <div class="faction-body">
            <div class="faction-ideology">
              <i class="fa-solid fa-bullseye"></i>
              {{ faction.宗旨 }}
            </div>
            <div class="faction-leader">
              <i class="fa-solid fa-user-tie"></i>
              领导人: {{ faction.领导人 }}
            </div>
            <div class="faction-relation">
              <div class="relation-header">
                <span>好感度</span>
                <span :class="['relation-value', getRelationClass(faction.好感度)]">
                  {{ faction.好感度 > 0 ? '+' : '' }}{{ faction.好感度 }}
                </span>
              </div>
              <div class="relation-bar">
                <div class="relation-fill" :style="getRelationStyle(faction.好感度)"></div>
                <div class="relation-center"></div>
              </div>
              <div class="relation-status">
                <span :class="['status-tag', getRelationClass(faction.好感度)]">
                  {{ faction.观感 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 设施 -->
      <div v-else-if="activeTab === 'facility'" class="facility-inventory">
        <div class="section">
          <h3 class="section-title">
            <i class="fa-solid fa-industry"></i>
            设施区域
          </h3>
          <div class="facility-grid">
            <div
              v-for="(facility, name) in data.设施与库存.设施区域"
              :key="name"
              :class="['facility-card', facility.状态]"
            >
              <div class="facility-header">
                <span class="facility-name">{{ name }}</span>
                <span :class="['status-badge', facility.状态]">{{ facility.状态 }}</span>
              </div>
              <div class="facility-body">
                <div class="facility-level">
                  <i class="fa-solid fa-star"></i>
                  Lv.{{ facility.等级 }}
                </div>
                <div class="facility-effect">{{ facility.效果 }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="section">
          <h3 class="section-title">
            <i class="fa-solid fa-box-open"></i>
            仓库系统
          </h3>
          <div class="item-list">
            <div v-for="(item, name) in data.设施与库存.仓库系统" :key="name" class="item-card">
              <div class="item-icon">
                <i :class="['fa-solid', getItemIcon(item.类型)]"></i>
              </div>
              <div class="item-info">
                <div class="item-name">{{ name }}</div>
                <div class="item-effect">{{ item.效果 }}</div>
              </div>
              <div class="item-quantity">x{{ item.数量 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 监督者 -->
      <div v-else-if="activeTab === 'overseer'" class="overseer-panel">
        <div class="section">
          <div class="overseer-header">
            <div class="avatar">
              <i class="fa-solid fa-user-astronaut"></i>
            </div>
            <div class="basic-info">
              <div class="name">{{ data.监督者.姓名 }}</div>
              <div class="location">
                <i class="fa-solid fa-location-dot"></i>
                {{ data.监督者.当前位置 }}
              </div>
            </div>
            <div class="action-points">
              <div class="ap-label">行动点</div>
              <div class="ap-value">
                <span class="current">{{ data.监督者.行动点数 }}</span>
                <span class="separator">/</span>
                <span class="max">{{ data.监督者.行动点数上限 }}</span>
              </div>
              <div class="ap-pips">
                <span
                  v-for="i in data.监督者.行动点数上限"
                  :key="i"
                  :class="['pip', { filled: i <= data.监督者.行动点数 }]"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div class="section">
          <h3 class="section-title">
            <i class="fa-solid fa-dna"></i>
            S.P.E.C.I.A.L 属性
          </h3>
          <div class="special-grid">
            <div v-for="(attr, key) in specialAttrs" :key="key" class="special-item">
              <div class="special-letter">{{ attr.letter }}</div>
              <div class="special-info">
                <div class="special-name">{{ attr.name }}</div>
                <div class="special-bar">
                  <div
                    class="special-fill"
                    :style="{
                      width: `${(data.监督者.SPECIAL[key] / 10) * 100}%`,
                      background: attr.color,
                    }"
                  ></div>
                </div>
              </div>
              <div class="special-value" :style="{ color: attr.color }">
                {{ data.监督者.SPECIAL[key] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 追随者 -->
      <div v-else-if="activeTab === 'follower'" class="follower-system">
        <div v-for="(follower, id) in data.追随者" :key="id" :class="['follower-card', { dead: follower.状态 === '死亡' }]">
          <div class="follower-header">
            <div class="avatar">
              <i
                :class="[
                  'fa-solid',
                  follower.性别 === '男' ? 'fa-mars' : follower.性别 === '女' ? 'fa-venus' : 'fa-genderless',
                ]"
              ></i>
            </div>
            <div class="basic-info">
              <div class="name">{{ follower.姓名 }}</div>
              <div class="meta">{{ follower.年龄 }}岁 · {{ follower.性别 }}</div>
            </div>
            <div :class="['status-badge', follower.状态]">{{ follower.状态 }}</div>
          </div>
          <div class="stats-section">
            <div class="stat-item">
              <i class="fa-solid fa-fist-raised"></i>
              <span class="stat-label">武力</span>
              <span class="stat-value">{{ follower.武力 }}</span>
            </div>
            <div class="stat-item">
              <i class="fa-solid fa-briefcase"></i>
              <span class="stat-label">管理</span>
              <span class="stat-value">{{ follower.管理 }}</span>
            </div>
            <div class="stat-item">
              <i class="fa-solid fa-compass"></i>
              <span class="stat-label">探索</span>
              <span class="stat-value">{{ follower.探索生存 }}</span>
            </div>
          </div>
          <div class="survival-section">
            <div class="survival-item">
              <span class="survival-label">
                <i class="fa-solid fa-heart"></i>
                生命
              </span>
              <div class="hp-bar">
                <div class="hp-fill" :style="{ width: `${follower.生命值}%` }"></div>
              </div>
              <span class="survival-value">{{ follower.生命值 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部警告栏 -->
    <div v-if="warnings.length > 0" class="warning-bar">
      <div class="warning-scroll">
        <div v-for="(warning, index) in warnings" :key="index" :class="['warning-item', warning.type]">
          <i :class="['fa-solid', warning.icon]"></i>
          <span>{{ warning.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from './index';

const store = useDataStore();
const data = computed(() => store.data);

const tabs = [
  { id: 'shelter', label: '避难所', icon: 'fa-house' },
  { id: 'social', label: '派系', icon: 'fa-users' },
  { id: 'facility', label: '设施', icon: 'fa-industry' },
  { id: 'overseer', label: '监督者', icon: 'fa-user-tie' },
  { id: 'follower', label: '追随者', icon: 'fa-user-group' },
];

const activeTab = ref('shelter');

const resources = {
  电力: { label: '电力', icon: 'fa-bolt', color: '#ffd700' },
  水源: { label: '水源', icon: 'fa-droplet', color: '#4fc3f7' },
  食物: { label: '食物', icon: 'fa-utensils', color: '#8bc34a' },
  人口: { label: '人口', icon: 'fa-users', color: '#ff9800' },
} as const;

const policies = [
  { key: '分配方法' as const, leftLabel: '公平', rightLabel: '效率' },
  { key: '信息管控' as const, leftLabel: '言论自由', rightLabel: '统一思想' },
  { key: '社会伦理' as const, leftLabel: '人性', rightLabel: '生存' },
  { key: '治安手段' as const, leftLabel: '重教化', rightLabel: '重刑罚' },
];

const specialAttrs = {
  威慑力: { letter: 'S', name: '威慑力', color: '#e53935' },
  洞察力: { letter: 'P', name: '洞察力', color: '#8bc34a' },
  抗压值: { letter: 'E', name: '抗压值', color: '#ffd54f' },
  统御力: { letter: 'C', name: '统御力', color: '#ff9800' },
  科研力: { letter: 'I', name: '科研力', color: '#4fc3f7' },
  反应力: { letter: 'A', name: '反应力', color: '#9c27b0' },
  气运: { letter: 'L', name: '气运', color: '#4caf50' },
} as const;

function getRelationClass(value: number): string {
  if (value >= 50) return 'excellent';
  if (value >= 20) return 'good';
  if (value >= -20) return 'neutral';
  if (value >= -50) return 'poor';
  return 'hostile';
}

function getRelationStyle(value: number) {
  const normalized = (value + 100) / 2;
  const color = value >= 50 ? '#4caf50' : value >= 20 ? '#8bc34a' : value >= -20 ? '#9e9e9e' : value >= -50 ? '#ff9800' : '#f44336';
  return { width: `${normalized}%`, background: color };
}

function getItemIcon(type: string): string {
  const icons: Record<string, string> = { 武器: 'fa-gun', 防具: 'fa-shield', 饰品: 'fa-gem', 消耗品: 'fa-flask', 材料: 'fa-cubes', 杂项: 'fa-box' };
  return icons[type] || 'fa-box';
}

const warnings = computed(() => {
  const result: { type: string; icon: string; text: string }[] = [];
  const 资源 = data.value.避难所.基础生存资源;
  if (资源.食物.当前值 / 资源.食物.上限 < 0.2) result.push({ type: 'warning', icon: 'fa-utensils', text: '食物紧缺' });
  if (资源.水源.当前值 / 资源.水源.上限 < 0.2) result.push({ type: 'warning', icon: 'fa-droplet', text: '水源紧缺' });
  for (const [name, f] of Object.entries(data.value.设施与库存.设施区域)) {
    if (f.状态 === '损坏') result.push({ type: 'critical', icon: 'fa-wrench', text: `${name}损坏` });
  }
  for (const [, f] of Object.entries(data.value.追随者)) {
    if (f.状态 === '生病') result.push({ type: 'info', icon: 'fa-virus', text: `${f.姓名}生病` });
  }
  return result;
});
</script>

<style lang="scss" scoped>
.shelter-panel {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #4a4a4a;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  font-family: var(--font-body);
  color: var(--c-vault-light);
  font-size: 13px;
  overflow: hidden;
}

.world-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(90deg, #1a4a6e 0%, #2d5a7e 100%);
  border-bottom: 2px solid #4a4a4a;
}

.shelter-name {
  font-size: 18px;
  font-weight: bold;
  color: #d4a84b;
  i { margin-right: 8px; }
}

.disaster-info {
  display: flex;
  gap: 12px;
  font-size: 12px;
  margin-top: 4px;
}

.disaster-type { color: #ff6b35; }
.timeline { color: #a0a0a0; }
.datetime { font-size: 12px; color: #c0c0c0; text-align: right; }
.date, .time { i { margin-right: 4px; opacity: 0.7; } }

.tab-nav {
  display: flex;
  background: #2a2a2a;
  border-bottom: 1px solid #4a4a4a;
}

.tab-btn {
  flex: 1;
  padding: 10px 12px;
  background: transparent;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.05); color: #d0d0d0; }
  &.active { color: #d4a84b; border-bottom-color: #d4a84b; background: rgba(212, 168, 75, 0.1); }
  i { font-size: 16px; }
  .tab-label { font-size: 11px; }
}

.content-area {
  padding: 12px 16px;
  min-height: 300px;
  background: rgba(0, 0, 0, 0.2);
}

.section {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #3a3a3a;
  margin-bottom: 12px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #d4a84b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.resource-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.resource-bar { background: rgba(0, 0, 0, 0.2); border-radius: 4px; padding: 8px; border: 1px solid #333; }
.resource-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 11px; }
.resource-label { flex: 1; color: #a0a0a0; }
.resource-value { color: #e0e0e0; font-weight: 600; }
.bar-container { height: 8px; background: #1a1a1a; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }

.indicator-grid { display: flex; flex-direction: column; gap: 8px; }
.indicator { display: flex; align-items: center; gap: 12px; }
.indicator-label { font-size: 12px; color: #a0a0a0; min-width: 80px; }
.indicator-value.tech { color: #4fc3f7; background: rgba(79, 195, 247, 0.1); padding: 2px 8px; border-radius: 4px; }
.progress-bar { flex: 1; height: 18px; background: rgba(0, 0, 0, 0.4); border-radius: 9px; overflow: hidden; border: 1px solid #3a3a3a; }
.progress-fill { height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; min-width: 40px; }
.progress-value { font-size: 10px; font-weight: 600; color: #fff; }

.policy-grid { display: flex; flex-direction: column; gap: 10px; }
.policy-slider { padding: 4px 0; }
.policy-labels { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px; }
.label-left { color: #4fc3f7; }
.label-right { color: #ff6b35; }
.slider-track { height: 8px; background: linear-gradient(90deg, #4fc3f7 0%, #4a4a4a 50%, #ff6b35 100%); border-radius: 4px; position: relative; }
.slider-fill { height: 100%; background: rgba(255, 255, 255, 0.2); border-radius: 4px 0 0 4px; }
.slider-marker { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; background: #fff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 0 2px #d4a84b; display: flex; align-items: center; justify-content: center; }
.marker-value { font-size: 8px; font-weight: bold; color: #333; }

.macro-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.macro-item { display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; i { font-size: 14px; color: #d4a84b; width: 20px; text-align: center; } &.secret i { color: #8b3a3a; } }
.macro-label { font-size: 11px; color: #a0a0a0; flex: 1; }
.macro-value { font-size: 14px; font-weight: bold; color: #e0e0e0; }

.social-system { display: flex; flex-direction: column; gap: 12px; }
.faction-card { background: rgba(0, 0, 0, 0.3); border-radius: 6px; border: 1px solid #3a3a3a; overflow: hidden; }
.faction-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(212, 168, 75, 0.15); border-bottom: 1px solid #3a3a3a; }
.faction-name { font-size: 14px; font-weight: 600; color: #d4a84b; }
.faction-population { font-size: 12px; color: #a0a0a0; i { margin-right: 4px; } }
.faction-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.faction-ideology, .faction-leader { font-size: 12px; color: #c0c0c0; i { width: 16px; margin-right: 6px; color: #a0a0a0; } }
.faction-relation { margin-top: 4px; padding-top: 8px; border-top: 1px solid #333; }
.relation-header { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; span:first-child { color: #888; } }
.relation-value { font-weight: 600; &.excellent { color: #4caf50; } &.good { color: #8bc34a; } &.neutral { color: #9e9e9e; } &.poor { color: #ff9800; } &.hostile { color: #f44336; } }
.relation-bar { height: 6px; background: rgba(0, 0, 0, 0.4); border-radius: 3px; position: relative; overflow: hidden; }
.relation-fill { height: 100%; transition: width 0.3s; }
.relation-center { position: absolute; top: 0; left: 50%; width: 2px; height: 100%; background: #666; transform: translateX(-50%); }
.relation-status { margin-top: 6px; text-align: right; }
.status-tag { font-size: 10px; padding: 2px 8px; border-radius: 10px; &.excellent { background: rgba(76, 175, 80, 0.2); color: #4caf50; } &.good { background: rgba(139, 195, 74, 0.2); color: #8bc34a; } &.neutral { background: rgba(158, 158, 158, 0.2); color: #9e9e9e; } &.poor { background: rgba(255, 152, 0, 0.2); color: #ff9800; } &.hostile { background: rgba(244, 67, 54, 0.2); color: #f44336; } }

.facility-inventory { display: flex; flex-direction: column; gap: 16px; }
.facility-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.facility-card { background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; border: 1px solid #444; &.损坏 { border-color: #8b3a3a; background: rgba(139, 58, 58, 0.1); } &.升级中 { border-color: #4fc3f7; } }
.facility-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(0, 0, 0, 0.3); }
.facility-name { font-size: 12px; font-weight: 600; color: #e0e0e0; }
.status-badge { font-size: 9px; padding: 2px 6px; border-radius: 3px; &.正常 { background: rgba(76, 175, 80, 0.2); color: #4caf50; } &.损坏 { background: rgba(244, 67, 54, 0.2); color: #f44336; } &.升级中 { background: rgba(79, 195, 247, 0.2); color: #4fc3f7; } &.健康 { background: rgba(76, 175, 80, 0.2); color: #4caf50; } &.生病 { background: rgba(255, 152, 0, 0.2); color: #ff9800; } }
.facility-body { padding: 8px 10px; }
.facility-level { font-size: 11px; color: #ffd700; margin-bottom: 4px; i { margin-right: 4px; } }
.facility-effect { font-size: 11px; color: #8bc34a; }
.item-list { display: flex; flex-direction: column; gap: 6px; }
.item-card { display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255, 255, 255, 0.03); border-radius: 4px; border: 1px solid #333; }
.item-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.3); border-radius: 4px; i { font-size: 14px; color: #d4a84b; } }
.item-info { flex: 1; }
.item-name { font-size: 12px; font-weight: 500; color: #e0e0e0; }
.item-effect { font-size: 10px; color: #888; }
.item-quantity { font-size: 14px; font-weight: 600; color: #ffd700; padding: 4px 8px; background: rgba(255, 215, 0, 0.1); border-radius: 4px; }

.overseer-panel { display: flex; flex-direction: column; gap: 16px; }
.overseer-header { display: flex; align-items: center; gap: 16px; }
.avatar { width: 60px; height: 60px; background: linear-gradient(135deg, #1a4a6e 0%, #2d5a7e 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #d4a84b; i { font-size: 28px; color: #d4a84b; } }
.basic-info { flex: 1; }
.name { font-size: 20px; font-weight: bold; color: #e0e0e0; margin-bottom: 4px; }
.location { font-size: 12px; color: #888; i { margin-right: 4px; color: #4fc3f7; } }
.action-points { text-align: center; padding: 8px 16px; background: rgba(212, 168, 75, 0.1); border-radius: 6px; border: 1px solid #d4a84b; }
.ap-label { font-size: 10px; color: #888; text-transform: uppercase; }
.ap-value { font-size: 20px; font-weight: bold; margin: 2px 0; .current { color: #ffd700; } .separator { color: #666; margin: 0 2px; } .max { color: #888; } }
.ap-pips { display: flex; justify-content: center; gap: 4px; }
.pip { width: 12px; height: 12px; border-radius: 50%; background: #333; border: 2px solid #555; &.filled { background: #ffd700; border-color: #ffa000; box-shadow: 0 0 6px rgba(255, 215, 0, 0.5); } }
.special-grid { display: flex; flex-direction: column; gap: 8px; }
.special-item { display: flex; align-items: center; gap: 12px; }
.special-letter { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: #2a2a2a; border-radius: 4px; font-size: 14px; font-weight: bold; color: #d4a84b; border: 1px solid #444; }
.special-info { flex: 1; }
.special-name { font-size: 11px; color: #888; margin-bottom: 2px; }
.special-bar { height: 6px; background: #2a2a2a; border-radius: 3px; overflow: hidden; }
.special-fill { height: 100%; transition: width 0.3s; }
.special-value { width: 24px; text-align: right; font-size: 16px; font-weight: bold; }

.follower-system { display: flex; flex-direction: column; gap: 12px; }
.follower-card { background: rgba(0, 0, 0, 0.3); border-radius: 6px; border: 1px solid #3a3a3a; overflow: hidden; &.dead { opacity: 0.5; filter: grayscale(80%); } }
.follower-header { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0, 0, 0, 0.3); border-bottom: 1px solid #333; .avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #2d5a7e 0%, #1a4a6e 100%); i { font-size: 18px; } } .basic-info { flex: 1; } .name { font-size: 14px; font-weight: 600; color: #e0e0e0; } .meta { font-size: 11px; color: #888; } }
.stats-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; border-bottom: 1px solid #333; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 2px; i { font-size: 14px; color: #d4a84b; } }
.stat-label { font-size: 10px; color: #888; }
.stat-value { font-size: 16px; font-weight: bold; color: #e0e0e0; }
.survival-section { padding: 12px; }
.survival-item { display: flex; align-items: center; gap: 8px; }
.survival-label { font-size: 11px; color: #888; min-width: 50px; i { margin-right: 4px; color: #e53935; } }
.hp-bar { flex: 1; height: 8px; background: #333; border-radius: 4px; overflow: hidden; }
.hp-fill { height: 100%; background: linear-gradient(90deg, #e53935 0%, #4caf50 100%); transition: width 0.3s; }
.survival-value { font-size: 12px; font-weight: 600; color: #e0e0e0; min-width: 30px; text-align: right; }

.warning-bar { background: linear-gradient(90deg, #2a1a1a 0%, #1a1a2a 100%); border-top: 1px solid #4a4a4a; padding: 8px 12px; }
.warning-scroll { display: flex; gap: 12px; flex-wrap: wrap; }
.warning-item { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; animation: pulse 2s infinite; i { font-size: 12px; } &.critical { background: rgba(244, 67, 54, 0.2); color: #f44336; border: 1px solid rgba(244, 67, 54, 0.4); } &.warning { background: rgba(255, 152, 0, 0.2); color: #ff9800; border: 1px solid rgba(255, 152, 0, 0.4); } &.info { background: rgba(158, 158, 158, 0.2); color: #9e9e9e; border: 1px solid rgba(158, 158, 158, 0.4); animation: none; } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
</style>
