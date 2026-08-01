import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mobile-pYsIao1B.js
var import_jsx_runtime = require_jsx_runtime();
/** Crash protection: a failed render never leaves a blank phone screen. */
function MobileCrashScreen({ error, reset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: "rtl",
		className: "flex min-h-screen flex-col items-center justify-center gap-4 px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "nico-orb h-24 w-24 rounded-full opacity-60",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "توقف نيكو للحظة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted-foreground",
				children: error.message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: reset,
				className: "rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground",
				children: "إعادة المحاولة"
			})
		]
	});
}
//#endregion
export { MobileCrashScreen as errorComponent };
