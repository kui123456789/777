import { createApp, type App as VueApp } from 'vue';
import { createPinia } from 'pinia';
import { teleportStyle, createScriptIdDiv } from '@util/script';
import './polyfill';
import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

const MOUNT_CLASS = 'tavern-inline-status-bar';

let currentApp: VueApp | null = null;
let $currentMountPoint: JQuery | null = null;
let destroyStyle: (() => void) | null = null;

function cleanupAllStatusBars() {
  if (currentApp) {
    try {
      currentApp.unmount();
    } catch (e) {
      console.warn('[Inline Status Bar] Error unmounting app:', e);
    }
    currentApp = null;
  }
  if ($currentMountPoint) {
    $currentMountPoint.remove();
    $currentMountPoint = null;
  }
  $(`.${MOUNT_CLASS}`).remove();
}

async function mountStatusBar() {
  cleanupAllStatusBars();
  const latestId = getLastMessageId();
  if (latestId === undefined) {
    console.warn('[Inline Status Bar] No message to mount on');
    return;
  }
  const $messageDiv = $(`#chat .mes[mesid="${latestId}"]`);
  if ($messageDiv.length === 0) {
    console.warn('[Inline Status Bar] Message element not found:', latestId);
    return;
  }
  $currentMountPoint = createScriptIdDiv().addClass(MOUNT_CLASS);
  $currentMountPoint.appendTo($messageDiv);
  currentApp = createApp(App).use(createPinia());
  currentApp.mount($currentMountPoint[0]);
  console.info('[Inline Status Bar] Mounted on message:', latestId);
}

$(async () => {
  console.info('[Inline Status Bar] Loading...');
  cleanupAllStatusBars();
  try {
    await waitUntil(
      () => {
        try {
          const latestId = getLastMessageId();
          return latestId !== undefined;
        } catch {
          return false;
        }
      },
      { timeout: 60000, intervalBetweenAttempts: 500 },
    );
  } catch (e) {
    console.error('[Inline Status Bar] Timeout waiting for message layer:', e);
    return;
  }
  console.info('[Inline Status Bar] Ready to mount');
  if (destroyStyle) destroyStyle();
  const styleResult = teleportStyle();
  destroyStyle = styleResult.destroy;
  await mountStatusBar();
  const messageReceivedHandler = eventOn(tavern_events.MESSAGE_RECEIVED, async () => {
    console.info('[Inline Status Bar] New message received, remounting...');
    await new Promise(resolve => setTimeout(resolve, 100));
    await mountStatusBar();
  });
  const messageSentHandler = eventOn(tavern_events.MESSAGE_SENT, async () => {
    console.info('[Inline Status Bar] Message sent, remounting...');
    await new Promise(resolve => setTimeout(resolve, 100));
    await mountStatusBar();
  });
  console.info('[Inline Status Bar] Loaded successfully');
  $(window).on('pagehide', () => {
    cleanupAllStatusBars();
    if (destroyStyle) {
      destroyStyle();
      destroyStyle = null;
    }
    messageReceivedHandler.stop();
    messageSentHandler.stop();
    console.info('[Inline Status Bar] Unloaded');
  });
});
