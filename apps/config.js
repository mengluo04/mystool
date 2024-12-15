import plugin from "../../../lib/plugins/plugin.js";
import Cfg from "../model/Cfg.js";
import fs from "node:fs";
import _ from "lodash";

export class ji_config extends plugin {
  constructor() {
    super({
      name: "寄·配置",
      dsc: "",
      event: "message",
      priority: Cfg.getConfig("config").priority ?? -114514,
      rule: [
        {
          reg: "^#?设置社区签到(经验|米币)$",
          fnc: "setbbs",
        },
        {
          reg: "^#?(原神|星铁|绝区零)?(禁用|解禁)(uid)?\\s*(1[0-9]|[1-9])?[0-9]{8}$",
          fnc: "banUid",
        },
        {
          reg: "^#?寄(替换|还原)$",
          permission: "master",
          fnc: "jicopy",
        },
      ],
    });
  }
  async setbbs(e) {
    let id = Number(e.user_id) || String(e.user_id);

    if (e.msg.includes("经验")) {
      return e.reply(`\n社区签到模式已设置：【米币+经验】`, false, {
        at: true,
      });
    } else if (e.msg.includes("米币")) {
      if (index !== -1) {
        e.reply(`\n社区签到模式已设置：【米币】`, false, { at: true });
      } else {
        e.reply(`\n当前社区签到模式：【米币】`, false, { at: true });
      }
      return;
    }
  }

  async banUid(e) {
    let uid = Number(
      e.msg.replace(/#?(原神|星铁|绝区零)?(禁用|解禁)(uid)?\s*/i, "").trim()
    );

    if (!uid) return e.reply("未输入UID");

    let Uid = Cfg.getConfig("banuid");

    let name = e.msg.includes("原神")
      ? "原神"
      : e.msg.includes("星铁")
      ? "星铁"
      : "绝区零";
    let set =
      Uid[
        e.msg.includes("原神") ? "gs" : e.msg.includes("星铁") ? "sr" : "zzz"
      ];
    let action = e.msg.includes("禁用") ? "禁用" : "解禁";
    let g = e.msg.includes("原神")
      ? "gs"
      : e.msg.includes("星铁")
      ? "sr"
      : "zzz";

    if (!e.isMaster) {
      let { cks } = await Cfg.getcks(false, e.user_id);
      if (_.isEmpty(cks[g]))
        return e.reply("未绑定ck,或此UID已禁用", false, { at: true });
      if (!cks[g][uid])
        return e.reply(`只能${action}自己已绑ck的uid\n或此UID已禁用`);
    }

    if (action === "禁用") {
      if (set && set.includes(uid)) return e.reply(`${name}UID:${uid}已禁用`);

      set.push(uid);
      Cfg.setConfig("banuid", Uid);
      return e.reply(`已${action}${name}UID:${uid}`);
    } else {
      if (set.length === 0) return e.reply(`未添加禁用UID`);

      let index = set.findIndex((q) => q == uid);
      if (index !== -1) {
        set.splice(index, 1);
        Cfg.setConfig("banuid", Uid);
        e.reply(`已${action}${name}UID:${uid}`);
      } else {
        e.reply(`${name}UID:${uid}未禁用`);
      }
      return;
    }
  }

  async jicopy(e) {
    let info = "./plugins/genshin/model/mys/mysInfo.js";
    if (!fs.existsSync(`${Cfg.resfile}temp`))
      fs.mkdirSync(`${Cfg.resfile}temp`);

    if (e.msg.includes("替换")) {
      if (fs.existsSync(`${Cfg.resfile}temp/mysInfo.js`))
        return e.reply(
          "已有未还原备份，若无更新冲突无需替换\n否则请【#寄还原】后更新本体再替换"
        );
      fs.copyFileSync(info, `${Cfg.resfile}temp/mysInfo.js`);
      fs.copyFileSync(`${Cfg.defile}/mysInfo.js`, info);
      return e.reply("替换成功，重启后生效");
    } else {
      if (!fs.existsSync(`${Cfg.resfile}temp/mysInfo.js`))
        return e.reply("你还没有替换过，无法还原哦");
      fs.copyFileSync(`${Cfg.resfile}temp/mysInfo.js`, info);
      fs.unlinkSync(`${Cfg.resfile}temp/mysInfo.js`);
      return e.reply("还原成功");
    }
  }
}
