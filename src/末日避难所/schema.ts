// 末日避难所管理类角色卡 - MVU 变量结构定义

// ===== 一、世界环境层 =====
const 灾难类型枚举 = z.enum(['核战', '丧尸潮', '极寒', '伪人入侵', '病毒爆发', '机器暴动', '外星入侵', '超自然灾变']);
const 时间线节点枚举 = z.enum([
  '爆发前的一周',
  '爆发前的五分钟',
  '爆发后的一年',
  '爆发的十年后',
  '爆发的一百年后',
  '爆发的两百年后',
]);

const 世界环境层 = z.object({
  当前日期: z.string().prefault('2077年10月23日'),
  当前时间: z.string().prefault('08:00'),
  灾难本质: 灾难类型枚举.prefault('核战'),
  世界现状: z.string().prefault('高辐射环境，地表废土化'),
  时间线节点: 时间线节点枚举.prefault('爆发后的一年'),
});

// ===== 二、避难所状态层 =====
const 资源状态 = z.object({
  当前值: z.coerce
    .number()
    .transform(v => Math.max(0, v))
    .prefault(50),
  上限: z.coerce
    .number()
    .transform(v => Math.max(1, v))
    .prefault(100),
});

const 基础生存资源 = z.object({
  电力: 资源状态.prefault({ 当前值: 50, 上限: 100 }),
  水源: 资源状态.prefault({ 当前值: 50, 上限: 100 }),
  食物: 资源状态.prefault({ 当前值: 50, 上限: 100 }),
  人口: 资源状态.prefault({ 当前值: 30, 上限: 100 }),
});

const 环境指标 = z.object({
  科技等级: z.string().prefault('工业时代'),
  卫生度: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(60),
  精神健康度: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(50),
});

// 社会制度滑块 (0-100, 50为中间值)
const 社会制度 = z.object({
  分配方法: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(50), // 0=公平, 100=效率
  信息管控: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(50), // 0=言论自由, 100=统一思想
  社会伦理: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(50), // 0=人性, 100=生存
  治安手段: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(50), // 0=重教化, 100=重刑罚
});

const 宏观属性 = z.object({
  统治力: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(50),
  防御等级: z.coerce
    .number()
    .transform(v => Math.max(0, v))
    .prefault(10),
  隐蔽度: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(50),
  隐藏目的: z.string().prefault('无'),
  秘密实验进度: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(0),
});

const 避难所状态层 = z.object({
  避难所名称: z.string().prefault('Vault-101'),
  基础生存资源: 基础生存资源.prefault({
    电力: { 当前值: 50, 上限: 100 },
    水源: { 当前值: 50, 上限: 100 },
    食物: { 当前值: 50, 上限: 100 },
    人口: { 当前值: 30, 上限: 100 },
  }),
  环境指标: 环境指标.prefault({
    科技等级: '工业时代',
    卫生度: 60,
    精神健康度: 50,
  }),
  社会制度: 社会制度.prefault({
    分配方法: 50,
    信息管控: 50,
    社会伦理: 50,
    治安手段: 50,
  }),
  宏观属性: 宏观属性.prefault({
    统治力: 50,
    防御等级: 10,
    隐蔽度: 50,
    隐藏目的: '无',
    秘密实验进度: 0,
  }),
});

// ===== 三、社会关系与派系 =====
const 派系信息 = z.object({
  宗旨: z.string().prefault('待定'),
  好感度: z.coerce
    .number()
    .transform(v => _.clamp(v, -100, 100))
    .prefault(0),
  观感: z.string().prefault('中立'),
  领导人: z.string().prefault('未知'),
  人数占比: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(10),
});

const 社会关系与派系 = z.record(
  z.string().describe('派系名称'),
  派系信息.prefault({
    宗旨: '待定',
    好感度: 0,
    观感: '中立',
    领导人: '未知',
    人数占比: 10,
  }),
);

// ===== 四、设施与库存 =====
const 设施信息 = z.object({
  等级: z.coerce
    .number()
    .transform(v => Math.max(1, v))
    .prefault(1),
  效果: z.string().prefault('基础功能'),
  说明: z.string().prefault(''),
  状态: z.enum(['正常', '损坏', '升级中', '停用']).prefault('正常'),
});

const 物品信息 = z.object({
  类型: z.enum(['武器', '防具', '饰品', '消耗品', '材料', '杂项']).prefault('杂项'),
  效果: z.string().prefault(''),
  说明: z.string().prefault(''),
  数量: z.coerce
    .number()
    .transform(v => Math.max(0, v))
    .prefault(1),
});

const 设施与库存 = z.object({
  设施区域: z
    .record(
      z.string().describe('设施名称'),
      设施信息.prefault({
        等级: 1,
        效果: '基础功能',
        说明: '',
        状态: '正常',
      }),
    )
    .prefault({}),
  仓库系统: z
    .record(
      z.string().describe('物品名称'),
      物品信息.prefault({
        类型: '杂项',
        效果: '',
        说明: '',
        数量: 1,
      }),
    )
    .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
    .prefault({}),
});

// ===== 五、监督者系统 =====
const SPECIAL属性 = z.object({
  威慑力: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 10))
    .prefault(5), // S
  洞察力: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 10))
    .prefault(5), // P
  抗压值: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 10))
    .prefault(5), // E
  统御力: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 10))
    .prefault(5), // C
  科研力: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 10))
    .prefault(5), // I
  反应力: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 10))
    .prefault(5), // A
  气运: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 10))
    .prefault(5), // L
});

const 特质信息 = z.object({
  效果: z.string().prefault(''),
});

