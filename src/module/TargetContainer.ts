import { TokenTarget } from './lib-targeting/TokenTarget';
import { getCanvas, MODULE_NAME } from './settings';
import { NPCTargeting } from './lib-targeting/NPCTargeting';
import { TargetsTable } from './lib-targeting/TargetsTable';

// TODO Integrated in separate library module
export class TargetContainer {

    static npcTargeting:NPCTargeting ;

    static ready() {
      this.npcTargeting = window['NPCTargeting'];
      let targetsTable;
      try {
          targetsTable = new TargetsTable(MODULE_NAME);
      } catch(error) {
          console.error(error);
          ui.notifications.error("You need to load the Lib-Targeting Module");
      }

      this.npcTargeting.init(targetsTable);
    } // -- end ready


    static async targetClassTargetTokenHandler(user: User ,token: Token, targeted:Boolean) {
        // TODO Check out the code targeted as some problem 'true'
        await this.npcTargeting.targetTokenHandler(user,token,targeted);

        let targetSources =  await this.npcTargeting.getTargetsTable().getTargetSources(token);
        let sourceTargets = await this.npcTargeting.getTargetsTable().getSourceTargets(user);

        console.log(MODULE_NAME,"Token is Targeted By:", targetSources);
        console.log(MODULE_NAME,"User is targeting:", sourceTargets);
        if(game.settings.get(MODULE_NAME, 'display_notificaton_enable_notification')){
            // for (let targetSource of targetSources) {
              TargetContainer.targetClassMessageCreate("Token is Targeted By:",targetSources);
            // }
            // for (let sourceTarget of sourceTargets) {
              TargetContainer.targetClassMessageCreate("User is targeting:",sourceTargets);
            // }
        }
    }

    static async targetClassControlTokenHandler(token:Token, tf:Boolean) {
        await this.npcTargeting.controlTokenHandler(token, tf);
    }


    static async addTarget(source: User | Token, target : Token | string){
      await this.npcTargeting.getTargetsTable().addTarget(source,target);
    }

    static async removeTarget(source: User | Token, target : Token | string){
      await this.npcTargeting.getTargetsTable().removeTarget(source,target);
    }

    static async clear(){
      await this.npcTargeting.getTargetsTable().clear();
    }

    static getTargetGraphics(u: any, token: Token):PIXI.Graphics {
      return this.npcTargeting.getTargetsTable().getRecord(u, token).getTargetGraphics();
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
          let tokenTarget:any = TargetContainer.getTokenByTokenID(target.getTargetID());
          let tokenSource:any = TargetContainer.getTokenByTokenID(target.getSourceID());
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

