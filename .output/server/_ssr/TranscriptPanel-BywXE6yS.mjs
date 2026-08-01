import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TranscriptPanel-BywXE6yS.js
var import_jsx_runtime = require_jsx_runtime();
function TranscriptPanel({ turns }) {
	if (!turns.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "nico-panel p-6 text-center text-sm text-muted-foreground",
		children: "ابدأ الحديث مع نيكو — قل مثلاً «ذكرني أشرب ماء بعد 20 دقيقة» أو «كيف الطقس؟»"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "nico-panel max-h-72 space-y-3 overflow-y-auto p-5",
		children: turns.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `rounded-2xl px-4 py-3 text-sm leading-relaxed ${t.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/12 text-foreground"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-xs font-semibold text-muted-foreground",
				children: t.role === "user" ? "أنت" : "نيكو"
			}), t.content]
		}, t.id))
	});
}
//#endregion
export { TranscriptPanel as t };
