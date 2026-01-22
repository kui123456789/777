import { waitUntil } from 'async-wait-until';
import _ from 'lodash';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './global.css';

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
  createApp(App).use(createPinia()).mount('#app');
});
