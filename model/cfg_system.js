export const cfgSchema = {
  Sign: {
    title: '游戏签到设置',
    cfg: {
      AutoSign: {
        title: '签到福利自动签到',
        key: '自动签到',
        def: false,
        desc: '是否开启每日福利自动签到'
      },
      signTime: {
        title: '签到福利自动签到开始时间',
        key: '签到任务',
        type: 'cron',
        def: '0 2 0 * * ?',
        desc: '可使用锅巴修改'
      },
      game: {
        title: '签到游戏设置',
        key: '签到游戏',
        type: 'cron',
        def: ['gs', 'sr', 'zzz'],
        desc: '可使用锅巴修改'
      },
      retry: {
        title: '签到重试次数',
        key: '签到重试',
        type: 'num',
        def: 2
      },
      recall: {
        title: '签到消息撤回时间',
        key: '签到撤回',
        type: 'num',
        def: 60
      }
    }
  },
  bbsSign: {
    title: '社区签到设置',
    cfg: {
      AutobbsSign: {
        title: '社区自动签到',
        key: '社区签到',
        def: false,
        desc: '是否开启社区每日自动签到'
      },
      bbsSignTime: {
        title: '社区自动签到开始时间',
        key: '社区任务',
        type: 'cron',
        def: '0 2 0 * * ?',
        desc: '可使用锅巴修改'
      },
      bbsRetry: {
        title: '社区签到重试次数',
        key: '社区重试',
        type: 'num',
        def: 2
      },
      ddos: {
        title: '社区自动签到DDos',
        key: '社区ddos',
        def: false,
        desc: '可加快自动签到速度，但不建议0-1点大量并发'
      },
      ddostime: {
        title: '社区自动签到DDos个数',
        key: 'ddos限制',
        type: 'num',
        def: 10,
        desc: '每15~30秒同时签到多少个'
      },
    }
  },

  other: {
    title: '其他设置',
    cfg: {
      whiteSign: {
        title: '非自动签到群白名单设置',
        key: '群白名单',
        def: false,
        desc: '非(签到福利|社区)自动签到是否开启群白名单'
      },
      whiteGroup: {
        title: '自动签到群和QQ白名单设置',
        key: '白名单同时',
        def: true,
        desc: '(签到福利|社区)自动签到是否同时开启群和QQ白名单，关闭则仅使用QQ白名单'
      },
      retrytime: {
        title: '本体过码重试次数',
        key: '本体重试',
        type: 'num',
        def: 2,
        desc: '需已使用#米游社工具替换'
      },
      invalid: {
        title: '失效QQ每行显示个数',
        key: '失效QQ',
        type: 'num',
        def: 2,
      }
    }
  },
  log: {
    title: '插件设置',
    cfg: {
      priority: {
        title: '插件优先级',
        key: '优先级',
        type: 'num',
        def: -114514
      },
      isLog: {
        title: '显示所有请求日志',
        key: '请求日志',
        def: false
      },
      resLog: {
        title: '显示所有返回日志',
        key: '返回日志',
        def: false
      }
    }
  }
}