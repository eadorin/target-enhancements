import { i18nFormat } from "../../target-enhancements";
import { getCanvas, MODULE_NAME } from "../settings";

let CTAsocket;
export let CTAtweens = []
class CTArender {
    /**
     * flagData = {
                name: name,
                textureData: this.textureData,
                id: this.flagId
            }
     * @param {*} token 
     * @param {*} flagData 
     */
    static async RenderAnim(tokenID, flagData, duplicate) {
        if (duplicate) { await CTArender.DeleteSpecificAnim, tokenID, duplicate.id }
        let token = getCanvas().tokens.get(tokenID)
        let { textureData, name, id } = flagData;
        let { texturePath, scale, speed, multiple, rotation, xScale, yScale, belowToken, radius, opacity, tint, equip, lock } = textureData

        let CTAtexture:PIXI.Texture = await loadTexture(texturePath)
        const textureSize = token.data.height * getCanvas().grid.size;
        var container;
        if (typeof scale === "number") {
            scale = [`${scale}`, `${scale}`];
        }
        else {
            scale = scale.split(",")
            if (scale.length === 1) scale[1] = scale[0]
        }
        if (equip) {
            container = token.children.find((i:any) => i.isSprite && i.texture.baseTexture?.imageUrl?.includes(token.data.img))
            container.CTAcontainer = true
            //@ts-ignore
            CTAtexture.orig = { height: textureSize * parseFloat(scale[1]) / container.scale.x, width: textureSize * parseFloat(scale[0]) / container.scale.y, x: -textureSize, y: -textureSize }
        }
        else {
            container = token
            //@ts-ignore
            CTAtexture.orig = { height: textureSize * parseFloat(scale[1]), width: textureSize * parseFloat(scale[0]), x: -textureSize, y: -textureSize }
        }
        if (rotation === "rotation") {
            token.sortableChildren = true
            for (let i = 0; i <= multiple - 1; i++) {
                let sprite = new PIXI.Sprite(CTAtexture)
                //sprite.anchor.set(0.5)
                sprite.anchor.set(radius)
                sprite.pivot.set(textureSize / 2)
                sprite.position.set(textureSize / 2)
                let icon:PIXI.Sprite = await token.addChild(sprite)
                await icon.position.set(token.data.width * getCanvas().grid.w * xScale, token.data.height * getCanvas().grid.h * yScale)
                const source = getProperty(icon.texture, "baseTexture.resource.source")//instead _texture
                if (source && (source.tagName === "VIDEO")) {
                    source.loop = true;
                    source.muted = true;
                    game.video.play(source);
                }
                //@ts-ignore
                icon.CTA = true;
                //@ts-ignore
                icon.CTAid = flagData.id;
                //@ts-ignore
                icon.CTAlock = lock;
                icon.alpha = opacity;
                icon.tint = tint;
                if (belowToken) { icon.zIndex = -1 }
                else { icon.zIndex = 1000 }
                icon.angle = i * (360 / multiple)
                //@ts-ignore
                let tween = TweenMax.to(icon, speed, { angle: (360 + icon.angle), repeat: -1, ease: Linear.easeNone });
                CTAtweens.push(tween)
            }
        }
        if (rotation === "static") {
            token.sortableChildren = true
            let sprite = new PIXI.Sprite(CTAtexture)
            sprite.anchor.set(0.5)
            let icon = await container.addChild(sprite)
            if (!equip) {
                await icon.position.set(token.data.width * getCanvas().grid.w * xScale, token.data.height * getCanvas().grid.h * yScale)
            } else {
                let xPos = container.texture.width * xScale - (container.texture.width / 2)
                let yPos = container.texture.height * yScale - (container.texture.height / 2)
                await icon.position.set(xPos, yPos)
            }
            const source = getProperty(icon._texture, "baseTexture.resource.source")
            if (source && (source.tagName === "VIDEO")) {
                source.loop = true;
                source.muted = true;
                game.video.play(source);
            }
            icon.CTA = true
            icon.CTAid = flagData.id;
            icon.CTAlock = lock;
            icon.alpha = opacity;
            icon.tint = tint;
            icon.angle = token.data.rotation
            if (belowToken) { icon.zIndex = -1 }
            else { icon.zIndex = 1000 }
        }

    }

