// For Zamrod.
// Special thanks to Reaver.
import { toNamespacedPath } from 'path';
import { MODULE_NAME } from '../module/settings.js';
import {libWrapper} from './libs/libWrapper/shim.js'
export const EasyTarget = {
	getTemplateShape: function (template) {
		let shape = template.data.t;
		shape = shape[0].toUpperCase() + shape.substring(1);

		const fn = MeasuredTemplate.prototype[`_get${shape}Shape`];
		const dim = canvas.dimensions;
		let {direction, distance, angle, width} = template.data;

		distance *= (dim.size / dim.distance);
		width *= (dim.size / dim.distance);
		direction = toRadians(direction);

		switch (shape) {
			case 'Circle': return fn.apply(template, [distance]);
			case 'Cone': return fn.apply(template, [direction, angle, distance]);
			case 'Rect': return fn.apply(template, [direction, distance]);
			case 'Ray': return fn.apply(template, [direction, distance, width]);
		}
	},

	patch: function () {
		const releaseOthersMap = new WeakMap();

		const tokenSetTarget = function (wrapped, ...args) {
			const releaseOthers = releaseOthersMap.get(this);
			if (releaseOthers !== undefined) {
				args[1].releaseOthers = releaseOthers;
			}

			return wrapped(...args);
		}

		const tokenOnClickLeft = function (wrapped, ...args) {
			const [ event ] = args;
			const oe = event.data.originalEvent;
			const tool = ui['controls'].control.activeTool;

			if (oe.altKey) {
				ui['controls'].control.activeTool = 'target';
			}

			if (ui['controls'].control.activeTool === 'target') {
				releaseOthersMap.set(this, EasyTarget.releaseBehaviour(oe));
			}

			wrapped(...args);

			releaseOthersMap.delete(this);

			ui['controls'].control.activeTool = tool;
		}

		const tokenCanControl = function (wrapped, ...args) {
			const [ user, event ] = args;

			if (!event) {
				return wrapped(...args);
			}

			const oe = event.data.originalEvent;
			const tool = ui['controls'].control.activeTool;

			if (oe.altKey) {
				ui['controls'].control.activeTool = 'target';
			}

			const canControl = wrapped(...args);

			ui['controls'].control.activeTool = tool;

			return canControl;
		};

		const tokenLayerTargetObjects = function (wrapped, ...args) {
			const releaseOthers = releaseOthersMap.get(this);

			if (releaseOthers !== undefined) {
				args[1].releaseOthers = releaseOthers;
			}

			return wrapped(...args);
		}

		const canvasOnClickLeft = function (wrapped, ...args) {
			const [ event ] = args;
			const oe = event.data.originalEvent;
			const tool = ui['controls'].control.activeTool;
			const selectState = event.data._selectState;

			if (oe.altKey) {
				ui['controls'].control.activeTool = 'target';
			}

			wrapped(...args);

			if (oe.altKey && selectState !== 2) {
				const {x: ox, y: oy} = event.data.origin;
				const templates = canvas.templates.objects.children.filter(template => {
					const {x: cx, y: cy} = template.center;
					return template.shape.contains(ox - cx, oy - cy);
				});

				EasyTarget.targetTokensInArea(templates, EasyTarget.releaseBehaviour(oe));
			}

			ui['controls'].control.activeTool = tool;
		};

		const canvasOnDragLeftDrop = function (wrapped, ...args) {
			const [ event ] = args;
			const oe = event.data.originalEvent;
			const tool = ui['controls'].control.activeTool;
			const layer = canvas.activeLayer;

			if (oe.altKey) {
				ui['controls'].control.activeTool = 'target';
			}

			if (ui['controls'].control.activeTool === 'target') {
				releaseOthersMap.set(layer, EasyTarget.releaseBehaviour(oe));
			}

			wrapped(...args);

			releaseOthersMap.delete(layer);

			ui['controls'].control.activeTool = tool;
		};

		const templateLayerOnDragLeftDrop = function (wrapped, ...args) {
			const [ event ] = args;
			const object = event.data.preview;
			const oe = event.data.originalEvent;

			wrapped(...args);

			if (oe.altKey) {
				const template = new MeasuredTemplate(object.data);
				template['shape'] = EasyTarget.getTemplateShape(template);
				EasyTarget.targetTokensInArea([template], EasyTarget.releaseBehaviour(oe));
			}
		};

		const keyboardManagerOnKeyC = function (wrapped, ...args) {
			const [ event, up, modifiers ] = args;

			if (!(modifiers.isShift && modifiers.isAlt)) {
				wrapped(...args);
			}
		};

		// if (game.modules.get('lib-wrapper')?.active) {
			libWrapper.register(MODULE_NAME, 'Token.prototype.setTarget', tokenSetTarget, 'WRAPPER');
			libWrapper.register(MODULE_NAME, 'Token.prototype._onClickLeft', tokenOnClickLeft, 'WRAPPER');
			libWrapper.register(MODULE_NAME, 'Token.prototype._canControl', tokenCanControl, 'WRAPPER');
			libWrapper.register(MODULE_NAME, 'TokenLayer.prototype.targetObjects', tokenLayerTargetObjects, 'WRAPPER');
			libWrapper.register(MODULE_NAME, 'Canvas.prototype._onClickLeft', canvasOnClickLeft, 'WRAPPER');
			libWrapper.register(MODULE_NAME, 'Canvas.prototype._onDragLeftDrop', canvasOnDragLeftDrop, 'WRAPPER');
			libWrapper.register(MODULE_NAME, 'TemplateLayer.prototype._onDragLeftDrop', templateLayerOnDragLeftDrop, 'WRAPPER');
			libWrapper.register(MODULE_NAME, 'KeyboardManager.prototype._onKeyC', keyboardManagerOnKeyC, 'MIXED');
		// } else {
		// 	const cachedTokenSetTarget = Token.prototype['setTarget'];
		// 	Token.prototype['setTarget'] = function () {
		// 		return tokenSetTarget.call(this, cachedTokenSetTarget.bind(this), ...arguments);
		// 	};

		// 	const cachedTokenOnClickLeft = Token.prototype['_onClickLeft'];
		// 	Token.prototype['_onClickLeft'] = function () {
		// 		return tokenOnClickLeft.call(this, cachedTokenOnClickLeft.bind(this), ...arguments);
		// 	};

		// 	const cachedTokenCanControl = Token.prototype['_canControl'];
		// 	Token.prototype['_canControl'] = function () {
		// 		return tokenCanControl.call(this, cachedTokenCanControl.bind(this), ...arguments);
        //     };
            
        //     //TODO ASK FOR HELP TO ANYONE

		// 	// const cachedTokenLayerTargetObjects = TokenLayer.prototype.targetObjects;
		// 	// TokenLayer.prototype.targetObjects = function () {
		// 	// 	return tokenLayerTargetObjects.call(this, cachedTokenLayerTargetObjects.bind(this), ...arguments);
		// 	// };

		// 	const cachedCanvasOnClickLeft = canvas.prototype._onClickLeft;
		// 	canvas.prototype._onClickLeft = function () {
		// 		return canvasOnClickLeft.call(this, cachedCanvasOnClickLeft.bind(this), ...arguments);
		// 	};

		// 	const cachedCanvasOnDragLeftDrop = canvas.prototype._onDragLeftDrop;
		// 	canvas.prototype._onDragLeftDrop = function () {
		// 		return canvasOnDragLeftDrop.call(this, cachedCanvasOnDragLeftDrop.bind(this), ...arguments);
        //     };
            
        //     //TODO ASK FOR HELP TO ANYONE

		// 	// const cachedTemplateLayerOnDragLeftDrop = TemplateLayer.prototype._onDragLeftDrop;
		// 	// TemplateLayer.prototype._onDragLeftDrop = function () {
		// 	// 	return templateLayerOnDragLeftDrop.call(this, cachedTemplateLayerOnDragLeftDrop.bind(this), ...arguments);
		// 	// };

		// 	const cachedKeyboardManagerOnKeyC = KeyboardManager.prototype['_onKeyC'];
		// 	KeyboardManager.prototype['_onKeyC'] = function () {
		// 		return keyboardManagerOnKeyC.call(this, cachedKeyboardManagerOnKeyC.bind(this), ...arguments);
		// 	};
		// }
	},

	releaseBehaviour: function (oe) {
		//const mode = game.settings.get(MODULE_NAME, 'release');
		//if (mode === 'sticky') {
		return !oe.shiftKey && !oe.altKey;
		//}
		//return !oe.shiftKey;
	},

	targetTokensInArea: function (templates, releaseOthers) {
		if (releaseOthers) {
            //game.user.targets.forEach(token =>
            canvas.tokens.objects.children.filter(token => {
				token.setTarget(false, {releaseOthers: false, groupSelection: true})});
		}

		canvas.tokens.objects.children.filter(token => {
			const {x: ox, y: oy} = token.center;
			return templates.some(template => {
				const {x: cx, y: cy} = template.center;
				return template.shape.contains(ox - cx, oy - cy);
			});
		}).forEach(token => token.setTarget(true, {releaseOthers: false, groupSelection: true}));
		game.user.broadCastActivity(
            {
                cursor: undefined,
                focus: false,
                ping: false,
                ruler: "",
                sceneId: "",
                targets: game.user.targets['ids']
            } 
        );
	}
};

document.addEventListener('keydown', event => {
	if (event.altKey && event.key === 'C') {
        //game.user.targets.forEach(token =>
        canvas.tokens.objects.children.forEach(token => 
            token.setTarget(false, {releaseOthers: false, groupSelection: true})
        );
        game.user.targets.forEach(token =>
            game.user.broadCastActivity(
                {
                    cursor: token.cursor,
                    focus: false,
                    ping: false,
                    ruler: "",
                    sceneId: "",
                    targets: game.user.targets['ids']
                }
            )
        );
	}
});