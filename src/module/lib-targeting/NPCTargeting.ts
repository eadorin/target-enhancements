import { initHooks } from "../Hooks";
import { getCanvas } from "../settings";
import { SOURCE_TYPES_TARGETING } from "./TargetConstants";
import { TargetsTable } from "./TargetsTable";
import { TokenTarget } from "./TokenTarget";

/**
 * NPCTargeting.js -   v0.5
 *
 * Enables the GM to use NPCs as target sources, to target other Tokens
 * Requires TargetsTable.js
 *
 *
 * NPC targeting works by allowing the GM to select a source token(s) and then select their target
 * The original version of this code did not allow the GM to select multiple targets.
 */
export class NPCTargeting {

    static controlledUnits:TokenTarget[] = [];
    static tt:TargetsTable;
    static _self = "";

    constructor(table){
      NPCTargeting.init(table);
    }

    static init(table) {
        NPCTargeting.tt = table;

        if (!game.user.isGM) {
          return;
        }
    }

    /**
     * Event Handler when tokens are controlled
     * @param {Token} token the targeted token
     * @param {Boolean} tf  is token control enabled (true) or released (false)
     */
     static async controlTokenHandler(token:Token, tf:Boolean) {
        console.log("npc", NPCTargeting.controlledUnits);
        let tt = new TokenTarget(token.id, game.user.id, SOURCE_TYPES_TARGETING.SOURCE_TYPE_TOKEN);
        if (tf) {
          NPCTargeting.controlledUnits.push(tt);
        } else {
          NPCTargeting.controlledUnits = NPCTargeting.controlledUnits.filter( i => i !== tt); // remove token
        }
    }

    /**
     *
     * @param {User} user the user who did the targeting
     * @param {Token} token the token being targeted
     * @param {Boolean} tf is the token being targeted or untargeted
     */

     static async targetTokenHandler(user:User, token:Token, tf:Boolean, data?:any) {
        let tt = new TokenTarget(token.id, game.user.id, SOURCE_TYPES_TARGETING.SOURCE_TYPE_TOKEN);
        if (tf) {
          NPCTargeting.controlledUnits.forEach(t => {
            NPCTargeting.tt.addTarget(this.getTokenByTokenID(token), this.getTokenByTokenID(game.user.id), data);
          });
        } else {
          NPCTargeting.controlledUnits.forEach(t => {
            NPCTargeting.tt.removeTarget(this.getTokenByTokenID(token), this.getTokenByTokenID(game.user.id));
          });
        }
    }

    static getTargetsTable():TargetsTable{
      return NPCTargeting.tt;
    }

    // static setTargetsTable(targetsTable:TargetsTable):TargetsTable{
    //   return NPCTargeting.tt = targetsTable;
    // }

    static async isEmpty(){
      return (await NPCTargeting.tt.getAllRecords()).length <= 0;
    }

    static getTokenByTokenID(id) {
      return getCanvas().tokens.placeables.find( x => {return x.id === id});
    }
    static getTokenByTokenName(name) {
        return getCanvas().tokens.placeables.find( x => { return x.name == name});
    }

}

// Hooks.on('init', NPCTargeting.init);
//@ts-ignore
window.NPCTargeting = NPCTargeting;
