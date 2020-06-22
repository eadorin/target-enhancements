/**
 * main entry point
 * Used to kickoff our target enhancements
 * 
 *  canvas.scene.update({"flags.-=target-enhancements":null}); // fixes random issues.
 */

const mod = "target-enhancements";
window.myx = '';
import { __filters }  from './src/pixi-filters.js';
import { ImageFilters } from './src/image-filters.js';
import { TargetIndicator } from './src/TargetIndicator.js';
import * as Helpers from './src/helpers.js';

var ready = false;


Array.prototype.partition = function(rule) {
    return this.reduce((acc, val) => {
      let test = rule(val);
      acc[Number(test)].push(val);
      return acc;
    }, [[], []]);
  };

class TargetEnhancements {

    static icon_size = 40;
    static npc_targeting_key = 'npc-targeting-tokens';  // used by our flag
    static modKeyPressed = false;
    static clickedToken = "";
    static resizeToken = "";
    static resizeFlagKey = "resize-scale";
    static resizeModKeyPressed = false;


    static async ready() {
        // TODO register game settings
        ready = true;

        game.settings.register(mod,'target-indicator',{
            name: "target-enhancements.options.target-indicator.name",
            hint: "target-enhancements.options.target-indicator.hint",
            scope: "world",
            config: true,
            default: "0",
            type: String,
            choices: {
                "0" : "target-enhancements.options.target-indicator.choices.0",
                "1" : "target-enhancements.options.target-indicator.choices.1",
                "2" : "target-enhancements.options.target-indicator.choices.2"
            }
        });
        

        game.settings.register(mod,'enable-target-modifier-key', {
            name : "target-enhancements.options.enable-target-modifier-key.name",
            hint : "target-enhancements.options.enable-target-modifier-key.hint",
            scope: "world",
            config: "true",
            default: true,
            type: Boolean
        });
        game.settings.register(mod,'enable-ctrl-resize-modifier', {
            name : "target-enhancements.options.enable-ctrl-resize-modifier.name",
            hint : "target-enhancements.options.enable-ctrl-resize-modifier.hint",
            scope: "world",
            config: "true",
            default: true,
            type: Boolean
        });
        

        game.settings.register(mod,'enable-target-portraits', {
            name : "target-enhancements.options.enable-target-portraits.name",
            hint : "target-enhancements.options.enable-target-portraits.hint",
            scope: "world",
            config: "true",
            default: true,
            type: Boolean
        });

        TargetEnhancements.registerClickModifier(); // consider moving to onHoverToken()

 
            
        
        if (game.settings.get(mod,'enable-target-modifier-key')) {
            for (let x = canvas.tokens.placeables.length -1; x >=0; x--) {
                let token = canvas.tokens.placeables[x];
                token.on('mousedown',TargetEnhancements.handleTokenClick);
                try {
                    token.data.scale = token.getFlag(mod,TargetEnhancements.resizeFlagKey) || 1;
                    token.refresh();
                } catch (ex) {}
                
            }
        }
        if (!game.user.isGM) { return; }
        TargetEnhancements.registerResizeModifier();
        $('body').on('mousewheel',TargetEnhancements.resizeHandler);
    }

    /**
     * Event listener on keydown to enable resize modifier
     */
    static async registerResizeModifier() {
        if (game.settings.get(mod,'enable-ctrl-resize-modifier')) {
            $(document).keydown(function(event) {
                // resize using the 'r' key
                if (event.which == "82") {
                    TargetEnhancements.resizeModKeyPressed = true;
                }
            });
            $(document).keyup(function(event) {
                TargetEnhancements.resizeModKeyPressed = false;
            });
        }
    }

    /**
     * Event listener on keydown to enable targeting modifier
     */
    static async registerClickModifier() {
        if (game.settings.get(mod,'enable-target-modifier-key')) {
            $(document).keydown(function(event) {
                // target with the 't' key
                if (event.which == "84") {
                    TargetEnhancements.modKeyPressed = true;
                    document.body.style.cursor = 'crosshair';
                }
            });
            $(document).keyup(function(event) {
                TargetEnhancements.modKeyPressed = false;
                document.body.style.cursor = 'default';
            });
        }
    }
    
