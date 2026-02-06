import { z } from 'zod';
import _ from 'lodash';

// 着装结构 (使用 object 而非 record，确保每个字段有独立默认值)
const createClothing = (defaults: {
  上装: string;
  下装: string;
  内衣: string;
  内裤: string;
  袜子: string;
  鞋子: string;
  饰品: string;
}) =>
  z
    .object({
      上装: z.string().prefault(defaults.上装),
      下装: z.string().prefault(defaults.下装),
      内衣: z.string().prefault(defaults.内衣),
      内裤: z.string().prefault(defaults.内裤),
      袜子: z.string().prefault(defaults.袜子),
      鞋子: z.string().prefault(defaults.鞋子),
      饰品: z.string().prefault(defaults.饰品),
    })
    .prefault({});

// 人类当前状态枚举
const HumanStatus = z.enum(['正常', '高潮', '昏迷', '崩溃', '睡眠']);

// 鹿晴当前状态枚举 (无表情是她的常态)
const LuQingStatus = z.enum(['正常', '高潮', '昏迷', '无表情', '睡眠']);

// 戎华当前状态枚举 (有发情状态)
const RongHuaStatus = z.enum(['正常', '高潮', '昏迷', '发情', '睡眠']);

// 机器人人格状态枚举
const RobotPersonalityStatus = z.enum(['正常', '过载', '崩溃', '重启中']);

// 开发度结构 (人类角色 - 只读记录使用程度)
const DevelopmentLevel = z
  .object({
    阴道开发度: z.coerce.number().prefault(0).describe('0-100 不可调节，记录使用程度'),
    肛门开发度: z.coerce.number().prefault(0),
    乳孔开发度: z.coerce.number().prefault(0),
    喉穴开发度: z.coerce.number().prefault(0),
  })
  .prefault({});

// 实时状态 (高潮幅度、怀孕、死亡检测)
const RealtimeStatus = z
  .object({
    高潮幅度: z.coerce.number().prefault(0).describe('>100超量高潮, >1000生命危险, 9999=DEAD'),
    怀孕概率: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(0)
      .describe('0-100% 可调节'),
    是否死亡: z.boolean().prefault(false),
  })
  .prefault({});

// 身体柔韧化状态 (人类和机器人都可用)
const SoftBodyState = z
  .object({
    启用: z.boolean().prefault(false),
    关节柔韧度: z.coerce.number().prefault(0).describe('0-100'),
    软组织强韧度: z.coerce.number().prefault(0),
    回弹速度: z.coerce.number().prefault(100).describe('0-100 扩张后恢复原状速度'),
    痛感转化率: z.coerce.number().prefault(0).describe('0-100 痛苦转化为快感的程度'),
  })
  .prefault({});

// 体内植入物
const ImplantDevice = z.object({
  类型: z.enum(['跳弹', '乳塞', '肛塞', '其他']).prefault('跳弹'),
  位置: z.string().prefault(''),
  震动强度: z.coerce.number().prefault(0).describe('0-100'),
  形态变化: z.coerce.number().prefault(0).describe('0-100 尺寸/形状变化程度'),
  已激活: z.boolean().prefault(false),
});
const Implants = z.record(z.string().describe('植入物名称'), ImplantDevice).prefault({});

// 敏感度结构 (人类角色)
const HumanSensitivity = z
  .object({
    乳穴: z.coerce.number().prefault(0),
    阴道: z.coerce.number().prefault(0),
    子宫: z.coerce.number().prefault(0),
    直肠: z.coerce.number().prefault(0),
    喉咙: z.coerce.number().prefault(0),
  })
  .prefault({});

// 敏感度结构 (机器人角色)
const RobotSensitivity = z
  .object({
    乳穴: z.coerce.number().prefault(0),
    阴道: z.coerce.number().prefault(0),
    人造子宫: z.coerce.number().prefault(0),
    直肠: z.coerce.number().prefault(0),
    喉咙: z.coerce.number().prefault(0),
  })
  .prefault({});

// 高潮统计
const OrgasmStats = z
  .object({
    单次最高幅度: z.coerce.number().prefault(0),
    累计次数: z.coerce.number().prefault(0),
  })
  .prefault({});

// 身体容纳 (人类)
const HumanBodyCapacity = z
  .object({
    子宫精液量: z.coerce.number().prefault(0).describe('单位ml'),
    肠道精液量: z.coerce.number().prefault(0),
    乳腺精液量: z.coerce.number().prefault(0),
    腹部隆起: z.boolean().prefault(false),
    异物: z.record(z.string(), z.string()).prefault({}),
  })
  .prefault({});

// 身体容纳 (机器人)
const RobotBodyCapacity = z
  .object({
    人造子宫精液量: z.coerce.number().prefault(0),
    腹部隆起: z.boolean().prefault(false),
    异物: z.record(z.string(), z.string()).prefault({}),
  })
  .prefault({});

