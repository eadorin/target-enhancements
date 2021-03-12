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
        let u = await Users['instance'].get(owners[y]);
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

export async function getTokenByTokenID(id) {
    return game.scenes.active.data['tokens'].find( x => {return x.id === id});
    //return canvas.tokens.placeables.find( x => {return x.id === id});
}
export async function getTokenByTokenName(name) {
    return game.scenes.active.data['tokens'].find( x => {return x._name === name});
    // return canvas.tokens.placeables.find( x => { return x.id == id});
    //return canvas.tokens.placeables.find( x => { return x.id == game.user.id});
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
 Clear Targets https://github.com/psyny/FoundryVTT/blob/master/CozyPlayer/cozy-player/scripts/hotkeys.js
*/
export function clearTargets() {
    const targets = game.user.targets.values();
    for(let target = targets.next(); !target.done; target = targets.next())
    {
        target.value.setTarget(false, { user: game.user, releaseOthers: false });
    }

    game.user.targets.forEach( t => t['setTarget'](false, {user: game.user, releaseOthers: true, groupSelection:false }));
    
    game.user.targets = new Set();
}
