import { r as __toESM } from "../_runtime.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as VOICE_OPTIONS, s as useNico } from "./useNico-DG1TdfhW.mjs";
import { t as VoiceWaves } from "./VoiceWaves-C2ER8I--.mjs";
import { n as WelcomeExperience, r as hasSeenWelcome, t as NicoOrb } from "./WelcomeExperience-CZjn4wzI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nico-C9bUMTQv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STYLES = [
	{
		id: "friendly",
		label: "ودود"
	},
	{
		id: "calm",
		label: "هادئ"
	},
	{
		id: "energetic",
		label: "حيوي"
	},
	{
		id: "formal",
		label: "رسمي"
	}
];
function VoiceFirst() {
	const nico = useNico();
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [showWelcome, setShowWelcome] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!hasSeenWelcome()) setShowWelcome(true);
	}, []);
	const listening = nico.state === "listening";
	const lastUser = (0, import_react.useMemo)(() => [...nico.turns].reverse().find((t) => t.role === "user"), [nico.turns]);
	const lastNico = (0, import_react.useMemo)(() => [...nico.turns].reverse().find((t) => t.role === "nico"), [nico.turns]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: "rtl",
		className: "relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-between px-5 py-8",
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
				className: "flex w-full items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-sm text-muted-foreground hover:text-foreground",
						children: "رجوع"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-sm font-medium tracking-wide text-muted-foreground",
						children: "وضع الصوت"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSettingsOpen((v) => !v),
						"aria-expanded": settingsOpen,
						className: "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground",
						children: "إعدادات الصوت"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex w-full flex-1 flex-col items-center justify-center gap-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NicoOrb, {
						state: nico.presence,
						level: nico.level,
						onPress: () => void (listening ? nico.stopListening() : nico.startListening())
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceWaves, {
						state: nico.state,
						level: nico.level
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void nico.setAlwaysReady(!nico.assistant.alwaysReady),
						className: `rounded-full border px-5 py-2.5 text-sm transition-colors ${nico.assistant.alwaysReady ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-secondary text-secondary-foreground hover:text-foreground"}`,
						children: nico.assistant.alwaysReady ? nico.wakeWordArmed ? "جاهز دائماً — قل «يا نيكو»" : "جاهز دائماً — مفعّل" : "تفعيل وضع الجاهزية الدائمة"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => nico.continuous ? nico.stopConversation() : void nico.startConversation(),
						className: `rounded-full border px-5 py-2.5 text-sm transition-colors ${nico.continuous ? "border-accent/50 bg-accent/15 text-accent" : "border-border bg-secondary text-secondary-foreground hover:text-foreground"}`,
						children: nico.continuous ? "إيقاف المحادثة المستمرة" : "محادثة مستمرة بدون يدين"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-24 w-full space-y-3 text-center",
						children: [
							lastUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"«",
									lastUser.content,
									"»"
								]
							}),
							lastNico && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-balance text-lg leading-relaxed text-foreground",
								children: lastNico.content
							}),
							!lastUser && !lastNico && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "اضغط الدائرة وقل «يا نيكو، ذكّرني بالاجتماع الساعة ٤»."
							}),
							nico.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: nico.error
							})
						]
					})
				]
			}),
			settingsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "w-full space-y-5 rounded-3xl border border-border bg-card p-5 text-card-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "voice-name",
							className: "text-xs text-muted-foreground",
							children: "الصوت"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "voice-name",
							value: nico.voiceProfile.voiceId,
							onChange: (e) => nico.updateVoiceProfile({ voiceId: e.target.value }),
							className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm",
							children: VOICE_OPTIONS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v.id,
								children: v.label
							}, v.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "voice-speed",
							className: "text-xs text-muted-foreground",
							children: [
								"السرعة — ",
								nico.voiceProfile.speed.toFixed(2),
								"×"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "voice-speed",
							type: "range",
							min: .5,
							max: 2,
							step: .05,
							value: nico.voiceProfile.speed,
							onChange: (e) => nico.updateVoiceProfile({ speed: Number(e.target.value) }),
							className: "w-full accent-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "voice-pitch",
							className: "text-xs text-muted-foreground",
							children: [
								"طبقة الصوت — ",
								nico.voiceProfile.pitch.toFixed(2),
								"×"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "voice-pitch",
							type: "range",
							min: .5,
							max: 2,
							step: .05,
							value: nico.voiceProfile.pitch,
							onChange: (e) => nico.updateVoiceProfile({ pitch: Number(e.target.value) }),
							className: "w-full accent-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "النبرة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: STYLES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => nico.updateVoiceProfile({ style: t.id }),
								className: `rounded-full border px-3 py-1.5 text-xs transition-colors ${nico.voiceProfile.style === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`,
								children: t.label
							}, t.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "اللغة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: ["ar", "en"].map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => nico.updateVoiceProfile({ language: lang }),
								className: `rounded-full border px-3 py-1.5 text-xs transition-colors ${nico.voiceProfile.language === lang ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`,
								children: lang === "ar" ? "العربية" : "English"
							}, lang))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "التسجيل يتوقف تلقائياً بعد صمتك، وكلمة الإيقاظ «يا نيكو» تعمل داخل الأوامر المنطوقة؛ الاستماع الدائم للكلمة جاهز معمارياً وسيُفعّل لاحقاً."
					})
				]
			})
		]
	});
}
//#endregion
export { VoiceFirst as component };
