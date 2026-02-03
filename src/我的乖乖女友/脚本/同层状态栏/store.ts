import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

// 注意：同层状态栏是在脚本中运行的，需要等待变量初始化后再创建 store
// 因此这个 store 的创建应该延迟到确认变量存在后(即 useDataStore 被调用时)
// 当楼层变化时，需要重置 store 以绑定到新楼层
let useStore: ReturnType<typeof defineMvuDataStore> | null = null;
let currentMessageId: number | undefined = undefined;

/**
 * 重置 store，使下次调用 useDataStore 时重新创建
 * 应在挂载到新楼层前调用
 */
export function resetStore() {
  useStore = null;
  currentMessageId = undefined;
  console.info('[同层状态栏] Store 已重置');
}

export const useDataStore = () => {
  const latestId = getLastMessageId();

  // 如果 store 不存在或楼层已变化，重新创建 store
  if (!useStore || currentMessageId !== latestId) {
    currentMessageId = latestId;
    useStore = defineMvuDataStore(Schema, { type: 'message', message_id: latestId }, _data => {
      // 初始化时的额外设置（如果需要）
      console.info('[同层状态栏] Store 初始化完成, 楼层:', latestId);
    });
  }
  return useStore();
};
