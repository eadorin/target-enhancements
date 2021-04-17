
/**
 * dedicated class to implement some PIXI.js filters
 */
export class ImageFilters {

    _filters:any = [];

    constructor () {
        this._filters = [];
    }
    get filters() {
        return this._filters;
    }

    // TODO FIND A WAY TO INTREGATED THESE IN 'foundry-pc-types'
    
    DropShadow() {
        let shadow = new PIXI.filters['DropShadowFilter'](); 
        shadow.blur = 4; 
        shadow.alpha = 1; 
        shadow.distance = 5;
        shadow.angle = Math.PI/4;
        this._filters.push(shadow);
        return this;
    }
    Bevel() {
        let bevel = new PIXI.filters['BevelFilter']();
        this._filters.push(bevel);
        return this;
    }
    Outline(thickness = 1) {
        let outline = new PIXI.filters['OutlineFilter'](thickness);
        this._filters.push(outline);
        return this;
    }
    Alpha(val?) {
        if(!val) val = 1;
        let alpha = new PIXI.filters.AlphaFilter(val=1);
        this._filters.push(alpha);
        return this;
    }
    TiltShift() {
        this._filters.push(new PIXI.filters['TiltShiftFilter']());
        return this;
    }
    Glow() {
        let glow = new PIXI.filters['GlowFilter']();
        this._filters.push(glow);
        return this;
    }

}