import { MODULE_NAME } from '../settings';
import { NPCTargeting } from './NPCTargeting';
import { TargetsTable } from './TargetsTable';

export class TargetClass {

    static targetsTable:TargetsTable;

    static async ready() {
        // NPCTargeting = window['NPCTargeting'];

        try {
            TargetClass.targetsTable = new TargetsTable(MODULE_NAME);
        } catch(error) {
            ui.notifications.error("You need to load the Lib-Targeting Module");
        }

        NPCTargeting.init(TargetClass.targetsTable);
    } // -- end ready


    static async targetTokenHandler(user,token,targeted) {
        await NPCTargeting.targetTokenHandler(user,token,targeted);

        console.log(MODULE_NAME,"Token is Targeted By:", TargetClass.targetsTable.getTargetSources(token));
        console.log(MODULE_NAME,"User is targeting:", TargetClass.targetsTable.getSourceTargets(user));

        // TODO ADD OPTIONS FOR PRINT ON CHAT MESSAGES
    }

    static async controlTokenHandler(token, tf) {
        await NPCTargeting.controlTokenHandler(token, tf);
    }
}

// Hooks.on("ready",TargetClass.ready);
// Hooks.on("targetToken", TargetClass.targetTokenHandler);
// Hooks.on("controlToken",TargetClass.controlTokenHandler);
