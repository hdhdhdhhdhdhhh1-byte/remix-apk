import { n as __exportAll } from "../_runtime.mjs";
import { n as WebPlugin, r as registerPlugin } from "./@capacitor/app+[...].mjs";
//#region node_modules/@capacitor/haptics/dist/esm/definitions.js
var ImpactStyle;
(function(ImpactStyle) {
	/**
	* A collision between large, heavy user interface elements
	*
	* @since 1.0.0
	*/
	ImpactStyle["Heavy"] = "HEAVY";
	/**
	* A collision between moderately sized user interface elements
	*
	* @since 1.0.0
	*/
	ImpactStyle["Medium"] = "MEDIUM";
	/**
	* A collision between small, light user interface elements
	*
	* @since 1.0.0
	*/
	ImpactStyle["Light"] = "LIGHT";
})(ImpactStyle || (ImpactStyle = {}));
var NotificationType;
(function(NotificationType) {
	/**
	* A notification feedback type indicating that a task has completed successfully
	*
	* @since 1.0.0
	*/
	NotificationType["Success"] = "SUCCESS";
	/**
	* A notification feedback type indicating that a task has produced a warning
	*
	* @since 1.0.0
	*/
	NotificationType["Warning"] = "WARNING";
	/**
	* A notification feedback type indicating that a task has failed
	*
	* @since 1.0.0
	*/
	NotificationType["Error"] = "ERROR";
})(NotificationType || (NotificationType = {}));
//#endregion
//#region node_modules/@capacitor/haptics/dist/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({
	Haptics: () => Haptics,
	ImpactStyle: () => ImpactStyle,
	NotificationType: () => NotificationType
});
var Haptics = registerPlugin("Haptics", { web: () => Promise.resolve().then(() => web_exports).then((m) => new m.HapticsWeb()) });
//#endregion
//#region node_modules/@capacitor/haptics/dist/esm/web.js
var web_exports = /* @__PURE__ */ __exportAll({ HapticsWeb: () => HapticsWeb });
var HapticsWeb = class extends WebPlugin {
	constructor() {
		super(...arguments);
		this.selectionStarted = false;
	}
	async impact(options) {
		const pattern = this.patternForImpact(options === null || options === void 0 ? void 0 : options.style);
		this.vibrateWithPattern(pattern);
	}
	async notification(options) {
		const pattern = this.patternForNotification(options === null || options === void 0 ? void 0 : options.type);
		this.vibrateWithPattern(pattern);
	}
	async vibrate(options) {
		const duration = (options === null || options === void 0 ? void 0 : options.duration) || 300;
		this.vibrateWithPattern([duration]);
	}
	async selectionStart() {
		this.selectionStarted = true;
	}
	async selectionChanged() {
		if (this.selectionStarted) this.vibrateWithPattern([70]);
	}
	async selectionEnd() {
		this.selectionStarted = false;
	}
	patternForImpact(style = ImpactStyle.Heavy) {
		if (style === ImpactStyle.Medium) return [43];
		else if (style === ImpactStyle.Light) return [20];
		return [61];
	}
	patternForNotification(type = NotificationType.Success) {
		if (type === NotificationType.Warning) return [
			30,
			40,
			30,
			50,
			60
		];
		else if (type === NotificationType.Error) return [
			27,
			45,
			50
		];
		return [
			35,
			65,
			21
		];
	}
	vibrateWithPattern(pattern) {
		if (navigator.vibrate) navigator.vibrate(pattern);
		else throw this.unavailable("Browser does not support the vibrate API");
	}
};
//#endregion
export { esm_exports as t };
