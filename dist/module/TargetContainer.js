import { NPCTargeting } from "./lib-targeting/NPCTargeting.js";
import { TargetsTable } from "./lib-targeting/TargetsTable.js";
import { getCanvas, MODULE_NAME } from "./settings.js";
import { FlagsTargeting } from "./lib-targeting/TargetConstants.js";
// ==========================================================
// THIS IS A IMPLEMENTATION OF THE LIB TARGET LIBRARY
// ==========================================================
Hooks.once('init', async () => {
    // Load lib-targetting module
    window['TargetsTable'] = TargetsTable;
    window['NPCTargeting'] = NPCTargeting;
});
// Hooks.once('ready', async () => {
//   TargetContainer.ready(MODULE_NAME);
// });
// TODO Integrated in separate library module
export class TargetContainer {
    static ready(moduleName) {
        //NPCTargeting = window['NPCTargeting'];
        let targetsTable;
        try {
            TargetContainer.nameSpace = moduleName;
            targetsTable = new TargetsTable(moduleName);
        }
        catch (error) {
            console.error(error);
            ui.notifications.error("You need to load the Lib-Targeting Module");
        }
        NPCTargeting.init(targetsTable);
    } // -- end ready
    static async targetClassTargetTokenHandler(user, token, targeted, data) {
        // TODO Check out the code targeted as some problem 'true'
        await NPCTargeting.targetTokenHandler(user, token, targeted, data);
        //if(NPCTargeting.getTargetsTable()){
        let targetSources = await NPCTargeting.getTargetsTable().getTargetSources(token);
        let sourceTargets = await NPCTargeting.getTargetsTable().getSourceTargets(user);
        console.log(TargetContainer.nameSpace, "Token is Targeted By:", targetSources);
        console.log(TargetContainer.nameSpace, "User is targeting:", sourceTargets);
        if (game.settings.get(MODULE_NAME, 'display_notificaton_enable_notification')) {
            // for (let targetSource of targetSources) {
            TargetContainer.targetClassMessageCreate("Token is Targeted By:", targetSources);
            // }
            // for (let sourceTarget of sourceTargets) {
            TargetContainer.targetClassMessageCreate("User is targeting:", sourceTargets);
            // }
        }
        //}else{
        //  NPCTargeting.setTargetsTable(new TargetsTable(TargetContainer.nameSpace));
        //}
    }
    static async targetClassControlTokenHandler(token, targeted) {
        await NPCTargeting.controlTokenHandler(token, targeted);
    }
    // static async addTarget(source: User | Token, target : Token | string, data:PIXI.Graphics){
    //   await NPCTargeting.getTargetsTable().addTarget(source,target,data);
    // }
    // static async removeTarget(source: User | Token, target : Token | string){
    //   await NPCTargeting.getTargetsTable().removeTarget(source,target);
    // }
    static async clear() {
        await NPCTargeting.getTargetsTable().clear();
    }
    // static getTargetGraphics(u: User, token: Token):PIXI.Graphics {
    //   return NPCTargeting.getTargetsTable().getRecord(u, token).getTargetGraphics();
    // }
    static getTargetToken(u, token) {
        return NPCTargeting.getTargetsTable().getRecord(u, token);
    }
    static getAllTargets() {
        return NPCTargeting.controlledUnits;
    }
    static isEmpty() {
        return NPCTargeting.isEmpty();
    }
    static async getCurrentTargets() {
        if (!getCanvas().scene.getFlag(MODULE_NAME, FlagsTargeting.targets)) {
            return [];
        }
        return await getCanvas().scene.getFlag(MODULE_NAME, FlagsTargeting.targets);
    }
    // UTILITY
    static async targetClassMessageCreate(message, tokenTargets) {
        let gm = game.user === game.users.find((u) => u.isGM && u.active);
        if (!gm && game.settings.get(MODULE_NAME, 'display_notificaton_gm_vision')) {
            return;
        }
        let isPlayer = game.settings.get(MODULE_NAME, 'display_notificaton_npc_name');
        let hideName = game.settings.get(MODULE_NAME, 'display_notificaton_show_to_players_the_player_updates');
        let content;
        let nameSources = [];
        let nameTargets = [];
        for (let target of tokenTargets) {
            let tokenTarget = TargetContainer.getTokenByTokenID(target.targetID);
            let tokenSource = TargetContainer.getTokenByTokenID(target.sourceID);
            let nameTarget = tokenTarget.actor.data.name;
            let nameSource = tokenSource.actor.data.name;
            if (nameSource) {
                nameSources.push(nameSource);
            }
            if (nameTarget) {
                nameTargets.push(nameTarget);
            }
        }
        if (nameSources.length > 0) {
            if (hideName && !isPlayer) {
                content = '<span class="hm_messagetaken">"' + nameSources.toString() + '" is target ' + ' "Unknown entity" ' + '</span>';
            }
            else {
                content = '<span class="hm_messagetaken">"' + nameSources.toString() + '" is target "' + nameTargets.toString() + '"</span>';
            }
            let recipient;
            if (game.settings.get(MODULE_NAME, 'display_notificaton_gm_vision')) {
                recipient = game.users.find((u) => u.isGM && u.active).id;
            }
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
    static getTokenByTokenID(id) {
        return getCanvas().tokens.placeables.find(x => { return x.id === id; });
    }
    static getTokenByTokenName(name) {
        return getCanvas().tokens.placeables.find(x => { return x.name == name; });
    }
}