    /**
     * 
     * @param {Object} token 
     * @param {String} id 
     */
    static async FadeAnim(tokenID, id) {
        let token = getCanvas().tokens.get(tokenID)
        let icon = token.children?.filter((c:any) => c.CTAid === id)
        //@ts-ignore
        TweenMax.to(icon, 2, { alpha: 0, onComplete: CTArender.DeleteSpecificAnim, onCompleteParams: [tokenID, id] })
    }

    /**
     * 
     * @param {Object} token 
     * @param {String} id 
     */
    static DeleteSpecificAnim(tokenID, id) {
        let token = getCanvas().tokens.get(tokenID)
        let icons = token.children?.filter((c:any) => c.CTAid === id)
        for (let icon of icons) {
            //@ts-ignore
            TweenMax.killTweensOf(icon)
            icon.destroy()
        }
        return true;
    }
}

export class CTA {


    // static ready() {

    //     Hooks.on("canvasInit", async () => {
    //         if (CTAtweens) {
    //             CTAtweens.forEach(i => i.kill())
    //         }
    //         Hooks.once("canvasPan", () => {
    //             CTA.AddTweens(undefined)
    //         })

    //     });
    //     Hooks.on("preDeleteToken", (scene, token) => {
    //         let deleteToken = getCanvas().tokens.get(token._id)
    //         if (!deleteToken) return;
    //         //@ts-ignore
    //         TweenMax.killTweensOf(deleteToken.children)
    //     });
    //     Hooks.on("createToken", (scene, token) => {
    //         let tokenInstance = getCanvas().tokens.get(token._id)
    //         if (!tokenInstance) return;
    //         let flags = tokenInstance.getFlag(MODULE_NAME, "anim") ? tokenInstance.getFlag(MODULE_NAME, "anim") : []
    //         if (flags) CTA.AddTweens(tokenInstance)
    //     });
    //     Hooks.on("preUpdateToken", async (_scene, token, update) => {
    //         if ("height" in update || "width" in update) {
    //             let fullToken = getCanvas().tokens.get(token._id)
    //             let CTAtweens = fullToken.children.filter((c:any) => c.CTA === true)
    //             for (let child of CTAtweens) {
    //                 //@ts-ignore
    //                 TweenMax.killTweensOf(child)
    //                 child.destroy()
    //             }
    //         }
    //     })
    //     Hooks.on("updateToken", (_scene, token, update) => {
    //         if ("height" in update || "width" in update || "img" in update) {
    //             let fullToken = getCanvas().tokens.get(token._id)
    //             CTA.AddTweens(fullToken)
    //         }
    //     })
    // }

    static AddTweens(token) {
        let testArray = []
        if (token) testArray.push(token)
        else testArray = getCanvas().tokens.placeables
        for (let testToken of testArray) {
            if (!testToken.actor) continue;
            let tokenFlags = <any[]>(testToken.getFlag(MODULE_NAME, "anim")) || []
            let actorFlags = getProperty(testToken.actor.data, "token.flags.target-enhancements.anim") || []
            let totalFlags = tokenFlags.concat(actorFlags)
            let newFlag = totalFlags.reduce((map, obj) => map.set(obj.id, obj), new Map()).values()
            if (!newFlag) continue;
            Array.from(newFlag).forEach((f:FlagData) => {
                CTArender.RenderAnim(testToken.id, f, false)
            })
        }
    }

