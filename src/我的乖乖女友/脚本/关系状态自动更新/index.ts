/**
 * 关系状态自动更新脚本
 *
 * 当好感度变化时，自动根据好感度范围更新关系状态：
 * - 0-29: 陌生人
 * - 30-59: 朋友
 * - 60-79: 暧昧
 * - 80-99: 恋人
 * - 100: 从属（需要手动触发，此脚本不会自动设置）
 *
 * 此脚本会根据好感度自动调整关系状态，包括降级
 */

$(() => {
  console.info('[关系状态自动更新] 脚本已加载');

  // 监听变量更新结束事件
  waitGlobalInitialized('Mvu').then(() => {
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_variables, old_variables) => {
      const oldGoodwill = _.get(old_variables, 'stat_data.姜林.好感度') as number | undefined;
      const newGoodwill = _.get(new_variables, 'stat_data.姜林.好感度') as number | undefined;
      const currentRelation = _.get(new_variables, 'stat_data.姜林.关系状态') as string | undefined;

      // 如果好感度没有变化，不处理
      if (oldGoodwill === newGoodwill) return;

      console.info(`[关系状态自动更新] 好感度变化: ${oldGoodwill} → ${newGoodwill}`);

      // 如果是从属关系，不自动调整（这是最高级关系，需要剧情触发解除）
      if (currentRelation === '从属') {
        console.info(`[关系状态自动更新] 当前关系为"从属"，不自动调整`);
        return;
      }

      // 根据好感度自动调整关系状态
      if (newGoodwill !== undefined) {
        let newRelation: string;

        if (newGoodwill >= 80) {
          newRelation = '恋人';
        } else if (newGoodwill >= 60) {
          newRelation = '暧昧';
        } else if (newGoodwill >= 30) {
          newRelation = '朋友';
        } else {
          newRelation = '陌生人';
        }

        if (currentRelation !== newRelation) {
          console.info(`[关系状态自动更新] 关系状态变化: ${currentRelation} → ${newRelation}`);
          _.set(new_variables, 'stat_data.姜林.关系状态', newRelation);
        }
      }
    });

    console.info('[关系状态自动更新] MVU 事件监听已注册');
  });

  // 卸载时清理
  $(window).on('pagehide', () => {
    console.info('[关系状态自动更新] 脚本已卸载');
  });
});
