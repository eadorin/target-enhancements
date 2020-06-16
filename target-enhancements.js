/**
 * main entry point
 * Used to kickoff our target enhancements
 */

const mod = "target-enhancements";
window.myx = '';
import { __filters }  from './src/pixi-filters.js';
import { ImageFilters } from './src/image-filters.js';


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


    static async ready() {
        // TODO register game settings

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
    };

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
        // playing with different filters...ignore this
        // token.target.filters = new ImageFilters().TiltShift().filters;
        // token.icon.filters = new ImageFilters().Glow().filters;

        TargetEnhancements.drawFoundryTargetIndicators(token);
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
        await token.target.clear();
        await token.target.removeChildren();

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
        console.log(npcs, othersArray);
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
 

        // get our icons & add them to the display
        let tokensContainer = await TargetEnhancements.getTargetIcons(targetingItems,token);
        token.target.addChild(tokensContainer);
    }

    /**
     * Draws the default target indicators, taken from Token._refreshTarget()
     * @param {Token} token  -- a Token object
     */
    static async drawFoundryTargetIndicators(token) {
        let p = 4;
        let aw = 12;
        let h = token.h;
        let hh = token.h / 2;
        let w = token.w;
        let hw = w / 2;
        let ah = canvas.dimensions.size / 3;
        token.target.beginFill(0xFF9829, 1.0).lineStyle(1, 0x000000)
        .drawPolygon([-p,hh, -p-aw,hh-ah, -p-aw,hh+ah])
        .drawPolygon([w+p,hh, w+p+aw,hh-ah, w+p+aw,hh+ah])
        .drawPolygon([hw,-p, hw-ah,-p-aw, hw+ah,-p-aw])
        .drawPolygon([hw,h+p, hw-ah,h+p+aw, hw+ah,h+p+aw]);
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
            icon = PIXI.Sprite.from(user.avatar);
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


 

        // apply any selected filters
        icon.filters = await TargetEnhancements.applyFilters();
        return icon;
        
    }

    /**
     * Applies a preselected choice of filters; should refactor out and be user-configurable
     */
    static applyFilters() {
       var filters = new ImageFilters();
       return filters.DropShadow().Outline(3).filters;
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
        canvas.tokens.objects.children.forEach( t => {
            if (t instanceof Token) {
            }
        });

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
Hooks.on("controlToken",TargetEnhancements.controlTokenEventHandler);
Hooks.on("clearTokenTargets",TargetEnhancements.clearTokenTargetsHandler);
Hooks.on("getSceneControlButtons",TargetEnhancements.getSceneControlButtonsHandler);



/**
 * Bugs
 *  - Sometimes after selecting multiple on GM side, neither side updates appropriately (NPCs) -- resolved?
 *  - clear target button doesn't always update clients // event handler isn't firing
 *      game.users.updateTokenTargets(); // resolved by setting groupSelection to False -- forces token updates
 */