    /**
         * Does given token have an animation of given name
         * @param {Object <token5e>} token 
         * @param {String} name 
         */
    static hasAnim(token, name) {
        let anims = <any[]>(token.getFlag(MODULE_NAME, "anim"))
        if (!anims) return false;
        for (let testAnim of anims) {
            if (testAnim.name === name) return true;
        }
        return false;
    }


    static addAnimation(token:Token, textureData:TextureData, pushActor:boolean, name:string, oldID:string) {
        if (typeof token === "string") token = getCanvas().tokens.get(token)
        if (!game.user.isGM) {
            CTAsocket.executeAsGM("addAnimation", token.id, textureData, pushActor, name, oldID)
            return;
        }
        let flagId = oldID || randomID()
        let flagData:FlagData = {
            name: name,
            textureData: textureData,
            id: flagId
        }
        CTA.PushFlags(token, flagData, pushActor)
    }

    static async removeAnim(token, animId, actorRemoval, fadeOut) {
        if (typeof token === "string") token = getCanvas().tokens.get(token)
        if (!game.user.isGM) {
            CTAsocket.executeAsGM("removeById", token.id, animId, actorRemoval, fadeOut);
            return;
        }
        let tokenFlags:any[] = Array.from(<any[]>(token.getFlag(MODULE_NAME, "anim")) || [])
        let actorFlags:any[] = Array.from(getProperty(token, "actor.data.token.flags.target-enhancements.anim") || [])

        let tokenAnimRemove = tokenFlags.findIndex(i => i.id === animId)
        tokenFlags.splice(tokenAnimRemove, 1)
        await token.update({ "flags.target-enhancements": tokenFlags })
        if (actorRemoval) {
            let actorAnimRemove = actorFlags.findIndex(i => i.id === animId)
            actorFlags.splice(actorAnimRemove, 1)
            await token.actor.update({ "token.flags.target-enhancements.anim": actorFlags })
        }
        let fade = fadeOut || game.settings.get(MODULE_NAME, "fadeOut")

        if (fade) {
            CTAsocket.executeForEveryone("fadeOut", token.id, animId)
        }
        else {
            CTAsocket.executeForEveryone("deleteSpecific", token.id, animId)
        }
    }

    static removeAnimByName(token, animName, actorRemoval, fadeOut) {
        if (typeof token === "string") token = getCanvas().tokens.get(token)
        if (!game.user.isGM) {
            CTAsocket.executeAsGM("removeByName", token.id, animName, actorRemoval, fadeOut);
            return;
        }
        let tokenFlags:any[] = Array.from(<any[]>(token.getFlag(MODULE_NAME, "anim")) || [])
        let removedAnim = tokenFlags.find(i => i.name === animName)
        CTA.removeAnim(token.id, removedAnim.id, actorRemoval, fadeOut)
    }


    /**
     * 
     * @param {*} token 
     * @param {*} flagData {name : effectName, textureData: textureData, id : id}
     * @param {*} pushActor 
     */
    static async PushFlags(token, flagData:FlagData, pushActor) {
        if (!game.user.isGM) return;
        let tokenFlags:any[] = Array.from(<any[]>(token.getFlag(MODULE_NAME, "anim")) || [])
        let actorFlags:any[] = Array.from(getProperty(token, "actor.data.token.flags.target-enhancements.anim") || [])

        let tokenDuplicate = tokenFlags.find(f => f.name === flagData.name)
        if (tokenDuplicate) {
            let index = tokenFlags.indexOf(tokenDuplicate)
            if (index > -1) {
                tokenFlags.splice(index, 1)
            }
            CTAsocket.executeForEveryone("deleteSpecific", token.id, tokenDuplicate.id)
        }
        tokenFlags.push(flagData)
        await token.update({ "flags.target-enhancements.anim": tokenFlags })

        if (pushActor) {
            let actorDuplicate = actorFlags.find(f => f.name === flagData.name)
            if (actorDuplicate) {
                let index = actorFlags.indexOf(actorDuplicate)
                if (index > -1) {
                    actorFlags.splice(index, 1)
                }
            }
            actorFlags.push(flagData)
            await token.actor.update({ "token.flags.target-enhancements.anim": actorFlags })
        }
        CTAsocket.executeForEveryone("renderAnim", token.id, flagData)
    }

