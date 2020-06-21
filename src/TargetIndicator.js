/**
 * For drawing new "Target" indicators
 */

import { SpriteID } from './sprite-id.js';

export class TargetIndicator {

    constructor(token) {
        this.token = token;
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
        let p = 4;
        let aw = 12;
        let h = this.token.h;
        let hh = this.token.h / 2;
        let w = this.token.w;
        let hw = w / 2;
        let ah = canvas.dimensions.size / 3;

        this.token.target.beginFill(0xFF9829, 1.0).lineStyle(1, 0x000000)
            .drawPolygon([-p,hh, -p-aw,hh-ah, -p-aw,hh+ah])
            .drawPolygon([w+p,hh, w+p+aw,hh-ah, w+p+aw,hh+ah])
            .drawPolygon([hw,-p, hw-ah,-p-aw, hw+ah,-p-aw])
            .drawPolygon([hw,h+p, hw-ah,h+p+aw, hw+ah,h+p+aw]);
    }

    drawCrossHairs1() {
        let fillColor = 0xFF9829;
        let borderColor = 0x000000;

        let p = 4;
        let aw = 12;
        let h = this.token.h;
        let hh = this.token.h / 2;
        let w = this.token.w;
        let hw = w / 2;
        let ah = canvas.dimensions.size / 3;

        let rw = 10; // rect width
        let rh = 30; // rect length
        let r = hh; // radius
        
        
        // let topX = r*Math.cos( 180 * Math.pi/180); // convert to radians
        // let topY = r*Math.sin( 180 * Math.pi/180); // doesn't work. sad panda.

        let topX   = hw - rw/2; let topY   = 0 - rh/2; 
        let rightX = w  - rh/2; let rightY = hh - rw/2;
        let botX   = hw - rw/2; let botY   = h  - rh/2;
        let leftX  = 0  - rh/2; let leftY = hh  - rw/2;


        this.token.target
            .beginFill(borderColor, 0).lineStyle(10,borderColor).drawCircle(hw,hh,r).endFill()
            .beginFill(fillColor, 0).lineStyle(6, fillColor).drawCircle(hw,hh,r).endFill()
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(topX,topY,rw,rh).endFill() // top bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(rightX,rightY,rh,rw).endFill() // right bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(botX,botY,rw,rh).endFill() // bottom bar
            .beginFill(fillColor).lineStyle(2,borderColor).drawRect(leftX,leftY,rh,rw).endFill() // tleft bar
        ;
    }

    drawBullsEye1() {
        let fillColor = 0xFF9829;
        let borderColor = 0x000000;

        // fillColor = game.user.color;
        // borderColor = 0xffffff;
        
        let p = 4;
        let aw = 12;
        let h = this.token.h;
        let hh = this.token.h / 2;
        let w = this.token.w;
        let hw = w / 2;
        let ah = canvas.dimensions.size / 3;
        this.token.target
            .beginFill(borderColor, 0).lineStyle(6,borderColor).drawCircle(hw,hh,hh).endFill()
            .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw,hh,hh).endFill() // stop here for outer ring
            .beginFill(borderColor, 0).lineStyle(6,borderColor).drawCircle(hw,hh,hh-40).endFill()
            .beginFill(fillColor, 0).lineStyle(4, fillColor).drawCircle(hw,hh,hh-40).endFill()
            // .beginFill(borderColor, 0).lineStyle(4,borderColor).drawCircle(hw,hh,hh/4.5).endFill()
            // .beginFill(fillColor, 0).lineStyle(2, fillColor).drawCircle(hw,hh,hh/4.5).endFill();
    
    }
}