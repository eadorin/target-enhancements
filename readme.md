# Target Enhancements -- FoundryVTT Module
Target Enhancements is a module for FoundryVTT that provides customizations for targeting. As a colorblind player, having icons instead of indistinguishable colored dots makes for a much better experience.

![New Targets](https://github.com/eadorin/target-enhancements/blob/master/img/screenshot_targets.png?raw=true)
![New Target Inticators](https://github.com/eadorin/target-enhancements/blob/master/img/screenshot_indicator_crosshair.png?raw=true)
![New Cancel Control](https://github.com/eadorin/target-enhancements/blob/master/img/new_cancel_control.png?raw=true)


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

## Known Issues / Limitations
- Users may notice the default target arrows + target baubles appear when first moving a token. Until an API hook is provided by FoundryVTT in the `Token._refreshTarget()` method, this will always be the case

- Moving or clicking too fast may try to update the token before the target request is received by a client.

- I've noticed an issue sometimes regarding the selection of multiple NPCs targeting...they don't all show up. If you can reproduce this consistently, please let me know how.
  
- The use of the &lt;T&gt; targeting ability may not be 100% yet.


Upcoming/requested features:
1. Turn target features on/off
2. Adjust the display of the target token icons!! (currently uses a black outline + shadow)
3. Adjust size of target token icons
4. Turn token target icon features on/off  (the default triangles)

## Troubleshooting
- Users should report issues to the github issues. Reaching out on Discord is a good option as well, but please follow-up with a github issue
- Try clearing all tokens using the new button before selecting/targeting other tokens. this should resolve most issues.

## Credit
Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!
[PixiJS-Filters](https://github.com/pixijs/pixi-filters)

## License
This Foundry VTT module, writen by Eadorin, is licensed under [GNU GPLv3.0](https://www.gnu.org/licenses/gpl-3.0.en.html), supplemented by [Commons Clause](https://commonsclause.com/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).