    /**
   * 
   * @param {String} OGpath original texture path
   * @param {Object} token Token to apply to
   * @param {Object} oldData Previous effect data, used in update pathway
   * @param {String} name name of the effect
   * @returns 
   */
    static async animationDialog(OGpath, token, oldData, name) {
        if (getCanvas().tokens.controlled.length > 1 && !token) { // instead .tokens.controlled > 1
            ui.notifications.error(i18nFormat(MODULE_NAME+".TokenError"));
            return;
        }
        if (!OGpath) OGpath = oldData.texturePath
        function shortLeft(string, boxLength) {
            let PREFIXDIRSTR = "...";
            boxLength += PREFIXDIRSTR.length;
            let splitString = string.substring(((string.length - 1) - boxLength), (string.length));
            splitString = PREFIXDIRSTR + splitString;
            return splitString;
        }
        let actorFlags = getProperty(token, "actor.data.token.flags.target-enhancements.anim") || []
        let animFlag = !!actorFlags.find(i => i.name === name)
        if (!token) token = getCanvas().tokens.controlled[0]
        let hexColour = oldData?.tint?.toString(16).padStart(6, '0').toUpperCase() || "FFFFFF"
        let oldX = typeof oldData?.xScale === "number" ? oldData.xScale : 0.5
        let oldY = typeof oldData?.yScale === "number" ? oldData.yScale : 0.5

        let content = `
        <style>
        .pickDialog .form-group {
            clear: both;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin: 3px 0;
            align-items: center;
        }
        .pickDialog label span {
            display: block;
        }

        </style>
    <form class="pickDialog">
        <div class="form-group">
            <label for="name">${i18nFormat("Name")}: </label>
            <input id="name" name="name" type="text" value= "${name || ""}"></input>
        </div>
        <div class="form-group">
            <label for="path">${i18nFormat(MODULE_NAME+".ImagePath")}: </label>
            <input id="path" name="path" type="text" value= "${shortLeft(OGpath, 20)}" required></input>
        </div>
        <div class="form-group">
            <label for="scale"><span>${i18nFormat("Scale")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".ImageScale")}</span></label>
            <input id="scale" name="scale" type="text" value= "${oldData?.scale || "1"}" required></input>
        </div>
        <div class="form-group">
            <label for="rotation"><span>${i18nFormat(MODULE_NAME+".StaticImage")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".StaticImage_hint")}</span> </label>
            <input id="rotation" name="rotation" type="checkbox" ${oldData?.rotation === "static" ? 'checked' : ''} ></input>
        </div>
        <div class="form-group">
            <label for="speed"><span>${i18nFormat(MODULE_NAME+".SpeedOfRotation")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".SpeedOfRotation_hint")}</span></label>
            <input id="speed" name="speed" type="number" step="0.1" value= "${oldData?.speed || 0}" ${oldData?.rotation === "static" ? 'disabled' : ''}></input>
        </div>
        <div class="form-group">
            <label for="radius"><span>${i18nFormat(MODULE_NAME+".RadiusOfRotation")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".RadiusOfRotation_hint")}</span> </label>
            <input id="radius" name="radius" type="number" step="0.1"  value= "${oldData?.radius / 2 || 1}" ${oldData?.rotation === "static" ? 'disabled' : ''}></input>
        </div>
        <div class="form-group">
            <label for="multiple">${i18nFormat(MODULE_NAME+".NumberOfCopies")}:</label>
            <input id="multiple" name="multiple" type="number" min="1" value= "${oldData?.multiple || 1}" ${oldData?.rotation === "static" ? 'disabled' : ''}></input>
        </div>
        <div class="form-group">
            <label for="xScale"><span>${i18nFormat(MODULE_NAME+".PositionXScale")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".PositionXScale_hint")}</span> </label>
            <input id="xScale" name="xScale" type="number" value= "${oldX}" required></input>
        </div>
        <div class="form-group">
            <label for="yScale"><span>${i18nFormat(MODULE_NAME+".PositionYScale")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".PositionYScale_hint")}</span> </label>
            <input id="yScale" name="yScale" type="number" value= "${oldY}" required></input>
        </div>
        <div class="form-group">
            <label for="opacity">${i18nFormat(MODULE_NAME+".AssetOpacity")}:</label>
            <input id="opacity" name="opacity" type="number" min="0" max="1" value= "${oldData?.opacity || 1}" required></input>
        </div>
        <div class="form-group">
            <label for="tint">${i18nFormat(MODULE_NAME+".AssetTint")}:</label>
            <input type="color" id="tint" name="tint" value="#${hexColour || "FFFFFF"}">
        </div>
        <div class="form-group">
            <label for="belowToken"><span>${i18nFormat(MODULE_NAME+".RenderBelow")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".RenderBelow_hint")}</label>
            <input id="belowToken" name="belowToken" type="checkbox" ${oldData?.belowToken === true ? 'checked' : ''}></input>
        </div>
        <div class="form-group">
            <label for="pushActor"><span>${i18nFormat(MODULE_NAME+".PermanentActor")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".PermanentActor_hint")}</label>
            <input id="pushActor" name="pushActor" type="checkbox" ${animFlag === true ? 'checked' : ''}></input>
        </div>
        <div class="form-group">
            <label for="equip"><span>${i18nFormat(MODULE_NAME+".ApplyEquipment")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".ApplyEquipment_hint")}</span> </label>
            <input id="equip" name="equip" type="checkbox" ${oldData?.equip === true ? 'checked' : ''}></input>
        </div>
        <div class="form-group">
            <label for="lock"><span>${i18nFormat(MODULE_NAME+".NoRotation")}:</span>
            <span class="units">${i18nFormat(MODULE_NAME+".NoRotation_hint")}</span> </label>
            <input id="lock" name="lock" type="checkbox" ${oldData?.lock === true ? 'checked' : ''}></input>
        </div>
    </form>
        `

        let dialog = await new Dialog({

            title: i18nFormat(MODULE_NAME+".PickEffects"),
            content: content,
            buttons: {
                one: {
                    label: i18nFormat(MODULE_NAME+".Create"),
                    callback: (html) => {
                        //@ts-ignore
                        let path = String(OGpath ? OGpath : html.find("#path")[0].value)
                        //@ts-ignore
                        let name = String(html.find("#name")[0].value)
                        //@ts-ignore
                        let scale = String(html.find("#scale")[0].value)
                        //@ts-ignore
                        let speed = Number(html.find("#speed")[0].value)
                        //@ts-ignore
                        let rotation = String(html.find("#rotation")[0].checked ? "static" : "rotation")
                        //@ts-ignore
                        let pushActor = Boolean(html.find("#pushActor")[0].checked)
                        //@ts-ignore
                        let multiple = Number(html.find("#multiple")[0].value)
                        //@ts-ignore
                        let xScale = Number(html.find("#xScale")[0].value)
                        //@ts-ignore
                        let yScale = Number(html.find("#yScale")[0].value)
                        //@ts-ignore
                        let opacity = Number(html.find("#opacity")[0].value)
                        //@ts-ignore
                        let tint = parseInt(String(html.find("#tint")[0].value).substr(1), 16)
                        //@ts-ignore
                        let belowToken = Boolean(html.find("#belowToken")[0].checked)
                        //@ts-ignore
                        let radius = Number(Number(html.find("#radius")[0].value) * 2)
                        //@ts-ignore
                        let equip = Boolean(html.find("#equip")[0].checked)
                        //@ts-ignore
                        let lock = Boolean(html.find("#lock")[0].checked)
                        let textureData:TextureData = {
                            texturePath: path,
                            scale: scale,
                            speed: speed,
                            multiple: multiple,
                            rotation: rotation,
                            xScale: xScale,
                            yScale: yScale,
                            opacity: opacity,
                            tint: tint,
                            belowToken: belowToken,
                            radius: radius,
                            equip: equip,
                            lock: lock
                        }
                        CTA.addAnimation(token, textureData, pushActor, name, undefined)
                    }
                },
                two: {
                    label: i18nFormat(MODULE_NAME+".RePick"),
                    callback: (html) => {
                        //@ts-ignore
                        let path = String(OGpath ? OGpath : html.find("#path")[0].value)
                        //@ts-ignore
                        let name = String(html.find("#name")[0].value)
                        //@ts-ignore
                        let scale = String(html.find("#scale")[0].value)
                        //@ts-ignore
                        let speed = Number(html.find("#speed")[0].value)
                        //@ts-ignore
                        let rotation = String(html.find("#rotation")[0].checked ? "static" : "rotation")
                        //@ts-ignore
                        let pushActor = Boolean(html.find("#pushActor")[0].checked)
                        //@ts-ignore
                        let multiple = Number(html.find("#multiple")[0].value)
                        //@ts-ignore
                        let xScale = Number(html.find("#xScale")[0].value)
                        //@ts-ignore
                        let yScale = Number(html.find("#yScale")[0].value)
                        //@ts-ignore
                        let opacity = Number(html.find("#opacity")[0].value)
                        //@ts-ignore
                        let tint = parseInt(html.find("#tint")[0].value.substr(1), 16)
                        //@ts-ignore
                        let belowToken = Boolean(html.find("#belowToken")[0].checked)
                        //@ts-ignore
                        let radius = Number(Number(html.find("#radius")[0].value) * 2)
                        //@ts-ignore
                        let equip = Boolean(html.find("#equip")[0].checked)
                        //@ts-ignore
                        let lock = Boolean(html.find("#lock")[0].checked)
                        let oldData = {
                            texturePath: path,
                            scale: scale,
                            speed: speed,
                            multiple: multiple,
                            rotation: rotation,
                            xScale: xScale,
                            yScale: yScale,
                            opacity: opacity,
                            tint: tint,
                            belowToken: belowToken,
                            radius: radius,
                            equip: equip,
                            lock: lock
                        }
                        CTA.pickEffect(token, oldData)
                    }
                }
            },
            default: undefined
        }).render(true) // instead _render


        $('.form-group #rotation').change(function () {
            if ($(this).is(':checked')) {
                //@ts-ignore
                $('.pickDialog #multiple')[0].disabled = true
                //@ts-ignore
                $('.pickDialog #speed')[0].disabled = true
                //@ts-ignore
                $('.pickDialog #radius')[0].disabled = true
            }
            else {
                //@ts-ignore
                $('.pickDialog #multiple')[0].disabled = false
                //@ts-ignore
                $('.pickDialog #speed')[0].disabled = false
                //@ts-ignore
                $('.pickDialog #radius')[0].disabled = true
            }
        })

    }

