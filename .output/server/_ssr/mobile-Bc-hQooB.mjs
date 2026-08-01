import { r as __toESM } from "../_runtime.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PRESENCE_LABEL, t as NICO_AUTO_GREETING } from "./useNico-DG1TdfhW.mjs";
import { t as VoiceWaves } from "./VoiceWaves-C2ER8I--.mjs";
import { t as TranscriptPanel } from "./TranscriptPanel-BywXE6yS.mjs";
import { n as useNicoMobile } from "./useNicoMobile-C_BHGEH9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mobile-Bc-hQooB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* NicoAvatar — the phone-side face of the assistant.
*
* Purely presentational: it reflects the presence coming from the existing
* voice runtime (idle / listening / thinking / speaking / sleeping) and the
* live mic level. It does not own any state or logic.
*/
function NicoAvatar({ state, level, onPress }) {
	const listening = state === "listening";
	const speaking = state === "speaking";
	const thinking = state === "thinking";
	const sleeping = state === "sleeping";
	const amp = Math.min(Math.max(level, 0), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onPress,
			"aria-label": PRESENCE_LABEL[state],
			"data-presence": state,
			className: "relative flex h-52 w-52 items-center justify-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-ring/60",
			children: [
				(listening || speaking) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-48 w-48 rounded-full border border-primary/40 animate-ripple" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute h-48 w-48 rounded-full border border-accent/30 animate-ripple",
					style: { animationDelay: "0.7s" }
				})] }),
				thinking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-48 w-48 rounded-full border-2 border-dashed border-primary/40 animate-spin [animation-duration:6s]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `nico-orb relative flex h-40 w-40 items-center justify-center rounded-full transition-all duration-300 animate-breathe ${sleeping ? "opacity-40 saturate-50 [animation-duration:7s]" : ""}`,
					style: { transform: `scale(${sleeping ? .9 : 1 + amp * .14})` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
								closed: sleeping,
								narrow: thinking
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
								closed: sleeping,
								narrow: thinking
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-background/70 transition-all duration-150",
							style: {
								width: speaking ? 34 + amp * 26 : listening ? 26 : 22,
								height: speaking ? 6 + amp * 20 : 4
							}
						})]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: PRESENCE_LABEL[state]
		})]
	});
}
function Eye({ closed, narrow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-background/80 transition-all duration-200",
		style: {
			width: 12,
			height: closed ? 3 : narrow ? 7 : 14
		}
	});
}
/**
* First-run experience for the Android app.
* Avatar first, then microphone, notifications, language and account —
* nothing is requested before the user taps its step, and the flow ends with
* Nico speaking, never with a text box.
*/
function MobileOnboarding({ isAuthenticated, language, onLanguage, onRequest, onDone }) {
	const [mic, setMic] = (0, import_react.useState)("prompt");
	const [notify, setNotify] = (0, import_react.useState)("prompt");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const ask = async (key, set) => {
		setBusy(key);
		try {
			set(await onRequest(key));
		} finally {
			setBusy(null);
		}
	};
	const stateClass = (s) => s === "granted" ? "border-accent/50 bg-accent/15 text-accent" : s === "denied" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border bg-secondary text-secondary-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-6 py-10",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "تهيئة نيكو",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-md space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "nico-orb h-32 w-32 rounded-full animate-breathe",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-bold",
							children: "نيكو"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-balance text-sm leading-relaxed text-muted-foreground",
							children: NICO_AUTO_GREETING
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "١ — الميكروفون (ضروري)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy === "microphone",
						onClick: () => void ask("microphone", setMic),
						className: `w-full rounded-2xl border px-4 py-3 text-sm transition-colors ${stateClass(mic)}`,
						children: mic === "granted" ? "الميكروفون مفعّل" : mic === "denied" ? "تم الرفض — يمكن السماح لاحقاً من الإعدادات" : "السماح بالميكروفون حتى أسمعك"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "٢ — الإشعارات"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy === "notifications",
						onClick: () => void ask("notifications", setNotify),
						className: `w-full rounded-2xl border px-4 py-3 text-sm transition-colors ${stateClass(notify)}`,
						children: notify === "granted" ? "الإشعارات مفعّلة" : notify === "denied" ? "بدون إشعارات — لن أذكّرك بالمواعيد" : "السماح بالإشعارات لأذكّرك في وقتها"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "٣ — لغة المحادثة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: ["ar", "en"].map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onLanguage(lang),
							className: `flex-1 rounded-2xl border px-4 py-3 text-sm transition-colors ${language === lang ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
							children: lang === "ar" ? "العربية" : "English"
						}, lang))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "٤ — الحساب"
					}), isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent",
						children: "أنت مسجل — ذاكرتك محفوظة في حسابك."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "flex-1 rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground",
							children: "تسجيل الدخول"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onDone,
							className: "flex-1 rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground",
							children: "متابعة كضيف"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDone,
					className: "w-full rounded-2xl bg-primary px-4 py-4 text-base font-semibold text-primary-foreground disabled:opacity-50",
					disabled: mic !== "granted",
					children: "ابدأ التحدث مع نيكو"
				}),
				mic !== "granted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "نيكو يحتاج الميكروفون ليعمل بالصوت أولاً."
				})
			]
		})
	});
}
/** Tracks device connectivity so Nico can degrade gracefully offline. */
function useOnline() {
	const [online, setOnline] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const update = () => setOnline(navigator.onLine);
		update();
		window.addEventListener("online", update);
		window.addEventListener("offline", update);
		return () => {
			window.removeEventListener("online", update);
			window.removeEventListener("offline", update);
		};
	}, []);
	return online;
}
/** Crash protection: a failed render never leaves a blank phone screen. */
function MobileApp() {
	const nico = useNicoMobile();
	const [showOnboarding, setShowOnboarding] = (0, import_react.useState)(false);
	const [typing, setTyping] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)("");
	const [logOpen, setLogOpen] = (0, import_react.useState)(false);
	const listening = nico.state === "listening";
	const online = useOnline();
	(0, import_react.useEffect)(() => {
		if (!nico.onboarded) setShowOnboarding(true);
	}, [nico.onboarded]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: "rtl",
		className: "mx-auto flex min-h-screen w-full max-w-md flex-col justify-between px-5 pb-8 pt-6",
		children: [
			showOnboarding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileOnboarding, {
				isAuthenticated: nico.isAuthenticated,
				language: nico.voiceProfile.language,
				onLanguage: (language) => nico.updateVoiceProfile({ language }),
				onRequest: nico.requestPermission,
				onDone: () => {
					setShowOnboarding(false);
					nico.finishOnboarding();
				}
			}),
			!online && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 rounded-2xl border border-border bg-secondary px-4 py-2 text-center text-xs text-muted-foreground",
				children: "لا يوجد اتصال — نيكو يعمل بالذاكرة المحلية والمهارات التي لا تحتاج إنترنت."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-bold",
					children: "نيكو"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: PRESENCE_LABEL[nico.presence]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mobile/settings",
						className: "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground",
						children: "الإعدادات"
					}), !nico.isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
						children: "دخول"
					})]
				})]
			}),
			(nico.offline || nico.mobileError || nico.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2",
				children: [nico.offline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border border-border bg-secondary px-4 py-2 text-xs text-muted-foreground",
					children: "لا يوجد اتصال — أرد على الأوامر البسيطة محلياً فقط."
				}), (nico.mobileError || nico.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs text-destructive",
					children: nico.mobileError ?? nico.error
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-1 flex-col items-center justify-center gap-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NicoAvatar, {
						state: nico.presence,
						level: nico.level,
						onPress: () => void (listening ? nico.stopListening() : nico.startListening())
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceWaves, {
						state: nico.state,
						level: nico.level
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: PRESENCE_LABEL[nico.presence]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => nico.continuous ? nico.stopConversation() : void nico.startConversation(),
								className: `w-full rounded-2xl border px-5 py-3 text-sm transition-colors ${nico.continuous ? "border-accent/50 bg-accent/15 text-accent" : "border-border bg-secondary text-secondary-foreground"}`,
								children: nico.continuous ? "إيقاف المحادثة المستمرة" : "محادثة بدون يدين"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void nico.setAlwaysReady(!nico.assistant.alwaysReady),
								className: `w-full rounded-2xl border px-5 py-3 text-sm transition-colors ${nico.assistant.alwaysReady ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-secondary text-secondary-foreground"}`,
								children: nico.assistant.alwaysReady ? "«يا نيكو» مفعّلة" : "تفعيل كلمة «يا نيكو»"
							}),
							nico.assistant.alwaysReady && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-[11px] text-muted-foreground",
								children: nico.background === "running" ? "خدمة الاستماع تعمل في الخلفية." : "الاستماع في الواجهة فقط — خدمة الخلفية تحتاج تطبيق أندرويد مبنياً."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTyping((v) => !v),
							children: typing ? "إخفاء الكتابة" : "الكتابة (اختياري)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLogOpen((v) => !v),
							children: logOpen ? "إخفاء السجل" : "السجل"
						})]
					}),
					typing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							const value = text.trim();
							if (!value) return;
							setText("");
							nico.sendText(value);
						},
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: text,
							onChange: (e) => setText(e.target.value),
							placeholder: "اكتب لنيكو...",
							className: "flex-1 rounded-2xl border border-border bg-secondary px-4 py-3 text-sm outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground",
							children: "إرسال"
						})]
					}),
					logOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TranscriptPanel, { turns: nico.turns }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[11px] text-muted-foreground",
						children: nico.isAuthenticated ? `${nico.authEmail} — الذاكرة مرتبطة بحسابك${nico.migratedMemories ? ` (نُقلت ${nico.migratedMemories} ذكرى من وضع الضيف)` : ""}.` : "وضع الضيف: الذاكرة محلية مؤقتة، وتُرقّى تلقائياً عند تسجيل الدخول."
					})
				]
			})
		]
	});
}
//#endregion
export { MobileApp as component };
