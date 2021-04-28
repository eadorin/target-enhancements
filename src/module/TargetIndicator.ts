/**
 * For drawing new "Target" indicators
 */

import { SpriteID } from './sprite-id.js';
import { getCanvas, MODULE_NAME } from '../module/settings'
import { FlagScopeTargeting, FlagsTargeting } from './lib-targeting/utilsTargeting.js';
import { TargetContainer } from './lib-targeting/TargetContainer.js';
// import { TargetContainer } from './TargetContainer.js';
//const mod = "target-enhancements";

export class TargetIndicator {

    token:Token;
    sprite:PIXI.Sprite;
    owner:Boolean;
    indicator_type:any;
    c:PIXI.Graphics;
    i:PIXI.Graphics;
    fillColor:number;

    constructor(token:Token,indicator_type="default") {
        this.token = token;
        this.sprite = new PIXI.Sprite();
        this.owner = token.owner;
        this.indicator_type = indicator_type;

        this.c = new PIXI.Graphics();
        this.i = new PIXI.Graphics();
        token['indicator'] = this;

        if (game.settings.get(MODULE_NAME,'use-player-color')) {
          this.fillColor = colorStringToHex(game.user['color']);
        } else {
          this.fillColor = 0xFF9829;
        }
    }

    drawIndicator(indicator="default") {
        switch (indicator) {
            case "1" :
                this.drawCrossHairs1();
                break;
            case "2" :
                this.drawBullsEye1();
                break;
            case "default":
            default :
                this.drawDefault();
                break;

        }
    }

    drawDefault() {
        let fillColor = this.fillColor;
        let p = 4;
        let aw = 12;
        let h = this.token.h;
        let hh = this.token.h / 2;
        let w = this.token.w;
        let hw = w / 2;
        let ah = getCanvas().dimensions.size / 3;

        this.i.beginFill(fillColor, 1.0).lineStyle(1, 0x000000)
            .drawPolygon([-p,hh, -p-aw,hh-ah, -p-aw,hh+ah])
            .drawPolygon([w+p,hh, w+p+aw,hh-ah, w+p+aw,hh+ah])
            .drawPolygon([hw,-p, hw-ah,-p-aw, hw+ah,-p-aw])
            .drawPolygon([hw,h+p, hw-ah,h+p+aw, hw+ah,h+p+aw]);

        let texture = getCanvas().app.renderer.generateTexture(this.i,PIXI.SCALE_MODES.LINEAR,PIXI.settings.RESOLUTION);
        return new SpriteID(texture, this.token.id);
    }

    drawCrossHairs1() {
        let fillColor = this.fillColor;
        let borderColor = 0x000000;

        let p = 4;
        let aw = 12;
        let h = this.token.h;
        let hh = this.token.h / 2;
        let w = this.token.w;
        let hw = w / 2;
        let ah = getCanvas().dimensions.size / 3;

        let rw = 10; // rect width
        let rh = 30; // rect length
        let r = hh; // radius

        let topX   = hw - rw/2; let topY   = 0 - rh/2;
        let rightX = w  - rh/2; let rightY = hh - rw/2;
        let botX   = hw - rw/2; let botY   = h  - rh/2;
        let leftX  = 0  - rh/2; let leftY = hh  - rw/2;


        this.i
            .beginFill(borderColor, 0).lineStyle(10,borderColor).drawCircle(hw,hh,r).endFill()
            .beginFill(fillColor, 0).lineStyle(6, fillColor).drawCircle(hw,hh,r).endFill()
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(topX,topY,rw,rh).endFill() // top bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(rightX,rightY,rh,rw).endFill() // right bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(botX,botY,rw,rh).endFill() // bottom bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(leftX,leftY,rh,rw).endFill() // tleft bar
        ;

        let texture = getCanvas().app.renderer.generateTexture(this.i,PIXI.SCALE_MODES.LINEAR,PIXI.settings.RESOLUTION);
        return new SpriteID(texture, this.token.id);
    }
    drawCrossHairs2() {
        let fillColor = this.fillColor;
        let borderColor = 0x000000;

        let p = 4;
        let aw = 12;
        let h = this.token.h;
        let hh = this.token.h / 2;
        let w = this.token.w;
        let hw = w / 2;
        let ah = getCanvas().dimensions.size / 3;

        let rw = 10; // rect width
        let rh = 50; // rect length
        let r = hh; // radius

        let topX   = hw - rw/2; let topY   = 0 - rh/2;
        let rightX = w  - rh/2; let rightY = hh - rw/2;
        let botX   = hw - rw/2; let botY   = h  - rh/2;
        let leftX  = 0  - rh/2; let leftY = hh  - rw/2;


        this.i
            .beginFill(borderColor, 1).lineStyle(8,borderColor).drawCircle(hw,hh,2).endFill()
            .beginFill(fillColor, 1).lineStyle(6,fillColor).drawCircle(hw,hh,2).endFill()
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(topX,topY,rw,rh).endFill() // top bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(rightX,rightY,rh,rw).endFill() // right bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(botX,botY,rw,rh).endFill() // bottom bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(leftX,leftY,rh,rw).endFill() // tleft bar
        ;

        let texture = getCanvas().app.renderer.generateTexture(this.i,PIXI.SCALE_MODES.LINEAR,PIXI.settings.RESOLUTION);
        return new SpriteID(texture, this.token.id);
    }