// 肢体状态 (机器人专用)
const LimbStatus = z
  .object({
    头: z.boolean().prefault(true),
    左臂: z.boolean().prefault(true),
    右臂: z.boolean().prefault(true),
    左腿: z.boolean().prefault(true),
    右腿: z.boolean().prefault(true),
  })
  .describe('true为安装，false为拆卸')
  .prefault({});

// 荷尔蒙水平 (人类深层生理)
const HormoneLevel = z
  .object({
    多巴胺: z.coerce.number().prefault(50).describe('0-100 快感/奖励'),
    内啡肽: z.coerce.number().prefault(50).describe('0-100 愉悦/止痛'),
    肾上腺素: z.coerce.number().prefault(30).describe('0-100 兴奋/应激'),
    催产素: z.coerce.number().prefault(40).describe('0-100 亲密/依恋'),
  })
  .prefault({});

// 深层生理数据 (人类角色专用 - X-RAY透视可见)
const DeepPhysiology = z
  .object({
    心跳: z.coerce.number().prefault(72).describe('BPM 正常60-100'),
    呼吸频率: z.coerce.number().prefault(16).describe('次/分 正常12-20'),
    体温: z.coerce.number().prefault(36.5),
    荷尔蒙: HormoneLevel,
    神经反应度: z.coerce.number().prefault(50).describe('0-100 整体神经敏感程度'),
    肌肉紧张度: z.coerce.number().prefault(30).describe('0-100'),
    瞳孔扩张: z.coerce.number().prefault(50).describe('0-100 情绪激动时扩张'),
  })
  .prefault({});

// 深层状态数据 (机器人角色专用 - X-RAY透视可见)
const DeepRobotStatus = z
  .object({
    CPU温度: z.coerce.number().prefault(45).describe('摄氏度'),
    内存占用: z.coerce.number().prefault(30).describe('百分比'),
    情感模拟强度: z.coerce.number().prefault(50).describe('0-100'),
    感知处理延迟: z.coerce.number().prefault(5).describe('毫秒'),
    自我意识指数: z.coerce.number().prefault(70).describe('0-100'),
    情感溢出风险: z.coerce.number().prefault(20).describe('0-100 情感模拟过载风险'),
  })
  .prefault({});

// 催眠暗示项 (单条植入的暗示)
const HypnosisSuggestion = z.object({
  内容: z.string(),
  强度: z.coerce.number().prefault(0).describe('0-100 暗示的根植深度'),
  触发词: z.string().optional(),
  激活状态: z.boolean().prefault(false),
});

// 催眠状态 (人类角色专用)
const HypnosisState = z
  .object({
    催眠深度: z.coerce.number().prefault(0).describe('0-100 当前催眠深度'),
    暗示接受度: z.coerce.number().prefault(50).describe('0-100 对暗示的接受程度'),
    抵抗力: z.coerce.number().prefault(100).describe('0-100 催眠抵抗'),
    意识模糊度: z.coerce.number().prefault(0).describe('0-100 意识清醒程度的反向'),
    植入暗示: z.record(z.string(), HypnosisSuggestion).prefault({}),
    累计催眠次数: z.coerce.number().prefault(0),
    上次催眠时间: z.string().nullable().prefault(null),
  })
  .prefault({});

// 机器人催眠状态 (N-2 林曦专用 - 程序层面的"催眠")
const RobotHypnosisState = z
  .object({
    指令覆盖深度: z.coerce.number().prefault(0).describe('0-100 核心指令被覆盖程度'),
    服从协议强度: z.coerce.number().prefault(50).describe('0-100 对用户指令的服从程度'),
    自主判断抑制: z.coerce.number().prefault(0).describe('0-100 自主判断能力被抑制程度'),
    植入指令: z.record(z.string(), HypnosisSuggestion).prefault({}),
    系统警告等级: z.coerce.number().prefault(0).describe('0-3 内部警告等级'),
  })
  .prefault({});

// 手机功能
const PhoneFunctions = z
  .object({
    透视开启: z.boolean().prefault(false),
    身体柔韧化开启: z.boolean().prefault(false),
    远程操控开启: z.boolean().prefault(false),
    催眠目标: z.string().nullable().prefault(null),
  })
  .prefault({});

// 背包物品
const InventoryItem = z.object({
  数量: z.coerce.number().prefault(1),
  描述: z.string().optional(),
});

// 世界信息
const WorldInfo = z
  .object({
    当前时间: z.string().prefault('中午'),
    日期: z.string().prefault('周一'),
    当前地点: z.string().prefault('学校'),
  })
  .prefault({});

// 商店商品结构 (支持动态扩展)
export const ShopItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  icon: z.string().prefault('📦'),
  category: z.enum(['特殊', '消耗品', '装备']).prefault('特殊'),
  stackable: z.boolean().optional().prefault(false),
  quantity: z.coerce.number().optional().prefault(1),
});

