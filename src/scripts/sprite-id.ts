import { PIXI } from './lib/pixi-filters.js';
// import { Sprite } from '@pixi/sprite';
import { Sprite } from './lib/pixi-filters.js';
/**
 * SpriteID wrapper around PIXI.sprite
 * v0.1
 */
export class SpriteID extends Sprite {

    sprite_type:string;
    id:string;

    constructor(texture, id) {
        super(texture);
        this.id = id;
        this.sprite_type = 'token-indicator';
    }
}