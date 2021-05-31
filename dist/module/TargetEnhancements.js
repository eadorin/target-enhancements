/**
 * main entry point
 * Used to kickoff our target enhancements
 *
 *  getCanvas().scene.update({"flags.-=target-enhancements":null}); // fixes random issues.
 */
// const mod = "target-enhancements";
// window.myx = '';
// import { __filters, PIXI } from './lib/pixi-filters.js';
// import { PIXI } from './libs/filters/pixi-filters.js';
import { ImageFilters } from "./image-filters.js";
import { TargetIndicator } from "./TargetIndicator.js";
import * as Helpers from "./helpers.js";
//@ts-ignore
// import ColorSetting from "../../colorsettings/colorSetting.js";
import { getCanvas, MODULE_NAME } from "./settings.js";
import { error } from "../target-enhancements.js";
import { FlagsTargeting, SOURCE_TYPES_TARGETING } from "./lib-targeting/TargetConstants.js";
import { TokenTarget } from "./lib-targeting/TokenTarget.js";
import { TargetContainer } from "./TargetContainer.js";
Array.prototype.partition = function (rule) {
    return this.reduce((acc, val) => {
        let test = rule(val);
        acc[Number(test)].push(val);
        return acc;
    }, [[], []]);
};
export class TargetEnhancements {
    /**
     * Event listener on keydown to enable resize modifier
     */
    static async registerResizeModifier() {
        if (game.settings.get(MODULE_NAME, 'enable-ctrl-resize-modifier')) {
            $(document).keydown(function (event) {
                // resize using the 'r' key
                if (event.which == 82) {
                    TargetEnhancements.resizeModKeyPressed = true;
                }
            });
            $(document).keyup(function (event) {
                TargetEnhancements.resizeModKeyPressed = false;
            });
        }
    }
    /**
     * Event listener on keydown to enable targeting modifier
     */
    //static async registerClickModifier() {
    static async canvasReadyHandler() {
        // MOD 4535992 Removed we use easy-target
        // if (game.settings.get(MODULE_NAME,'enable-target-modifier-key')) {
        //     $(document).keydown(function(event) {
        //         // target with the 't' key
        //         if (event.which == 84) {
        //             TargetEnhancements.modKeyPressed = true;
        //             document.body.style.cursor = 'crosshair';
        //         }
        //     });
        //     $(document).keyup(function(event) {
        //         TargetEnhancements.modKeyPressed = false;
        //         document.body.style.cursor = 'default';
        //     });
        //     // consider moving to onHoverToken()
        //     for (let x = getCanvas().tokens.placeables.length -1; x >=0; x--) {
        //         let token = getCanvas().tokens.placeables[x];
        //         token.on('mousedown',TargetEnhancements.handleTokenClick);
        //         try {
        //             token.data.scale = token.getFlag(MODULE_NAME,TargetEnhancements.resizeFlagKey) || 1;
        //             token.refresh();
        //         } catch (ex) {}
        //     }
        // }
        // END MOD 4535992 Removed we use easy-target
        if (!game.user.isGM) {
            return;
        }
        TargetEnhancements.registerResizeModifier();
        $('body').on('mousewheel', TargetEnhancements.resizeHandler);
        // ADDED 4535992
        try {
            getCanvas();
        }
        catch (e) {
            return;
        }
        if (game.scenes.active) {
            let targets = [];
            if (game.scenes.active.data.flags[MODULE_NAME][TargetEnhancements.npc_targeting_key]) {
                targets = game.scenes.active.data.flags[MODULE_NAME][TargetEnhancements.npc_targeting_key];
                targets.forEach((targetfounded) => {
                    const tfounded = Helpers.getTokenByTokenID(targetfounded.targetID);
                    TargetEnhancements.drawTargetIndicators(tfounded);
                });
            }
            else if (game.scenes.active.data.flags[MODULE_NAME][FlagsTargeting.targets]) {
                targets = Object.values(game.scenes.active.data.flags[MODULE_NAME][FlagsTargeting.targets].items);
                for (let i = 0; i < targets.length; i++) {
                    const targetfounded = targets[i];
                    const tfounded = Helpers.getTokenByTokenID(targetfounded.targetID);
                    TargetEnhancements.drawTargetIndicators(tfounded);
                }
            }
            if (targets && targets.length <= 0) {
                targets = TargetContainer.getAllTargets();
                for (let i = 0; i < targets.length; i++) {
                    const tfounded = Helpers.getTokenByTokenID(targets[i].targetID);
                    TargetEnhancements.drawTargetIndicators(tfounded);
                }
            }
        }
        // END ADDED 4535992  
    }
    // MOD 4535992 Removed we use easy-target
    // /**
    //  * If using the modifier to target a mob, sets them as a target
    //  */
    // static async handleTokenClick() {
    //     let token = await Helpers.getTokenByTokenID(TargetEnhancements.clickedToken);
    //     if (game.settings.get(MODULE_NAME,'enable-target-modifier-key')) {
    //         if (TargetEnhancements.modKeyPressed) {
    //              if(token['target'] && token['target']._geometry) token['target'].clear();
    //             if (!token.targeted.has(game.user)) {
    //                 token.setTarget(game.user, {releaseOthers: false});
    //             } else {
    //                 token.setTarget(false, {user: game.user, releaseOthers: false, groupSelection: true});
    //             }
    //         }
    //     }
    // }
    /**
     * Have to reset existing target art on hover
     * @param {Token} token -- Token instance passed in
     * @param {*} tf
     */
    static async hoverTokenEventHandler(token, hovered) {
        if (token['target'] && token['target']._geometry) {
            token['target'].clear();
            token['target'].removeChildren();
        }
        if (TargetEnhancements.getTargets(await token.targeted).selfA.length) {
            // only redraw if not already existing
            if (token['target'].children.length <= 0) {
                TargetEnhancements.drawTargetIndicators(token);
            }
        }
        TargetEnhancements.clickedToken = token.id;
        TargetEnhancements.resizeToken = token.id;
        // TargetEnhancements.customBorderColorsInternal();
        let text = "";
        var line = new PIXI.Graphics();
        switch (token.data.disposition) {
            case 1:
                text = TargetEnhancements.friendly_text;
                line.lineStyle(3, 0x00FF00);
                break;
            case 0:
                text = TargetEnhancements.neutral_text;
                line.lineStyle(3, 0x0000FF);
                break;
            default:
                text = TargetEnhancements.hostile_text;
                line.lineStyle(3, 0xFF0000);
                break;
        }
        line.moveTo(0, 0);
        line.drawDashLine(token.w, 0, 10, 6);
        line.drawDashLine(token.w, token.h, 10, 6);
        // line.drawDashLine(0,token.h+1,10,6);
        // line.drawDashLine(0,0,10,6);
        line.moveTo(0, 0);
        line.drawDashLine(0, token.h + 1, 10, 6);
        line.drawDashLine(token.w, token.h + 1, 10, 6);
        text.position.set(0, -25);
        if (game.settings.get(MODULE_NAME, 'enable-colorblind-features')) {
            if (hovered) {
                token.addChild(text);
                token.addChild(line);
            }
            else {
                token.removeChild(text);
                for (let x = 0; x <= token.children.length; x++) {
                    if (token.children[x]['line']) {
                        if (token.children[x]['line'].width == 3) {
                            token.removeChild(token.children[x]);
                        }
                    }
                }
            } // end if tf
        } // end if enable
    }
    ;
    /**
     * If mod key is pressed, resizes teh scale of the token
     * @param {Event} event  -- the mousewheel event
     */
    static async resizeHandler(event) {
        let oe = event.originalEvent;
        if (game.settings.get(MODULE_NAME, 'enable-ctrl-resize-modifier')) {
            // 82 is the 'r' key
            if (TargetEnhancements.resizeModKeyPressed) {
                let token = await Helpers.getTokenByTokenID(TargetEnhancements.resizeToken);
                if (oe.deltaY < 0) {
                    // token.icon.scale.x += .05; // the icon scales at a different rate
                    // token.icon.scale.y += .05; // additionally scaling data maintains our changes
                    token.scale.x += .05; // the icon scales at a different rate
                    token.scale.y += .05; // additionally scaling data maintains our changes
                    token.data.scale += 0.2;
                }
                else {
                    // token.icon.scale.x -= .05;
                    // token.icon.scale.y -= .05;
                    token.scale.x -= .05;
                    token.scale.y -= .05;
                    token.data.scale -= 0.2;
                }
                token.setFlag(MODULE_NAME, TargetEnhancements.resizeFlagKey, token.data.scale);
            }
        }
    }
    /**
     * Have to reset existing target art on TokenUpdate
     * @param {Scene} scene -- The current Scene
     * @param {Token} token_obj -- token instance
     * @param {*} update -- the data being updated
     * @param {*} dif
     * @param {*} userId -- user who made the change
     */
    static async updateTokenEventHandler(scene, token_obj, update, dif, userId) {
        let token = getCanvas().tokens.get(token_obj._id);
        // console.log("Token updated:",token.icon);
        try {
            token['target'].clear(); // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
            //token['target'].removeChildren();
        }
        catch (error) { }
        // patch for issue #11. Only fixes it for DND I think :(
        try {
            if (token_obj.actorData.data.attributes.hp.value == 0) {
                return;
            }
        }
        catch (error) { }
        // if (token?.targeted && TargetEnhancements.getTargets(await token.targeted).selfA.length) {
        //     TargetEnhancements.drawTargetIndicators(token);
        // }
    }
    ;
    /**
     * Helper function to draw consistent target indicators
     * @param {Token} token -- the Token
     */
    static async drawTargetIndicators(token) {
        let selectedIndicator = game.settings.get(MODULE_NAME, "target-indicator");
        if (game.settings.get(MODULE_NAME, "enable-better-target")) {
            selectedIndicator = "5";
        }
        // playing with different filters...ignore this
        // token['target'].filters = new ImageFilters().TiltShift().filters;
        // token.icon.filters = new ImageFilters().Glow().filters;
        // only redraw if not already existing
        if (token['target'].children.length <= 0) {
            let indicator = new TargetIndicator(token);
            await indicator.create(selectedIndicator);
        }
        //MOD 4535992 2021-04-13
        // Determine whether the current user has target and any other users
        //const [others, user] = Array.from(token.targeted).partition(u => u === game.user);
        //const userTarget = user.length;
        // For other users, draw offset pips
        // for (let [i, u] of others.entries()) {
        // 	let color = colorStringToHex(u['data'].color);
        // 	ZZZ.beginFill(color, 1.0).lineStyle(2, 0x0000000).drawCircle(2 + (i * 8), 0, 6);
        // }
        //END MOD 4535992 2021-04-13
    }
    /**
     * Splits the <set> of targets of a token into two arrays
     * @param {set} tokenTargets
     * @return {object} -- contains 2 arrays; one with other users and one with current player
     */
    static getTargets(tokenTargets) {
        let uA = [];
        let oA = [];
        tokenTargets.forEach(u => {
            if (u.id == game.user.id) {
                uA.push(u); // current player
            }
            else {
                oA.push(u); // other players
            }
        });
        return { othersA: oA, selfA: uA };
    }
    /**
     * Gets the results from our flag
     */
    static async npcTokensTargetingHandler() {
        // user clicked before GM targeted anything
        if (!getCanvas().scene.getFlag(MODULE_NAME, TargetEnhancements.npc_targeting_key)) {
            // return false; // REMOVED 4535992
            return []; // MOD 4535992
        }
        return await getCanvas().scene.getFlag(MODULE_NAME, TargetEnhancements.npc_targeting_key);
    }
    /**
     * When the GM controls a token, allows them to target other npcs
     * @param {Token} token  -- the token being controlled
     * @param {boolean} opt  -- taking control of the token or dropping it
     */
    static async controlTokenEventHandler(token, opt) {
        // exit out if not GM. Need to change this to check for token ownership
        if (!game.user.isGM) {
            return false;
        }
        await token['target'].clear();
        let mySet = [];
        // get flag if exists, if not create it
        if (typeof getCanvas().scene.getFlag(MODULE_NAME, (TargetEnhancements.npc_targeting_key)) === 'undefined') {
            await getCanvas().scene.setFlag(MODULE_NAME, (TargetEnhancements.npc_targeting_key), mySet);
        }
        // not really a set, an array of npc token info
        mySet = getCanvas().scene.getFlag(MODULE_NAME, TargetEnhancements.npc_targeting_key);
        console.log(MODULE_NAME, mySet);
        // cull out tokens not actively controlled.
        let myObj = {
            id: token.id,
            img: token.data.img,
            name: token.data.name,
            type: "npc"
        };
        if (opt) {
            if (!mySet.find(x => x.id === token.id)) {
                mySet.push(myObj);
            }
        }
        else {
            mySet.splice(mySet.findIndex(x => x.id === token.id), 1);
        }
        let toStore = Array.from(mySet);
        // update the flag. Have to unset first b/c sometimes it just doesn't take the setting
        //getCanvas().scene.unsetFlag(MODULE_NAME,TargetEnhancements.npc_targeting_key).then( () => {
        getCanvas().scene.setFlag(MODULE_NAME, TargetEnhancements.npc_targeting_key, toStore);
        //});
        // MOD 4535992
        await TargetContainer.targetClassControlTokenHandler(token, opt);
        // get flag if exists, if not create it
        if (typeof getCanvas().scene.getFlag(MODULE_NAME, (FlagsTargeting.targets)) === 'undefined') {
            await getCanvas().scene.setFlag(MODULE_NAME, (FlagsTargeting.targets), mySet);
        }
        // not really a set, an array of npc token info
        let mySetTargets = getCanvas().scene.getFlag(MODULE_NAME, FlagsTargeting.targets);
        let ttt = new TokenTarget(token.id, game.user.id, SOURCE_TYPES_TARGETING.SOURCE_TYPE_TOKEN);
        if (opt) {
            mySetTargets.push(ttt);
        }
        else {
            mySetTargets.splice(mySetTargets.findIndex(x => x.targetID === ttt.targetID), 1);
        }
        let toStoreTargets = Array.from(mySetTargets);
        // update the flag. Have to unset first b/c sometimes it just doesn't take the setting
        //getCanvas().scene.unsetFlag(MODULE_NAME,FlagsTargeting.targets).then( () => {
        getCanvas().scene.setFlag(MODULE_NAME, (FlagsTargeting.targets), toStoreTargets);
        //});
        //END MOD 4535992
        return;
    }
    /**
     * Fires when a token has been Targetted
     * @param {User} usr -- User object
     * @param {Token} token  -- Token object
     * @param {Boolean} targeted -- Is targeted or just is clicked?
     */
    static async targetTokenEventHandler(usr, token, targeted) {
        // initialize some values
        var userArray = [];
        var othersArray = [];
        var npcs = [];
        let tokenTargets = await token.targeted; // this takes time to arrive
        // clear any existing items/icons
        // // if (game.settings.get(mod,"enable-target-portraits")) {
        try {
            await token['target'].clear(); // indicator & baubles // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
            await token['target'].removeChildren(); // baubles // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
        }
        catch (err) {
            // something weird happeened. return;
            error(err);
        }
        // // }
        // if for some reason we still don't have a size
        if (!tokenTargets.size) {
            return;
        }
        // split the targets into two arrays -- we don't need to show player their own icon
        let targets = TargetEnhancements.getTargets(tokenTargets);
        userArray = targets.selfA;
        othersArray = targets.othersA;
        // handle npcs
        let npcsArray = await TargetEnhancements.npcTokensTargetingHandler();
        if (npcsArray) {
            npcs = npcsArray;
        }
        // only display npc updates if the GM triggered the update
        // console.log(npcs, othersArray);
        let targetingItems = await (usr.isGM) ? othersArray.concat(npcs) : othersArray;
        // targetingItems = othersArray;
        // MOD 4535992 ADD User Icon if no token was selected on prior
        // if(targetingItems.length == 0 && game.user.targets.size>0){
        //     game.user.targets.forEach((i, t) => {
        //         var myTarget = t.actor.data;
        //         if(t.actor.data.type=="npc"){
        //             npcs.push(myTarget);
        //         }else{
        //             othersArray.push(myTarget);
        //         }
        //     });
        //     // getCanvas().scene.setFlag(MODULE_NAME,TargetEnhancements.npc_targeting_key,npcs);
        //     targetingItems = await (usr.isGM) ? othersArray.concat(npcs) : othersArray;
        // }
        // END MOD 4535992
        // if not using our indicators, then redraw the baubles
        if (!game.settings.get(MODULE_NAME, "enable-target-portraits")) {
            for (let [i, u] of othersArray.entries()) {
                let color = colorStringToHex(u.data.color);
                token['target'].beginFill(color, 1.0).lineStyle(2, 0x0000000).drawCircle(2 + (i * 8), 0, 6); // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
            }
        }
        //-----------------------------
        //           Target
        //-----------------------------
        if (userArray.length) {
            TargetEnhancements.drawTargetIndicators(token);
        }
        //-----------------------------
        //           Tokens
        //-----------------------------
        if (!targetingItems.length) {
            return; // only user is ourself or no one
        }
        // TODO: update which tokens are now targeting the token, store this in a custom property or in a canvas flag
        if (!game.settings.get(MODULE_NAME, "enable-target-portraits")) {
            return;
        }
        // get our icons & add them to the display
        let tokensContainer = await TargetEnhancements.getTargetIcons(targetingItems, token);
        token['target'].addChild(tokensContainer); // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
        return;
    }
    /**
     * Iterates the list of *other* players, creates an container and adds the target Icons
     * @param {array} others -- array of other User objects (and NPC tokens)
     * @param {Token} token -- Token instance is useful for height & width;
     */
    static async getTargetIcons(others, token) {
        // icon/avatar info
        this.icon_size = getCanvas().dimensions.size / 3.5;
        let num_icons = others.length;
        let tc = await new PIXI.Container();
        for (let [i, u] of others.entries()) {
            tc.addChild(await TargetEnhancements.getIcon(u, i, token));
        }
        //tc.token_id = token.id;
        return tc;
    }
    /**
     * Creates a sprite from the selected avatar and positions around the container
     * @param {User} user -- the user to get
     * @param {int} idx  -- the current row count
     * @param {Token} token -- PIXI.js container for height & width (the token)
     */
    static async getIcon(user, idx, token) {
        let icon = {};
        let padding = 2;
        // custom in case we need it
        //icon.token_id = token.id;
        // icon.user_id = user.id;
        // grab the user's avatar. If not available use mysteryman.
        try {
            if (user.avatar === "icons/svg/mystery-man.svg") {
                let t = getCanvas().tokens.placeables.find((x) => { return x.actor.id == user.data.character; });
                icon = PIXI.Sprite.from(t.data.img);
            }
            else {
                icon = PIXI.Sprite.from(user.avatar);
            }
        }
        catch (err) {
            try {
                //@ts-ignore
                icon = PIXI.Sprite.from(user.img); // npc- token.actor.type === "npc"; !actor.isPC
            }
            catch (er) {
                icon = PIXI.Sprite.from("icons/svg/mystery-man.svg");
            }
        }
        // set the icon dimensions & anchor
        icon.anchor.x = 0;
        icon.anchor.y = 0;
        icon.width = this.icon_size;
        icon.height = this.icon_size;
        //-----------------------------
        //      Icon Positioning
        //-----------------------------
        /*
         * TODO:
         * [-] finish different arrangements
         * [-] refactor out to Icon Class?
         */
        let icon_arrangement = 1;
        if (icon_arrangement == 1) {
            // Top, Bottom, Top, Bottom
            //-----------------------------
            if (idx == 0) {
                icon.position.x = icon.position.y = 0;
            }
            else if (idx % 2 > 0) {
                // icon.position.y = this.icon_size * idx + padding;
                icon.position.y = token.h - this.icon_size;
                icon.position.x = 0;
                if (idx > 2) {
                    icon.position.x = this.icon_size * Math.floor(idx / 2) + padding;
                }
            }
            else {
                icon.position.x = this.icon_size * Math.floor(idx / 2) + padding;
                icon.position.y = 0;
            }
        }
        if (icon_arrangement == 2) {
            // Top to fit, bottom
            //-----------------------------
            icon.position.y = 0;
            if (idx == 0) {
                icon.position.x = 0;
            }
            else {
                icon.position.x = this.icon_size * idx + padding;
            }
        }
        // Bottom to fit, top
        //-----------------------------
        // Top Left, Down 1, Right 1, Down 1...
        //-----------------------------
        let bg = new PIXI.Graphics();
        let oc = new PIXI.Graphics();
        let drawbox = true;
        let drawCircle = false;
        if (drawbox) {
            bg.beginFill(colorStringToHex((user.color) ? user.color : '#000000'), .4);
            bg.drawRect(icon.position.x - 1, icon.position.y - 1, this.icon_size + 1, this.icon_size + 1);
            bg.endFill();
        }
        if (drawCircle) {
            bg.beginFill(colorStringToHex((user.color) ? user.color : '#000000'), .4);
            bg.drawCircle(icon.position.x + this.icon_size / 2, icon.position.y + this.icon_size / 2, this.icon_size + .5);
            bg.lineStyle(3.2, 0x000000);
            oc.lineStyle(1.2, 0x000000);
            oc.drawCircle(icon.position.x + this.icon_size / 2, icon.position.y + this.icon_size / 2, this.icon_size + .5);
        }
        // apply any selected filters
        icon.filters = await TargetEnhancements.applyFilters();
        let p = new PIXI.Container();
        p.addChild(bg);
        p.addChild(oc);
        p.addChild(icon);
        return p;
        //return icon;
    }
    /**
     * Applies a preselected choice of filters; should refactor out and be user-configurable
     */
    static applyFilters() {
        var filters = new ImageFilters();
        // TODO FIND A WAY TO INTREGATED THESE IN 'foundry-pc-types'
        return filters.DropShadow().Outline(3).filters;
        //return filters.Alpha().filters;
    }
    static preUpdateSceneEventHandler(scene, flags, diff, id) {
        // MOD p4535992 REMOVED NOT NEED THIS ?
        /*
        game.user.targets.forEach( t => {
            t['target'].clear();  // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
            t['target'].removeChild();
            TargetEnhancements.drawTargetIndicators(t);
        });
        */
        // END MOD p4535992 REMOVED NOT NEED THIS ?  
    }
    static renderTokenEventHandler(a, div, data) {
        if (data instanceof Token) {
            let token = data;
            if (token.getFlag(MODULE_NAME, TargetEnhancements.resizeFlagKey)) {
                token.data.scale = token.getFlag(MODULE_NAME, TargetEnhancements.resizeFlagKey);
            }
        }
    }
    /**
     * Button Handler to clear token targets & selections
     * @param {User} user              -- the user clearing the targets
     * @param {TokenLayer} tokenlayer  -- token layer
     */
    static async clearTokenTargetsHandler(user, tokenlayer) {
        user.targets.forEach(t => t.setTarget(false, {
            user: user,
            releaseOthers: true,
            groupSelection: false
        }));
        // This adds handling to untarget and remove any animations
        for (let token of game.user.targets) {
            if (token.targeted) {
                token.targeted.clear();
            }
            token['target'].clear(); // indicator & baubles // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
            token['target'].removeChildren(); // baubles // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
            //token.unsetFlag(MODULE_NAME,FlagsTargeting.target);
        }
        game.user.targets.clear();
        // if (user.isGM) {
        //     getCanvas().scene.unsetFlag(MODULE_NAME,TargetEnhancements.npc_targeting_key);
        // }
        /*
        getCanvas().scene.unsetFlag(MODULE_NAME,TargetEnhancements.npc_targeting_key);
        getCanvas().scene.unsetFlag(MODULE_NAME,FlagsTargeting.targets);
        if(game.scenes.active.data.flags[MODULE_NAME][TargetEnhancements.npc_targeting_key]){
            game.scenes.active.data.flags[MODULE_NAME][TargetEnhancements.npc_targeting_key] = null;
        }
        if(game.scenes.active.data.flags[MODULE_NAME][FlagsTargeting.targets]){
            game.scenes.active.data.flags[MODULE_NAME][FlagsTargeting.targets] = null;
        }
        if(game.scenes.active.data.flags[MODULE_NAME]){
            await game.scenes.active.unsetFlag(MODULE_NAME,FlagsTargeting.targets);
        }
        */
        // ADDED AND REMOVED 4535992
        // //Helpers.clearTargets();
        //game.users['updateTokenTargets']();
        return true;
    }
    /**
     * Adds the clear targets/selection button to the menu.
     * @param {array} controls -- the current controls hud array
     */
    static getSceneControlButtonsHandler(controls) {
        let control = controls.find(c => c.name === "token") || controls[0];
        control.tools.push({
            name: "cancelTargets",
            title: "Clear Targets/Selection",
            icon: "fa fa-times-circle",
            //visible: game.settings.get(MODULE_NAME, "XXX"),
            button: true,
            onClick: () => {
                control.activeTool = "select";
                Hooks.call("clearTokenTargets", game.user, TargetEnhancements.clearTokenTargetsHandler(game.user, null));
                return;
            },
            layer: "TokenLayer"
        });
        /*
        var icon1 = {
            name: "cancelTargets",
            title: "Clear Targets/Selection",
            icon:"fa fa-times-circle",
            button:true,
            onClick: function() { Hooks.call("clearTokenTargets",game.user,TokenLayer.instance);},
            layer: "TokenLayer"
        };
        controls[0].tools.push(icon1);
        */
    }
    static async preCreateSceneHandler() {
        // REMOVED 4535992
        //TargetEnhancements.clearTokenTargetsHandler(game.user,null);
    }
}
TargetEnhancements.icon_size = 40;
TargetEnhancements.npc_targeting_key = 'npc-targeting-tokens'; // used by our flag
TargetEnhancements.modKeyPressed = false;
TargetEnhancements.clickedToken = "";
TargetEnhancements.resizeToken = "";
TargetEnhancements.resizeFlagKey = "resize-scale";
TargetEnhancements.resizeModKeyPressed = false;
TargetEnhancements.friendly_text = new PIXI.Text('Friendly Unit', { fontFamily: 'Signika', fontSize: 24, fill: 0x00ff10, align: 'center' });
TargetEnhancements.neutral_text = new PIXI.Text('Neutral Unit', { fontFamily: 'Signika', fontSize: 24, fill: 0xff1010, align: 'center' });
TargetEnhancements.hostile_text = new PIXI.Text('Hostile Unit', { fontFamily: 'Signika', fontSize: 24, fill: 0xFF0000, align: 'center' });
/**
 * Helper function to draw consistent target indicators
 * @param {Token} token -- the Token
 */
