/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import JavaScript modules

// Import TypeScript modules
import { registerSettings, MODULE_NAME } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import { TargetEnhancements } from './scripts/TargetEnhancements.js';

export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3
export let debug = (...args) => {if (debugEnabled > 1) console.log("DEBUG: target-enhancements | ", ...args)};
export let log = (...args) => console.log("target-enhancements | ", ...args);
export let warn = (...args) => {if (debugEnabled > 0) console.warn("target-enhancements | ", ...args)};
export let error = (...args) => console.error("target-enhancements | ", ...args)
export let i18n = key => {
  return game.i18n.localize(key);
};
export let setDebugLevel = (debugText: string) => {
  debugEnabled = {"none": 0, "warn": 1, "debug": 2, "all": 3}[debugText] || 0;
  // 0 = none, warnings = 1, debug = 2, all = 3
  CONFIG.debug.hooks = debugEnabled >= 3;
}

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async () => {
	console.log('target-enhancements | Initializing target-enhancements');

	// Assign custom classes and constants here

	// Register custom module settings
	registerSettings();
	//CONFIG.debug.hooks = true;
	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', () => {
	// Do anything after initialization but before ready
  registerSettings();
  
  TargetEnhancements.registerClickModifier(); // consider moving to onHoverToken()
  // customBorderColors();
  if (game.settings.get(MODULE_NAME,'enable-target-modifier-key')) {
      for (let x = canvas.tokens.placeables.length -1; x >=0; x--) {
          let token = canvas.tokens.placeables[x];
          token.on('mousedown',TargetEnhancements.handleTokenClick);
          try {
              token.data.scale = token.getFlag(MODULE_NAME,TargetEnhancements.resizeFlagKey) || 1;
              token.refresh();
          } catch (ex) {}
          
      }
  }
  if (!game.user.isGM) { return; }
  TargetEnhancements.registerResizeModifier();
  $('body').on('mousewheel',TargetEnhancements.resizeHandler);

});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', () => {
	// Do anything once the module is ready
	if (!game.modules.get("lib-wrapper")?.active && game.user.isGM){
    ui.notifications.warn("The 'target-enhancements' module recommends to install and activate the 'libWrapper' module.");
  }
  if (!game.modules.get("colorsettings")?.active && game.user.isGM){
    ui.notifications.warn('Please make sure you have the "lib - ColorSettings" module installed and enabled.');
  }
  TargetEnhancements.ready;
});

// Add any additional hooks if necessary

// setup all the hooks

// Hooks.on("ready", TargetEnhancements.ready);
Hooks.on("targetToken", TargetEnhancements.targetTokenEventHandler);
Hooks.on("hoverToken", TargetEnhancements.hoverTokenEventHandler);
Hooks.on("updateToken",TargetEnhancements.updateTokenEventHandler);
Hooks.on("render",TargetEnhancements.renderTokenEventHandler);
Hooks.on("preUpdateScene",TargetEnhancements.preUpdateSceneEventHandler);
Hooks.on("renderSceneControls",TargetEnhancements.preUpdateSceneEventHandler);
Hooks.on("controlToken",TargetEnhancements.controlTokenEventHandler);
Hooks.on("clearTokenTargets",TargetEnhancements.clearTokenTargetsHandler);
Hooks.on("getSceneControlButtons",TargetEnhancements.getSceneControlButtonsHandler);