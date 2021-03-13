import { log } from '../../target-enhancements';
import { MODULE_NAME } from '../settings';
import { NPCTargeting } from './NPCTargeting';
import { TargetsTable } from './TargetsTable';
import {libWrapper} from '../libs/shim.js';
import { getTokenByTokenID } from '../helpers';

export class TargetClass {

    static targetsTable:TargetsTable;

    static flagReady:boolean = false;

    static async ready() {
        // NPCTargeting = window['NPCTargeting'];

        try {
            TargetClass.targetsTable = new TargetsTable(MODULE_NAME);
        } catch(error) {
            console.error(error);
            // ui.notifications.error("You need to load the Lib-Targeting Module");
        }

        NPCTargeting.init(TargetClass.targetsTable);
        TargetClass.flagReady = true;
    } // -- end ready


    static async targetTokenHandler(user,token,targeted) {
        if(!TargetClass.flagReady){
            TargetClass.ready();
        }

        await NPCTargeting.targetTokenHandler(user,token,targeted);

        let targetSources =  await TargetClass.targetsTable.getTargetSources(token);
        let sourceTargets = await TargetClass.targetsTable.getSourceTargets(user);

        log(MODULE_NAME,"Token is Targeted By:", targetSources);
        log(MODULE_NAME,"User is targeting:", sourceTargets);
        for (let targetSource of targetSources) {
            MessageCreate("Token is Targeted By:",targetSource);
        }
        for (let sourceTarget of sourceTargets) {
            MessageCreate("User is targeting:",sourceTarget);
        }
    }

    static async controlTokenHandler(token, tf) {
        if(!TargetClass.flagReady){
            TargetClass.ready();
        }
        await NPCTargeting.controlTokenHandler(token, tf);
    }
}

// Hooks.on("ready",TargetClass.ready);
// Hooks.on("targetToken", TargetClass.targetTokenHandler);
// Hooks.on("controlToken",TargetClass.controlTokenHandler);

export async function MessageCreate(message, tokenTargets) {
    let gm = game.user === game.users.find((u) => u.isGM && u.active)
    if (!gm && game.settings.get(MODULE_NAME, 'gm_vision')) return;

    let isPlayer = game.settings.get(MODULE_NAME, 'npc_name');
    let hideName = game.settings.get(MODULE_NAME, 'show_to_players_the_player_updates');

    for (let target of tokenTargets) {
        let content;
        let tokenTarget:any = getTokenByTokenID(target.targetID);
        let tokenSource:any = getTokenByTokenID(target.sourceID);
        let nameTarget = tokenTarget.actor.data.name;
        let nameSource = tokenSource.actor.data.name;
        if (hideName && !isPlayer) {
            content = '<span class="hm_messagetaken">"' + nameSource + '" is target ' + ' "Unknown entity" '  + '</span>'
        }
        else {
            content = '<span class="hm_messagetaken">"' + nameSource + '" is target "' + nameTarget + '"</span>'
        }
        
        let recipient;
        if (game.settings.get(MODULE_NAME, 'gm_vision')) recipient = game.users.find((u) => u.isGM && u.active).id;
        let chatData = {
            type: 4,
            user: recipient,
            speaker: { alias: MODULE_NAME },
            content: content,
            whisper: [recipient]

        };

        ChatMessage.create(chatData, {});
        // if((chatData)!== '' && game.settings.get('health-monitor', 'Enable_Disable')) {
        // 	ChatMessage.create(chatData, {});	
        // }
    }
}