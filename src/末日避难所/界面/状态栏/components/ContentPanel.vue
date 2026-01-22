<template>
  <div class="content-panel">
    <div v-if="contentText" class="content-text" v-html="formattedContent"></div>
    <div v-else class="no-content">
      <i class="fa-solid fa-file-circle-question"></i>
      <p>未找到正文内容</p>
      <p class="hint">正文应使用 content 标签包裹</p>
    </div>

    <!-- 选项区域 -->
    <div v-if="options.length > 0" class="options-section">
      <div class="options-title">
        <i class="fa-solid fa-hand-pointer"></i>
        <span>选择你的行动</span>
      </div>
      <div class="options-grid">
        <button v-for="(option, index) in options" :key="index" class="option-button" @click="sendOption(option)">
          <span class="option-number">{{ index + 1 }}</span>
          <span class="option-text">{{ option }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

const contentText = ref('');
const options = ref<string[]>([]);

function extractContent(): string {
  try {
    const messageId = getCurrentMessageId();
    if (messageId === undefined) return '';
    const messages = getChatMessages(messageId);
    const message = messages[0];
    if (!message) return '';
    const rawText = message.message || '';
    const regex = /<content>([\s\S]*?)<\/content>/i;
    const contentMatch = rawText.match(regex);
    if (contentMatch && contentMatch[1]) {
      return contentMatch[1].trim();
    }
    return '';
  } catch (e) {
    console.error('[ContentPanel] 提取正文失败:', e);
    return '';
  }
}

function extractOptions(): string[] {
  try {
    const messageId = getCurrentMessageId();
    if (messageId === undefined) return [];
    const messages = getChatMessages(messageId);
    const message = messages[0];
    if (!message) return [];
    const rawText = message.message || '';

    // 提取 <options>...</options> 内容
    const optionsRegex = /<options>([\s\S]*?)<\/options>/i;
    const optionsMatch = rawText.match(optionsRegex);
    if (!optionsMatch || !optionsMatch[1]) return [];

    // 提取每个 <opt>...</opt>
    const optRegex = /<opt>([\s\S]*?)<\/opt>/gi;
    const opts: string[] = [];
    let match;
    while ((match = optRegex.exec(optionsMatch[1])) !== null) {
      const optText = match[1].trim();
      if (optText) {
        opts.push(optText);
      }
    }
    return opts;
  } catch (e) {
    console.error('[ContentPanel] 提取选项失败:', e);
    return [];
  }
}

async function sendOption(optionText: string) {
  try {
    // 使用 triggerSlash 发送消息
    // /send 命令会将文本发送到聊天
    await triggerSlash(`/send ${optionText}`);
    toastr.success('已发送选项');
  } catch (e) {
    console.error('[ContentPanel] 发送选项失败:', e);
    toastr.error('发送失败');
  }
}

const formattedContent = computed(() => {
  return contentText.value.replace(/&/g, '&amp;').replace(/\x3c/g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
});

onMounted(() => {
  contentText.value = extractContent();
  options.value = extractOptions();
});
</script>

<style lang="scss" scoped>
.content-panel {
  height: 932px;
  overflow-y: auto;
  padding: 16px;
  background: rgba(0, 0, 0, 0.1);
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
}
.content-text {
  color: #d0d0d0;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}
.no-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #888;
  i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  p {
    margin: 8px 0;
    font-size: 14px;
  }
  .hint {
    font-size: 12px;
    color: #666;
  }
}

// 选项区域样式
.options-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.options-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #f0c040;
  font-size: 14px;
  font-weight: 600;

  i {
    font-size: 16px;
  }
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-button {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(60, 60, 80, 0.8) 0%, rgba(40, 40, 60, 0.9) 100%);
  border: 1px solid rgba(100, 100, 140, 0.3);
  border-radius: 8px;
  color: #d0d0d0;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(80, 80, 110, 0.9) 0%, rgba(60, 60, 90, 0.95) 100%);
    border-color: rgba(140, 140, 180, 0.5);
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateX(2px);
    background: linear-gradient(135deg, rgba(100, 100, 130, 0.9) 0%, rgba(70, 70, 100, 0.95) 100%);
  }
}

.option-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(240, 192, 64, 0.2);
  border: 1px solid rgba(240, 192, 64, 0.4);
  border-radius: 50%;
  color: #f0c040;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}
</style>
