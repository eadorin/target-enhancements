import { warn, error, debug, i18n } from "../target-enhancements";
import { EasyTarget } from "./easyTarget";
import { TargetClass } from "./lib-targeting/TargetClass";
import { TargetEnhancements } from "./TargetEnhancements";


export let readyHooks = async () => {
  TargetClass.ready();
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
  TargetClass.ready();
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
}
