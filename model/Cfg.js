import NoteUser from "../../genshin/model/mys/NoteUser.js";
import MysUser from "../../genshin/model/mys/MysUser.js";
import { cfgSchema } from "./cfg_system.js";
import { promisify } from "node:util";
import fs from "node:fs";
import yaml from "yaml";
import _ from "lodash";
let sqlite3;
try {
  sqlite3 = (await import("sqlite3")).default;
} catch (err) {
  logger.error(
    "导入sqlite3失败，本插件不支持Yunzai-Bot，非Yunzai-Bot请检查依赖"
  );
}

const _path = process.cwd().replace(/\\/g, "/");
class Cfg {
  constructor() {
    this.file = `${_path}/plugins/mystool/config`;
    this.defile = `${_path}/plugins/mystool/defSet`;
    this.resfile = `${_path}/plugins/mystool/resources/`;
    this.dir = `${_path}/plugins/xiaoyao-cvs-plugin/data/yaml/`;
  }

  /** 用户配置 */
  getConfig(app, y = true) {
    if (y)
      return yaml.parse(fs.readFileSync(`${this.file}/${app}.yaml`, "utf8"));
    else return fs.readFileSync(`${this.file}/${app}.yaml`, "utf8");
  }

  getdef(app, y = true) {
    if (y)
      return yaml.parse(fs.readFileSync(`${this.defile}/${app}.yaml`, "utf8"));
    else return fs.readFileSync(`${this.defile}/${app}.yaml`, "utf8");
  }

  setConfig(app, data, y = true) {
    if (y) data = yaml.stringify(data);
    return fs.writeFileSync(`${this.file}/${app}.yaml`, data, "utf8");
  }

  setCk(ck, device_id) {
    return _.trim(ck, ";") + `; _MHYUUID=${device_id}; `;
  }

  async signCk() {
    let config = this.getConfig("config");

    logger.mark("[自动签到]查询全部ck");
    return await this.getcks(true);
  }

  async getcks(all, qq = "", note = false) {
    if (qq) qq = Number(qq) || String(qq);
    this.banUid = this.getConfig("banuid");
    let config = this.getConfig("config");

    this.Game = note ? ["gs", "sr", "zzz"] : config.game;
    let cks = _.fromPairs(this.Game.map((game) => [game, {}]));
    let uids = _.fromPairs(this.Game.map((game) => [game, {}]));

    const dbPath = `${_path}/data/db/data.db`;
    const db = new sqlite3.Database(dbPath);
    const Users = `select id as qq, ltuid, ck, device, uids  from Users 
	 left join MysUsers on Users.ltuids Like '%' ||MysUsers.ltuid||'%'
	 where ${all ? `` : `Users.id = '${qq}' and`}
	Users.id is not null and MysUsers.ck is not null;`;
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all(Users, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });

      for (let key of ["gs", "sr", "zzz"]) {
        for (let row of rows) {
          const Data = JSON.parse(row.uids);
          for (let i in Data[key]) {
            if (this.banUid[key]?.includes(Number(Data[key][i]))) continue;
            let uid = String(Data[key][i]);
            let ck = {
              [uid]: {
                qq: row.qq,
                uid: uid,
                ck: this.setCk(row.ck, row.device),
                skid: `${row.ltuid}_${row.qq}`,
                region: "",
                device_id: row.device,
                ltuid: row.ltuid,
              },
            };
            cks[key] = Object.assign({}, cks[key], ck);
          }
        }
      }
      for (let game of this.Game) uids[game] = _.map(cks[game], "uid");

      return { cks, uids };
    } catch (err) {
      logger.mark(`抛出异常: ${err.message}`);
      return { cks, uids };
    } finally {
      db.close();
    }
  }

  async signSk() {
    logger.mark("[社区自动签到]查询全部sk");
    let sks = await this.getsks(true);
    return { sks, ltuids: _.map(sks, "id") };
  }

  async getsks(all, qq) {
    let list = {};
    try {
      let sks = [];
      if (all) {
        let files = fs
          .readdirSync(this.dir)
          .filter((file) => file.endsWith(".yaml"));

        const readFile = promisify(fs.readFile);

        let promises = [];

        files.forEach((v) =>
          promises.push(readFile(`${this.dir}${v}`, "utf8"))
        );
        const res = await Promise.all(promises);
        res.forEach((v, index) => {
          let tmp = yaml.parse(v);
          sks.push(tmp);
        });
        sks = Object.assign({}, ...sks);
      } else {
        if (!fs.existsSync(`${this.dir}${String(qq)}.yaml`)) return list;
        sks = yaml.parse(
          fs.readFileSync(`${this.dir}${String(qq)}.yaml`, "utf-8")
        );
      }

      for (let i in sks) {
        if (!sks[i].stoken || !sks[i].stuid || !sks[i].ltoken) continue;
        let id = `${sks[i].stuid}_${sks[i].userId}`;
        if (list[id]) continue;
        let sk = {
          [id]: {
            userId: sks[i].userId,
            ltoken: sks[i].ltoken,
            stuid: sks[i].stuid,
            id: id,
            sk: `stuid=${sks[i].stuid};stoken=${sks[i].stoken};${
              sks[i].mid ? `mid=${sks[i].mid}` : `ltoken=${sks[i].ltoken}`
            };`,
          },
        };
        list = Object.assign({}, list, sk);
      }
    } catch (error) {
      logger.error("stoken获取失败：" + error);
    }
    return list;
  }

  async user(e) {
    return await NoteUser.create(e);
  }

  async delck(ltuid, qq) {
    qq = Number(qq) || String(qq);
    let e = {
      user_id: qq,
      qq,
      msg: "删除ck",
      isSr: false,
      isZzz: false,
    };

    let user = await this.user(e);
    let mys = await MysUser.create(ltuid);
    if (!mys) return;

    await user.delMysUser(ltuid);
  }

  async delsk(qq, stuid) {
    if (!stuid) return;
    let sks = yaml.parse(
      fs.readFileSync(`${this.dir}${String(qq)}.yaml`, "utf-8")
    );
    for (let i in sks) if (sks[i].stuid == stuid) delete sks[i];
    logger.mark(`[qq:${qq}][stuid:${stuid}]删除失效sk`);
    fs.writeFileSync(
      `${this.dir}${String(qq)}.yaml`,
      yaml.stringify(sks),
      "utf8"
    );

    if (_.isEmpty(sks)) fs.unlinkSync(`${this.dir}${String(qq)}.yaml`);
    return;
  }

  getCfgSchemaMap() {
    let ret = {};
    _.forEach(cfgSchema, (cfgGroup) => {
      _.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        cfgItem.cfgKey = cfgKey;
        ret[cfgItem.key] = cfgItem;
      });
    });
    return ret;
  }

  getCfgSchema() {
    return cfgSchema;
  }

  countTime(time) {
    let hour = Math.floor((time / 3600) % 24);
    let min = Math.floor((time / 60) % 60);
    let sec = Math.floor(time % 60);
    let msg = "";
    if (hour > 0) msg += `${hour}小时`;
    if (min > 0) msg += `${min}分钟`;
    if (sec > 0) msg += `${sec}秒`;
    return msg;
  }
}

export default new Cfg();