TargetEnhancements.TokenPrototypeRefreshTargetHandler = async function (wrapped, ...args) {
    //let token = args[0];
    let token = this;
    TargetEnhancements.TokenPrototypeRefreshTargetHandlerinternal(token);
    return wrapped(...args);
};
TargetEnhancements.TokenPrototypeRefreshTargetHandlerinternal = async function (token) {
    if (token['target'] && token['target']._geometry) {
        token['target'].clear(); // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC
        token['target'].removeChildren();
    }
    if (!token.targeted.size) {
        return;
    }
    // Determine whether the current user has target and any other users
    const [others, users] = Array.from(token.targeted).partition(u => u === game.user);
    const userTarget = users.length;
    // For the current user, draw the target arrows
    /*
    if (userTarget) {
        TargetEnhancements.drawTargetIndicators(token);
    }

    // TODO TO INTEGRATE ?????
    // For other users, draw offset pips
    for (let [i, u] of others.entries()) {
        let color = colorStringToHex(u['data'].color);
        //token['target'].beginFill(color, 1.0).lineStyle(2, 0x0000000).drawCircle(2 + (i * 8), 0, 6);
        if(token.getFlag(MODULE_NAME,FlagsTargeting.target)){
            token.setFlag(
                MODULE_NAME,
                FlagsTargeting.target,
                (<PIXI.Graphics>token.getFlag(MODULE_NAME,FlagsTargeting.target)).beginFill(color, 1.0).lineStyle(2, 0x0000000).drawCircle(2 + (i * 8), 0, 6)
            );

        }
    }
    */
    if (userTarget) {
        if (game.scenes.active) {
            if ((typeof game.scenes.active.getFlag(MODULE_NAME, FlagsTargeting.targets)) !== 'undefined') {
                const myTargets = game.scenes.active.getFlag(MODULE_NAME, FlagsTargeting.targets);
                if (myTargets && myTargets.length > 0) {
                    myTargets.forEach(element => {
                        const targetId = element.targetID;
                        const targetToken = getCanvas().tokens.placeables.find((x) => { return x.id === targetId; });
                        TargetEnhancements.drawTargetIndicators(targetToken);
                    });
                    // For other users, draw offset pips
                    for (let [i, u] of others.entries()) {
                        let color = colorStringToHex(u['data'].color);
                        //token['target'].beginFill(color, 1.0).lineStyle(2, 0x0000000).drawCircle(2 + (i * 8), 0, 6);
                        if (token.getFlag(MODULE_NAME, FlagsTargeting.target)) {
                            token.setFlag(MODULE_NAME, FlagsTargeting.target, token.getFlag(MODULE_NAME, FlagsTargeting.target).beginFill(color, 1.0).lineStyle(2, 0x0000000).drawCircle(2 + (i * 8), 0, 6));
                        }
                        TargetEnhancements.drawTargetIndicators(token);
                    }
                }
            }
        }
    }
};
/**
 * Bugs
 *  - Sometimes after selecting multiple on GM side, neither side updates appropriately (NPCs) -- resolved?
 *  - clear target button doesn't always update clients // event handler isn't firing
 *      game.users.updateTokenTargets(); // resolved by setting groupSelection to False -- forces token updates
 */
