# Target Enhancements -- FoundryVTT Module
Target Enhancements is a module for FoundryVTT that provides customizations for targeting


## Installation
~~Simply use the install module screen within the FoundryVTT setup~~
copy the folder to your `modules` directory.


## Usage
1. From the Game Settings tab
1. In the 'Game Settings' section, Click 'Configure Settings' (button)
1. Click the 'Module Settings' tab. 
1. Scrol down to the *Target Enhancements* section
1. Select the options that you want and save


## Known Issues / Limitations
- Users may notice the default target arrows + target baubles appear when first moving a token. Until an API hook is provided by FoundryVTT in the `Token._refreshTarget()` method, this will always be the case

- Moving or clicking too fast may try to update the token before the target request is received by a client.

- There are currently no settings for the module. They include:
1. Turn target features on/off
1. Turn token target icon features on/off  (the default triangles)
1. Adjust size of target token icons
1. Adjust type of target feature (replacements for the triangles)

## Troubleshooting

## Credit
Thanks to anyone who helps me with this code!

## License
This Foundry VTT module, writen by Eadorin, is licensed under [GNU GPLv3.0](https://www.gnu.org/licenses/gpl-3.0.en.html), supplemented by [Commons Clause](https://commonsclause.com/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).