    drawBullsEye1() {
        let fillColor = this.fillColor;
        let borderColor = 0x000000;

        let p = 4;
        let aw = 12;
        let h = this.token.h;
        let hh = this.token.h / 2;
        let w = this.token.w;
        let hw = w / 2;
        let ah = getCanvas().dimensions.size / 3;
        this.i
            .beginFill(borderColor, 0).lineStyle(6,borderColor).drawCircle(hw,hh,hh).endFill()
            .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw,hh,hh).endFill() // stop here for outer ring
            .beginFill(borderColor, 0).lineStyle(6,borderColor).drawCircle(hw,hh,hh-40).endFill()
            .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw,hh,hh-40).endFill()
            // .beginFill(borderColor, 0).lineStyle(4,borderColor).drawCircle(hw,hh,hh/4.5).endFill()
            // .beginFill(fillColor, 0).lineStyle(2, fillColor).drawCircle(hw,hh,hh/4.5).endFill();

        let texture = getCanvas().app.renderer.generateTexture(this.i,PIXI.SCALE_MODES.LINEAR,PIXI.settings.RESOLUTION);
        return new SpriteID(texture, this.token.id);
    }

    drawBullsEye2() {
        let fillColor = this.fillColor;
        let borderColor = 0x000000;

        let p = 4;
        let aw = 12;
        let h = this.token.h;
        let hh = this.token.h / 2;
        let w = this.token.w;
        let hw = w / 2;
        let ah = getCanvas().dimensions.size / 3;
        this.i
            .beginFill(borderColor, 0).lineStyle(6,borderColor).drawCircle(hw,hh,hh).endFill()
            .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw,hh,hh).endFill() // stop here for outer ring
            .beginFill(borderColor, 0).lineStyle(6,borderColor).drawCircle(hw,hh,hh-20).endFill()
            .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw,hh,hh-20).endFill()
            .beginFill(fillColor, 1).lineStyle(8,fillColor).drawCircle(hw,hh,2).endFill()
        ;

        let texture = getCanvas().app.renderer.generateTexture(this.i,PIXI.SCALE_MODES.LINEAR,PIXI.settings.RESOLUTION);
        return new SpriteID(texture, this.token.id);
    }

    drawBetterTarget() {
      const [others, user] = Array.from(this.token.targeted).partition(u => u === game.user);
      const userTarget = user.length;

      let fillColor = this.fillColor;
      if (game.settings.get(MODULE_NAME,'enable-better-target')) {
        fillColor = 0xc72121; // Fooce the standard red
      }

      // For the current user, draw the target arrows
      // if (userTarget) {
        let size = this.token.w;
        // Constrain dimensions to the shortest axis
        if (size > this.token.h) {
          size = this.token.h;
        }
        const padding = 12;
        const stroke = 6;
        const vmid = this.token.h / 2;
        const hmid = this.token.w / 2;
        const crossLen = (size / 2) - padding;
        this.i.beginFill(fillColor, 1.0).lineStyle(1, 0x000000)
          .drawCircle(hmid, vmid, (size / 2) - padding)
          .beginHole()
          .drawCircle(hmid, vmid, (size / 2) - padding - stroke)
          .endHole()
          .drawRoundedRect(hmid - (stroke / 2), vmid - stroke - crossLen, stroke, crossLen, null)
          .drawRoundedRect(hmid - (stroke / 2), vmid + padding - stroke, stroke, crossLen, null)
          .drawRoundedRect(hmid - stroke - crossLen, vmid - (stroke / 2), crossLen, stroke, null)
          .drawRoundedRect(hmid + padding - stroke, vmid - (stroke / 2), crossLen, stroke, null)
                  .endFill();
        /*
        // Original indicator
        .drawPolygon([-p, hh, -p - aw, hh - ah, -p - aw, hh + ah])
        .drawPolygon([w + p, hh, w + p + aw, hh - ah, w + p + aw, hh + ah])
        .drawPolygon([hw, -p, hw - ah, -p - aw, hw + ah, -p - aw])
        .drawPolygon([hw, h + p, hw - ah, h + p + aw, hw + ah, h + p + aw]);
        */
      // }

      let texture = getCanvas().app.renderer.generateTexture(this.i,PIXI.SCALE_MODES.LINEAR,PIXI.settings.RESOLUTION);
      return new SpriteID(texture, this.token.id);
    }

    async create(sprite=""): Promise<PIXI.Graphics> {
        if (!this.sprite && sprite == "") {
            this.sprite = await this.drawDefault();
        } else if (sprite != "") {
            switch (sprite) {
                case "1" :
                    this.sprite = await this.drawCrossHairs1();
                    break;
                case "2" :
                    this.sprite = await this.drawCrossHairs2();
                    break;
                case "3" :
                    this.sprite = await this.drawBullsEye1();
                    break;
                case "4" :
                    this.sprite = await this.drawBullsEye2();
                    break;
                case "5" :
                    this.sprite = await this.drawBetterTarget();
                    break;
                default:
                    this.sprite = await this.drawDefault();
                    break;
            }

        }

        this.sprite.zIndex = -1;
        this.sprite.position.x = this.token.w/2;
        this.sprite.position.y = this.token.h/2;
        this.sprite.anchor.set(.5);
        this.sprite.angle = 0;
        this.c.pivot.x = this.token.w/2;
        this.c.pivot.y = this.token.w/2;
        this.c.position.x = this.token.w/2;
        this.c.position.y = this.token.h/2;
        this.c.addChild(this.sprite);
        //this.token['target'].addChild(this.c); // THE KEY 'target' IS IMPORTANT FOR REMOVE THE PIXI GRAPHIC

         // TODO CAN'T UNDERSTAND THEY BROKE FOUNDRY
        /*
        if (game.settings.get(MODULE_NAME,'use-fx-pulse')) {
            this.pulse();
        }
        if (game.settings.get(MODULE_NAME,'use-fx-rotate')) {
            this.rotate();
        }
        */
        return this.c;
    }

    // TODO CAN'T UNDERSTAND THEY BROKE FOUNDRY
    // pulse() {
    //     //pulse code
    //     var _self = this.c; //.parent.parent is the token
    //     var size = 1;
    //     var speed = 0.001;
    //     var pulse_ticks = 0;
    //     var max_ticks = 20;
    //     var pulse_grow = true;
    //     getCanvas().app.ticker.add( function(delta) {
    //         // Uncaught TypeError: Cannot read property 'scale' of null, when player chang scene
    //         if(_self){
    //             _self.scale.set(size);

    //             if (pulse_grow) {
    //                 size = size + speed * delta;
    //                 pulse_ticks++;

    //                 if (pulse_ticks == max_ticks) { pulse_grow = false;}
    //             } else {
    //                 size = size - speed *delta;
    //                 pulse_ticks--;
    //                 if (pulse_ticks == 0) { pulse_grow = true;}
    //             }
    //         }
    //     });
    // }
    // rotate() {
    //     try{
    //         var _self = this.c;
    //         var spin = 1.2;
    //         var speed = 0.006;
    //         getCanvas().app.ticker.add(function(delta) {
    //             // Uncaught TypeError: Cannot read property 'scale' of null, when player chang scene
    //             if(_self){
    //                 _self.rotation = spin;
    //                 spin = spin + speed * delta;
    //             }
    //         });
    //     }catch(e){
    //         // DO NOTHING
    //     }
    // }



}
