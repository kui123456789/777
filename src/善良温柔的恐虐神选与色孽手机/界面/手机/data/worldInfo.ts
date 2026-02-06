/**
 * 世界信息数据模块
 * 基于世界书 index.yaml 提取的场景、角色、世界观数据
 */

// ==================== 接口定义 ====================

/** 场景定义 */
export interface WorldScene {
  id: string;
  name: string;
  icon: string;
  keywords: string[];
  description: string;
  triggerKeyword: string; // 用于触发场景的关键字
}

/** 角色定义 */
export interface WorldCharacter {
  id: string;
  name: string;
  icon: string;
  gender: '男' | '女';
  identity: string;
  type: 'main' | 'npc';
  traits?: string[];
  relationship?: string;
}

/** 世界观设定条目 */
export interface WorldSetting {
  id: string;
  title: string;
  icon: string;
  category: 'background' | 'technology' | 'supernatural' | 'item';
  content: string[];
}

// ==================== 场景数据 ====================

export const worldScenes: WorldScene[] = [
  {
    id: 'classroom',
    name: '高二教室',
    icon: '📚',
    keywords: ['教室', '高二', '高二三班'],
    description: '林海所在的高二教室，戎华坐在前桌',
    triggerKeyword: '教室场景触发',
  },
  {
    id: 'library',
    name: '学校图书馆',
    icon: '📖',
    keywords: ['图书馆'],
    description: '学校图书馆，午休时段较为安静',
    triggerKeyword: '图书馆场景触发',
  },
  {
    id: 'dressing_room',
    name: '商场更衣室',
    icon: '👗',
    keywords: ['更衣室', '试衣间', '服装店'],
    description: '商场内的更衣室，空间狭小私密',
    triggerKeyword: '更衣室场景触发',
  },
  {
    id: 'linhai_home',
    name: '林海家',
    icon: '🏠',
    keywords: ['林海家', '家'],
    description: '林海的住所',
    triggerKeyword: '林海家场景触发',
  },
];

// ==================== 角色数据 ====================

export const worldCharacters: WorldCharacter[] = [
  // 主要角色
  {
    id: 'linhai',
    name: '林海',
    icon: '🧑',
    gender: '男',
    identity: '高中生 / 体育委员',
    type: 'main',
    traits: ['西伯纽斯手机持有者'],
  },
  {
    id: 'luxin',
    name: '鹿忻',
    icon: '👩',
    gender: '女',
    identity: '高中生',
    type: 'main',
    relationship: '林海青梅竹马 / 鹿晴的双胞胎姐姐',
    traits: ['身高170cm'],
  },
  {
    id: 'luqing',
    name: '鹿晴',
    icon: '👩',
    gender: '女',
    identity: '高中生',
    type: 'main',
    relationship: '林海青梅竹马 / 鹿忻的双胞胎妹妹',
    traits: ['身高170cm', '寡言'],
  },
  {
    id: 'ronghua',
    name: '戎华',
    icon: '👩',
    gender: '女',
    identity: '高中生',
    type: 'main',
    relationship: '林海前桌',
    traits: ['身高177cm', '黑色长发'],
  },
  {
    id: 'linxi',
    name: '林曦',
    icon: '🤖',
    gender: '女',
    identity: '机器人',
    type: 'main',
    traits: ['西伯纽斯定制型', '白发', '红色义眼', '机械结构'],
  },
  // NPC
  {
    id: 'monitor',
    name: '班长',
    icon: '👤',
    gender: '女',
    identity: '学生',
    type: 'npc',
  },
  {
    id: 'security',
    name: '保安',
    icon: '👮',
    gender: '男',
    identity: '学校门卫',
    type: 'npc',
  },
  {
    id: 'courier',
    name: '快递员',
    icon: '📦',
    gender: '男',
    identity: '快递员',
    type: 'npc',
  },
  {
    id: 'clerk',
    name: '服装店员',
    icon: '🛍️',
    gender: '女',
    identity: '商场店员',
    type: 'npc',
  },
];

// ==================== 世界观设定 ====================

export const worldSettings: WorldSetting[] = [
  {
    id: 'background',
    title: '世界背景',
    icon: '🌍',
    category: 'background',
    content: [
      '时代：现代都市',
      '地点：学校、城市',
      '社会：政府、学校、公共交通等现代设施',
      '机器人作为商品流通于市面',
      '存在西伯纽斯科技公司',
    ],
  },
  {
    id: 'phone',
    title: '西伯纽斯手机',
    icon: '📱',
    category: 'item',
    content: [
      '催眠APP：锁定单人修改认知',
      '身体柔韧化：关节可任意弯曲',
      '远程操控：隔空物理触碰',
      '透视功能：穿透衣物和墙壁',
      '敏感度调节：可调节痛觉与快感',
    ],
  },
  {
    id: 'robot',
    title: '机器人技术',
    icon: '🤖',
    category: 'technology',
    content: [
      '型号：西伯纽斯定制版',
      '具备仿生皮肤、体温与脉搏',
      '内部金属骨架与仿生肌肉',
      '四肢可拆卸',
      '运行模拟人格，核心指令服从持有者',
    ],
  },
  {
    id: 'supernatural',
    title: '超自然体系',
    icon: '✨',
    category: 'supernatural',
    content: [
      '亚空间实体：色孽',
      '能量来源：生物的欲望与情绪',
      '侵蚀现象：接触者对禁忌接受度提高',
      '存在名为"审判庭"的对抗组织',
    ],
  },
];

