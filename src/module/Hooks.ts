import { warn, error, debug, i18n } from "../target-enhancements";
import { EasyTarget } from "./easyTarget";
import { TargetContainer } from "./TargetContainer";
import { BorderFrame } from "./libs/BorderControl";
import { CTA, CTAtweens } from "./libs/CTA";
// import { TargetContainer } from "./TargetContainer";
import { getCanvas, MODULE_NAME } from "./settings";
import { TargetEnhancements } from "./TargetEnhancements";
//import * as libWrapper  from "/modules/lib-wrapper/lib-wrapper";

export let readyHooks = async () => {

  // ===========================================
  // TARGET ENCHANTMENTS
  // ===========================================

  TargetContainer.ready(MODULE_NAME);
  
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype.control', EasyTarget.tokenOnControl, 'WRAPPER');



  // ===========================================
  // CUSTOM TOKEN ANIMATION (CUSTOMIZED)
  // ============================================

  //CTA.ready();

  Hooks.on("canvasInit", async () => {
      if (CTAtweens) {
          CTAtweens.forEach(i => i.kill())
      }
      Hooks.once("canvasPan", () => {
          CTA.AddTweens(undefined)
      })

  });
  Hooks.on("preDeleteToken", (scene, token) => {
      let deleteToken = getCanvas().tokens.get(token._id)
      if (!deleteToken) return;
      //@ts-ignore
      TweenMax.killTweensOf(deleteToken.children)
  });
  Hooks.on("createToken", (scene, token) => {
      let tokenInstance = getCanvas().tokens.get(token._id)
      if (!tokenInstance) return;
      let flags = tokenInstance.getFlag(MODULE_NAME, "anim") ? tokenInstance.getFlag(MODULE_NAME, "anim") : []
      if (flags) CTA.AddTweens(tokenInstance)
  });
  Hooks.on("preUpdateToken", async (_scene, token, update) => {
      if ("height" in update || "width" in update) {
          let fullToken = getCanvas().tokens.get(token._id)
          let CTAtweens = fullToken.children.filter((c:any) => c.CTA === true)
          for (let child of CTAtweens) {
              //@ts-ignore
              TweenMax.killTweensOf(child)
              child.destroy()
          }
      }
  })
  Hooks.on("updateToken", (_scene, token, update) => {
      if ("height" in update || "width" in update || "img" in update) {
          let fullToken = getCanvas().tokens.get(token._id)
          CTA.AddTweens(fullToken)
      }
  })

  // ===========================================
  // BORDER CONTROL (CUSTOMIZED)
  // ===========================================

  //@ts-ignore
  //libWrapper.register(MODULE_NAME, 'Token.prototype._refreshBorder', BorderFrame.newBorder, 'OVERRIDE')
  //@ts-ignore
  //libWrapper.register(MODULE_NAME, 'Token.prototype._getBorderColor', BorderFrame.newBorderColor, 'OVERRIDE')
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype._refreshTarget', BorderFrame.newTarget, 'OVERRIDE')

}

export let initHooks = () => {
  warn("Init Hooks processing");
  
  // ==================================
  // INTEGRATION LIB TARGETING
  // ==================================
  // TargetClass.ready();
  // Hooks.on("ready",TargetClass.ready); // MOVED TO ESYTARGET CLASS
  // Hooks.on("targetToken", TargetClass.targetTokenHandler); // MOVED TO ESYTARGET CLASS
  // Hooks.on("controlToken",TargetClass.controlTokenHandler); // MOVED TO ESYTARGET CLASS

  // ==================================
  // INTEGRATION TARGET ENHANCEMENTS
  // ==================================

  // Hooks.on("targetToken", TargetEnhancements.targetTokenEventHandler); // MOVED TO ESYTARGET CLASS
  Hooks.on("hoverToken", TargetEnhancements.hoverTokenEventHandler);
  Hooks.on("updateToken",TargetEnhancements.updateTokenEventHandler);
  Hooks.on("render",TargetEnhancements.renderTokenEventHandler);
  Hooks.on("preUpdateScene",TargetEnhancements.preUpdateSceneEventHandler);
  Hooks.on("renderSceneControls",TargetEnhancements.preUpdateSceneEventHandler);

  //Hooks.on("controlToken",TargetEnhancements.controlTokenEventHandler); // MOVED TO ESYTARGET CLASS
  Hooks.on("clearTokenTargets",TargetEnhancements.clearTokenTargetsHandler);
  Hooks.on("getSceneControlButtons",TargetEnhancements.getSceneControlButtonsHandler);
  Hooks.on("canvasReady",TargetEnhancements.canvasReadyHandler);

  // TODO NOT SURE IF WE NEED THIS
  //Hooks.on('preCreateScene', TargetEnhancements.preCreateSceneHandler);
  //Hooks.on('renderSceneConfig', TargetEnhancements.preCreateSceneHandler);

  // Hooks.on("getSceneNavigationContext", (html, contextOptions) => {
  //   TargetEnhancements.clearTokenTargetsHandler(game.user, null);
  // });

  // Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
  //   TargetEnhancements.clearTokenTargetsHandler(game.user, null);
  // });

  // Hooks.on('getJournalDirectoryEntryContext', (html,contextOptions)=>{
  //   TargetEnhancements.clearTokenTargetsHandler(game.user, null);
  // });

  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype.setTarget', EasyTarget.tokenSetTarget, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype._onClickLeft', EasyTarget.tokenOnClickLeft, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype._canControl', EasyTarget.tokenCanControl, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'TokenLayer.prototype.targetObjects', EasyTarget.tokenLayerTargetObjects, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Canvas.prototype._onClickLeft', EasyTarget.canvasOnClickLeft, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Canvas.prototype._onDragLeftDrop', EasyTarget.canvasOnDragLeftDrop, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'TemplateLayer.prototype._onDragLeftDrop', EasyTarget.templateLayerOnDragLeftDrop, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'KeyboardManager.prototype._onKeyC', EasyTarget.keyboardManagerOnKeyC, 'MIXED');


  // This is a horrible hack where we replace the entire method body, but I'm not certain there's a better way.
  //libWrapper.register(MODULE_NAME, 'Token.prototype._refreshTarget', TargetEnhancements.TokenPrototypeRefreshTargetHandler, 'MIXED');

  // /*
  // * This adds handling to untarget and remove any animations
  // * The tokenDelete event is called after a token is destroyed which is too late to handle un-targeting
  // */
  // // const onDelete = Token.prototype['_onDelete'];
  // // Token.prototype['_onDelete'] = function(options, userId) {
  // const onDelete = Token.prototype.delete;
  // Token.prototype.delete = function(options, userId) {
  //     this.targeted.forEach((user) =>
  //         user.targets.forEach((t) =>
  //             t.setTarget(false, {user: user, releaseOthers: true, groupSelection:false })
  //         )
  //     );
  //     //return onDelete.apply(this, options, userId);
  //     return onDelete.apply(options, userId);
  // }

  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype.delete', TargetEnhancements.tokenDeleteHandler, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype._onDelete', TargetEnhancements.tokenDeleteHandler, 'WRAPPER');
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype._getBorderColor', TargetEnhancements.customBorderColors, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'PIXI.Graphics.prototype.drawEllipse', TargetEnhancements.drawDashLine, 'WRAPPER');
  PIXI.Graphics.prototype['drawDashLine'] = TargetEnhancements.drawDashLine;

}


