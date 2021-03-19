import { warn, error, debug, i18n } from "../target-enhancements";
import { EasyTarget } from "./easytarget/easyTarget";
import { TargetClass } from "./lib-targeting/TargetClass";
import { MODULE_NAME, KeyBinding } from "./settings";
import { TargetEnhancements } from "./TargetEnhancements";
import {libWrapper} from './libs/shim.js'

export let parsedValueKeyBindingTarget = KeyBinding.parse("Alt");

export let readyHooks = async () => {
  TargetClass.ready();

  // CHECKOUT
  let stringValue = game.settings.get(MODULE_NAME, 'set-customize-hotkey-target');
  if (stringValue.endsWith("+")) {
      stringValue = stringValue + "  ";
  }
  parsedValueKeyBindingTarget = KeyBinding.parse(stringValue);
  //const withShift = KeyBinding.parse('Shift + ' + stringValue);
  //const bind = KeyBinding.eventIsForBinding(event, parsedValue);
  //const bindWithShift = KeyBinding.eventIsForBinding(event, withShift);
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

  // SOMETHING IS WRONG WITH THESE

  // libWrapper.register(MODULE_NAME, 'Token.prototype._onHoverIn', TargetEnhancements.hoverTokenEventHandler, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'Token.prototype.update', TargetEnhancements.updateTokenEventHandler, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'Token.prototype.render', TargetEnhancements.renderTokenEventHandler, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'Scene.prototype._onUpdate', TargetEnhancements.preUpdateSceneEventHandler, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'SceneControls.prototype.render', TargetEnhancements.preUpdateSceneEventHandler, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'Token.prototype._refreshTarget', TargetEnhancements.clearTokenTargetsHandler, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'SceneControls.prototype._getControlButtons', TargetEnhancements.getSceneControlButtonsHandler, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'Canvas.prototype.constructor', TargetEnhancements.canvasReadyHandler, 'WRAPPER');

  // TODO AVOID WHERE IS POSSIBLE lib-wrapper in favor of Hooks (need someone more skilled than me by p4535992)

  libWrapper.register(MODULE_NAME, 'Token.prototype.setTarget', EasyTarget.tokenSetTarget, 'WRAPPER');
  libWrapper.register(MODULE_NAME, 'Token.prototype._onClickLeft', EasyTarget.tokenOnClickLeft, 'WRAPPER');
  libWrapper.register(MODULE_NAME, 'Token.prototype._canControl', EasyTarget.tokenCanControl, 'WRAPPER');
  libWrapper.register(MODULE_NAME, 'TokenLayer.prototype.targetObjects', EasyTarget.tokenLayerTargetObjects, 'WRAPPER');
  libWrapper.register(MODULE_NAME, 'Canvas.prototype._onClickLeft', EasyTarget.canvasOnClickLeft, 'WRAPPER');
  libWrapper.register(MODULE_NAME, 'Canvas.prototype._onDragLeftDrop', EasyTarget.canvasOnDragLeftDrop, 'WRAPPER');
  libWrapper.register(MODULE_NAME, 'TemplateLayer.prototype._onDragLeftDrop', EasyTarget.templateLayerOnDragLeftDrop, 'WRAPPER');
  libWrapper.register(MODULE_NAME, 'KeyboardManager.prototype._onKeyC', EasyTarget.keyboardManagerOnKeyC, 'MIXED');
  libWrapper.register(MODULE_NAME, 'Token.prototype.control', EasyTarget.tokenOnControl, 'WRAPPER');

  // ?????
  // libWrapper.register(MODULE_NAME, 'Token.prototype._refreshTarget', TargetEnhancements.drawTargetIndicatorsWrapper, 'WRAPPER');

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

  libWrapper.register(MODULE_NAME, 'Token.prototype.delete', TargetEnhancements.tokenDeleteHandler, 'WRAPPER');
  libWrapper.register(MODULE_NAME, 'Token.prototype._onDelete', TargetEnhancements.tokenDeleteHandler, 'WRAPPER');

  libWrapper.register(MODULE_NAME, 'Token.prototype._getBorderColor', TargetEnhancements.customBorderColors, 'WRAPPER');
  // libWrapper.register(MODULE_NAME, 'PIXI.Graphics.prototype.drawEllipse', TargetEnhancements.drawDashLine, 'WRAPPER');
  PIXI.Graphics.prototype['drawDashLine'] = TargetEnhancements.drawDashLine;
}


