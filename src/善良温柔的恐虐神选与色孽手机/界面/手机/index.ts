import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import router from './router';
import './global.css';

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));

  // 变量同步说明：
  // 前端界面修改变量后（如商店购买、背包使用物品），需要调用 syncLinHaiDataToLatest()
  // 将修改同步到最新楼层，确保 AI 生成新消息时能获取到正确的变量值
  // 具体实现见 store.ts 中的 syncLinHaiDataToLatest 函数

  createApp(App).use(createPinia()).use(router).mount('#app');
});
