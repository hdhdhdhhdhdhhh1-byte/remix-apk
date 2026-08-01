import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VoiceWaves-C2ER8I--.js
var import_jsx_runtime = require_jsx_runtime();
var BARS = 28;
function VoiceWaves({ state, level }) {
	const active = state === "listening" || state === "speaking";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-16 items-end justify-center gap-1.5",
		"aria-hidden": true,
		children: Array.from({ length: BARS }).map((_, i) => {
			const wave = Math.sin(i / BARS * Math.PI);
			const height = active ? 8 + wave * level * 56 + i % 3 * 3 : 6;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `w-1.5 rounded-full transition-[height] duration-100 ${state === "speaking" ? "bg-accent" : "bg-primary"} ${active ? "opacity-90" : "opacity-25"}`,
				style: { height: `${height}px` }
			}, i);
		})
	});
}
//#endregion
export { VoiceWaves as t };
