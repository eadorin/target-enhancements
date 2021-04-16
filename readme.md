# Target Enhancements -- FoundryVTT Module

## THIS MODULE IS STILL IN BETA IF YOU WANT TO CONTIBUTE ADD SOME BOUNTY FOR DEVELOPING

I tried to solve the problems as far as I could, but now I can't solve the remaining problems myself, for anyone who wants to contribute financially to attract the attention of some developer I put below the link of the reward on trello

[Bounty on trelllo of League of Extraordinary foundryvtt developers](https://trello.com/c/KvEZVMtw/213-modulebountyrevive-target-enhancements)

Target Enhancements is a module for FoundryVTT that provides customizations for targeting. As a colorblind player, having icons instead of indistinguishable colored dots makes for a much better experience.

# Why this module?

There are more than 100 modules in foundry vtt but for what concerns the targetting these are the main ones used:

- [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/) thanks to [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/)
- [Target Enhancements (Pre 1.0.0)](https://github.com/eadorin/target-enhancements) thanks to [eadorin](https://github.com/eadorin) 
- [Better Target](https://github.com/sPOiDar/fvtt-module-better-target) thanks to [sPOiDar](https://github.com/sPOiDar/fvtt-module-better-target)
- [T is for target](https://github.com/basicer/foundryvtt-t-is-for-target) thanks to [basicer](https://github.com/basicer)

So the scope of this module is to reduce the number of modules on your game and integrate them with each other and put together something that works (more or less, there is still some work to do).

Thanks to all the other developers who inspired this work.

I'm trying to make this module a upgrade of my favorite targetting module for all system 'Target Enhancements'.  

### NOTE

Another objective i will try to set up AFTER make it work this module is to build a module library for targetting on foundry system independent, in the specific a upgrade of this module [lib-targeting](https://github.com/eadorin/lib-targeting) always thanks to [eadorin](https://github.com/eadorin)

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/target-enhancements/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### Color Settings

This module uses the [color settings](https://github.com/ardittristan/VTTColorSettings) library like a dependency. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### FXMaster

This module uses the [FXMaster](https://gitlab.com/mesfoliesludiques/foundryvtt-fxmaster) library like a dependency. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Usage & features

- Replaces the colored baubles for users targeting a token with their avatar. (Now with NPC Support!) It will fall back to token if an avatar is not supplied

- Adds new "targeted token" indicators, including animations

![New Targets](./img/screenshot_targets.png?raw=true)

- Adds a new button under "Basic Controls" to remove all of a user's current targets/selections

![New Cancel Control](./img/new_cancel_control.png?raw=true)

- Allows the GM to select tokens (<SELECTED>) and then target other tokens as <SELECTED> with the 'Alt' key button (ty to easy target)
  
![New Target Inticators](./img/screenshot_indicator_crosshair.png?raw=true)

- Allows for easy targeting whilst holding alt. Also allows for alt+clicking inside an AoE to target all tokens within that AoE. Holding alt while placing a template will also target all tokens within that template when placed. (ty to easy target)

- [Experimental][need more developing] If a token is not selected and you're the GM, you can use the &lt;SHIFT&gt; key + mousewheel to resize tokens

- Add the choice on module settings for integration with Better Target

![Better Target 1](./img/better_target_1.png?raw=true)

![Better Target 2](./img/better_target_2.png?raw=true)

- [Experimental][It's work but the chat a little ugly ] Write on the chat who is targeting whom, or who is being targeted by whom thanks to the lib-targetting library module

## Settings

- Display notification: Write on chat enabled (Need some developing)

- Display notification: Write on chat but Hide name of npc/monster with "Unknown Creature" label

- Display notification: Write on chat but show only to GM
	
- Display notification: Write on chat to players but only when a player is targetting
		
- Enable better target feature
       
- Use player color for target indicator

- Indicator FX: Apply Pulse Effect

- Indicator FX: Apply Rotate Effect

- Target indicator

-  Default Foundry Indicator

   -  CrossHair 1
   -  CrossHair 2
   -  BullsEye 1
   -  BullsEye 2
   -  Better Target

- [Experimental] Resize token with mousewheel

- Enable target portraits

- Enable color feature
  
  - Friendly color  
  - Neutral color
  - Hostile color

- Enable Colorblind-targeting features? (warning:ugly)
  
- Enables a set of features to help those who are colorblind

- Release Behaviour

<!----
1. From the Game Settings tab
2. In the 'Game Settings' section, Click 'Configure Settings' (button)
3. Click the 'Module Settings' tab. 
4. Scrol down to the *Target Enhancements* section
5. Select the options that you want and save
-->

# Build

## Install all packages

```bash
npm install
```
## npm build scripts
### build

will build the code and copy all necessary assets into the dist folder and make a symlink to install the result into your foundry data; create a
`foundryconfig.json` file with your Foundry Data path.

```json
{
  "dataPath": "~/.local/share/FoundryVTT/"
}
```

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run-script build
```

### NOTE:

You don't need to build the `foundryconfig.json` file you can just copy the content of the `dist` folder on the module folder under `modules` of Foundry

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run-script build:watch
```

### clean

`clean` will remove all contents in the dist folder (but keeps the link from build:install).

```bash
npm run-script clean
```

## TODO List / Known Issues / Limitations

- [Bug] I commented the "pulse" and "rotate" options on the "TargetIndicator" class because they broke foundry when i delete the token or change the scene. I will try tso fix this.

- [Feature] Show to others player the animated token marker

- [Bug][Switching Scenes or Deleting tokens while target locks up game](https://github.com/eadorin/target-enhancements/issues/31)

- [Bug][Medium priority] When you refesh/reload the page lose all targets

- [Feature][Low priority] Adjust the display of the target token icons!! (currently uses a black outline + shadow)

- [Feature][Low priority] Adjust size of target token icons

- [OTHER ISSUE ARE SET ON TRELLO](https://trello.com/c/KvEZVMtw/213-modulebountyrevive-target-enhancements) 

## [Changelog](./changelog.md)

## Issues

- Users should report issues to the github issues. Reaching out on Discord is a good option as well, but please follow-up with a github issue
- Try clearing all tokens using the new button before selecting/targeting other tokens. this should resolve most issues.

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/target-enhancements/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).


## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- [PixiJS-Filters](https://github.com/pixijs/pixi-filters)
- [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/) thanks to [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/)
- [lib-targeting](https://github.com/eadorin/lib-targeting) thanks to [eadorin](https://github.com/eadorin)
- [Better Target](https://github.com/sPOiDar/fvtt-module-better-target) thanks to [sPOiDar](https://github.com/sPOiDar/fvtt-module-better-target)
- [Target Enhancements](https://github.com/eadorin/target-enhancements) thanks to [eadorin](https://github.com/eadorin)
- [Foundry VTT - Bullseye](https://gitlab.com/Ionshard/foundry-vtt-bullseye) ty to [Ionshard](https://gitlab.com/Ionshard)
- [settings-extender](https://gitlab.com/cswendrowski/settings-extender) ty to [foundry-azzurrite](https://gitlab.com/foundry-azzurite)
- [T is for target](https://github.com/basicer/foundryvtt-t-is-for-target) ty to [basicer](https://github.com/basicer)

and of course a huge ty to all the developers of 'League of Extraordinary foundryvtt developers' for give me a hand every time i ask.

## License

This Foundry VTT module, writen by Eadorin, is licensed under [GNU GPLv3.0](https://www.gnu.org/licenses/gpl-3.0.en.html), supplemented by [Commons Clause](https://commonsclause.com/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).