    static async getAnims(token:Token) {
        if (getCanvas().tokens.controlled.length !== 1) { ui.notifications.notify(i18nFormat(MODULE_NAME+".TokenError")); return; }
        if (!token) token = getCanvas().tokens.controlled[0]
        let anims = <any[]>(await token.getFlag(MODULE_NAME, "anim"))
        let content = ``;
        let allButtons = {
            one: {
                label: i18nFormat("Update"),
                icon: `<i class="fas fa-edit"></i>`,
                callback: (html) => {
                    let animId = html.find("[name=anims]")[0].value;
                    //@ts-ignore
                    let updateAnim = anims.find(i => i.id === animId)
                    CTA.animationDialog(undefined, token, updateAnim.textureData, updateAnim.name)
                }
            },
            two: {
                label: i18nFormat("Delete"),
                icon: `<i class="fas fa-trash-alt"></i>`,
                callback: (html) => {
                    let updateAnim = html.find("[name=anims]")[0].value;

                    new Dialog({
                        title: i18nFormat(MODULE_NAME+".Confirm"),
                        content: i18nFormat(MODULE_NAME+".Confirm_Content"),
                        buttons: {
                            one: {
                                label: i18nFormat(MODULE_NAME+".ActorDelete"),
                                icon: `<i class="fas fa-check"></i>`,
                                callback: () => {
                                    let fadeOut = game.settings.get(MODULE_NAME, "fadeOut")
                                    CTA.removeAnim(token, updateAnim, true, fadeOut)
                                }
                            },
                            two: {
                                label: i18nFormat(MODULE_NAME+".TokenDelete"),
                                icon: `<i class="fas fa-check"></i>`,
                                callback: () => {
                                    let fadeOut = game.settings.get(MODULE_NAME, "fadeOut")
                                    CTA.removeAnim(token, updateAnim, false, fadeOut)
                                }
                            },
                            three: {
                                label: i18nFormat(MODULE_NAME+".Return"),
                                icon: `<i class="fas fa-undo-alt"></i>`,
                                callback: () => {
                                    CTA.getAnims(token)
                                }
                            }
                        },
                        default: undefined
                    }).render(true)
                }
            },
            three: {
                label: i18nFormat(MODULE_NAME+".Replicate"),
                icon: `<i class="fas fa-file-import"></i>`,
                callback: (html) => {
                    let animId = html.find("[name=anims]")[0].value;
                    //@ts-ignore
                    let updateAnim = anims.find(i => i.id === animId)
                    CTA.generateMacro(updateAnim)
                }
            },
            four: {
                label: i18nFormat(MODULE_NAME+".AddNew"),
                icon: `<i class="fas fa-plus"></i>`,
                callback: () => {
                    CTA.pickEffect(token, undefined)
                }
            }
        }
        let addButton:any = {
            one: {
                label: i18nFormat(MODULE_NAME+".AddNew"),
                icon: `<i class="fas fa-plus"></i>`,
                callback: () => {
                    CTA.pickEffect(token, undefined)
                }
            }
        }
        if (anims && anims.length > 0) {
            content = `<div class="form group">
                            <label>${i18nFormat(MODULE_NAME+".Animations")}:</label>
                            <div><select name="anims">${anims.reduce((acc, anim) => acc += `<option value = ${anim.id}>${anim.name}</option>`, '')}</select></div>
                        </div>`;
            addButton = allButtons
        };
        new Dialog({
            title: i18nFormat(MODULE_NAME+".AnimationPicker"),
            content: content,
            buttons: addButton, // instead .
            default: undefined
        }).render(true)
    }

