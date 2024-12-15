import Cfg from "../Cfg.js";
import crypto from "crypto";

export default class apiTool {
  constructor(uid, server, game = "gs") {
    this.uid = uid;
    this.server = server;
    this.game = game;
    this.api = Cfg.getConfig("api");
    this.uuid = crypto.randomUUID();
  }

  getUrlMap = (data = {}) => {
    let bbs_api = "https://bbs-api.mihoyo.com/";
    let host, host_hk4e, host_nap, hostRecord, hostPublicData;
    if (/cn_|_cn/.test(this.server)) {
      host = "https://api-takumi.mihoyo.com/";
      host_nap = "https://act-nap-api.mihoyo.com/";
      hostRecord = "https://api-takumi-record.mihoyo.com/";
      hostPublicData = "https://public-data-api.mihoyo.com/";
    } else {
      host = "https://sg-public-api.hoyolab.com/";
      host_hk4e = "https://sg-hk4e-api.hoyolab.com/";
      host_nap = "https://sg-act-nap-api.hoyolab.com/";
      hostRecord = "https://bbs-api-os.hoyolab.com/";
      hostPublicData = "https://sg-public-data-api.hoyoverse.com/";
    }

    let urlMap = {
      all: {
        createGeetest: {
          url: `${host}event/toolcomsrv/risk/createGeetest`,
          query: `is_high=true&app_key=${data.app_key}`,
        },
        verifyGeetest: {
          url: `${host}event/toolcomsrv/risk/verifyGeetest`,
          body: {
            geetest_challenge: data.challenge,
            geetest_validate: data.validate,
            geetest_seccode: `${data.validate}|jordan`,
            app_key: data.app_key,
          },
        },
        createVerification: {
          url: `${hostRecord}game_record/app/card/wapi/createVerification`,
          query: "is_high=true",
        },
        verifyVerification: {
          url: `${hostRecord}game_record/app/card/wapi/verifyVerification`,
          body: {
            geetest_challenge: data.challenge,
            geetest_validate: data.validate,
            geetest_seccode: `${data.validate}|jordan`,
          },
        },
        recognize: {
          url: `${this.api.api}`,
          config: `${this.api.key}&${this.api.query}&gt=${data.gt}&challenge=${data.challenge}`,
        },
        results: {
          url: `${this.api.resapi}`,
          config: `${this.api.key}&resultid=${data.resultid}`,
        },
      },
      bbs: {
        bbsisSign: {
          url: `${bbs_api}apihub/sapi/getUserMissionsState`,
          types: "bbs",
        },
        bbsSign: {
          url: `${bbs_api}apihub/app/api/signIn`,
          body: {
            gids: data.signId,
          },
          sign: true,
          types: "bbs",
        },
        bbsGetCaptcha: {
          url: `${bbs_api}misc/api/createVerification`,
          query: "is_high=false",
          types: "bbs",
        },
        bbsCaptchaVerify: {
          url: `${bbs_api}misc/api/verifyVerification`,
          body: {
            geetest_challenge: data.challenge,
            geetest_validate: data.validate,
            geetest_seccode: `${data.validate}|jordan`,
          },
          types: "bbs",
        },
        bbsPostList: {
          url: `${bbs_api}post/api/getForumPostList`,
          query: `forum_id=${data.forumId}&is_good=false&is_hot=false&page_size=20&sort_type=1`,
          types: "bbs",
        },
        bbsPostFull: {
          url: `${bbs_api}post/api/getPostFull`,
          query: `post_id=${data.postId}`,
          types: "bbs",
        },
        bbsReply: {
          url: `${bbs_api}post/api/releaseReply`,
          body: {
            content: data.Replymsg,
            post_id: data.postId,
            reply_id: "",
            structured_content: data.Replymsg,
          },
          types: "bbs",
        },
        bbsShareConf: {
          url: `${bbs_api}apihub/api/getShareConf`,
          query: `entity_id=${data.postId}&entity_type=1`,
          types: "bbs",
        },
        bbsVotePost: {
          url: `${bbs_api}apihub/sapi/upvotePost`,
          body: {
            post_id: data.postId,
            is_cancel: false,
          },
          types: "bbs",
        },
      },
      bh3: {
        UserGame: {
          url: `${host}binding/api/getUserGameRolesByCookie`,
          query: `game_biz=hk4e_cn&region=${this.server}&game_uid=${this.uid}`,
        },
        sign: {
          url: `${host}event/luna/sign`, // 国服原神签到
          body: {
            act_id: "e202306201626331",
            region: this.server,
            uid: this.uid,
            lang: "zh-cn",
          },
          types: "sign",
        },
        sign_info: {
          url: `${host}event/luna/info`,
          query: `lang=zh-cn&act_id=e202306201626331&region=${this.server}&uid=${this.uid}`,
          types: "sign",
        },
        sign_home: {
          url: `${host}event/luna/home`,
          query: "lang=zh-cn&act_id=e202306201626331",
          types: "sign",
        },
        getFp: {
          url: `${hostPublicData}device-fp/api/getFp`,
          body: {
            app_name: "bbs_cn",
            bbs_device_id: `${this.uuid}`,
            device_fp: "38d7faa51d2b6",
            device_id: "35315696b7071100",
            ext_fields: `{"proxyStatus":1,"isRoot":1,"romCapacity":"512","deviceName":"Xperia 1","productName":"J9110","romRemain":"456","hostname":"BuildHost","screenSize":"1096x2434","isTablet":0,"aaid":"${this.uuid}","model":"J9110","brand":"Sony","hardware":"qcom","deviceType":"J9110","devId":"REL","serialNumber":"unknown","sdCapacity":107433,"buildTime":"1633631032000","buildUser":"BuildUser","simState":1,"ramRemain":"96757","appUpdateTimeDiff":1722171241616,"deviceInfo":"Sony\/J9110\/J9110:11\/55.2.A.4.332\/055002A004033203408384484:user\/release-keys","vaid":"${this.uuid}","buildType":"user","sdkVersion":"30","ui_mode":"UI_MODE_TYPE_NORMAL","isMockLocation":0,"cpuType":"arm64-v8a","isAirMode":0,"ringMode":2,"chargeStatus":1,"manufacturer":"Sony","emulatorStatus":0,"appMemory":"512","osVersion":"11","vendor":"unknown","accelerometer":"-0.084346995x8.73799x4.6301117","sdRemain":96600,"buildTags":"release-keys","packageName":"com.mihoyo.hyperion","networkType":"WiFi","oaid":"${this.uuid}","debugStatus":1,"ramCapacity":"107433","magnetometer":"-13.9125x-17.8875x-5.4750004","display":"55.2.A.4.332","appInstallTimeDiff":1717065300325,"packageVersion":"2.20.2","gyroscope":"0.017714571x-4.5813544E-4x0.0015271181","batteryStatus":76,"hasKeyboard":0,"board":"msmnile"}`,
            platform: "2",
            seed_id: `${this.uuid}`,
            seed_time: new Date().getTime() + "",
          },
        },

        dailyNote: {
          url: `${hostRecord}game_record/app/genshin/api/dailyNote`,
          query: `role_id=${this.uid}&server=${this.server}`,
        },
      },
      gs: {
        UserGame: {
          url: `${host}binding/api/getUserGameRolesByCookie`,
          query: `game_biz=hk4e_cn&region=${this.server}&game_uid=${this.uid}`,
        },
        sign: {
          url: `${host}event/luna/sign`, // 国服原神签到
          body: {
            act_id: "e202311201442471",
            region: this.server,
            uid: this.uid,
            lang: "zh-cn",
          },
          types: "sign",
        },
        sign_info: {
          url: `${host}event/luna/info`,
          query: `lang=zh-cn&act_id=e202311201442471&region=${this.server}&uid=${this.uid}`,
          types: "sign",
        },
        sign_home: {
          url: `${host}event/luna/home`,
          query: "lang=zh-cn&act_id=e202311201442471",
          types: "sign",
        },
        getFp: {
          url: `${hostPublicData}device-fp/api/getFp`,
          body: {
            app_name: "bbs_cn",
            bbs_device_id: `${this.uuid}`,
            device_fp: "38d7faa51d2b6",
            device_id: "35315696b7071100",
            ext_fields: `{"proxyStatus":1,"isRoot":1,"romCapacity":"512","deviceName":"Xperia 1","productName":"J9110","romRemain":"456","hostname":"BuildHost","screenSize":"1096x2434","isTablet":0,"aaid":"${this.uuid}","model":"J9110","brand":"Sony","hardware":"qcom","deviceType":"J9110","devId":"REL","serialNumber":"unknown","sdCapacity":107433,"buildTime":"1633631032000","buildUser":"BuildUser","simState":1,"ramRemain":"96757","appUpdateTimeDiff":1722171241616,"deviceInfo":"Sony\/J9110\/J9110:11\/55.2.A.4.332\/055002A004033203408384484:user\/release-keys","vaid":"${this.uuid}","buildType":"user","sdkVersion":"30","ui_mode":"UI_MODE_TYPE_NORMAL","isMockLocation":0,"cpuType":"arm64-v8a","isAirMode":0,"ringMode":2,"chargeStatus":1,"manufacturer":"Sony","emulatorStatus":0,"appMemory":"512","osVersion":"11","vendor":"unknown","accelerometer":"-0.084346995x8.73799x4.6301117","sdRemain":96600,"buildTags":"release-keys","packageName":"com.mihoyo.hyperion","networkType":"WiFi","oaid":"${this.uuid}","debugStatus":1,"ramCapacity":"107433","magnetometer":"-13.9125x-17.8875x-5.4750004","display":"55.2.A.4.332","appInstallTimeDiff":1717065300325,"packageVersion":"2.20.2","gyroscope":"0.017714571x-4.5813544E-4x0.0015271181","batteryStatus":76,"hasKeyboard":0,"board":"msmnile"}`,
            platform: "2",
            seed_id: `${this.uuid}`,
            seed_time: new Date().getTime() + "",
          },
        },
        dailyNote: {
          url: `${hostRecord}game_record/app/genshin/api/dailyNote`,
          query: `role_id=${this.uid}&server=${this.server}`,
        },
      },
      sr: {
        UserGame: {
          url: `${host}binding/api/getUserGameRolesByCookie`,
          query: `game_biz=hkrpg_cn&region=${this.server}&game_uid=${this.uid}`,
        },
        sign: {
          url: `${host}event/luna/sign`, // 国服星铁签到
          body: {
            act_id: "e202304121516551",
            region: this.server,
            uid: this.uid,
            lang: "zh-cn",
          },
          types: "sign",
        },
        sign_info: {
          url: `${host}event/luna/info`,
          query: `lang=zh-cn&act_id=e202304121516551&region=${this.server}&uid=${this.uid}`,
          types: "sign",
        },
        sign_home: {
          url: `${host}event/luna/home`,
          query: "lang=zh-cn&act_id=e202304121516551",
          types: "sign",
        },
        getFp: {
          url: `${hostPublicData}device-fp/api/getFp`,
          body: {
            app_name: "bbs_cn",
            bbs_device_id: `${this.uuid}`,
            device_fp: "38d7faa51d2b6",
            device_id: "35315696b7071100",
            ext_fields: `{"proxyStatus":1,"isRoot":1,"romCapacity":"512","deviceName":"Xperia 1","productName":"J9110","romRemain":"456","hostname":"BuildHost","screenSize":"1096x2434","isTablet":0,"aaid":"${this.uuid}","model":"J9110","brand":"Sony","hardware":"qcom","deviceType":"J9110","devId":"REL","serialNumber":"unknown","sdCapacity":107433,"buildTime":"1633631032000","buildUser":"BuildUser","simState":1,"ramRemain":"96757","appUpdateTimeDiff":1722171241616,"deviceInfo":"Sony\/J9110\/J9110:11\/55.2.A.4.332\/055002A004033203408384484:user\/release-keys","vaid":"${this.uuid}","buildType":"user","sdkVersion":"30","ui_mode":"UI_MODE_TYPE_NORMAL","isMockLocation":0,"cpuType":"arm64-v8a","isAirMode":0,"ringMode":2,"chargeStatus":1,"manufacturer":"Sony","emulatorStatus":0,"appMemory":"512","osVersion":"11","vendor":"unknown","accelerometer":"-0.084346995x8.73799x4.6301117","sdRemain":96600,"buildTags":"release-keys","packageName":"com.mihoyo.hyperion","networkType":"WiFi","oaid":"${this.uuid}","debugStatus":1,"ramCapacity":"107433","magnetometer":"-13.9125x-17.8875x-5.4750004","display":"55.2.A.4.332","appInstallTimeDiff":1717065300325,"packageVersion":"2.20.2","gyroscope":"0.017714571x-4.5813544E-4x0.0015271181","batteryStatus":76,"hasKeyboard":0,"board":"msmnile"}`,
            platform: "2",
            seed_id: `${this.uuid}`,
            seed_time: new Date().getTime() + "",
          },
        },

        dailyNote: {
          url: `${hostRecord}game_record/app/hkrpg/api/note`,
          query: `role_id=${this.uid}&server=${this.server}`,
        },
        index: {
          url: `${hostRecord}game_record/app/hkrpg/api/index`,
          query: `role_id=${this.uid}&server=${this.server}`,
        },
      },
      zzz: {
        sign: {
          url: `${host_nap}event/luna/zzz/sign`, // 国服绝区零签到
          body: {
            act_id: "e202406242138391",
            region: this.server,
            uid: this.uid,
            lang: "zh-cn",
          },
          types: "sign",
        },
        sign_info: {
          url: `${host_nap}event/luna/zzz/info`,
          query: `lang=zh-cn&act_id=e202406242138391&region=${this.server}&uid=${this.uid}`,
          types: "sign",
        },
        sign_home: {
          url: `${host_nap}event/luna/zzz/home`,
          query: "lang=zh-cn&act_id=e202406242138391",
          types: "sign",
        },
      },
    };
    return urlMap[this.game];
  };
}
