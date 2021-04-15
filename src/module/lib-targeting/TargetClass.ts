import { getCanvas, MODULE_NAME } from '../settings';
import { NPCTargeting } from './NPCTargeting';
import { TargetsTable } from './TargetsTable';

// TODO Integrated in separate library module
export class TargetClass {

    static targetsTable:TargetsTable;

    static ready() {
        // NPCTargeting = window['NPCTargeting'];

        try {
            TargetClass.targetsTable = new TargetsTable(MODULE_NAME);
        } catch(error) {
            //console.error(error);
            // ui.notifications.error("You need to load the Lib-Targeting Module");
        }

        NPCTargeting.init(TargetClass.targetsTable);
    } // -- end ready


    static async targetClassTargetTokenHandler(user,token,targeted) {
        // TODO Check out the code targeted as some problem 'true'
        await NPCTargeting.targetTokenHandler(user,token,true);

        let targetSources =  await TargetClass.targetsTable.getTargetSources(token);
        let sourceTargets = await TargetClass.targetsTable.getSourceTargets(user);

        console.log(MODULE_NAME,"Token is Targeted By:", targetSources);
        console.log(MODULE_NAME,"User is targeting:", sourceTargets);
        if(game.settings.get(MODULE_NAME, 'display_notificaton_enable_notification')){
            // for (let targetSource of targetSources) {
                targetClassMessageCreate("Token is Targeted By:",targetSources);
            // }
            // for (let sourceTarget of sourceTargets) {
                targetClassMessageCreate("User is targeting:",sourceTargets);
            // }
        }
    }

    static async targetClassControlTokenHandler(token, tf) {
        await NPCTargeting.controlTokenHandler(token, tf);
    }
}

export async function targetClassMessageCreate(message, tokenTargets) {
    let gm = game.user === game.users.find((u) => u.isGM && u.active)
    if (!gm && game.settings.get(MODULE_NAME, 'display_notificaton_gm_vision')){
       return;
    }
    let isPlayer = <boolean>game.settings.get(MODULE_NAME, 'display_notificaton_npc_name');
    let hideName = <boolean>game.settings.get(MODULE_NAME, 'display_notificaton_show_to_players_the_player_updates');
    let content;

    let nameSources = [];
    let nameTargets = [];

    for (let tokenTarget of tokenTargets) {
        for (let target  of tokenTarget) {
            let tokenTarget:any = getTokenByTokenID(target.targetID);
            let tokenSource:any = getTokenByTokenID(target.sourceID);
            let nameTarget = tokenTarget.actor.data.name;
            let nameSource = tokenSource.actor.data.name;
            if(nameSource){
                nameSources.push(nameSource);
            }
            if(nameTarget){
                nameTargets.push(nameTarget);
            }
        }
    }

    if(nameSources.length>0){
        if (hideName && !isPlayer) {
            content = '<span class="hm_messagetaken">"' + nameSources.toString() + '" is target ' + ' "Unknown entity" '  + '</span>'
        }
        else {
            content = '<span class="hm_messagetaken">"' + nameSources.toString() + '" is target "' + nameTargets.toString() + '"</span>'
        }

        let recipient;
        if (game.settings.get(MODULE_NAME, 'display_notificaton_gm_vision')){
           recipient = game.users.find((u) => u.isGM && u.active).id;
        }
        let chatData:any = {
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

export function getTokenByTokenID(id) {
  return getCanvas().tokens.placeables.find( x => {return x.id === id});
}
export function getTokenByTokenName(name) {
  return getCanvas().tokens.placeables.find( x => { return x.name == name});
}
