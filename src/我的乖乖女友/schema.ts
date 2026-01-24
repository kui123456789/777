export const Schema = z.object({
  // --- 世界环境 ---
  世界: z
    .object({
      当前日期: z.string().prefault('2020年9月1日'),
      当前时间: z.string().prefault('18:30'),
      当前地点: z.string().prefault('巷口'),
      天气: z.string().prefault('晴'),
    })
    .prefault({
      当前日期: '2020年9月1日',
      当前时间: '18:30',
      当前地点: '巷口',
      天气: '晴',
    }),

  // --- 姜林的核心数据 ---
  姜林: z
    .object({
      // 关系状态（用于分阶段控制器）
      好感度: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(0),
      关系状态: z.enum(['陌生人', '朋友', '暧昧', '恋人', '从属']).prefault('陌生人'),

      // 基础状态
      基础状态: z.object({
        心情: z.string().prefault('紧张'),
        当前状态: z.string().prefault('正常'),
        体力: z.coerce
          .number()
          .transform(v => _.clamp(v, 0, 100))
          .prefault(60),
      }),

      // 经济系统（精确到角）
      财务: z.object({
        现金: z.coerce
          .number()
          .transform(v => parseFloat(v.toFixed(1))) // 强制保留1位小数
          .prefault(128.5),
        欠债: z.coerce.number().prefault(0), // 欠User的钱
        打工收入: z.coerce.number().prefault(0), // 累计打工赚的钱
      }),

      // 身体数据（随营养变化的可能性）
      身体: z.object({
        腿长: z.string().prefault('98cm'),
        大腿围: z.string().prefault('36cm'),
        私密部位: z.object({
          胸部: z.string().prefault('隆起幅度小，乳晕淡粉'),
          下体: z.string().prefault('毛发稀疏，大阴唇闭合'),
        }),
      }),

      // 物品系统
      背包: z
        .record(
          z.string().describe('物品名称'),
          z.object({
            描述: z.string().prefault('无描述'),
            数量: z.coerce.number().prefault(1),
          }),
        )
        // 自动过滤掉数量小于等于0的物品
        .transform(data => _.pickBy(data, item => item.数量 > 0)),
    })
    .prefault({
      好感度: 0,
      关系状态: '陌生人',
      基础状态: {
        心情: '紧张',
        当前状态: '正常',
        体力: 60,
      },
      财务: {
        现金: 128.5,
        欠债: 0,
        打工收入: 0,
      },
      身体: {
        腿长: '98cm',
        大腿围: '36cm',
        私密部位: {
          胸部: '隆起幅度小，乳晕淡粉',
          下体: '毛发稀疏，大阴唇闭合',
        },
      },
      背包: {},
    }),

  // --- 沈婉清的核心数据（霸凌者/校花）---
  沈婉清状态: z
    .object({
      屈从度: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(0),
      好感度: z.coerce
        .number()
        .transform(v => _.clamp(v, -100, 100))
        .prefault(-50),
      心情: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(60),
      关系: z.enum(['同学', '敌人', '奴隶', '玩物']).prefault('同学'),
      当前状态: z.string().prefault('傲慢'),
      是否处女: z.boolean().prefault(true),
      是否怀孕: z.boolean().prefault(false),
      存款: z.coerce.number().prefault(50000),
    })
    .prefault({}),

  沈婉清身体: z
    .object({
      胸部: z
        .object({
          描述: z.string().prefault('挺拔B罩杯'),
          状态: z.string().prefault('未开发'),
          特征: z.string().prefault('粉嫩/柔软'),
          敏感度: z.coerce.number().prefault(0),
        })
        .prefault({}),
      下体: z
        .object({
          描述: z.string().prefault('白虎无毛'),
          状态: z.string().prefault('处女/紧致'),
          特征: z.string().prefault('粉嫩/一线天'),
          敏感度: z.coerce.number().prefault(0),
          内射量: z.coerce.number().prefault(0),
        })
        .prefault({}),
      臀部: z
        .object({
          描述: z.string().prefault('圆润挺翘'),
          状态: z.string().prefault('未开发'),
          特征: z.string().prefault('无痕/白皙'),
          敏感度: z.coerce.number().prefault(0),
        })
        .prefault({}),
      口腔: z
        .object({
          描述: z.string().prefault('湿润红唇'),
          状态: z.string().prefault('未开发'),
          敏感度: z.coerce.number().prefault(0),
        })
        .prefault({}),
    })
    .prefault({}),

  沈婉清背包: z
    .record(
      z.string().describe('物品名称'),
      z.object({
        描述: z.string().prefault('无描述'),
        数量: z.coerce.number().prefault(1),
      }),
    )
    .prefault({
      限量款iPhone: { 描述: '最新款的粉色iPhone，贴着水钻', 数量: 1 },
      香奈儿口红: { 描述: '色号43，只用了一点点', 数量: 1 },
      父亲的附属黑卡: { 描述: '额度很高的信用卡', 数量: 1 },
      补妆镜: { 描述: '精致的小镜子', 数量: 1 },
    }),

  // --- 林小雨的核心数据 ---
  林小雨状态: z
    .object({
      兄控度: z.coerce.number().prefault(15),
      心情: z.coerce.number().prefault(80),
      当前状态: z.string().prefault('娇纵'),
      是否处女: z.boolean().prefault(true),
      零花钱: z.coerce.number().prefault(200),
    })
    .prefault({}),

  林小雨身体: z
    .object({
      胸部: z
        .object({
          描述: z.string().prefault('微微隆起A罩杯'),
          状态: z.string().prefault('发育初期'),
          特征: z.string().prefault('小巧/稚嫩'),
          敏感度: z.coerce.number().prefault(10),
        })
        .prefault({}),
      下体: z
        .object({
          描述: z.string().prefault('光洁无毛'),
          状态: z.string().prefault('处女/极紧'),
          特征: z.string().prefault('稚嫩/闭合'),
          敏感度: z.coerce.number().prefault(10),
        })
        .prefault({}),
      臀部: z
        .object({
          描述: z.string().prefault('单薄紧实'),
          状态: z.string().prefault('未开发'),
          特征: z.string().prefault('骨感/缺乏弹性'),
          敏感度: z.coerce.number().prefault(5),
        })
        .prefault({}),
    })
    .prefault({}),

  林小雨背包: z
    .record(
      z.string().describe('物品名称'),
      z.object({
        描述: z.string().prefault('无描述'),
        数量: z.coerce.number().prefault(1),
      }),
    )
    .prefault({
      贴满贴纸的手机: { 描述: '屏幕有点裂痕的旧手机', 数量: 1 },
      半包薯片: { 描述: '番茄味的，吃了一半', 数量: 1 },
      你的备用钥匙: { 描述: '偷偷配的User家钥匙', 数量: 1 },
      没写完的作业本: { 描述: '上面画满了涂鸦', 数量: 1 },
    }),
});
export type Schema = z.output<typeof Schema>;
