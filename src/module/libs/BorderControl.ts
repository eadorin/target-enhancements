import { getCanvas, MODULE_NAME } from "../settings";

Hooks.on('renderTokenHUD', (app, html, data) => {
    BorderFrame.AddBorderToggle(app, html, data)
})
Hooks.on('renderSettingsConfig', (app, el, data) => {
    let nC = game.settings.get(MODULE_NAME, "neutralColor");
    let fC = game.settings.get(MODULE_NAME, "friendlyColor");
    let hC = game.settings.get(MODULE_NAME, "hostileColor");
    let cC = game.settings.get(MODULE_NAME, "controlledColor");
    let pC = game.settings.get(MODULE_NAME, "partyColor");
    let nCE = game.settings.get(MODULE_NAME, "neutralColorEx");
    let fCE = game.settings.get(MODULE_NAME, "friendlyColorEx");
    let hCE = game.settings.get(MODULE_NAME, "hostileColorEx");
    let cCE = game.settings.get(MODULE_NAME, "controlledColorEx");
    let pCE = game.settings.get(MODULE_NAME, "partyColorEx");
    let tC = game.settings.get(MODULE_NAME, "targetColor");
    let tCE = game.settings.get(MODULE_NAME, "targetColorEx");
    let gS = game.settings.get(MODULE_NAME, "healthGradientA");
    let gE = game.settings.get(MODULE_NAME, "healthGradientB");
    el.find('[name="target-enhancements.neutralColor"]').parent().append(`<input type="color" value="${nC}" data-edit="target-enhancements.neutralColor">`)
    el.find('[name="target-enhancements.friendlyColor"]').parent().append(`<input type="color" value="${fC}" data-edit="target-enhancements.friendlyColor">`)
    el.find('[name="target-enhancements.hostileColor"]').parent().append(`<input type="color" value="${hC}" data-edit="target-enhancements.hostileColor">`)
    el.find('[name="target-enhancements.controlledColor"]').parent().append(`<input type="color"value="${cC}" data-edit="target-enhancements.controlledColor">`)
    el.find('[name="target-enhancements.partyColor"]').parent().append(`<input type="color"value="${pC}" data-edit="target-enhancements.partyColor">`)
    el.find('[name="target-enhancements.targetColor"]').parent().append(`<input type="color"value="${tC}" data-edit="target-enhancements.targetColor">`)

    el.find('[name="target-enhancements.neutralColorEx"]').parent().append(`<input type="color" value="${nCE}" data-edit="target-enhancements.neutralColorEx">`)
    el.find('[name="target-enhancements.friendlyColorEx"]').parent().append(`<input type="color" value="${fCE}" data-edit="target-enhancements.friendlyColorEx">`)
    el.find('[name="target-enhancements.hostileColorEx"]').parent().append(`<input type="color" value="${hCE}" data-edit="target-enhancements.hostileColorEx">`)
    el.find('[name="target-enhancements.controlledColorEx"]').parent().append(`<input type="color"value="${cCE}" data-edit="target-enhancements.controlledColorEx">`)
    el.find('[name="target-enhancements.partyColorEx"]').parent().append(`<input type="color"value="${pCE}" data-edit="target-enhancements.partyColorEx">`)
    el.find('[name="target-enhancements.targetColorEx"]').parent().append(`<input type="color"value="${tCE}" data-edit="target-enhancements.targetColorEx">`)

    el.find('[name="target-enhancements.healthGradientA"]').parent().append(`<input type="color"value="${gS}" data-edit="target-enhancements.healthGradientA">`)
    el.find('[name="target-enhancements.healthGradientB"]').parent().append(`<input type="color"value="${gE}" data-edit="target-enhancements.healthGradientB">`)
});


Hooks.on("createToken", (_scene, data) => {
    setTimeout(function () {
        let token = getCanvas().tokens.get(data._id)
        if (!token.owner) token.cursor = "default"
    }, 500)
})

Hooks.once("ready", () => {
    getCanvas().tokens.placeables.forEach(t => {
        if (!t.owner) t.cursor = "default"
    })
})



export class BorderFrame {
    static AddBorderToggle(app, html, data) {
        if (!game.user.isGM) return;
        const buttonPos = game.settings.get(MODULE_NAME, "hudPos")
        const borderButton = `<div class="control-icon border ${app.object.data.flags[MODULE_NAME]?.noBorder ? "active" : ""}" title="Toggle Border"> <i class="fas fa-border-style"></i></div>`
        let Pos = html.find(buttonPos)
        Pos.append(borderButton)
        html.find('.border').click(this.ToggleBorder.bind(app))
    }

