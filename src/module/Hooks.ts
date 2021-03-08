import { warn, error, debug, i18n } from "../target-enhancements";
import { EasyTarget } from "./easyTarget";
import { TargetEnhancements } from "./TargetEnhancements";


export let readyHooks = async () => {
  // initialazideTab = true;
}

export let initHooks = () => {
  warn("Init Hooks processing");
  EasyTarget.patch();
  // Hooks.once('init', () => EasyTarget.patch());
  // Hooks.once('ready', function () {
  //   game.settings.register('easy-target', 'release', {
  //     name: 'EASYTGT.ReleaseBehaviour',
  //     hint: 'EASYTGT.ReleaseBehaviourHint',
  //     scope: 'user',
  //     config: true,
  //     default: 'sticky',
  //     type: String,
  //     choices: {
  //       'sticky': 'EASYTGT.Sticky',
  //       'standard': 'EASYTGT.Standard'
  //     }
  //   });
  // });

  // setup all the hooks

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

  // TODO INTEGRATED LIB WRAPPER

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