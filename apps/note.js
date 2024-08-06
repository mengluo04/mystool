import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import Note from '../model/note.js'
import Cfg from '../model/Cfg.js'
import _ from 'lodash'

export class ji_note extends plugin {
    constructor() {
        super({
            name: '寄·体力',
            dsc: '',
            event: 'message',
            priority: Cfg.getConfig('config').priority ?? -114514,
            rule: [
                {
                    reg: '^#?(多|全|全部|原神|星铁|绝区零)?(体力|开拓力|电量|树脂|查询体力|便笺|便签)$',
                    fnc: 'note',
                },
                {
                    reg: '^#?(原神|星铁|绝区零)?(开启|关闭)体力推送(\\s*(1[0-9]|[1-9])?[0-9]{8})?$',
                    fnc: 'noteconfig'
                },
                {
                    reg: '^#?(原神|星铁|绝区零)?体力推送(阈值)?\\s*[1-9][0-9]{0,2}$',
                    fnc: 'noteResin'
                },
                {
                    reg: '^#?体力推送格式转换$',//对8.30前的体力推送格式适配
                    permission: 'master',
                    fnc: 'copy'
                }
            ]
        })
        this.set = Cfg.getConfig('config')
        this.task = {
            cron: this.set.TaskTime,
            name: '体力推送任务',
            fnc: () => this.NoteTask()
        }
    }

    async NoteTask() {
        await new Note(this.e).NoteTask()
    }

    async note() {
        await Note.get(this.e)
    }

