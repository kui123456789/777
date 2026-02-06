import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '@/善良温柔的恐虐神选与色孽手机/schema';
import { klona } from 'klona';

// 使用最新消息楼层的变量
// 确保界面读取到 AI 刚更新的最新楼层数据
export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: 'latest',
});

/**
 * 从最新楼层刷新 store 数据
 * 当 AI 生成新消息后调用此函数，确保界面显示最新变量
 */
export function refreshDataFromLatest(store: ReturnType<typeof useDataStore>) {
  try {
    const latestData = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
    const statData = _.get(latestData, 'stat_data', {});
    const parsed = Schema.safeParse(statData);
    if (parsed.success) {
      // 深度比较，只有数据真的变化了才更新
      if (!_.isEqual(store.data, parsed.data)) {
        Object.assign(store.data, parsed.data);
        console.log('[数据刷新] 已从最新楼层刷新界面数据');
      }
    }
  } catch (error) {
    console.error('[数据刷新] 刷新失败:', error);
  }
}

/**
 * 注册消息事件监听，当 AI 生成或更新消息时自动刷新数据
 * 在 App.vue 的 onMounted 中调用
 */
export function setupMessageListeners(store: ReturnType<typeof useDataStore>) {
  // AI 生成新消息完成时刷新
  const subReceived = eventOn(tavern_events.MESSAGE_RECEIVED, () => {
    refreshDataFromLatest(store);
  });

  // 消息被更新时刷新 (包括重新生成、编辑等)
  const subUpdated = eventOn(tavern_events.MESSAGE_UPDATED, () => {
    refreshDataFromLatest(store);
  });

  // 返回清理函数
  return () => {
    subReceived.stop();
    subUpdated.stop();
  };
}

/**
 * 将所有角色的关键数据同步到最新楼层
 * 解决问题：前端界面修改的变量只存在于界面所在楼层，AI 生成新楼层时不会继承
 * 调用时机：购买物品、使用物品、丢弃物品等任何修改数据的操作后
 */
export async function syncAllDataToLatest(store: ReturnType<typeof useDataStore>) {
  try {
    // 获取最新楼层的变量
    const latestData = Mvu.getMvuData({ type: 'message', message_id: 'latest' });

    // ========== 同步世界信息 ==========
    _.set(latestData, 'stat_data.世界', klona(store.data.世界));

    // ========== 同步林海数据 ==========
    _.set(latestData, 'stat_data.林海.色孽点', store.data.林海.色孽点);
    _.set(latestData, 'stat_data.林海.背包', klona(store.data.林海.背包));
    _.set(latestData, 'stat_data.林海.手机功能', klona(store.data.林海.手机功能));
    _.set(latestData, 'stat_data.林海.解锁商品', klona(store.data.林海.解锁商品));

    // ========== 同步鹿忻数据 ==========
    _.set(latestData, 'stat_data.鹿忻.体力', store.data.鹿忻.体力);
    _.set(latestData, 'stat_data.鹿忻.好感度', store.data.鹿忻.好感度);
    _.set(latestData, 'stat_data.鹿忻.敏感度', klona(store.data.鹿忻.敏感度));
    _.set(latestData, 'stat_data.鹿忻.实时状态', klona(store.data.鹿忻.实时状态));
    _.set(latestData, 'stat_data.鹿忻.催眠状态', klona(store.data.鹿忻.催眠状态));
    _.set(latestData, 'stat_data.鹿忻.身体柔韧化', klona(store.data.鹿忻.身体柔韧化));
    _.set(latestData, 'stat_data.鹿忻.植入物', klona(store.data.鹿忻.植入物));
    _.set(latestData, 'stat_data.鹿忻.身体容纳', klona(store.data.鹿忻.身体容纳));
    _.set(latestData, 'stat_data.鹿忻.深层生理', klona(store.data.鹿忻.深层生理));

    // ========== 同步鹿晴数据 ==========
    _.set(latestData, 'stat_data.鹿晴.体力', store.data.鹿晴.体力);
    _.set(latestData, 'stat_data.鹿晴.好感度', store.data.鹿晴.好感度);
    _.set(latestData, 'stat_data.鹿晴.敏感度', klona(store.data.鹿晴.敏感度));
    _.set(latestData, 'stat_data.鹿晴.实时状态', klona(store.data.鹿晴.实时状态));
    _.set(latestData, 'stat_data.鹿晴.催眠状态', klona(store.data.鹿晴.催眠状态));
    _.set(latestData, 'stat_data.鹿晴.身体柔韧化', klona(store.data.鹿晴.身体柔韧化));
    _.set(latestData, 'stat_data.鹿晴.植入物', klona(store.data.鹿晴.植入物));
    _.set(latestData, 'stat_data.鹿晴.身体容纳', klona(store.data.鹿晴.身体容纳));
    _.set(latestData, 'stat_data.鹿晴.深层生理', klona(store.data.鹿晴.深层生理));

    // ========== 同步戎华数据 ==========
    _.set(latestData, 'stat_data.戎华.体力', store.data.戎华.体力);
    _.set(latestData, 'stat_data.戎华.好感度', store.data.戎华.好感度);
    _.set(latestData, 'stat_data.戎华.星怒值', store.data.戎华.星怒值);
    _.set(latestData, 'stat_data.戎华.敏感度', klona(store.data.戎华.敏感度));
    _.set(latestData, 'stat_data.戎华.实时状态', klona(store.data.戎华.实时状态));
    _.set(latestData, 'stat_data.戎华.催眠状态', klona(store.data.戎华.催眠状态));
    _.set(latestData, 'stat_data.戎华.身体柔韧化', klona(store.data.戎华.身体柔韧化));
    _.set(latestData, 'stat_data.戎华.植入物', klona(store.data.戎华.植入物));
    _.set(latestData, 'stat_data.戎华.身体容纳', klona(store.data.戎华.身体容纳));
    _.set(latestData, 'stat_data.戎华.深层生理', klona(store.data.戎华.深层生理));

    // ========== 同步林曦数据 (机器人) ==========
    _.set(latestData, 'stat_data.林曦.体力', store.data.林曦.体力);
    _.set(latestData, 'stat_data.林曦.好感度', store.data.林曦.好感度);
    _.set(latestData, 'stat_data.林曦.电量', store.data.林曦.电量);
    _.set(latestData, 'stat_data.林曦.敏感度', klona(store.data.林曦.敏感度));
    _.set(latestData, 'stat_data.林曦.身体柔韧化', klona(store.data.林曦.身体柔韧化));
    _.set(latestData, 'stat_data.林曦.植入物', klona(store.data.林曦.植入物));
    _.set(latestData, 'stat_data.林曦.程序催眠', klona(store.data.林曦.程序催眠));
    _.set(latestData, 'stat_data.林曦.身体容纳', klona(store.data.林曦.身体容纳));
    _.set(latestData, 'stat_data.林曦.深层状态', klona(store.data.林曦.深层状态));

    // 写入最新楼层
    await Mvu.replaceMvuData(latestData, { type: 'message', message_id: 'latest' });

    console.log('[变量同步] 已同步所有角色数据到最新楼层');
  } catch (error) {
    console.error('[变量同步] 同步失败:', error);
  }
}

// 保留旧函数名的别名，兼容已有代码
export const syncLinHaiDataToLatest = syncAllDataToLatest;