// ==================== 地点映射 ====================

/** 地点图标映射（用于当前地点显示） */
export const locationIcons: Record<string, string> = {
  学校: '🏫',
  教室: '📚',
  操场: '🏃',
  图书馆: '📖',
  食堂: '🍜',
  宿舍: '🛏️',
  家: '🏠',
  林海家: '🏠',
  街道: '🛣️',
  公园: '🌳',
  商场: '🛍️',
  更衣室: '👗',
  医院: '🏥',
};

/** 时间段图标映射 */
export const timeIcons: Record<string, string> = {
  清晨: '🌅',
  早上: '☀️',
  上午: '🌤️',
  中午: '🌞',
  下午: '⛅',
  傍晚: '🌇',
  晚上: '🌙',
  深夜: '🌌',
  凌晨: '🌃',
};

/** 日期图标映射 */
export const dateIcons: Record<string, string> = {
  周一: '1️⃣',
  周二: '2️⃣',
  周三: '3️⃣',
  周四: '4️⃣',
  周五: '5️⃣',
  周六: '6️⃣',
  周日: '7️⃣',
};

// ==================== 辅助函数 ====================

/**
 * 格式化时间字符串
 * 将可能的数字时间格式（如 "10:15"、"10:1500:10"）转换为时间段文字
 */
export function formatTime(time: string): string {
  // 如果已经是有效的时间段文字，直接返回
  const validPeriods = ['清晨', '早上', '上午', '中午', '下午', '傍晚', '晚上', '深夜', '凌晨'];
  for (const period of validPeriods) {
    if (time.includes(period)) return time;
  }

  // 尝试从数字格式提取小时
  // 匹配格式: "10:15", "10:1500:10", "22:30" 等
  const hourMatch = time.match(/^(\d{1,2})/);
  if (hourMatch) {
    const hour = parseInt(hourMatch[1], 10);

    if (hour >= 0 && hour < 5) return '凌晨';
    if (hour >= 5 && hour < 7) return '清晨';
    if (hour >= 7 && hour < 9) return '早上';
    if (hour >= 9 && hour < 11) return '上午';
    if (hour >= 11 && hour < 13) return '中午';
    if (hour >= 13 && hour < 17) return '下午';
    if (hour >= 17 && hour < 19) return '傍晚';
    if (hour >= 19 && hour < 23) return '晚上';
    if (hour >= 23) return '深夜';
  }

  // 无法解析，返回默认值
  return '中午';
}

/** 获取时间图标 */
export function getTimeIcon(time: string): string {
  const formattedTime = formatTime(time);
  for (const [key, icon] of Object.entries(timeIcons)) {
    if (formattedTime.includes(key)) return icon;
  }
  return '⏰';
}

/** 获取地点图标 */
export function getLocationIcon(location: string): string {
  for (const [key, icon] of Object.entries(locationIcons)) {
    if (location.includes(key)) return icon;
  }
  return '📍';
}

/** 获取日期图标 */
export function getDateIcon(date: string): string {
  for (const [key, icon] of Object.entries(dateIcons)) {
    if (date.includes(key)) return icon;
  }
  return '📅';
}

/** 根据时间段获取背景渐变 */
export function getTimeGradient(time: string): string {
  const formattedTime = formatTime(time);
  if (formattedTime.includes('清晨') || formattedTime.includes('早上')) {
    return 'from-orange-900/30 to-yellow-900/20';
  }
  if (formattedTime.includes('中午') || formattedTime.includes('下午')) {
    return 'from-blue-900/30 to-cyan-900/20';
  }
  if (formattedTime.includes('傍晚')) {
    return 'from-orange-900/30 to-purple-900/20';
  }
  if (formattedTime.includes('晚上') || formattedTime.includes('深夜') || formattedTime.includes('凌晨')) {
    return 'from-indigo-900/30 to-purple-900/20';
  }
  return 'from-blue-900/30 to-cyan-900/20';
}

/** 检查当前地点是否匹配场景 */
export function isSceneActive(scene: WorldScene, currentLocation: string): boolean {
  return scene.keywords.some(keyword => currentLocation.includes(keyword));
}
