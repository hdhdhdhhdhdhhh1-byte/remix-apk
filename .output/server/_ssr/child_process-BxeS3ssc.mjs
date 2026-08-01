//#region node_modules/.nitro/vite/services/ssr/assets/child_process-BxeS3ssc.js
/* @__NO_SIDE_EFFECTS__ */
function createNotImplementedError(name) {
	return /* @__PURE__ */ new Error(`[unenv] ${name} is not implemented yet!`);
}
/* @__NO_SIDE_EFFECTS__ */
function notImplemented(name) {
	const fn = () => {
		throw /* @__PURE__ */ createNotImplementedError(name);
	};
	return Object.assign(fn, { __unenv__: true });
}
var spawn = /* @__PURE__ */ notImplemented("child_process.spawn");
//#endregion
export { spawn };