    // Add button to sidebar
    static getSceneControlButtons(buttons) {
        if (!game.modules.get("socketlib")?.active) {
            ui.notifications.error(i18nFormat(MODULE_NAME+".SocketLib_warn"))
            return;
        }
        let tokenButton = buttons.find(b => b.name == "token")
        let playerPermissions = game.settings.get(MODULE_NAME, "playerPermissions") === true ? true : game.user.isGM
        if (tokenButton) {
            tokenButton.tools.push({
                name: "cta-anim",
                title: i18nFormat(MODULE_NAME+".AddAnimation"),
                icon: "fas fa-spinner",
                visible: playerPermissions,
                onClick: () => CTA.getAnims(undefined),
                button: true
            });
        }
    }

    /**
     * Create a macro from selected effect data
     * @param {Object} oldData Data to transform into a macro
     */
    static generateMacro(oldData) {
        let data = duplicate(oldData)
        let image = data.textureData.texturePath.includes(".webm") ? "icons/svg/acid.svg" : data.textureData.texturePath
        let macroData:Macro.Data = {
            command: `
            let textureData = {
                texturePath: "${data.textureData.texturePath}",
                scale: "${data.textureData.scale}",
                speed: ${data.textureData.speed},
                multiple: ${data.textureData.multiple},
                rotation: "${data.textureData.rotation}",
                xScale: ${data.textureData.xScale},
                yScale: ${data.textureData.yScale},
                belowToken: ${data.textureData.belowToken},
                radius: ${data.textureData.radius},
                opacity: ${data.textureData.opacity},
                tint: ${data.textureData.tint},
                equip: ${data.textureData.equip},
                lock : ${data.textureData.lock}
            }
            CTA.addAnimation(token, textureData, false, "${data.name}", null)
            `,
            img: image,
            name: `CTA ${data.name}`,
            scope: "global",
            type: "script",
            actorIds: undefined,
            author: undefined,
            permission: undefined,
            _id: undefined,
            flags: undefined
        }
        Macro.create(macroData)
        ui.notifications.notify(i18nFormat(MODULE_NAME+".MacroPrompt", { macroName: `CTA ${data.name}` }))
    }

