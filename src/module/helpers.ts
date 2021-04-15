import { Flags, FlagScope } from "./lib-targeting/TargetsTable";
import { getCanvas } from "./settings";
import { TargetContainer } from "./TargetContainer";
import { TargetEnhancements } from "./TargetEnhancements";

/**
 * Some utility functions
 * v0.3
 */
export function getKeyByValue(object, value) {
    return Object.keys(object).filter(key => object[key] === value);
}

export async function getTokenOwner(token, includeGM=false) {
    let owners = getKeyByValue(token.actor.data.permission,3);
    let ret = [];
    for (let y = 0; y < owners.length; y++) {
        let u = await Users.instance.get(owners[y]);
        if (includeGM) {
            ret.push(u);
            continue;
        } else {
            if (!u) { ret.push(u);continue;}
            if (!game.user.isGM) { ret.push(u);}
        }
    }
    return ret;
}

export function getTokenByTokenID(id) {
    // return await game.scenes.active.data.tokens.find( x => {return x.id === id});
    return getCanvas().tokens.placeables.find( x => {return x.id === id});
}
export function getTokenByTokenName(name) {
    // return await game.scenes.active.data.tokens.find( x => {return x._name === name});
    return getCanvas().tokens.placeables.find( x => { return x.name == name});
    // return getCanvas().tokens.placeables.find( x => { return x.id == game.user.id});
}

export function getInput(prompt) {
    return new Promise(resolve => {
        new Dialog({
            title: prompt,
            content: '<div align="center"><input id="dialog_box" style="width:375px"></input></div>',
            buttons: {
                ok: {
                    label: "OK",
                    callback: () => {
                        //resolve(document.getElementById("dialog_box").value)
                        resolve(document.getElementById("dialog_box").nodeValue)
                    }
                }
            },
            default:"ok"
        })['render'](true);
    });
}

/*
 * Clear Targets https://github.com/psyny/FoundryVTT/blob/master/CozyPlayer/cozy-player/scripts/hotkeys.js
 */
export const clearTargets = async function() {
    // const targets = game.user.targets.values();
    // for(let target = targets.next(); !target.done; target = targets.next())
    // {
    //     target.value.setTarget(
    //         false,
    //         {
    //             user: game.user,
    //             releaseOthers: true,
    //             groupSelection:false
    //         }
    //     );
    // }
    game.user.targets.forEach(
        t => t.setTarget(
            false,
            {
                user: game.user,
                releaseOthers: true,
                groupSelection:false
            }
        )
    );

    // This adds handling to untarget and remove any animations
    for (let token of game.user.targets) {
        // MOD 4535992 REMOVED AND MODIFY

        // if(token['target']){
        //     token['target']['_lineStyle'].texture.destroy();
        //     token['target']['_fillStyle'].visible = false;
        //     token['target']['fill.visible'] = false;
        //     token['target']['graphicsData'].length = 0;
        // }

        TargetContainer.npcTargeting.targetTokenHandler(game.user, token, false);

        if(token.targeted){
            token.targeted.clear();
        }
        // END MOD 4535992 REMOVED AND MODIFY
    }

    //game.user.targets = new Set();
    game.user.targets.clear();
}