const 监督者系统 = z.object({
  姓名: z.string().prefault('{{user}}'),
  当前位置: z.string().prefault('监督者办公室'),
  行动点数: z.coerce
    .number()
    .transform(v => Math.max(0, v))
    .prefault(3),
  行动点数上限: z.coerce
    .number()
    .transform(v => Math.max(1, v))
    .prefault(3),
  SPECIAL: SPECIAL属性.prefault({
    威慑力: 5,
    洞察力: 5,
    抗压值: 5,
    统御力: 5,
    科研力: 5,
    反应力: 5,
    气运: 5,
  }),
  特质: z.record(z.string().describe('特质名称'), 特质信息.prefault({ 效果: '' })).prefault({}),
});

// ===== 六、追随者系统 =====
const 装备栏 = z.object({
  武器位: z.string().prefault('空'),
  防具位: z.string().prefault('空'),
  饰品工具位: z.string().prefault('空'),
});

const 追随者信息 = z.object({
  姓名: z.string().prefault('未命名'),
  年龄: z.coerce
    .number()
    .transform(v => Math.max(0, v))
    .prefault(25),
  性别: z.enum(['男', '女', '其他']).prefault('男'),
  // 核心数值
  武力: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 100))
    .prefault(10),
  管理: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 100))
    .prefault(10),
  探索生存: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 100))
    .prefault(10),
  // 生存状态
  生命值: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(100),
  防护等级: z.coerce
    .number()
    .transform(v => Math.max(0, v))
    .prefault(0),
  状态: z.enum(['健康', '生病', '崩溃', '死亡']).prefault('健康'),
  忠诚度: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .prefault(50),
  // 装备栏
  装备栏: 装备栏.prefault({
    武器位: '空',
    防具位: '空',
    饰品工具位: '空',
  }),
  // 特质
  特质: z.record(z.string().describe('特质名称'), 特质信息.prefault({ 效果: '' })).prefault({}),
  // 描述
  描述: z.string().prefault(''),
});

const 追随者系统 = z.record(
  z.string().describe('追随者ID'),
  追随者信息.prefault({
    姓名: '未命名',
    年龄: 25,
    性别: '男',
    武力: 10,
    管理: 10,
    探索生存: 10,
    生命值: 100,
    防护等级: 0,
    状态: '健康',
    忠诚度: 50,
    装备栏: { 武器位: '空', 防具位: '空', 饰品工具位: '空' },
    特质: {},
    描述: '',
  }),
);

// ===== 综合 Schema (基础版本，用于 store) =====
export const Schema = z.object({
  世界: 世界环境层.prefault({
    当前日期: '2077年10月23日',
    当前时间: '08:00',
    灾难本质: '核战',
    世界现状: '高辐射环境，地表废土化',
    时间线节点: '爆发后的一年',
  }),
  避难所: 避难所状态层.prefault({
    避难所名称: 'Vault-101',
    基础生存资源: {
      电力: { 当前值: 50, 上限: 100 },
      水源: { 当前值: 50, 上限: 100 },
      食物: { 当前值: 50, 上限: 100 },
      人口: { 当前值: 30, 上限: 100 },
    },
    环境指标: { 科技等级: '工业时代', 卫生度: 60, 精神健康度: 50 },
    社会制度: { 分配方法: 50, 信息管控: 50, 社会伦理: 50, 治安手段: 50 },
    宏观属性: { 统治力: 50, 防御等级: 10, 隐蔽度: 50, 隐藏目的: '无', 秘密实验进度: 0 },
  }),
  派系: 社会关系与派系.prefault({}),
  设施与库存: 设施与库存.prefault({
    设施区域: {},
    仓库系统: {},
  }),
  监督者: 监督者系统.prefault({
    姓名: '{{user}}',
    当前位置: '监督者办公室',
    行动点数: 3,
    行动点数上限: 3,
    SPECIAL: { 威慑力: 5, 洞察力: 5, 抗压值: 5, 统御力: 5, 科研力: 5, 反应力: 5, 气运: 5 },
    特质: {},
  }),
  追随者: 追随者系统.prefault({}),
  // 派生属性 (由 transform 计算，但为了兼容 store 直接放在这里)
  $社会Buff: z.array(z.string()).prefault([]),
  $资源警告: z.array(z.string()).prefault([]),
  $气运加成: z.coerce.number().prefault(0),
});

export type Schema = z.output<typeof Schema>;

// ===== 辅助函数：计算派生属性 =====
export function computeDerivedProperties(data: Schema): Schema {
  const 避难所 = data.避难所;

  // 根据信息管控极端值触发 Buff
  const $社会Buff: string[] = [];
  if (避难所.社会制度.信息管控 >= 95) {
    $社会Buff.push('蜂巢思维');
  }
  if (避难所.社会制度.社会伦理 >= 95) {
    $社会Buff.push('冷酷生存');
  }
  if (避难所.社会制度.社会伦理 <= 5) {
    $社会Buff.push('理想主义');
  }
  if (避难所.社会制度.治安手段 >= 95) {
    $社会Buff.push('铁腕统治');
  }

  // 计算资源紧缺警告
  const $资源警告: string[] = [];
  const 资源 = 避难所.基础生存资源;
  if (资源.电力.当前值 / 资源.电力.上限 < 0.2) $资源警告.push('电力紧缺');
  if (资源.水源.当前值 / 资源.水源.上限 < 0.2) $资源警告.push('水源紧缺');
  if (资源.食物.当前值 / 资源.食物.上限 < 0.2) $资源警告.push('食物紧缺');

  // 计算L属性加成
  const $气运加成 = Math.floor(data.监督者.SPECIAL.气运 * 0.33);

  return {
    ...data,
    $社会Buff,
    $资源警告,
    $气运加成,
  };
}