    async noteResin(e) {
        if (!e.isGroup) return
        if (!this.set.NoteTask) return e.reply(`主人未开启体力推送`)

        let Notes = Cfg.getConfig('defnote')

        let Resin = Number(e.msg.replace(/#?(原神|星铁)?体力推送(阈值)?\s*/i, '').trim())
        let max = e.msg.includes('星铁') ? 120 : 100
        let g = e.msg.includes('星铁') ? 'sr_Resin' : 'gs_Resin'
        if (Resin < max) return e.reply(`\n${e.msg.includes('星铁') ? '星铁' : '原神'}体力推送阈值不可小于${e.msg.includes('星铁') ? '【120】' : '【100】'}`, false, { at: true })
        if (!Notes?.[e.self_id]?.[e.user_id]?.[e.group_id]) return e.reply(`\n你还没有在本群开启体力推送哦~`, false, { at: true })

        Notes[e.self_id][e.user_id][e.group_id][g] = Resin
        Cfg.setConfig('defnote', Notes)
        return await e.reply(`\n${e.msg.includes('星铁') ? '星铁' : '原神'}体力推送阈值【${Resin}】`, false, { at: true })
    }

    async noteconfig(e) {
        if (!e.isGroup) return
        if (!this.set.NoteTask) return e.reply(`主人未开启体力推送`)

        let uid = Number(e.msg.replace(/#?(原神|星铁)?(开启|关闭)体力推送\s*/i, '').trim())
        let g = e.msg.includes('星铁') ? 'sr' : 'gs'
        let game = e.msg.includes('星铁') ? '星铁' : '原神'

        let { cks, uids } = await Cfg.getcks(false, e.user_id, true)
        let sks = await Cfg.getsks(false, e.user_id)
        if (_.isEmpty(sks) || _.isEmpty(cks[g])) return e.reply('\n请【#扫码登录】后使用体力推送', false, { at: true })

        if (uid) {
            if (!cks[g][uid]) return e.reply(`\n只能开启自己已绑ck及sk且未禁用的uid的体力提醒`, false, { at: true })
            if (!sks[cks[g][uid].skid]) return e.reply(`\n${game}UID:${uid} 请【#扫码登录】后使用体力推送`, false, { at: true })
            return await this.config(e, uid, g, game)
        } else {
            for (let uid of uids[g]) {
                if (!sks[cks[g][uid].skid]) {
                    e.reply(`\n${game}UID:${uid} 请【#扫码登录】后使用体力推送`, false, { at: true })
                    continue
                }
                await this.config(e, uid, g, game)
                await common.sleep(500)
            }

        }
    }

    async config(e, uid, g, game) {
        let Notes = Cfg.getConfig('defnote')

        try {
            if (e.msg.includes('开启')) {
                if (_.isEmpty(Notes)) {
                    Notes = { [e.self_id]: { [e.user_id]: { [e.group_id]: { gs: g === 'gs' ? [uid] : [], sr: g === 'sr' ? [uid] : [], gs_Resin: this.set.gs_Resin, sr_Resin: this.set.sr_Resin } } } }
                } else {
                    if (!Notes[e.self_id])
                        Notes[e.self_id] = {}
                    Notes[e.self_id][e.user_id] = Notes[e.self_id][e.user_id] || {}

                    if (!Notes[e.self_id][e.user_id][e.group_id]) {
                        Notes[e.self_id][e.user_id][e.group_id] = { gs: g === 'gs' ? [uid] : [], sr: g === 'sr' ? [uid] : [], gs_Resin: this.set.gs_Resin, sr_Resin: this.set.sr_Resin }
                    } else {
                        if (Notes[e.self_id][e.user_id][e.group_id][g].includes(uid))
                            return e.reply(`\n${game}UID:${uid}本群体力推送已开启\n当体力大于${g === 'gs' ? '【160】' : '【200】'}时将提醒`, false, { at: true })
                        Notes[e.self_id][e.user_id][e.group_id][g].push(uid)
                    }
                }
                Cfg.setConfig('defnote', Notes)
                return e.reply(`\n${game}UID:${uid}本群体力推送已开启`, false, { at: true })
            } else {
                if (Notes?.[e.self_id]?.[e.user_id]?.[e.group_id]) {
                    let note = Notes[e.self_id][e.user_id][e.group_id]
                    let uidIndex = note[g].indexOf(uid)
                    if (uidIndex !== -1) {
                        note[g].splice(uidIndex, 1)
                        if (_.every(note, _.isEmpty)) delete Notes[e.self_id][e.user_id][e.group_id]
                        if (_.isEmpty(Notes[e.self_id][e.user_id])) delete Notes[e.self_id][e.user_id]
                        if (_.isEmpty(Notes[e.self_id])) delete Notes[e.self_id]
                    } else {
                        return e.reply(`\n${game}UID:${uid}未在本群开启体力推送`, false, { at: true })
                    }
                    Cfg.setConfig('defnote', Notes)
                    return e.reply(`\n${game}UID:${uid}本群体力推送已关闭`, false, { at: true })
                } else {
                    return e.reply(`\n${game}UID:${uid}未在本群开启体力推送`, false, { at: true })
                }
            }
        } catch (error) {
            logger.error(error)
        }
    }

    async copy(e) {
        let note = Cfg.getConfig('note')
        let Notes = Cfg.getConfig('defnote')

        if (_.isEmpty(note)) return e.reply('note.yaml为空无需转换')
        for (let bot_id in note) {
            if (_.isEmpty(Notes)) Notes = {}
            if (!Notes[bot_id]) Notes[bot_id] = {}
            for (let group_id in note[bot_id])
                for (let user_id in note[bot_id][group_id]) {
                    let User = note[bot_id][group_id][user_id]
                    if (!Notes[bot_id][user_id]) Notes[bot_id][user_id] = {}
                    if (!Notes[bot_id][user_id][group_id]) {
                        Notes[bot_id][user_id][group_id] = User
                        continue
                    }
                    for (let g of ['gs', 'sr']) {
                        for (let uid of User[g])
                            if (!Notes[bot_id][user_id][group_id][g].includes(Number(uid)))
                                Notes[bot_id][user_id][group_id][g].push(Number(uid))

                        Notes[bot_id][user_id][group_id][`${g}_Resin`] = User[`${g}_Resin`]
                    }
                }
        }
        Cfg.setConfig('defnote', Notes)
        return e.reply('转换完成')
    }
}