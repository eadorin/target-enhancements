/**
 * main entry point
 * Used to kickoff our target enhancements
 */

const mod = "target-enhancements";
window.myx = '';
import { __filters }  from './src/pixi-filters.js';


Array.prototype.partition = function(rule) {
    return this.reduce((acc, val) => {
      let test = rule(val);
      acc[Number(test)].push(val);
      return acc;
    }, [[], []]);
  };

class TargetEnhancements {

    icon_size = 40;

    static async ready() {
        // register game settings

    }

    static async hoverTokenEventHandler(token,tf) { 
        token.target.clear();
        if (TargetEnhancements.getTargets(await token.targeted).selfA.length) {
            TargetEnhancements.drawFoundryTargetIndicators(token);
        }
    };
 
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


    static async targetTokenEventHandler(usr, token, targeted) {
       
        // initialize some values
        var userArray = [];
        var othersArray = [];
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
  

        //-----------------------------
        //           Target
        //-----------------------------
        if (userArray.length) { TargetEnhancements.drawFoundryTargetIndicators(token);}

        //-----------------------------
        //           Tokens
        //-----------------------------
        if (!othersArray.length) { return;} // only user is ourself or no one

        // get our icons & add them to the display
        let tokensContainer = await TargetEnhancements.getTargetIcons(othersArray);
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
     * @param {array} others -- array of other User objects
     */
    static async getTargetIcons(others) {
        // icon/avatar info
        this.icon_size = canvas.dimensions.size / 3.5;
        let num_icons = others.length;

        let tc = await new PIXI.Container();
        for ( let [i, u] of others.entries() ) {
            tc.addChild( await TargetEnhancements.getIcon(u,i));
        }
        return tc;
    }

    /**
     * Creates a sprite from the selected avatar and positions around the container
     * @param {User} user -- the user to get
     * @param {int} idx  -- the current row count
     */
    static async getIcon(user,idx) {
        let icon = {};
        let padding = 2;

        // grab the user's avatar. If not available use mysteryman.
        try {
            icon = PIXI.Sprite.from(user.avatar);
        } catch (err) {
            icon = PIXI.Sprite.from("icons/svg/mystery-man.svg");
        }

        // set the icon anchor
        icon.anchor.x = 0;
        icon.anchor.y = 0;


        
        //-----------------------------
        //      Icon Positioning
        //-----------------------------

        /*
         * TODO: 
         * [-] finish different arrangements
         * [-] refactor out to Icon Class?
         */


        // Top, Bottom, Top, Bottom
        //-----------------------------
        if (idx == 0) {
            icon.position.x = icon.position.y = 0;
        } else if (idx % 2 == 0) {
            icon.position.y = this.icon_size * idx + padding;
            icon.position.x = 0;
            if (idx > 2) { icon.position.x = this.icon_size * idx + padding;}
        } else {
            icon.position.x = this.icon_size * idx + padding;
            icon.position.y = 0;
        }

        // Top to fit, bottom
        //-----------------------------

        // Bottom to fit, top
        //-----------------------------

        // Top Left, Down 1, Right 1, Down 1...
        //-----------------------------


        icon.width  = this.icon_size;
        icon.height = this.icon_size;

        // apply any selected filters
        icon.filters = await TargetEnhancements.applyFilters();
        return icon;
        
    }

    /**
     * Applies a preselected choice of filters; should refactor out
     */
    static applyFilters() {
       var filters = new ImageFilters();
       filters.DropShadow().Outline(3);
       return filters.filters;
    }
}


/**
 * dedicated class to implement some PIXI.js filters
 */
class ImageFilters {
    constructor () {
        this._filters = [];
    }
    get filters() {
        return this._filters;
    }
    DropShadow() {
        let shadow = new PIXI.filters.DropShadowFilter(); 
        shadow.blur = 4; 
        shadow.alpha = 1; 
        shadow.distance = 5;
        shadow.angle = Math.PI/4;
        this._filters.push(shadow);
        return this;
    }
    Bevel() {
        let bevel = new PIXI.filters.BevelFilter();
        this._filters.push(bevel);
        return this;
    }
    Outline(thickness = 1) {
        let outline = new PIXI.filters.OutlineFilter(thickness);
        this._filters.push(outline);
        return this;
    }
    Alpha(val) {
        let alpha = new PIXI.filters.AlphaFilter(val=1);
        this._filters.push(alpha);
        return this;
    }

}

Hooks.on("ready", TargetEnhancements.ready);
Hooks.on("targetToken", TargetEnhancements.targetTokenEventHandler);
Hooks.on("hoverToken", TargetEnhancements.hoverTokenEventHandler);
