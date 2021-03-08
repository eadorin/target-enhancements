import { PIXI } from './libs/filters/pixi-filters.js';
/**
 * SpriteID wrapper around PIXI.sprite
 * v0.1
 */
export class SpriteID extends PIXI.Sprite {

    sprite_type:string;
    id:string;

    constructor(texture, id) {
        super(texture);
        this.id = id;
        this.sprite_type = 'token-indicator';
    }
}