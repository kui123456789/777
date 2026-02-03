import { mountStreamingMessages } from '@util/streaming';
import App from './App.vue';

$(() => {
  const { unmount } = mountStreamingMessages(() => createApp(App).use(createPinia()), { host: 'iframe' });

  $(window).on('pagehide', () => unmount());
});