export type ShopItem = z.infer<typeof ShopItemSchema>;

// 林海 (主角) 状态
const LinHai = z
  .object({
    色孽点: z.coerce.number().prefault(0).describe('通过色情行为获得的货币'),
    手机功能: PhoneFunctions,
    背包: z.record(z.string().describe('物品名称'), InventoryItem).prefault({}),
    // 解锁的商品列表 (AI创造的新道具会添加到这里，可在商店购买)
    解锁商品: z.record(z.string().describe('商品ID'), ShopItemSchema).prefault({}),
  })
  .prefault({});

// 鹿忻角色
const LuXin = z
  .object({
    体力: z.coerce.number().prefault(100),
    好感度: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(50),
    当前状态: HumanStatus.prefault('正常'),
    敏感度: z
      .object({
        乳穴: z.coerce.number().prefault(0),
        阴道: z.coerce.number().prefault(0),
        子宫: z.coerce.number().prefault(190).describe('鹿忻特质：基础极高'),
        直肠: z.coerce.number().prefault(0),
        喉咙: z.coerce.number().prefault(0),
      })
      .prefault({}),
    开发度: DevelopmentLevel,
    实时状态: RealtimeStatus,
    身体柔韧化: SoftBodyState,
    植入物: Implants,
    高潮统计: OrgasmStats,
    身体容纳: HumanBodyCapacity,
    着装: createClothing({
      上装: '校服衬衫',
      下装: '百褶短裙',
      内衣: '白色棉质文胸',
      内裤: '纯白棉质三角内裤',
      袜子: '黑色中筒袜',
      鞋子: '制服皮鞋',
      饰品: '无',
    }),
    深层生理: DeepPhysiology,
    催眠状态: HypnosisState,
  })
  .prefault({});

// 鹿晴角色
const LuQing = z
  .object({
    体力: z.coerce.number().prefault(100),
    好感度: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(60),
    当前状态: LuQingStatus.prefault('无表情'),
    敏感度: HumanSensitivity,
    开发度: DevelopmentLevel,
    实时状态: RealtimeStatus,
    身体柔韧化: SoftBodyState,
    植入物: Implants,
    高潮统计: OrgasmStats,
    身体容纳: HumanBodyCapacity,
    着装: createClothing({
      上装: '校服衬衫',
      下装: '百褶短裙',
      内衣: '变形的白色文胸',
      内裤: '浅色棉质三角内裤',
      袜子: '黑色棉质中筒袜',
      鞋子: '黑色皮鞋',
      饰品: '无',
    }),
    深层生理: DeepPhysiology,
    催眠状态: HypnosisState,
  })
  .prefault({});

// 戎华角色 (增加星怒值)
const RongHua = z
  .object({
    体力: z.coerce.number().prefault(100),
    好感度: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(40),
    星怒值: z.coerce.number().prefault(0).describe('受虐与服从的程度'),
    当前状态: RongHuaStatus.prefault('正常'),
    敏感度: HumanSensitivity,
    开发度: DevelopmentLevel,
    实时状态: RealtimeStatus,
    身体柔韧化: SoftBodyState,
    植入物: Implants,
    高潮统计: OrgasmStats,
    身体容纳: HumanBodyCapacity,
    着装: createClothing({
      上装: '校服',
      下装: '长裙',
      内衣: '黑色运动内衣',
      内裤: '黑色内裤',
      袜子: '船袜',
      鞋子: '运动鞋',
      饰品: '无',
    }),
    深层生理: DeepPhysiology,
    催眠状态: HypnosisState,
  })
  .prefault({});

// 机器人角色 (林曦 N-2)
const LinXi = z
  .object({
    体力: z.coerce.number().prefault(100),
    好感度: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(0),
    当前状态: z.string().prefault('运行中'),
    电量: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(100),
    模拟人格状态: RobotPersonalityStatus.prefault('正常'),
    敏感度: RobotSensitivity,
    身体柔韧化: SoftBodyState,
    植入物: Implants,
    身体容纳: RobotBodyCapacity,
    着装: createClothing({
      上装: '宽松外套',
      下装: '红黑短裙',
      内衣: '无',
      内裤: '无',
      袜子: '无',
      鞋子: '运动鞋',
      饰品: '无',
    }),
    肢体状态: LimbStatus,
    深层状态: DeepRobotStatus,
    程序催眠: RobotHypnosisState,
  })
  .prefault({});

// 完整的 stat_data Schema (不使用顶层 prefault 以兼容 defineMvuDataStore)
export const Schema = z.object({
  世界: WorldInfo,
  林海: LinHai,
  鹿忻: LuXin,
  鹿晴: LuQing,
  戎华: RongHua,
  林曦: LinXi,
});

export type StatData = z.infer<typeof Schema>;
