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

    static controlledUnits = [];
    static tt:any = {};
    static _self = "";

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
    static async controlTokenHandler(token, tf) {
        console.log("npc", NPCTargeting.controlledUnits);
        if (tf) {
            NPCTargeting.controlledUnits.push(token);
        } else {
            NPCTargeting.controlledUnits = NPCTargeting.controlledUnits.filter( i => i !== token); // remove token
        }
    }

    /**
     *
     * @param {User} user the user who did the targeting
     * @param {Token} token the token being targeted
     * @param {Boolean} tf is the token being targeted or untargeted
     */

    static async targetTokenHandler(user, token, tf) {
        if (tf) {
            NPCTargeting.controlledUnits.forEach(t => {
                NPCTargeting.tt.addTarget(t,token);
            });
        } else {
            NPCTargeting.controlledUnits.forEach(t => {
                NPCTargeting.tt.removeTarget(t,token);
            });
        }
    }

}

