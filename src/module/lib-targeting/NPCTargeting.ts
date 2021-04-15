import { TargetsTable } from "./TargetsTable";

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

    controlledUnits:Token[] = [];
    tt:TargetsTable;
    _self = "";

    init(table) {
        this.tt = table;

        if (!game.user.isGM) {
          return;
        }
    }

    /**
     * Event Handler when tokens are controlled
     * @param {Token} token the targeted token
     * @param {Boolean} tf  is token control enabled (true) or released (false)
     */
    async controlTokenHandler(token:Token, tf:Boolean) {
        console.log("npc", this.controlledUnits);
        if (tf) {
          this.controlledUnits.push(token);
        } else {
          this.controlledUnits = this.controlledUnits.filter( i => i !== token); // remove token
        }
    }

    /**
     *
     * @param {User} user the user who did the targeting
     * @param {Token} token the token being targeted
     * @param {Boolean} tf is the token being targeted or untargeted
     */

    async targetTokenHandler(user:User, token:Token, tf:Boolean) {
        if (tf) {
          this.controlledUnits.forEach(t => {
            this.tt.addTarget(t,token);
          });
        } else {
          this.controlledUnits.forEach(t => {
            this.tt.removeTarget(t,token);
          });
        }
    }

    setNewTargetsTable(targetsTable:TargetsTable){
      this.tt = targetsTable;
    }

    getTargetsTable():TargetsTable{
      return this.tt;
    }

}