    /**
     * Start the "full pathway"
     * @param {Object} token Token to apply too
     */
    static pickEffect(token:Token, oldData) {
        let CTAPick = new FilePicker({
            type: "imagevideo",
            current: "",
            //@ts-ignore
            callback: path => { //TODO OPEN ISSUE FOR INSERT IN TYPE SCRIPT
                CTA.animationDialog(path, token, oldData, undefined)
            },

        })
        CTAPick.browse();
    }
}

Hooks.once("socketlib.ready", () => {
    //@ts-ignore
    CTAsocket = socketlib.registerModule(MODULE_NAME);
    CTAsocket.register("renderAnim", CTArender.RenderAnim)
    CTAsocket.register("removeByName", CTA.removeAnimByName)
    CTAsocket.register("removeById", CTA.removeAnim)
    CTAsocket.register("addAnimation", CTA.addAnimation)
    CTAsocket.register("fadeOut", CTArender.FadeAnim)
    CTAsocket.register("deleteSpecific", CTArender.DeleteSpecificAnim)
})


Hooks.on("updateToken", (scene, token, update) => {
    if (!getProperty(update, "rotation")) return;
    let fullToken = getCanvas().tokens.get(token._id)
    let icons = fullToken.children.filter((i:any) => i.CTA && !i.CTAlock)
    icons.forEach(i => i.angle = update.rotation)
})

class FlagData{
    name: string;
    textureData:TextureData;
    id : string;
}

class TextureData{
    texturePath: string;
    scale: any; // Can be a string or a number
    speed: number;
    multiple: number;
    rotation: string;
    xScale: number;
    yScale: number;
    opacity: number;
    tint: number;
    belowToken: boolean;
    radius: number;
    equip: boolean;
    lock: boolean;
}

// Hooks.on('init', () => {
//     game.settings.register(MODULE_NAME, "playerPermissions", {
//         name: i18n(MODULE_NAME+".Permissions"),
//         hint: i18n(MODULE_NAME+".Permissions_hint"),
//         scope: "world",
//         config: true,
//         default: false,
//         type: Boolean,
//     });
//     game.settings.register(MODULE_NAME, "fadeOut", {
//         name: i18n(MODULE_NAME+".FadeAnims"),
//         hint: i18n(MODULE_NAME+".FadeAnims_hint"),
//         scope: "world",
//         config: true,
//         default: true,
//         type: Boolean,
//     });
// })

// Hooks.on('init', CTA.ready);
// Hooks.on('getSceneControlButtons', CTA.getSceneControlButtons)

// window.CTA = CTA;