    static ToggleBorder = async function(event) {
        const border = this.object.getFlag(MODULE_NAME, "noBorder")
        await this.object.setFlag(MODULE_NAME, "noBorder", !border)
        event.currentTarget.classList.toggle("active", !border);

    }
    static newBorder = function() {
        this.border.clear();
        let borderColor = this._getBorderColor();
        if (!borderColor) return;
        switch (game.settings.get(MODULE_NAME, "removeBorders")) {
            case "0": break;
            case "1": if (!this.owner) return;
                break;
            case "2": return;
        }
        if (this.getFlag(MODULE_NAME, "noBorder")) return;
        const t = <number>game.settings.get(MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
        if (game.settings.get(MODULE_NAME, "healthGradient")){
            const stepLevel = <number>game.settings.get(MODULE_NAME, "stepLevel")
            const systemPath = BorderFrame.getActorHpPath()
            const hpDecimal = Math.ceil(parseInt(String(getProperty(this, systemPath.value)/getProperty(this, systemPath.max) * stepLevel))) || 1
            const endColor = hexToRGB(colorStringToHex(<string>game.settings.get(MODULE_NAME, "healthGradientA")))
            const startColor = hexToRGB(colorStringToHex(<string>game.settings.get(MODULE_NAME, "healthGradientB")))
            const colorArray = BorderFrame.interpolateColors(`rgb(${startColor[0]*255}, ${startColor[1]*255}, ${startColor[2]*255})`, `rgb(${endColor[0]*255}, ${endColor[1]*255}, ${endColor[2]*255})`, stepLevel)
            const color = BorderFrame.rgbToHex(colorArray[hpDecimal-1])
            borderColor.INT = parseInt(color.substr(1), 16)

        }
            // Draw Hex border for size 1 tokens on a hex grid
            const gt = CONST.GRID_TYPES;
        const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
        if (game.settings.get(MODULE_NAME, "circleBorders")) {
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            this.border.lineStyle(t, borderColor.EX, 0.8).drawCircle(this.w / 2, this.h / 2, this.w / 2 + t);
            this.border.lineStyle(h, borderColor.INT, 1.0).drawCircle(this.w / 2, this.h / 2, this.w / 2 + h + t / 2);
        }
        //@ts-ignore
        else if (hexTypes.includes(getCanvas().grid.type) && (this.data.width === 1) && (this.data.height === 1)) {
            const p = <number>game.settings.get(MODULE_NAME, "borderOffset")
            const q = Math.round(p/2)
            //@ts-ignore
            const polygon = getCanvas().grid.grid.getPolygon(-1.5-q, -1.5-q, this.w + 2+p, this.h + 2+p);
            this.border.lineStyle(t, borderColor.EX, 0.8).drawPolygon(polygon);
            this.border.lineStyle(t / 2, borderColor.INT, 1.0).drawPolygon(polygon);
        }

        // Otherwise Draw Square border
        else {
            const p = <number>game.settings.get(MODULE_NAME, "borderOffset")
            const q = Math.round(p/2)
            const h = Math.round(t / 2);
            const o = Math.round(h / 2);
            this.border.lineStyle(t, borderColor.EX, 0.8).drawRoundedRect(-o-q, -o-q, this.w + h+p, this.h + h+p, 3);
            this.border.lineStyle(h, borderColor.INT, 1.0).drawRoundedRect(-o-q, -o-q, this.w + h+p, this.h + h+p, 3);
        }
        return;
    }

    static newBorderColor = function() {

        const overrides = {
            CONTROLLED: {
                INT: parseInt(String(game.settings.get(MODULE_NAME, "controlledColor")).substr(1), 16),
                EX: parseInt(String(game.settings.get(MODULE_NAME, "controlledColorEx")).substr(1), 16),
            },
            FRIENDLY: {
                INT: parseInt(String(game.settings.get(MODULE_NAME, "friendlyColor")).substr(1), 16),
                EX: parseInt(String(game.settings.get(MODULE_NAME, "friendlyColorEx")).substr(1), 16),
            },
            NEUTRAL: {
                INT: parseInt(String(game.settings.get(MODULE_NAME, "neutralColor")).substr(1), 16),
                EXT: parseInt(String(game.settings.get(MODULE_NAME, "neutralColorEx")).substr(1), 16),
            },
            HOSTILE: {
                INT: parseInt(String(game.settings.get(MODULE_NAME, "hostileColor")).substr(1), 16),
                EX: parseInt(String(game.settings.get(MODULE_NAME, "hostileColorEx")).substr(1), 16),
            },
            PARTY: {
                INT: parseInt(String(game.settings.get(MODULE_NAME, "partyColor")).substr(1), 16),
                EX: parseInt(String(game.settings.get(MODULE_NAME, "partyColorEx")).substr(1), 16),
            },
        }
        if (this._controlled) return overrides.CONTROLLED;
        else if (this._hover) {
            let d = parseInt(this.data.disposition);
            if (!game.user.isGM && this.owner) return overrides.CONTROLLED;
            else if (this.actor?.hasPlayerOwner) return overrides.PARTY;
            else if (d === TOKEN_DISPOSITIONS.FRIENDLY) return overrides.FRIENDLY;
            else if (d === TOKEN_DISPOSITIONS.NEUTRAL) return overrides.NEUTRAL;
            else return overrides.HOSTILE;
        }
        else return null;
    }

    static newTarget = function() {
        const multiplier = <number>game.settings.get(MODULE_NAME, "targetSize");
        const INT = parseInt(String(game.settings.get(MODULE_NAME, "targetColor")).substr(1), 16);
        const EX = parseInt(String(game.settings.get(MODULE_NAME, "targetColorEx")).substr(1), 16);

        this.target.clear();
        if (!this.targeted.size) return;

        // Determine whether the current user has target and any other users
        const [others, user] = Array.from(this.targeted).partition(u => u === game.user);
        const userTarget = user.length;



        // For the current user, draw the target arrows
        if (userTarget) {
            if (game.settings.get(MODULE_NAME, "internatTarget")) {
                let p = -4; // padding
                let aw = -12 * multiplier; // arrow width
                let h = this.h; // token height
                let hh = h / 2; // half height
                let w = this.w; // token width
                let hw = w / 2; // half width
                let ah = getCanvas().dimensions.size / 3 * multiplier;
                this.target.beginFill(INT, 1.0).lineStyle(1, EX)
                    .drawPolygon([
                        -p - aw, hh,
                        -p, hh - ah,
                        -p, hh + ah
                    ])
                    .drawPolygon([
                        w + p + aw, hh,
                        w + p, hh - ah,
                        w + p, hh + ah
                    ])
                    .drawPolygon([
                        hw, -p - aw,
                        hw - ah, -p,
                        hw + ah, -p
                    ])
                    .drawPolygon([
                        hw, h + p + aw,
                        hw - ah, h + p,
                        hw + ah, h + p
                    ]);
            }
            else {
                let p = 4; // padding
                let aw = 12 * multiplier; // arrow width
                let h = this.h; // token height
                let hh = h / 2; // half height
                let w = this.w; // token width
                let hw = w / 2; // half width
                let ah = getCanvas().dimensions.size / 3 * multiplier;
                this.target.beginFill(INT, 1.0).lineStyle(1, EX)
                    .drawPolygon([
                        -p, hh,
                        -p - aw, hh - ah,
                        -p - aw, hh + ah
                    ])
                    .drawPolygon([
                        w + p, hh,
                        w + p + aw, hh - ah,
                        w + p + aw, hh + ah
                    ])
                    .drawPolygon([
                        hw, -p, hw - ah,
                        -p - aw, hw + ah,
                        -p - aw
                    ])
                    .drawPolygon([
                        hw, h + p,
                        hw - ah, h + p + aw,
                        hw + ah, h + p + aw
                    ]);
            }
        }
    }

    static componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    static rgbToHex(A) {
        return "#" + BorderFrame.componentToHex(A[0]) + BorderFrame.componentToHex(A[1]) + BorderFrame.componentToHex(A[2]);
    }

    static hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


    static interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) {
            factor = 0.5;
        }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };

    // My function to interpolate between two colors completely, returning an array
    static interpolateColors(color1, color2, steps) {
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];

        color1 = color1.match(/\d+/g).map(Number);
        color2 = color2.match(/\d+/g).map(Number);

        for (var i = 0; i < steps; i++) {
            interpolatedColorArray.push(BorderFrame.interpolateColor(color1, color2, stepFactor * i));
        }

        return interpolatedColorArray;
    }

    static getActorHpPath(){
        switch(game.system.id){
            case "dnd5e" : return { value : "actor.data.data.attributes.hp.value", max: "actor.data.data.attributes.hp.max"}
        }
    }
}