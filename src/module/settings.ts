import { debug, log, setDebugLevel, warn, i18n } from '../target-enhancements';
import { TargetsTable } from './lib-targeting/TargetsTable';
import { NPCTargeting } from './lib-targeting/NPCTargeting';

window['TargetsTable'] = TargetsTable;
window['NPCTargeting'] = NPCTargeting;

export const MODULE_NAME = 'target-enhancements';

export const registerSettings = function () {

    game.settings.register(MODULE_NAME, 'display_notificaton_enable_notification', {
		name: 'Display notification: Write on chat enabled (Need some developing)',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Display notification: Write on chat enabled (Need some developing)'
	});

    game.settings.register(MODULE_NAME, 'display_notificaton_npc_name', {
		name: 'Display notification: Write on chat but Hide name of npc/monster with "Unknown Creature" label',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Display notification: Write on chat but Hide name of npc/monster with "Unknown Creature" label'
	});

	game.settings.register(MODULE_NAME, 'display_notificaton_gm_vision', {
		name: 'Display notification: Write on chat but show only to GM',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Display notification: Write on chat but show only to GM'
	});

	game.settings.register(MODULE_NAME, 'display_notificaton_show_to_players_the_player_updates', {
		name: 'Display notification: Write on chat to players but only when a player is targetting',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Display notification: Write on chat to players but only when a player is targetting'
	});

    game.settings.register(MODULE_NAME,'enable-better-target', {
        name : "Enable better target feature",
        hint : "Enable better target feature",
        scope: "player",
        config: "true",
        default: false,
        type: Boolean
    });

    game.settings.register(MODULE_NAME,'target-indicator',{
        name: "target-enhancements.options.target-indicator.name",
        hint: "target-enhancements.options.target-indicator.hint",
        scope: "player",
        config: true,
        default: "0",
        type: String,
        choices: {
            "0" : "target-enhancements.options.target-indicator.choices.0",
            "1" : "target-enhancements.options.target-indicator.choices.1",
            "2" : "target-enhancements.options.target-indicator.choices.2",
            "3" : "target-enhancements.options.target-indicator.choices.3",
            "4" : "target-enhancements.options.target-indicator.choices.4",
            "5" : "target-enhancements.options.target-indicator.choices.5",
        }
    });

  // TODO TO INTEGRATED
  // new ColorSetting(MODULE_NAME, 'friendly-color', {
  //     name: "target-enhancements.options.friendly-color.name",
  //     hint: "target-enhancements.options.friendly-color.hint",
  //     label: "Pick color",
  //     restricted: false,
  //     defaultColor: hexToRGBAString(0x43DFDF, 1),
  //     scope: "client"
  // });
  // new ColorSetting(MODULE_NAME, 'neutral-color', {
  //     name: "target-enhancements.options.neutral-color.name",
  //     hint: "target-enhancements.options.neutral-color.hint",
  //     label: "Pick color",
  //     restricted: false,
  //     defaultColor: hexToRGBAString(0xF1D836, 1),
  //     scope: "client"
  // });
  // new ColorSetting(MODULE_NAME, 'hostile-color', {
  //     name: "target-enhancements.options.hostile-color.name",
  //     hint: "target-enhancements.options.hostile-color.hint",
  //     label: "Pick color",
  //     restricted: false,
  //     defaultColor: hexToRGBAString(0xE72124, 1),
  //     scope: "client"
  // });

    game.settings.register(MODULE_NAME,'enable-colorblind-features', {
        name : "target-enhancements.options.enable-colorblind-features.name",
        hint : "target-enhancements.options.enable-colorblind-features.hint",
        scope: "player",
        config: "true",
        default: false,
        type: Boolean
    });

    game.settings.register(MODULE_NAME,'use-player-color', {
        name : "target-enhancements.options.use-player-color.name",
        hint : "target-enhancements.options.use-player-color.hint",
        scope: "player",
        config: "true",
        default: true,
        type: Boolean
    });

    game.settings.register(MODULE_NAME,'use-fx-rotate', {
        name : "target-enhancements.options.use-fx-rotate.name",
        hint : "target-enhancements.options.use-fx-rotate.hint",
        scope: "player",
        config: "true",
        default: true,
        type: Boolean
    });

    game.settings.register(MODULE_NAME,'use-fx-pulse', {
        name : "target-enhancements.options.use-fx-pulse.name",
        hint : "target-enhancements.options.use-fx-pulse.hint",
        scope: "player",
        config: "true",
        default: true,
        type: Boolean
    });

    // MOD 4535992 Removed we use easy-target
    // game.settings.register(MODULE_NAME,'enable-target-modifier-key', {
    //     name : "target-enhancements.options.enable-target-modifier-key.name",
    //     hint : "target-enhancements.options.enable-target-modifier-key.hint",
    //     scope: "world",
    //     config: "true",
    //     default: true,
    //     type: Boolean
    // });

    game.settings.register(MODULE_NAME,'enable-ctrl-resize-modifier', {
        name : "target-enhancements.options.enable-ctrl-resize-modifier.name",
        hint : "target-enhancements.options.enable-ctrl-resize-modifier.hint",
        scope: "world",
        config: "true",
        default: true,
        type: Boolean
    });

    game.settings.register(MODULE_NAME,'enable-target-portraits', {
        name : "target-enhancements.options.enable-target-portraits.name",
        hint : "target-enhancements.options.enable-target-portraits.hint",
        scope: "world",
        config: "true",
        default: true,
        type: Boolean
    });

    game.settings.register(MODULE_NAME, 'release', {
      name: 'target-enhancements.options.ReleaseBehaviour',
      hint: 'target-enhancements.options.ReleaseBehaviourHint',
      scope: 'user',
      config: true,
      default: 'sticky',
      type: String,
      choices: {
        'sticky': 'target-enhancements.options.Sticky',
        'standard': 'target-enhancements.options.Standard'
      }
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
