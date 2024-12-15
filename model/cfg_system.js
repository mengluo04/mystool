export const cfgSchema = {
  Sign: {
    title: "游戏签到设置",
    cfg: {
      AutoSign: {
        title: "签到福利自动签到",
        key: "自动签到",
        def: false,
        desc: "是否开启每日福利自动签到",
      },
      signTime: {
        title: "签到福利自动签到开始时间",
        key: "签到任务",
        type: "cron",
        def: "0 2 0 * * ?",
        desc: "可使用锅巴修改",
      },
      game: {
        title: "签到游戏设置",
        key: "签到游戏",
        type: "cron",
        def: ["gs", "sr", "zzz"],
        desc: "可使用锅巴修改",
      },
      retry: {
        title: "签到重试次数",
        key: "签到重试",
        type: "num",
        def: 2,
      },
    },
  },
  bbsSign: {
    title: "社区签到设置",
    cfg: {
      AutobbsSign: {
        title: "社区自动签到",
        key: "社区签到",
        def: false,
        desc: "是否开启社区每日自动签到",
      },
      bbsSignTime: {
        title: "社区自动签到开始时间",
        key: "社区任务",
        type: "cron",
        def: "0 2 0 * * ?",
        desc: "可使用锅巴修改",
      },
      bbsRetry: {
        title: "社区签到重试次数",
        key: "社区重试",
        type: "num",
        def: 2,
      },
    },
  },
  Note: {
    title: "体力查询·推送设置",
    cfg: {
      NoteTask: {
        title: "体力推送设置",
        key: "体力推送",
        def: false,
        desc: "体力推送仅使用小组件查询",
      },
      TaskTime: {
        title: "体力推送定时任务",
        key: "推送任务",
        type: "cron",
        def: "0 0/30 * * * ?",
        desc: "可使用锅巴修改",
      },
      sendCD: {
        title: "体力推送CD",
        key: "推送CD",
        type: "num",
        def: 12,
      },
      gs_Resin: {
        title: "原神推送默认阈值",
        key: "原神推送",
        type: "num",
        def: 140,
      },
      sr_Resin: {
        title: "星铁推送默认阈值",
        key: "星铁推送",
        type: "num",
        def: 200,
      },
      zzz_Resin: {
        title: "绝区零推送默认阈值",
        key: "绝区零推送",
        type: "num",
        def: 200,
      },
      forward: {
        title: "合并转发",
        key: "合并转发",
        type: "num",
        def: 2,
        desc: "查询体力时发送的文字消息+图片大于几条时合并转发",
      },
    },
  },
  other: {
    title: "其他设置",
    cfg: {
      retrytime: {
        title: "本体过码重试次数",
        key: "本体重试",
        type: "num",
        def: 2,
        desc: "需已使用#寄替换",
      },
      invalid: {
        title: "失效QQ每行显示个数",
        key: "失效QQ",
        type: "num",
        def: 2,
      },
    },
  },
  log: {
    title: "插件设置",
    cfg: {
      priority: {
        title: "插件优先级",
        key: "优先级",
        type: "num",
        def: -114514,
      },
      isLog: {
        title: "显示所有请求日志",
        key: "请求日志",
        def: false,
      },
      resLog: {
        title: "显示所有返回日志",
        key: "返回日志",
        def: false,
      },
    },
  },
};
