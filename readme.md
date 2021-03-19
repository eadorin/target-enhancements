# Target Enhancements -- FoundryVTT Module

Target Enhancements is a module for FoundryVTT that provides customizations for targeting. As a colorblind player, having icons instead of indistinguishable colored dots makes for a much better experience.

# Why this module?

There are more than 100 modules in foundry vtt but for what concerns the targetting these are the main ones used:

- [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/) thanks to [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/)
- [Target Enhancements (Pre 1.0.0)](https://github.com/eadorin/target-enhancements) thanks to [eadorin](https://github.com/eadorin) 
- [Better Target](https://github.com/sPOiDar/fvtt-module-better-target) thanks to [sPOiDar
](https://github.com/sPOiDar/fvtt-module-better-target)

So the scope of this module is to reduce the number of modules on your game and integrate them with each other and put together something that works (more or less, there is still some work to do).
Thanks to all the other developers who inspired this work.

I'm trying to make this module a upgrade of my favorite tagetting module for all  system 'Target Enhancements'.

The check out the  developing see the [changelog.md](./changelog.md)
  
## Installation

Simply use the install module screen within the FoundryVTT setup

## Usage & features

- Replaces the colored baubles for users targeting a token with their avatar. (Now with NPC Support!) It will fall back to token if an avatar is not supplied

- Adds new "targeted token" indicators, including animations

![New Targets](./img/screenshot_targets.png?raw=true)

- Adds a new button under "Basic Controls" to remove all of a user's current targets/selections

![New Cancel Control](./img/new_cancel_control.png?raw=true)

- Allows the GM to select tokens (<SELECTED>) and then target other tokens as <SELECTED> (ty to easy target)
  
![New Target Inticators](./img/screenshot_indicator_crosshair.png?raw=true)

- Allows for easy targeting whilst holding alt. Also allows for alt+clicking inside an AoE to target all tokens within that AoE. Holding alt while placing a template will also target all tokens within that template when placed. (ty to easy target)

- [Experimental][need more developing] If a token is not selected and you're the GM, you can use the &lt;SHIFT&gt; key + mousewheel to resize tokens

- Add the choice on module settings for integration with Better Target

![Better Target 1](./img/better_target_1.png?raw=true)

![Better Target 2](./img/better_target_2.png?raw=true)

- [Experimental][need more developing] Write on the chat who is targeting whom, or who is being targeted by whom thanks to the lib-targetting library module

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

## TODO List / Known Issues / Limitations

- [Feature][Low priority] Adjust the display of the target token icons!! (currently uses a black outline + shadow)

- [Feature][Low priority] Adjust size of target token icons

- [Low priority] Turn token target icon features on/off  (the default triangles)

- [Bug][Low priority] Users may notice the default target arrows + target baubles appear when first moving a token. Until an API hook is provided by FoundryVTT in the `Token._refreshTarget()` method, this will always be the case

- [Bug][Low priority] Moving or clicking too fast may try to update the token before the target request is received by a client.

- [Bug][Low priority] I've noticed an issue sometimes regarding the selection of multiple NPCs targeting...they don't all show up. If you can reproduce this consistently, please let me know how.

## Troubleshooting

- Users should report issues to the github issues. Reaching out on Discord is a good option as well, but please follow-up with a github issue
- Try clearing all tokens using the new button before selecting/targeting other tokens. this should resolve most issues.

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- [PixiJS-Filters](https://github.com/pixijs/pixi-filters)
- [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/) thanks to [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/)
- [lib-targeting](https://github.com/eadorin/lib-targeting) thanks to [eadorin](https://github.com/eadorin)
- [Better Target](https://github.com/sPOiDar/fvtt-module-better-target) thanks to [sPOiDar](https://github.com/sPOiDar/fvtt-module-better-target)
- [Target Enhancements](https://github.com/eadorin/target-enhancements) thanks to [eadorin](https://github.com/eadorin)
- [Foundry VTT - Bullseye](https://gitlab.com/Ionshard/foundry-vtt-bullseye) ty to [Ionshard](https://gitlab.com/Ionshard)
- [settings-extender](https://gitlab.com/cswendrowski/settings-extender) ty to [foundry-azzurrite](https://gitlab.com/foundry-azzurite)

and of course a huge ty to all the developers of 'League of Extraordinary foundryvtt developers' for give me a hand every time i ask.

## License
This Foundry VTT module, writen by Eadorin, is licensed under [GNU GPLv3.0](https://www.gnu.org/licenses/gpl-3.0.en.html), supplemented by [Commons Clause](https://commonsclause.com/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).
