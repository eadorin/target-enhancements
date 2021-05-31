/**
 * Generic class to hold our records
 */
export class TokenTarget {
    // targetGraphics:PIXI.Graphics;
    // id:string;
    // img:string;
    // name:string;
    // type:string;
    constructor(targetID, sourceID, sourceType) {
        // this.id = sourceID+"_"+targetID;
        this.targetID = targetID;
        this.sourceID = sourceID;
        this.sourceType = sourceType;
        // this.targetGraphics = new PIXI.Graphics();
        // img:token.data.img,
        // name:token.data.name,
        // type:"npc"
    }
    toString() {
        return this.targetID + this.sourceID;
    }
}
