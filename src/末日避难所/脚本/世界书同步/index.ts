/**
 * 世界书实时同步脚本
 * 从本地开发服务器加载 JSON 文件导入世界书到酒馆
 */

const WORLDBOOK_NAME = '末日避难所';
const WORLDBOOK_URL = 'http://localhost:5500/src/末日避难所/世界书/末日避难所.json';

async function importWorldbook() {
  try {
    console.info(`[世界书同步] 正在导入世界书: ${WORLDBOOK_NAME}...`);

    // 从本地服务器加载世界书 JSON
    const response = await fetch(WORLDBOOK_URL);
    if (!response.ok) {
      throw new Error(`加载世界书失败: ${response.status} ${response.statusText}`);
    }

    const worldbookData = await response.json();
    const entryCount = Object.keys(worldbookData.entries || {}).length;

    // 获取 SillyTavern 上下文
    // 脚本在 iframe 中运行，需要通过 window.parent 访问主页面的 SillyTavern
    // SillyTavern 对象只有 libs 和 getContext 两个属性，所有方法都在 getContext() 返回的对象上
    const ctx = (window.parent as any).SillyTavern.getContext();

    // 使用 SillyTavern 的 saveWorldInfo API 保存世界书
    // 保存世界书（immediately=true 立即保存）
    await ctx.saveWorldInfo(WORLDBOOK_NAME, worldbookData, true);

    // 刷新世界书列表
    await ctx.updateWorldInfoList();

    console.info(`[世界书同步] 世界书已同步，共 ${entryCount} 个条目`);
    toastr.success(`世界书 "${WORLDBOOK_NAME}" 已同步 (${entryCount} 条目)`, '世界书同步');

    return true;
  } catch (error) {
    console.error(`[世界书同步] 同步失败:`, error);
    toastr.error(`同步失败: ${error instanceof Error ? error.message : error}`, '世界书同步');
    return false;
  }
}

// 注册按钮事件：手动同步世界书
eventOn(getButtonEvent('同步世界书'), async () => {
  await importWorldbook();
});

$(() => {
  console.info(`[世界书同步] 脚本已加载`);

  // 初始同步
  importWorldbook();
});
