import { TokenTarget } from './lib-targeting/TokenTarget';
import { NPCTargeting } from './lib-targeting/NPCTargeting';
import { TargetsTable } from './lib-targeting/TargetsTable';
import { getCanvas, MODULE_NAME } from './settings';
import { TargetIndicator } from './TargetIndicator';
import { CTA } from './libs/CTA';
import { BorderFrame } from './libs/BorderControl';
import { FlagsTargeting } from './lib-targeting/TargetConstants';

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

    // static npcTargeting:NPCTargeting ;
    static nameSpace:string;

    static ready(moduleName) {
      //NPCTargeting = window['NPCTargeting'];
      let targetsTable;
      try {
          TargetContainer.nameSpace = moduleName;
          targetsTable = new TargetsTable(moduleName);
      } catch(error) {
          console.error(error);
          ui.notifications.error("You need to load the Lib-Targeting Module");
      }

      NPCTargeting.init(targetsTable);

    } // -- end ready


    static async targetClassTargetTokenHandler(user: User ,token: Token, targeted:Boolean, data:PIXI.Graphics) {
        // TODO Check out the code targeted as some problem 'true'
        await NPCTargeting.targetTokenHandler(user,token,targeted, data);
        //if(NPCTargeting.getTargetsTable()){
          let targetSources =  await NPCTargeting.getTargetsTable().getTargetSources(token);
          let sourceTargets = await NPCTargeting.getTargetsTable().getSourceTargets(user);

          console.log(TargetContainer.nameSpace,"Token is Targeted By:", targetSources);
          console.log(TargetContainer.nameSpace,"User is targeting:", sourceTargets);
          if(game.settings.get(MODULE_NAME, 'display_notificaton_enable_notification')){
              // for (let targetSource of targetSources) {
                TargetContainer.targetClassMessageCreate("Token is Targeted By:",targetSources);
              // }
              // for (let sourceTarget of sourceTargets) {
                TargetContainer.targetClassMessageCreate("User is targeting:",sourceTargets);
              // }
          }
        //}else{
        //  NPCTargeting.setTargetsTable(new TargetsTable(TargetContainer.nameSpace));
        //}
    }

    static async targetClassControlTokenHandler(token:Token, targeted:Boolean) {
        await NPCTargeting.controlTokenHandler(token, targeted);
    }


    // static async addTarget(source: User | Token, target : Token | string, data:PIXI.Graphics){
    //   await NPCTargeting.getTargetsTable().addTarget(source,target,data);
    // }

    // static async removeTarget(source: User | Token, target : Token | string){
    //   await NPCTargeting.getTargetsTable().removeTarget(source,target);
    // }

    static async clear(){
      await NPCTargeting.getTargetsTable().clear();
    }

    // static getTargetGraphics(u: User, token: Token):PIXI.Graphics {
    //   return NPCTargeting.getTargetsTable().getRecord(u, token).getTargetGraphics();
    // }

    static getTargetToken(u: User, token: Token){
      return NPCTargeting.getTargetsTable().getRecord(u, token);
    }

    static getAllTargets(){
      return NPCTargeting.controlledUnits;
    }

    static isEmpty(){
      return NPCTargeting.isEmpty();
    }

    static async getCurrentTargets() {
      if (!getCanvas().scene.getFlag(MODULE_NAME,FlagsTargeting.targets)) {
          return [];
      }
      return await <TokenTarget[]>getCanvas().scene.getFlag(MODULE_NAME,FlagsTargeting.targets);
    }

    // UTILITY

    private static async targetClassMessageCreate(message:string, tokenTargets: TokenTarget[]) {
      let gm = game.user === game.users.find((u) => u.isGM && u.active)
      if (!gm && game.settings.get(MODULE_NAME, 'display_notificaton_gm_vision')){
         return;
      }
      let isPlayer = <boolean>game.settings.get(MODULE_NAME, 'display_notificaton_npc_name');
      let hideName = <boolean>game.settings.get(MODULE_NAME, 'display_notificaton_show_to_players_the_player_updates');
      let content;

      let nameSources = [];
      let nameTargets = [];

      for (let target of tokenTargets) {
          let tokenTarget:Token = TargetContainer.getTokenByTokenID(target.targetID);
          let tokenSource:Token = TargetContainer.getTokenByTokenID(target.sourceID);
          let nameTarget = tokenTarget.actor.data.name;
          let nameSource = tokenSource.actor.data.name;
          if(nameSource){
              nameSources.push(nameSource);
          }
          if(nameTarget){
              nameTargets.push(nameTarget);
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

    private static getTokenByTokenID(id) {
      return getCanvas().tokens.placeables.find( x => {return x.id === id});
    }

    private static getTokenByTokenName(name) {
      return getCanvas().tokens.placeables.find( x => { return x.name == name});
    }
}