    /**
     * If using the modifier to target a mob, sets them as a target
     */
    static async handleTokenClick() {
        let token = await Helpers.getTokenByTokenID(TargetEnhancements.clickedToken);
        if (game.settings.get(mod,'enable-target-modifier-key')) {
            if (TargetEnhancements.modKeyPressed) {
                token.target.clear();
                if (!token.targeted.has(game.user)) {
                    token.setTarget(game.user, {releaseOthers: false});
                } else {
                    token.setTarget(false, {user: game.user, releaseOthers: false, groupSelection: true});
                }
            }
        }
    }

    /**
     * Have to reset existing target art on hover
     * @param {Token} token -- Token instance passed in
     * @param {*} tf 
     */
    static async hoverTokenEventHandler(token,tf) { 
        token.target.clear();
        if (TargetEnhancements.getTargets(await token.targeted).selfA.length) {
            TargetEnhancements.drawTargetIndicators(token);
        }

        TargetEnhancements.clickedToken = token.id;
        TargetEnhancements.resizeToken  = token.id;
    };


    /**
     * If mod key is pressed, resizes teh scale of the token
     * @param {Event} event  -- the mousewheel event
     */
    static async resizeHandler(event) {
        let oe = event.originalEvent;
        if (game.settings.get(mod,'enable-ctrl-resize-modifier')) {
            // 82 is the 'r' key
            if (TargetEnhancements.resizeModKeyPressed) {
                let token = await Helpers.getTokenByTokenID(TargetEnhancements.resizeToken);
                if (oe.deltaY < 0 ) {
                    token.icon.scale.x += .05; // the icon scales at a different rate
                    token.icon.scale.y += .05; // additionally scaling data maintains our changes
                    token.data.scale +=  0.2;
                } else {
                    token.icon.scale.x -= .05;
                    token.icon.scale.y -= .05;
                    token.data.scale -= 0.2;
                }
                token.setFlag(mod,TargetEnhancements.resizeFlagKey,token.data.scale);
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
    static async updateTokenEventHandler(scene,token_obj,update,dif,userId) { 
        let token = canvas.tokens.get(token_obj._id);
        console.log("Token updated:",token.icon);
        token.target.clear();
        if (TargetEnhancements.getTargets(await token.targeted).selfA.length) {
            TargetEnhancements.drawTargetIndicators(token);
        }
    };

    /**
     * Helper function to draw consistent target indicators
     * @param {Token} token -- the Token
     */
    static async drawTargetIndicators(token) {
        let selectedIndicator = game.settings.get(mod,"target-indicator");
        // playing with different filters...ignore this
        // token.target.filters = new ImageFilters().TiltShift().filters;
        // token.icon.filters = new ImageFilters().Glow().filters;

        let indicator = new TargetIndicator(token);
        indicator.drawIndicator(selectedIndicator);
    }


 
    /**
     * Splits the <set> of targets of a token into two arrays
     * @param {set} tokenTargets 
     * @return {object} -- contains 2 arrays; one with other users and one with current player
     */
    static getTargets(tokenTargets) {
        let uA = [];
        let oA = [];
        tokenTargets.forEach( u => {
            if (u.id == game.user.id) {
                uA.push(u); // current player
            } else {
                oA.push(u); // other players
            }
        });
        return {othersA: oA, selfA: uA};
    }

    /**
     * Gets the results from our flag
     */
    static async npcTokensTargetingHandler() {
        // user clicked before GM targeted anything
        if (!canvas.scene.getFlag(mod,TargetEnhancements.npc_targeting_key)) {
            return false;
        }
        return canvas.scene.getFlag(mod,TargetEnhancements.npc_targeting_key);
    }


    /**
     * When the GM controls a token, allows them to target other npcs
     * @param {Token} token  -- the token being controlled
     * @param {boolean} opt  -- taking control of the token or dropping it
     */
    static async controlTokenEventHandler(token, opt) {


        // exit out if not GM. Need to change this to check for token ownership
        if (!game.user.isGM) { return false; }
        await token.target.clear();

        let mySet = [];

        // get flag if exists, if not create it
        if (typeof canvas.scene.getFlag(mod, (TargetEnhancements.npc_targeting_key)) === 'undefined'){
            await canvas.scene.setFlag(mod, (TargetEnhancements.npc_targeting_key), mySet);
        }

        // not really a set, an array of npc token info
        mySet = canvas.scene.getFlag(mod,TargetEnhancements.npc_targeting_key);

        // cull out tokens not actively controlled.
        let myObj = {id:token.id,img:token.data.img,name:token.data.name,type:"npc"};
        if (opt) {
            if (!mySet.find(x=> x.id === token.id)) {
                mySet.push(myObj);
            }
        } else {
            mySet.splice(mySet.findIndex(x => x.id === token.id),1);
        }
        let toStore = Array.from(mySet);

        // update the flag. Have to unset first b/c sometimes it just doesn't take the setting
        canvas.scene.unsetFlag(mod,TargetEnhancements.npc_targeting_key).then( () => {
            canvas.scene.setFlag(mod, (TargetEnhancements.npc_targeting_key) , toStore);
        })
        await token.target.clear();

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
        if (game.settings.get(mod,"enable-target-portraits")) {
            try {
                await token.target.clear();
                await token.target.removeChildren();
            } catch(err) {
                // something weird happeened. return;
            }
            }
        // if for some reason we still don't have a size
        if (!tokenTargets.size) return;

        // split the targets into two arrays -- we don't need to show player their own icon
        let targets = TargetEnhancements.getTargets(tokenTargets);
        userArray = targets.selfA;
        othersArray = targets.othersA;

        // handle npcs
        let npcsArray = await TargetEnhancements.npcTokensTargetingHandler();
        if (npcsArray) {
            npcs  = npcsArray;
        }

        // only display npc updates if the GM triggered the update
        // console.log(npcs, othersArray);
        let targetingItems = await (usr.isGM) ? othersArray.concat(npcs) : othersArray;

        // targetingItems = othersArray;


        //-----------------------------
        //           Target
        //-----------------------------
        if (userArray.length) { TargetEnhancements.drawTargetIndicators(token);}

        //-----------------------------
        //           Tokens
        //-----------------------------
        if (!targetingItems.length) { return;} // only user is ourself or no one

        // TODO: update which tokens are now targeting the token, store this in a custom property or in a canvas flag
 
        if (!game.settings.get(mod,"enable-target-portraits")){return;}
        // get our icons & add them to the display
        let tokensContainer = await TargetEnhancements.getTargetIcons(targetingItems,token);
        token.target.addChild(tokensContainer);
    }


    /**
     * Iterates the list of *other* players, creates an container and adds the target Icons
     * @param {array} others -- array of other User objects (and NPC tokens)
     * @param {Token} token -- Token instance is useful for height & width;
     */
    static async getTargetIcons(others,token) {
        // icon/avatar info
        this.icon_size = canvas.dimensions.size / 3.5;
        let num_icons = others.length;

        let tc = await new PIXI.Container();


        for ( let [i, u] of others.entries() ) {
            tc.addChild( await TargetEnhancements.getIcon(u,i, token));
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
    static async getIcon(user,idx, token) {
        let icon = {};
        let padding = 2;


        // custom in case we need it
        //icon.token_id = token.id;
       // icon.user_id = user.id;

        // grab the user's avatar. If not available use mysteryman.
        try {
            if (user.avatar === "icons/svg/mystery-man.svg") {
                let t = canvas.tokens.placeables.find( (x) => { return x.actor.id == user.data.character;});
                icon = PIXI.Sprite.from(t.data.img);
            } else {
                icon = PIXI.Sprite.from(user.avatar);
            }
            

        } catch (err) {
            try {
                icon = PIXI.Sprite.from(user.img); // npc- token.actor.type === "npc"; !actor.isPC
            } catch (er) {
                icon = PIXI.Sprite.from("icons/svg/mystery-man.svg");
            }
            
        }

        // set the icon dimensions & anchor
        icon.anchor.x = 0;
        icon.anchor.y = 0;
        icon.width  = this.icon_size;
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
        if (icon_arrangement==1) {
            // Top, Bottom, Top, Bottom
            //-----------------------------
            if (idx == 0) {
                icon.position.x = icon.position.y = 0;
            } else if (idx % 2 > 0) {
                // icon.position.y = this.icon_size * idx + padding;
                icon.position.y = token.h - this.icon_size
                icon.position.x = 0;
                if (idx > 2) { icon.position.x = this.icon_size * Math.floor(idx/2) + padding;}
            } else {
                icon.position.x = this.icon_size * Math.floor(idx/2) + padding;
                icon.position.y = 0;
            }
        }

        if (icon_arrangement == 2) {
            // Top to fit, bottom
            //-----------------------------
            icon.position.y = 0;
            if (idx == 0) {
                icon.position.x = 0;
            } else {
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
            bg.drawCircle(icon.position.x + this.icon_size /2, icon.position.y + this.icon_size / 2, this.icon_size+.5);
            bg.lineStyle(3.2,0x000000);
            
            oc.lineStyle(1.2,0x000000);
            oc.drawCircle(icon.position.x + this.icon_size / 2, icon.position.y + this.icon_size / 2, this.icon_size + .5);

        }



 

        // apply any selected filters
        icon.filters = await TargetEnhancements.applyFilters();

        let p = new PIXI.Container();
        p.addChild(bg);
        p.addChild(oc);
        p.addChild(icon);
        return p;
        return icon;
        
    }

    /**
     * Applies a preselected choice of filters; should refactor out and be user-configurable
     */
    static applyFilters() {
       var filters = new ImageFilters();
       return filters.DropShadow().Outline(3).filters;
    }


    static preUpdateSceneEventHandler(sene,flags,diff,id) {
        game.user.targets.forEach( t => {
            t.target.clear();
            TargetEnhancements.drawTargetIndicators(t);
        });
    }

    static renderTokenEventHandler(a, div, data) {
        if (data instanceof Token) {
            if (token.getFlag(mod,TargetEnhancements.resizeFlagKey)) {
                token.data.scale = token.getFlag(mod,TargetEnhancements.resizeFlagKey);
            } 
        }
    }
    
    /**
     * Button Handler to clear token targets & selections
     * @param {User} user              -- the user clearing the targets
     * @param {TokenLayer} tokenlayer  -- token layer
     */
    static clearTokenTargetsHandler(user,tokenlayer) {

        user.targets.forEach( t => t.setTarget(false, {user: user, releaseOthers: true, groupSelection:false }));
    

        tokenlayer.selectObjects({
            x:0,
            y:0,
            height:0,
            releaseOptions:{},
            controlOptions:{releaseOthers:true,updateSight:true}
        });

        if (user.isGM) { canvas.scene.unsetFlag(mod,TargetEnhancements.npc_targeting_key);}

        // clear all Targets
        // canvas.tokens.objects.children.forEach( t => {
        //     if (t instanceof Token) {
        //         try {
                   
        //         } catch (ex) {

        //         }
        //     }
        // });

        return true;
    }

    /**
     * Adds the clear targets/selection button to the menu.
     * @param {array} controls -- the current controls hud array
     */
    static getSceneControlButtonsHandler(controls) {
        var icon1 = {
            name: "cancelTargets", 
            title: "Clear Targets/Selection",
            icon:"fa fa-times-circle", 
            button:true,
            onClick: function() { Hooks.call("clearTokenTargets",game.user,TokenLayer.instance);},
            layer: "TokenLayer"
        };
    
        controls[0].tools.push(icon1);
    }
    
}

/** Hooks **/
Hooks.on("ready", TargetEnhancements.ready);
Hooks.on("targetToken", TargetEnhancements.targetTokenEventHandler);
Hooks.on("hoverToken", TargetEnhancements.hoverTokenEventHandler);
Hooks.on("updateToken",TargetEnhancements.updateTokenEventHandler);
Hooks.on("render",TargetEnhancements.renderTokenEventHandler);
Hooks.on("preUpdateScene",TargetEnhancements.preUpdateSceneEventHandler);
Hooks.on("renderSceneControls",TargetEnhancements.preUpdateSceneEventHandler);
Hooks.on("controlToken",TargetEnhancements.controlTokenEventHandler);
Hooks.on("clearTokenTargets",TargetEnhancements.clearTokenTargetsHandler);
Hooks.on("getSceneControlButtons",TargetEnhancements.getSceneControlButtonsHandler);


/**
 * Bugs
 *  - Sometimes after selecting multiple on GM side, neither side updates appropriately (NPCs) -- resolved?
 *  - clear target button doesn't always update clients // event handler isn't firing
 *      game.users.updateTokenTargets(); // resolved by setting groupSelection to False -- forces token updates
 */



 /*** Utility Stuff, will be hoisted ***/
export function getKeyByValue(object, value) {
    return Object.keys(object).filter(key => object[key] === value);
}