TargetEnhancements.customBorderColors = function (wrapped, ...args) {
    if (game.settings.get(MODULE_NAME, "enable-color")) {
        let mycolor;
        if (this._controlled) {
            mycolor = 0xFF9829; // Controlled
        }
        else if (this._hover) {
            let d = parseInt(this.data.disposition);
            if (!game.user.isGM && this.owner) {
                mycolor = 0xFF9829; // Owner
            }
            else if (this.actor && this.actor.hasPlayerOwner) {
                mycolor = 0x33BC4E; // Party Member
            }
            else if (d === 1) {
                mycolor = colorStringToHex(game.settings.get(MODULE_NAME, "friendly-color")); // Friendly NPC
            }
            else if (d === 0) {
                mycolor = colorStringToHex(game.settings.get(MODULE_NAME, "neutral-color")); // Neutral NPC
            }
            else {
                mycolor = colorStringToHex(game.settings.get(MODULE_NAME, "hostile-color")); // Hostile NPC
            }
        }
        else {
            mycolor = null;
        }
        this.border._fillStyle.color = mycolor;
        this.border._fillStyle.visible = true;
    }
    return wrapped(...args);
};
TargetEnhancements.drawDashLine = function (...args) {
    const [toX, toY, dash = 16, gap = 8] = args;
    const lastPosition = this.currentPath.points;
    const currentPosition = {
        x: lastPosition[lastPosition.length - 2] || 0,
        y: lastPosition[lastPosition.length - 1] || 0
    };
    const absValues = {
        toX: Math.abs(toX),
        toY: Math.abs(toY)
    };
    for (; Math.abs(currentPosition.x) < absValues.toX ||
        Math.abs(currentPosition.y) < absValues.toY;) {
        currentPosition.x =
            Math.abs(currentPosition.x + dash) < absValues.toX
                ? currentPosition.x + dash
                : toX;
        currentPosition.y =
            Math.abs(currentPosition.y + dash) < absValues.toY
                ? currentPosition.y + dash
                : toY;
        this.lineTo(currentPosition.x, currentPosition.y);
        currentPosition.x =
            Math.abs(currentPosition.x + gap) < absValues.toX
                ? currentPosition.x + gap
                : toX;
        currentPosition.y =
            Math.abs(currentPosition.y + gap) < absValues.toY
                ? currentPosition.y + gap
                : toY;
        this.moveTo(currentPosition.x, currentPosition.y);
    }
    //return wrapped(...args);
};
/**
 * This adds handling to untarget and remove any animations
 * The tokenDelete event is called after a token is destroyed which is too late to handle un-targeting
 */
