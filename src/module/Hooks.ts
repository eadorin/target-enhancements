import { warn, error, debug, i18n } from "../target-enhancements";
import { EasyTarget } from "./easyTarget";
// import { TargetContainer } from "./TargetContainer";
import { MODULE_NAME } from "./settings";
import { TargetEnhancements } from "./TargetEnhancements";
//import * as libWrapper  from "/modules/lib-wrapper/lib-wrapper";

export let readyHooks = async () => {
  // TargetContainer.ready();
  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'Token.prototype.control', EasyTarget.tokenOnControl, 'WRAPPER');
}

export let initHooks = () => {
  warn("Init Hooks processing");

  // setup all the hooks

  // ==================================
  // INTEGRATION EASY TARGET
  // ==================================

  // EasyTarget.patch();

  // ==================================
  // INTEGRATION LIB TARGETING
  // ==================================
  // TargetClass.ready();
  // Hooks.on("ready",TargetClass.ready); // MOVED TO ESYTARGET CLASS
  // Hooks.on("targetToken", TargetClass.targetTokenHandler); // MOVED TO ESYTARGET CLASS
  // Hooks.on("controlToken",TargetClass.controlTokenHandler); // MOVED TO ESYTARGET CLASS

  // ==================================
  // INTEGRATION BETTER TARGET
  // ==================================

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

  //     if (TargetEnhancements.tickerFunctions[this.data._id]) {
  //         TargetEnhancements.tickerFunctions[this.data._id].destroy();
  //         delete TargetEnhancements.tickerFunctions[this.data._id];
  //     }
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


