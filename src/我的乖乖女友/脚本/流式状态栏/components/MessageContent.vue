<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  message: string;
  messageId: number;
  duringStreaming: boolean;
}>();

// Extract content from <maintext>...</maintext> tag
// The regex "隐藏maintext标签" hides this content, so we need to extract and display it
// During streaming, the closing tag may not exist yet, so we handle both cases
const extractMaintext = (text: string, isStreaming: boolean): string | null => {
  // First, try to match complete tag (closed)
  const closedMatch = text.match(/<[Mm]aintext>([\s\S]*?)<\/[Mm]aintext>/);
  if (closedMatch) {
    return closedMatch[1].trim();
  }

  // During streaming, try to match unclosed tag (from <maintext> to end of message)
  if (isStreaming) {
    const openMatch = text.match(/<[Mm]aintext>([\s\S]*?)$/);
    if (openMatch) {
      return openMatch[1].trim();
    }
  }

  return null;
};

// Simple markdown conversion for streaming
const simpleFormat = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
};

// Format the message content as displayed HTML
const formattedHtml = computed(() => {
  if (!props.message) return '';

  // Extract maintext content (what the regex hides)
  const maintext = extractMaintext(props.message, props.duringStreaming);

  // If no maintext tag found, don't display anything
  // (the original message is shown by tavern, regex doesn't hide it)
  if (!maintext) return '';

  // During streaming, use simple conversion
  if (props.duringStreaming) {
    return simpleFormat(maintext);
  }

  // After streaming complete, use full formatting
  return formatAsDisplayedMessage(maintext, { message_id: props.messageId });
});
</script>

<template>
  <!-- Message content rendered with tavern formatting -->
  <div class="message-content" v-html="formattedHtml" />
</template>

<style scoped>
.message-content {
  /* Inherit tavern text color or use light color for dark backgrounds */
  color: var(--SmartThemeBodyColor, #e5e7eb);
  font-weight: 500;
  line-height: 1.7;
  max-width: 100%;
  overflow-wrap: anywhere;
  padding: 1rem 0 0 0;
  font-size: 1rem;
}

.message-content :deep(p) {
  margin: 0.5em 0;
}

.message-content :deep(p:first-child) {
  margin-top: 0;
}

.message-content :deep(p:last-child) {
  margin-bottom: 0;
}

.message-content :deep(em) {
  color: var(--SmartThemeEmColor, #a78bfa);
  font-style: italic;
}

.message-content :deep(strong) {
  font-weight: 700;
}

.message-content :deep(q),
.message-content :deep(blockquote) {
  color: var(--SmartThemeQuoteColor, #f472b6);
  border-left: 3px solid currentColor;
  padding-left: 0.75em;
  margin: 0.5em 0;
  display: block;
}

/* Code blocks */
.message-content :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: monospace;
}

.message-content :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75em;
  border-radius: 6px;
  overflow-x: auto;
}
</style>