TargetEnhancements.tokenDeleteHandler = function (wrapped, ...args) {
    this.targeted.forEach((user) => user.targets.forEach((token) => {
        token.setTarget(false, { user: user, releaseOthers: true, groupSelection: false });
        token['target'].clear();
        //token['target'].removeChildren();
    }));
    return wrapped(...args);
};
/**
 * If using the modifier to target a mob, sets them as a target
 * TODO CHECK OUT THIS FUNCTION WITH lib-wrapper
 */
TargetEnhancements.handleTokenClick = async function (wrapped, ...args) {
    const [event] = args;
    let token = await Helpers.getTokenByTokenID(TargetEnhancements.clickedToken);
    if (game.settings.get(MODULE_NAME, 'enable-target-modifier-key')) {
        if (TargetEnhancements.modKeyPressed) {
            if (token['target'] && token['target']._geometry) {
                token['target'].clear();
                //token['target'].removeChildren();
            }
            if (!token.targeted.has(game.user)) {
                //token.setTarget(game.user, {releaseOthers: false});
                token.setTarget(true, { releaseOthers: false });
            }
            else {
                token.setTarget(false, { user: game.user, releaseOthers: false, groupSelection: true });
            }
        }
    }
    else {
        // DEFAULT IS EASY TARGET BEHAVIOUR
        if (event.altKey && event.key === 'C') {
            game.user.targets.forEach(token => token.setTarget(false, { releaseOthers: false, groupSelection: true }));
            game.user.broadcastActivity({ targets: game.user.targets['ids'] });
        }
    }
    return wrapped(...args);
};
// /**
//  * Bugs
//  *  - Sometimes after selecting multiple on GM side, neither side updates appropriately (NPCs) -- resolved?
//  *  - clear target button doesn't always update clients // event handler isn't firing
//  *      game.users.updateTokenTargets(); // resolved by setting groupSelection to False -- forces token updates
//  */
// (function customBorderColors() {
//     Token.prototype['_getBorderColor'] = function() {
//         if (this._controlled) return 0xFF9829;                    // Controlled
//         else if (this._hover) {
//             let d = parseInt(this.data.disposition);
//             if (!game.user.isGM && this.owner) return 0xFF9829;       // Owner
//             else if (this.actor && this.actor.hasPlayerOwner) return 0x33BC4E;  // Party Member
//             else if (d === 1) return colorStringToHex(game.settings.get(MODULE_NAME,"friendly-color"));                        // Friendly NPC
//             else if (d === 0) return colorStringToHex(game.settings.get(MODULE_NAME,"neutral-color"));                        // Neutral NPC
//             else return colorStringToHex(game.settings.get(MODULE_NAME,"hostile-color"));                                     // Hostile NPC
//         }
//         else return null;
//     }
// });
// PIXI.Graphics.prototype['drawDashLine'] = function(toX, toY, dash = 16, gap = 8) {
//     const lastPosition = this.currentPath.points;
//     const currentPosition = {
//       x: lastPosition[lastPosition.length - 2] || 0,
//       y: lastPosition[lastPosition.length - 1] || 0
//     };
//     const absValues = {
//       toX: Math.abs(toX),
//       toY: Math.abs(toY)
//     };
//     for (
//       ;
//       Math.abs(currentPosition.x) < absValues.toX ||
//       Math.abs(currentPosition.y) < absValues.toY;
//     ) {
//       currentPosition.x =
//         Math.abs(currentPosition.x + dash) < absValues.toX
//           ? currentPosition.x + dash
//           : toX;
//       currentPosition.y =
//         Math.abs(currentPosition.y + dash) < absValues.toY
//           ? currentPosition.y + dash
//           : toY;
//       this.lineTo(currentPosition.x, currentPosition.y);
//       currentPosition.x =
//         Math.abs(currentPosition.x + gap) < absValues.toX
//           ? currentPosition.x + gap
//           : toX;
//       currentPosition.y =
//         Math.abs(currentPosition.y + gap) < absValues.toY
//           ? currentPosition.y + gap
//           : toY;
//       this.moveTo(currentPosition.x, currentPosition.y);
//     }
//   };
