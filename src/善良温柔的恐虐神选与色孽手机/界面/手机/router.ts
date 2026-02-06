import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router';

// Re-export navigation utilities for backward compatibility
export { usePhoneNavigation, type PhoneView } from './navigation';

const routes: RouteRecordRaw[] = [
  { path: '/', name: '主界面', component: () => import('./views/StatusView.vue') },
  // { path: '/状态栏', name: '状态栏', component: () => import('./views/StatusView.vue') },
  { path: '/透视', name: '透视', component: () => import('./views/XRayView.vue') },
  { path: '/背包', name: '背包', component: () => import('./views/InventoryView.vue') },
  { path: '/催眠', name: '催眠', component: () => import('./views/HypnosisView.vue') },
  { path: '/远程操控', name: '远程操控', component: () => import('./views/RemoteView.vue') },
  { path: '/肉体软化', name: '肉体软化', component: () => import('./views/SoftBodyView.vue') },
  { path: '/商店', name: '商店', component: () => import('./views/ShopView.vue') },
  { path: '/世界信息', name: '世界信息', component: () => import('./views/WorldInfoView.vue') },
  { path: '/设置', name: '设置', component: () => import('./views/SettingsView.vue') },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
