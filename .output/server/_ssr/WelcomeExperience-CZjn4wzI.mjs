import { r as __toESM } from "../_runtime.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PRESENCE_LABEL, t as NICO_AUTO_GREETING } from "./useNico-DG1TdfhW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WelcomeExperience-CZjn4wzI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NicoOrb({ state, level, onPress }) {
	const active = state === "listening" || state === "speaking";
	const sleeping = state === "sleeping";
	const thinking = state === "thinking";
	const scale = 1 + Math.min(level, 1) * .18;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex h-64 w-64 items-center justify-center",
			children: [
				active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-52 w-52 rounded-full border border-primary/40 animate-ripple" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute h-52 w-52 rounded-full border border-accent/30 animate-ripple",
					style: { animationDelay: "0.8s" }
				})] }),
				thinking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-52 w-52 rounded-full border-2 border-dashed border-primary/40 animate-spin [animation-duration:6s]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onPress,
					"aria-label": PRESENCE_LABEL[state],
					"data-presence": state,
					className: `nico-orb relative h-44 w-44 rounded-full transition-all duration-300 animate-breathe focus:outline-none focus-visible:ring-4 focus-visible:ring-ring/60 ${sleeping ? "opacity-40 saturate-50 [animation-duration:6s]" : ""}`,
					style: { transform: `scale(${sleeping ? .88 : scale})` },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: PRESENCE_LABEL[state]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-6 rounded-full bg-background/10 backdrop-blur-sm" })]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg font-medium text-muted-foreground",
			children: PRESENCE_LABEL[state]
		})]
	});
}
var KEY = "nico.welcome.v1";
var WELCOME_SPEECH = NICO_AUTO_GREETING;
function hasSeenWelcome() {
	if (typeof window === "undefined") return true;
	try {
		return window.localStorage.getItem(KEY) === "done";
	} catch {
		return true;
	}
}
function markSeen() {
	try {
		window.localStorage.setItem(KEY, "done");
	} catch {}
}
/**
* First-run experience: Nico asks for the
* microphone and, as soon as it is granted, greets the user out loud, the language, and whether to sign in or continue as a guest.
* No permission is requested before the user taps its step.
*/
function WelcomeExperience({ isAuthenticated, language, onLanguage, onRequestMic, onSpeak, onDone }) {
	const [micState, setMicState] = (0, import_react.useState)("idle");
	const finish = () => {
		markSeen();
		onDone();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-5 backdrop-blur",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "ترحيب نيكو",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-7 rounded-3xl border border-border bg-card p-6 text-card-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "nico-orb h-28 w-28 rounded-full animate-breathe",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-balance text-lg leading-relaxed",
						children: WELCOME_SPEECH
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "١ — إذن الميكروفون"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: async () => {
							const res = await onRequestMic();
							setMicState(res === "granted" ? "granted" : "denied");
							if (res === "granted") Promise.resolve(onSpeak(WELCOME_SPEECH)).catch(() => {});
						},
						className: `w-full rounded-2xl border px-4 py-3 text-sm transition-colors ${micState === "granted" ? "border-accent/50 bg-accent/15 text-accent" : micState === "denied" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border bg-secondary text-secondary-foreground hover:text-foreground"}`,
						children: micState === "granted" ? "الميكروفون مفعّل" : micState === "denied" ? "تم الرفض — يمكنك السماح لاحقاً" : "السماح باستخدام الميكروفون"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "٢ — لغة المحادثة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: ["ar", "en"].map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onLanguage(lang),
							className: `flex-1 rounded-2xl border px-4 py-3 text-sm transition-colors ${language === lang ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`,
							children: lang === "ar" ? "العربية" : "English"
						}, lang))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "٣ — الحساب"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [!isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								onClick: markSeen,
								className: "flex-1 rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground hover:opacity-90",
								children: "تسجيل الدخول"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: finish,
								className: "flex-1 rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground",
								children: isAuthenticated ? "ابدأ" : "المتابعة كضيف"
							})]
						}),
						!isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "كضيف: الذاكرة محلية ومؤقتة فقط، ولا يُحفظ أي شيء حساس."
						})
					]
				})
			]
		})
	});
}
//#endregion
export { WelcomeExperience as n, hasSeenWelcome as r, NicoOrb as t };
