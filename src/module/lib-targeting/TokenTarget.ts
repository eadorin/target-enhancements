import { SOURCE_TYPES_TARGETING } from "./TargetConstants";

/**
 * Generic class to hold our records
 */
 export class TokenTarget {
    
  targetID:string;
  sourceID:string;
  sourceType:SOURCE_TYPES_TARGETING;
  // targetGraphics:PIXI.Graphics;
  // id:string;
  // img:string;
  // name:string;
  // type:string;

  constructor(targetID:string, sourceID:string, sourceType:SOURCE_TYPES_TARGETING) {
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

  // getID():string{
  //   return this.sourceID+"_"+this.targetID;
  // }

  // getTargetID(){
  //   return this.targetID;
  // }

  // getSourceID(){
  //   return this.sourceID;
  // }

  // getSourceType(){
  //   return this.sourceType;
  // }

  // setTargetGraphics(targetGraphics:PIXI.Graphics){
  //   this.targetGraphics = targetGraphics;
  // }

  // getTargetGraphics(){
  //   return this.targetGraphics;
  // }
}
