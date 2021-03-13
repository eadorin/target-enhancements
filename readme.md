# Target Enhancements -- FoundryVTT Module

Target Enhancements is a module for FoundryVTT that provides customizations for targeting. As a colorblind player, having icons instead of indistinguishable colored dots makes for a much better experience.

# What new with 1.0.0 version ?

There are more than 100 modules in foundry vtt for what concerns the targetting there are three which are the main ones used:

- [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/) thanks to [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/)
- [Target Enhancements (Pre 1.0.0)](https://github.com/eadorin/target-enhancements) thanks to [eadorin](https://github.com/eadorin) 
- [Better Target](https://github.com/sPOiDar/fvtt-module-better-target) thanks to [sPOiDar
](https://github.com/sPOiDar/fvtt-module-better-target)


![New Targets](./img/screenshot_targets.png?raw=true)
![New Target Inticators](./img/screenshot_indicator_crosshair.png?raw=true)
![New Cancel Control](./img/new_cancel_control.png?raw=true)

## [BOUNTY ON TRELLO](https://trello.com/c/KvEZVMtw/213-modulebountyrevive-target-enhancements)

With the new version '1.0.0' i'm trying to make this module the 'facto' tagetting module for all  system.

The devoloping include:

- Converted to typescript project
- Direct integration with [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/) thanks to [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/)
- Direct integration with [lib-targeting](https://github.com/eadorin/lib-targeting) thanks to [eadorin](https://github.com/eadorin) + minor bug fix
- Generic minor bug fix
- Direct integration [Better Target](https://github.com/sPOiDar/fvtt-module-better-target) thanks to [sPOiDar
](https://github.com/sPOiDar/fvtt-module-better-target)

  
## Installation

Simply use the install module screen within the FoundryVTT setup

## Usage & features

- Replaces the colored baubles for users targeting a token with their avatar. (Now with NPC Support!) It will fall back to token if an avatar is not supplied
- Adds new "targeted token" indicators, including animations
- Adds a new button under "Basic Controls" to remove all of a user's current targets/selections
- Allows the GM to select tokens (<SELECTED>) and then target other tokens as <SELECTED>
- Experimental --&gt; adds the ability to hold the &lt;T&gt; key down and click enemies to target them
- If a token is not selected and you're the GM, you can use the &lt;SHIFT&gt; key + mousewheel to resize tokens

<!----
1. From the Game Settings tab
1. In the 'Game Settings' section, Click 'Configure Settings' (button)
1. Click the 'Module Settings' tab. 
1. Scrol down to the *Target Enhancements* section
1. Select the options that you want and save
-->

## TODO List and bug fix

- [Low priority] Full integration of i18

- [Low priority] Full integration of all hoook with lib-wrapper module 
  
- [Low priority] Integration of 'color settings' module for make choose color of target by single use on module settings 

- [Low priority] Turn target features on/off

- [Low priority] Adjust the display of the target token icons!! (currently uses a black outline + shadow)

- [Low priority] Adjust size of target token icons

- [Low priority] Turn token target icon features on/off  (the default triangles)

## Known Issues / Limitations

- Users may notice the default target arrows + target baubles appear when first moving a token. Until an API hook is provided by FoundryVTT in the `Token._refreshTarget()` method, this will always be the case

- Moving or clicking too fast may try to update the token before the target request is received by a client.

- I've noticed an issue sometimes regarding the selection of multiple NPCs targeting...they don't all show up. If you can reproduce this consistently, please let me know how.

-  When the 'Better Target^ module feature is enable, if you hover the customize token target disappear

## Troubleshooting
- Users should report issues to the github issues. Reaching out on Discord is a good option as well, but please follow-up with a github issue
- Try clearing all tokens using the new button before selecting/targeting other tokens. this should resolve most issues.

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- [PixiJS-Filters](https://github.com/pixijs/pixi-filters)
- [easy target](https://bitbucket.org/Fyorl/easy-target/src/master/) thanks to [Fyorl](https://bitbucket.org/%7Beee45cf2-a6e7-43d6-bded-8054de334101%7D/)
- [lib-targeting](https://github.com/eadorin/lib-targeting) thanks to [eadorin](https://github.com/eadorin)
- [Better Target](https://github.com/sPOiDar/fvtt-module-better-target) thanks to [sPOiDar
](https://github.com/sPOiDar/fvtt-module-better-target)
- [Target Enhancements (Pre 1.0.0)](https://github.com/eadorin/target-enhancements) thanks to [eadorin](https://github.com/eadorin) 

## License
This Foundry VTT module, writen by Eadorin, is licensed under [GNU GPLv3.0](https://www.gnu.org/licenses/gpl-3.0.en.html), supplemented by [Commons Clause](https://commonsclause.com/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).
