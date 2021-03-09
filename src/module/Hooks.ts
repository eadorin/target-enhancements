import { warn, error, debug, i18n } from "../target-enhancements";
import { EasyTarget } from "./easyTarget";
import { TargetClass } from "./lib-targeting/TargetClass";
import { TargetEnhancements } from "./TargetEnhancements";


export let readyHooks = async () => {
  // initialazideTab = true;
}

export let initHooks = () => {
  warn("Init Hooks processing");

  // setup all the hooks

  // ==================================
  // INTEGRATION EASY TARGET
  // ==================================

  EasyTarget.patch();

  // ==================================
  // INTEGRATION LIB TARGETING
  // ==================================

  Hooks.on("ready",TargetClass.ready);
  Hooks.on("targetToken", TargetClass.targetTokenHandler);
  Hooks.on("controlToken",TargetClass.controlTokenHandler);

  // ==================================
  // INTEGRATION TARGET ENHANCEMENTS
  // ==================================

  Hooks.on("targetToken", TargetEnhancements.targetTokenEventHandler);
  Hooks.on("hoverToken", TargetEnhancements.hoverTokenEventHandler);
  Hooks.on("updateToken",TargetEnhancements.updateTokenEventHandler);
  Hooks.on("render",TargetEnhancements.renderTokenEventHandler);
  Hooks.on("preUpdateScene",TargetEnhancements.preUpdateSceneEventHandler);
  Hooks.on("renderSceneControls",TargetEnhancements.preUpdateSceneEventHandler);
  Hooks.on("controlToken",TargetEnhancements.controlTokenEventHandler);
  Hooks.on("clearTokenTargets",TargetEnhancements.clearTokenTargetsHandler);
  Hooks.on("getSceneControlButtons",TargetEnhancements.getSceneControlButtonsHandler);
  Hooks.on("canvasReady",TargetEnhancements.canvasReadyHandler);

  /*
  * This adds handling to untarget and remove any animations
  * The tokenDelete event is called after a token is destroyed which is too late to handle un-targeting
  */
  // const onDelete = Token.prototype['_onDelete'];
  // Tokenprototype['_onDelete'] = function(options, userId) {
  const onDelete = Token.prototype.delete;
  Token.prototype.delete = function(options, userId) {

      if (TargetEnhancements.tickerFunctions[this.data._id]) {
          TargetEnhancements.tickerFunctions[this.data._id].destroy();
          delete TargetEnhancements.tickerFunctions[this.data._id];
      }
      this.targeted.forEach((user) =>
          user.targets.forEach((t) =>
              t.setTarget(false, {user: user, releaseOthers: true, groupSelection:false })
          )
      );
      //return onDelete.apply(this, options, userId);
      return onDelete.apply(options, userId);
  }

  // TODO INTEGRATION WITH LIB WRAPPER

  // Hooks.on("targetToken", () => {
  //   //libWrapper.register(MODULE_NAME, 'Token.prototype.setTarget', TargetEnhancements.targetTokenEventHandler, 'WRAPPER');
  //   TargetEnhancements.targetTokenEventHandler
  // });

  // Hooks.on("hoverToken", () => {
  //   TargetEnhancements.hoverTokenEventHandler
  // });

  // Hooks.on("updateToken", () => {
  //   //libWrapper.register(MODULE_NAME, 'Token.prototype.update', TargetEnhancements.renderTokenEventHandler, 'WRAPPER');
  //   TargetEnhancements.renderTokenEventHandler
  // });

  // Hooks.on("render", () => {
  //   //libWrapper.register(MODULE_NAME, 'TokenConfig.render', TargetEnhancements.renderTokenEventHandler, 'WRAPPER');
  //   TargetEnhancements.renderTokenEventHandler
  // });
  // Hooks.on("preUpdateScene", () => {
  //   TargetEnhancements.preUpdateSceneEventHandler

  // });
  // Hooks.on("renderSceneControls", () => {
  //   TargetEnhancements.preUpdateSceneEventHandler
  // });
  // Hooks.on("controlToken", () => {
  //   //libWrapper.register(MODULE_NAME, 'Token.prototype.control', TargetEnhancements.controlTokenEventHandler, 'WRAPPER');
  //   TargetEnhancements.controlTokenEventHandler
  // });
  // Hooks.on("clearTokenTargets", () => {
  //   //libWrapper.register(MODULE_NAME, 'TokenLayer.prototype.targetObjects', TargetEnhancements.clearTokenTargetsHandler, 'WRAPPER');
  //   TargetEnhancements.clearTokenTargetsHandler
  // });
  // Hooks.on("getSceneControlButtons", () => {
  //   TargetEnhancements.getSceneControlButtonsHandler

  // });
  // Hooks.on("canvasReady", () => {
  //   //libWrapper.register(MODULE_NAME, 'Canvas.prototype.ready',TargetEnhancements.canvasReadyHandler, 'WRAPPER');
  //   TargetEnhancements.canvasReadyHandler
  // });

}
