import { r as __toESM } from "../_runtime.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as useNico } from "./useNico-CItiVl90.mjs";
import { t as VoiceWaves } from "./VoiceWaves-C2ER8I--.mjs";
import { t as TranscriptPanel } from "./TranscriptPanel-BywXE6yS.mjs";
import { n as WelcomeExperience, r as hasSeenWelcome, t as NicoOrb } from "./WelcomeExperience-DW6V8jhN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B3ylQ_k4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	microphone: "الميكروفون",
	location: "الموقع",
	files: "الملفات",
	camera: "الكاميرا",
	notifications: "الإشعارات",
	background_audio: "الصوت في الخلفية",
	bluetooth: "البلوتوث",
	contacts: "جهات الاتصال"
};
function PermissionsBar({ permissions, onRequest, onRevoke }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap items-center justify-center gap-2",
		children: Object.keys(LABELS).map((key) => {
			const state = permissions[key];
			const granted = state === "granted";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => granted ? onRevoke(key) : onRequest(key),
				className: `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${granted ? "border-accent/50 bg-accent/15 text-accent" : state === "denied" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`,
				children: [
					LABELS[key],
					" · ",
					granted ? "مسموح" : state === "denied" ? "مرفوض" : "بانتظار الإذن"
				]
			}, key);
		})
	});
}
function NicoHome() {
	const nico = useNico();
	const [showWelcome, setShowWelcome] = (0, import_react.useState)(false);
	const [logOpen, setLogOpen] = (0, import_react.useState)(false);
	const listening = nico.state === "listening";
	const greetedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!hasSeenWelcome()) setShowWelcome(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (showWelcome || greetedRef.current) return;
		greetedRef.current = true;
		const t = window.setTimeout(() => {
			const greeting = (nico.voiceProfile.language === "en" ? "en" : "ar") === "ar" ? "أهلاً وسهلاً، أنا نيكو مساعدك الشخصي، كيف أستطيع مساعدتك؟" : "Hi, I'm Nico, your personal assistant. How can I help?";
			nico.runtime.voice.say(greeting).catch(() => {});
		}, 400);
		return () => window.clearTimeout(t);
	}, [
		showWelcome,
		nico.runtime,
		nico.voiceProfile.language
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: "rtl",
		className: "mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-5 py-10",
		children: [
			showWelcome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeExperience, {
				isAuthenticated: nico.isAuthenticated,
				language: nico.voiceProfile.language,
				onLanguage: (language) => nico.updateVoiceProfile({ language }),
				onRequestMic: () => nico.requestPermission("microphone"),
				onSpeak: (text) => nico.runtime.voice.say(text),
				onDone: () => setShowWelcome(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "نيكو"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "مساعدك الشخصي الصوتي"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/nico",
							className: "rounded-full border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
							children: "وضع الصوت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/mobile",
							className: "rounded-full border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
							children: "تطبيق الجوال"
						}),
						nico.isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "rounded-full border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:text-foreground",
							children: "لوحة التحكم"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void nico.signOut(),
							className: "rounded-full border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
							children: "خروج"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
							children: "دخول"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col items-center gap-6 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NicoOrb, {
						state: nico.presence,
						level: nico.level,
						onPress: () => listening ? void nico.stopListening() : void nico.startListening()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceWaves, {
						state: nico.state,
						level: nico.level
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => nico.continuous ? nico.stopConversation() : void nico.startConversation(),
						className: `rounded-full border px-5 py-2.5 text-sm transition-colors ${nico.continuous ? "border-accent/50 bg-accent/15 text-accent" : "border-border bg-secondary text-secondary-foreground hover:text-foreground"}`,
						children: nico.continuous ? "إيقاف المحادثة المستمرة" : "محادثة مستمرة بدون يدين"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void nico.setAlwaysReady(!nico.assistant.alwaysReady),
						className: `rounded-full border px-5 py-2 text-xs transition-colors ${nico.assistant.alwaysReady ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-secondary text-secondary-foreground hover:text-foreground"}`,
						children: nico.assistant.alwaysReady ? "الجاهزية الدائمة مفعّلة" : "تفعيل «يا نيكو»"
					}),
					nico.lastIntent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground",
						children: ["النية المكتشفة: ", nico.lastIntent]
					}),
					nico.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: nico.error
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PermissionsBar, {
				permissions: nico.permissions,
				onRequest: (k) => void nico.requestPermission(k),
				onRevoke: nico.revokePermission
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setLogOpen((v) => !v),
					"aria-expanded": logOpen,
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: logOpen ? "إخفاء السجل النصي" : "عرض السجل النصي (مساعد فقط)"
				}), logOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TranscriptPanel, { turns: nico.turns })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "pb-6 text-center text-xs text-muted-foreground",
				children: nico.isAuthenticated ? `مسجل بـ ${nico.authEmail} — الذاكرة مخزّنة في السحابة.` : "أنت في وضع الضيف: الذاكرة مؤقتة محلياً فقط ولا تُحفظ بيانات حساسة."
			})
		]
	});
}
//#endregion
export { NicoHome as component };
