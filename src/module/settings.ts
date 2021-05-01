import { debug, log, setDebugLevel, warn, i18n, i18nFormat } from '../target-enhancements';
//import { hotkeys } from './libs/lib-df-hotkeys.shim.js';
//@ts-ignore
import ColorSetting from '/modules/colorsettings/colorSetting.js';
// import './libs/settings-extender.js';

// window['TargetsTable'] = TargetsTable;
// window['NPCTargeting'] = NPCTargeting;

export const MODULE_NAME = 'target-enhancements';

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
 export function getCanvas(): Canvas {
    if (!(canvas instanceof Canvas) || !canvas.ready) {
        throw new Error("Canvas Is Not Initialized");
    }
    return canvas;
}

// export const KeyBinding = window['Azzu'].SettingsTypes.KeyBinding;
// export let parsedValueKeyBindingTarget = KeyBinding.parse("Alt");

export const registerSettings = function () {

  game.settings.register(MODULE_NAME, 'display_notificaton_enable_notification', {
		name: i18n(MODULE_NAME+".display-notificaton-enable-notification-name"),
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: i18n(MODULE_NAME+".display-notificaton-enable-notification-hint")
	});

  game.settings.register(MODULE_NAME, 'display_notificaton_npc_name', {
		name: i18n(MODULE_NAME+".display-notificaton-npc-name-name"),
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: i18n(MODULE_NAME+".display-notificaton-npc-name-hint")
	});

	game.settings.register(MODULE_NAME, 'display_notificaton_gm_vision', {
		name: i18n(MODULE_NAME+".display-notificaton-gm-vision-name"),
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: i18n(MODULE_NAME+".display-notificaton-gm-vision-hint")
	});

	game.settings.register(MODULE_NAME, 'display_notificaton_show_to_players_the_player_updates', {
		name: i18n(MODULE_NAME+".display-notificaton-show-to-players-the-player-updates-name"),
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: i18n(MODULE_NAME+".display-notificaton-show-to-players-the-player-updates-hint")
	});

  game.settings.register(MODULE_NAME,'enable-better-target', {
      name : i18n(MODULE_NAME+".enable-better-target-name"),
      hint : i18n(MODULE_NAME+".enable-better-target-hint"),
      scope: "player",
      config: true,
      default: false,
      type: Boolean
  });

  game.settings.register(MODULE_NAME,'target-indicator',{
      name: i18n(MODULE_NAME+".target-indicator-name"),
      hint: i18n(MODULE_NAME+".target-indicator-hint"),
      scope: "player",
      config: true,
      default: "0",
      type: String,
      choices: {
          "0" : i18n(MODULE_NAME+".target-indicator-choices-0"),
          "1" : i18n(MODULE_NAME+".target-indicator-choices-1"),
          "2" : i18n(MODULE_NAME+".target-indicator-choices-2"),
          "3" : i18n(MODULE_NAME+".target-indicator-choices-3"),
          "4" : i18n(MODULE_NAME+".target-indicator-choices-4"),
          "5" : i18n(MODULE_NAME+".target-indicator-choices-5"),
      }
  });

  game.settings.register(MODULE_NAME,'enable-color', {
      name : i18n(MODULE_NAME+".enable-color-name"),
      hint : i18n(MODULE_NAME+".enable-color-hint"),
      scope: "player",
      config: true,
      default: false,
      type: Boolean
  });

  new ColorSetting(MODULE_NAME, 'friendly-color', {
      name: i18n(MODULE_NAME+".friendly-color-name"),
      hint: i18n(MODULE_NAME+".friendly-color-hint"),
      label: "Pick color",
      restricted: false,
      defaultColor: hexToRGBAString(0x43DFDF, 1),
      scope: "client"
  });
  new ColorSetting(MODULE_NAME, 'neutral-color', {
      name: i18n(MODULE_NAME+".neutral-color-name"),
      hint: i18n(MODULE_NAME+".neutral-color-hint"),
      label: "Pick color",
      restricted: false,
      defaultColor: hexToRGBAString(0xF1D836, 1),
      scope: "client"
  });
  new ColorSetting(MODULE_NAME, 'hostile-color', {
      name: i18n(MODULE_NAME+".hostile-color-name"),
      hint: i18n(MODULE_NAME+".hostile-color-hint"),
      label: "Pick color",
      restricted: false,
      defaultColor: hexToRGBAString(0xE72124, 1),
      scope: "client"
  });

  game.settings.register(MODULE_NAME,'enable-colorblind-features', {
      name : i18n(MODULE_NAME+".enable-colorblind-features-name"),
      hint : i18n(MODULE_NAME+".enable-colorblind-features-hint"),
      scope: "player",
      config: true,
      default: false,
      type: Boolean
  });

  game.settings.register(MODULE_NAME,'use-player-color', {
      name : i18n(MODULE_NAME+".use-player-color-name"),
      hint : i18n(MODULE_NAME+".use-player-color-hint"),
      scope: "player",
      config: true,
      default: true,
      type: Boolean
  });

  game.settings.register(MODULE_NAME,'use-fx-rotate', {
      name : i18n(MODULE_NAME+".use-fx-rotate-name"),
      hint : i18n(MODULE_NAME+".use-fx-rotate-hint"),
      scope: "player",
      config: true,
      default: true,
      type: Boolean
  });

  game.settings.register(MODULE_NAME,'use-fx-pulse', {
      name : i18n(MODULE_NAME+".use-fx-pulse-name"),
      hint : i18n(MODULE_NAME+".use-fx-pulse-hint"),
      scope: "player",
      config: true,
      default: true,
      type: Boolean
  });

  // MOD 4535992 Removed we use easy-target
  // game.settings.register(MODULE_NAME,'enable-target-modifier-key', {
  //     name : i18n(MODULE_NAME+".enable-target-modifier-key-name",
  //     hint : i18n(MODULE_NAME+".enable-target-modifier-key-hint",
  //     scope: "world",
  //     config: "true",
  //     default: true,
  //     type: Boolean
  // });

  game.settings.register(MODULE_NAME,'enable-ctrl-resize-modifier', {
      name : i18n(MODULE_NAME+".enable-ctrl-resize-modifier-name"),
      hint : i18n(MODULE_NAME+".enable-ctrl-resize-modifier-hint"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean
  });

  //   hotkeys.registerShortcut({
//     name : i18n(MODULE_NAME+".enable-target-modifier-key-name"),
//     label: i18n(MODULE_NAME+".enable-target-modifier-key-hint"),
//     default: { key: hotkeys.keys.KeyT, alt: false, ctrl: false, shift: false },
//     onKeyDown: () => trigger(false)
//   });

  game.settings.register(MODULE_NAME,'enable-target-portraits', {
      name : i18n(MODULE_NAME+".enable-target-portraits-name"),
      hint : i18n(MODULE_NAME+".enable-target-portraits-hint"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean
  });

  game.settings.register(MODULE_NAME, 'release', {
    name: i18n(MODULE_NAME+".ReleaseBehaviour"),
    hint: i18n(MODULE_NAME+".ReleaseBehaviourHint"),
    scope: 'user',
    config: true,
    default: 'sticky',
    type: String,
    choices: {
      'sticky': i18n(MODULE_NAME+".Sticky"),
      'standard': i18n(MODULE_NAME+".Standard")
    }
  });

  // game.settings.register(MODULE_NAME, 'set-customize-hotkey-target', {
  //   name: i18n(MODULE_NAME+".set-customize-hotkey-target-name"),
  //   hint: i18n(MODULE_NAME+".set-customize-hotkey-target-hint"),
  //   type: window['Azzu'].SettingsTypes.KeyBinding,
  //   default: 'Alt',
  //   scope: 'client',
  //   config: true,
  //   // onChange: (key:any) => {
  //   //     // CHECKOUT
  //   //     let stringValue = key;// game.settings.get(MODULE_NAME, 'set-customize-hotkey-target');
  //   //     if (stringValue.endsWith("+")) {
  //   //         stringValue = stringValue + "  ";
  //   //     }
  //   //     parsedValueKeyBindingTarget = KeyBinding.parse(stringValue);
  //   //     //const withShift = KeyBinding.parse('Shift + ' + stringValue);
  //   //     //const bind = KeyBinding.eventIsForBinding(event, parsedValue);
  //   //     //const bindWithShift = KeyBinding.eventIsForBinding(event, withShift);
  //   // }
  // });

  // ========================================================
  // CUSTOM TOKEN ANIMATION (CUSTOMIZED)
  // ========================================================

  game.settings.register(MODULE_NAME, "playerPermissions", {
        name: i18nFormat("target-enhancements.Permissions"),
        hint: i18nFormat("target-enhancements.Permissions_hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });
    game.settings.register(MODULE_NAME, "fadeOut", {
        name: i18nFormat("target-enhancements.FadeAnims"),
        hint: i18nFormat("target-enhancements.FadeAnims_hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });
  
  // ========================================================
  // BORDER CONTROL SETTINGS (CUSTOMIZED)
  // ========================================================

    game.settings.register(MODULE_NAME, "removeBorders", {
        name: 'Remove Borders',
        hint: 'Remove the border from specific tokens',
        scope: 'world',
        type: String,
        choices: {
            "0": "None",
            "1": "Non Owned",
            "2": "All",
        },
        default: "0",
        config: true,
    });

    game.settings.register(MODULE_NAME, "healthGradient", {
        name: 'HP Gradient',
        scope: 'world',
        type: Boolean,
        default: false,
        config: true,
    });
    game.settings.register(MODULE_NAME, "healthGradientA", {
        name: 'HP Gradient Start',
        scope: 'world',
        type: String,
        default: "#1b9421",
        config: true,
    });
    game.settings.register(MODULE_NAME, "healthGradientB", {
        name: 'HP Gradient End',
        scope: 'world',
        type: String,
        default: "#c9240a",
        config: true,
    });
    game.settings.register(MODULE_NAME, "stepLevel", {
        name: 'Gradient Step Level',
        hint: 'How many individual colors are part of the gradient',
        scope: 'world',
        type: Number,
        default: 10,
        config: true,
    });

    game.settings.register(MODULE_NAME, "borderWidth", {
        name: 'Border Width',
        hint: 'Override border width',
        scope: 'client',
        type: Number,
        default: 4,
        config: true,
    });
    game.settings.register(MODULE_NAME, "borderOffset", {
        name: 'Border Offset',
        hint: 'Customize border offset',
        scope: 'client',
        type: Number,
        default: 0,
        config: true,
    });
    game.settings.register(MODULE_NAME, "targetSize", {
        name: 'Target Size Multiplier',
        scope: 'client',
        type: Number,
        default: 1,
        config: true,
    });
    game.settings.register(MODULE_NAME, "internatTarget", {
        name: 'Internal Target',
        hint: "Target reticule inside  token borders",
        scope: 'client',
        type: Boolean,
        default: false,
        config: true,
    });
    game.settings.register(MODULE_NAME, "circleBorders", {
        name: 'Circular Borders',
        scope: 'client',
        type: Boolean,
        default: false,
        config: true,
    });
    game.settings.register(MODULE_NAME, "hudPos", {
        name: 'Border Control HUD Position',
        scope: 'client',
        type: String,
        default: ".right",
        choices: {
            ".right": "Right",
            ".left": "Left",
        },
        config: true,
    });
    game.settings.register(MODULE_NAME, "controlledColor", {
        name: 'Color: Controlled',
        scope: 'client',
        type: String,
        default: "#FF9829",
        config: true,
    });
    game.settings.register(MODULE_NAME, "controlledColorEx", {
        name: 'Color: Controlled External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "hostileColor", {
        name: 'Color: Hostile',
        scope: 'client',
        type: String,
        default: "#E72124",
        config: true,
    });
    game.settings.register(MODULE_NAME, "hostileColorEx", {
        name: 'Color: Hostile External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "friendlyColor", {
        name: 'Color: Friendly',
        scope: 'client',
        type: String,
        default: "#43DFDF",
        config: true,
    });
    game.settings.register(MODULE_NAME, "friendlyColorEx", {
        name: 'Color: Friendly External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "neutralColor", {
        name: 'Color: Neutral',
        scope: 'client',
        type: String,
        default: "#F1D836",
        config: true,
    });
    game.settings.register(MODULE_NAME, "neutralColorEx", {
        name: 'Color: Neutral External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "partyColor", {
        name: 'Color: Party',
        scope: 'client',
        type: String,
        default: "#33BC4E",
        config: true,
    });
    game.settings.register(MODULE_NAME, "partyColorEx", {
        name: 'Color: Party External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });
    game.settings.register(MODULE_NAME, "targetColor", {
        name: 'Color: Target',
        scope: 'client',
        type: String,
        default: "#FF9829",
        config: true,
    });
    game.settings.register(MODULE_NAME, "targetColorEx", {
        name: 'Color: Target External',
        scope: 'client',
        type: String,
        default: "#000000",
        config: true,
    });




}

// function setup(templateSettings) {
// 	templateSettings.settings().forEach(setting => {
// 		let options = {
// 			name: game.i18n.localize(templateSettings.name()+"."+setting.name+'.Name'),
// 			hint: game.i18n.localize(`${templateSettings.name()}.${setting.name}.Hint`),
// 			scope: setting.scope,
// 			config: true,
// 			default: setting.default,
// 			type: setting.type,
// 			choices: {}
// 		};
// 		if (setting.choices) options.choices = setting.choices;
// 		game.settings.register(templateSettings.name(), setting.name, options);
// 	});
// }

export const matchBoundKeyEvent = function(event): boolean {
  if (!event){
    return false;
  }
  return event.altKey; // TODO FIND A WAY TO MAKE CUSTOMIZABLE
  // let keySetting = game.settings.get(MODULE_NAME,'set-customize-hotkey-target');
  // // keybinds ending with space are trimmed by 0.7.x settings window
  // if (keySetting.endsWith("+")) {
  //   keySetting = keySetting + "  ";
  // }

  // const key = window['Azzu'].SettingsTypes.KeyBinding.parse(keySetting);
  // if (key.key === " " && canvas.controls?.ruler?.waypoints?.length > 0) {
  //   return false;
  // }

  // return (
  //   window['Azzu'].SettingsTypes.KeyBinding.eventIsForBinding(event, key) &&
  //   !$(document.activeElement)
  //     .closest(".app.window-app")
  //     .is("#client-settings")
  // );
}
