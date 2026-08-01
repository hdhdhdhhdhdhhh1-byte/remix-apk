import { r as __toESM } from "../_runtime.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as VOICE_OPTIONS, s as useNico } from "./useNico-DG1TdfhW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Bi5hvANV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY$1 = "nico.automation.v1";
var DEFAULTS = [{
	id: "daily_briefing",
	label: "إحاطة الصباح",
	time: "07:00",
	days: [],
	enabled: false,
	action: "daily_briefing"
}];
/**
* Task Automation Engine — recurring, time-of-day triggers evaluated in the
* foreground (web) and by the Android foreground service (mobile).
* Actions are resolved by the host so no business logic lives here.
*/
var TaskAutomation = class {
	schedules = [];
	handlers = /* @__PURE__ */ new Map();
	listeners = /* @__PURE__ */ new Set();
	timer = null;
	constructor() {
		this.schedules = this.load();
	}
	load() {
		if (typeof window === "undefined") return [...DEFAULTS];
		try {
			const raw = window.localStorage.getItem(KEY$1);
			const stored = raw ? JSON.parse(raw) : [];
			const merged = [...DEFAULTS];
			for (const s of stored) {
				const i = merged.findIndex((m) => m.id === s.id);
				if (i >= 0) merged[i] = {
					...merged[i],
					...s
				};
				else merged.push(s);
			}
			return merged;
		} catch {
			return [...DEFAULTS];
		}
	}
	persist() {
		if (typeof window !== "undefined") try {
			window.localStorage.setItem(KEY$1, JSON.stringify(this.schedules));
		} catch {}
		const snapshot = this.list();
		this.listeners.forEach((l) => l(snapshot));
	}
	list() {
		return this.schedules.map((s) => ({ ...s }));
	}
	register(action, handler) {
		this.handlers.set(action, handler);
		return () => this.handlers.delete(action);
	}
	add(schedule) {
		const created = {
			...schedule,
			id: crypto.randomUUID()
		};
		this.schedules.push(created);
		this.persist();
		return created;
	}
	update(id, patch) {
		const s = this.schedules.find((x) => x.id === id);
		if (!s) return null;
		Object.assign(s, patch);
		this.persist();
		return { ...s };
	}
	remove(id) {
		this.schedules = this.schedules.filter((s) => s.id !== id);
		this.persist();
	}
	start() {
		if (this.timer || typeof window === "undefined") return () => {};
		this.timer = setInterval(() => void this.tick(), 3e4);
		this.tick();
		return () => this.stop();
	}
	stop() {
		if (this.timer) clearInterval(this.timer);
		this.timer = null;
	}
	/** Runs any schedule whose local time has arrived (once per day). */
	async tick(now = /* @__PURE__ */ new Date()) {
		const [nowH, nowM] = [now.getHours(), now.getMinutes()];
		for (const s of this.schedules) {
			if (!s.enabled) continue;
			if (s.days.length && !s.days.includes(now.getDay())) continue;
			const [h, m] = s.time.split(":").map(Number);
			if (Number.isNaN(h) || Number.isNaN(m)) continue;
			const dueMinutes = h * 60 + m;
			const nowMinutes = nowH * 60 + nowM;
			if (nowMinutes < dueMinutes || nowMinutes > dueMinutes + 5) continue;
			if (s.lastRunAt && new Date(s.lastRunAt).toDateString() === now.toDateString()) continue;
			s.lastRunAt = now.getTime();
			this.persist();
			await this.handlers.get(s.action)?.(s);
		}
	}
	subscribe(fn) {
		this.listeners.add(fn);
		fn(this.list());
		return () => this.listeners.delete(fn);
	}
};
var taskAutomation = new TaskAutomation();
var KEY = "nico.analytics.v1";
var EMPTY = () => ({
	conversations: 0,
	messages: 0,
	voiceMinutes: 0,
	skillRuns: {},
	errors: 0,
	startedAt: Date.now()
});
/**
* Privacy-respecting usage analytics.
* Stores counters only — never transcripts, memories, or personal fields.
* Cloud mirroring is opt-in and off by default.
*/
var UsageAnalytics = class {
	snapshot;
	sink = null;
	cloudEnabled = false;
	listeners = /* @__PURE__ */ new Set();
	constructor() {
		this.snapshot = this.load();
	}
	load() {
		if (typeof window === "undefined") return EMPTY();
		try {
			const raw = window.localStorage.getItem(KEY);
			return raw ? {
				...EMPTY(),
				...JSON.parse(raw)
			} : EMPTY();
		} catch {
			return EMPTY();
		}
	}
	persist() {
		if (typeof window !== "undefined") try {
			window.localStorage.setItem(KEY, JSON.stringify(this.snapshot));
		} catch {}
		const s = this.get();
		this.listeners.forEach((l) => l(s));
	}
	/** Enable cloud mirroring of anonymous counters (explicit user consent). */
	configureCloud(sink, enabled) {
		this.sink = sink;
		this.cloudEnabled = enabled;
	}
	mirror(event_type, detail) {
		if (this.cloudEnabled && this.sink) this.sink({
			event_type,
			detail
		});
	}
	conversationStarted() {
		this.snapshot.conversations += 1;
		this.persist();
		this.mirror("analytics_conversation");
	}
	messageExchanged(count = 1) {
		this.snapshot.messages += count;
		this.persist();
	}
	voiceTime(seconds) {
		this.snapshot.voiceMinutes = Number((this.snapshot.voiceMinutes + seconds / 60).toFixed(2));
		this.persist();
	}
	skillUsed(skillId) {
		this.snapshot.skillRuns[skillId] = (this.snapshot.skillRuns[skillId] ?? 0) + 1;
		this.persist();
		this.mirror("analytics_skill", skillId);
	}
	/** Technical errors only — the message is truncated and never includes content. */
	errorOccurred(code) {
		this.snapshot.errors += 1;
		this.snapshot.lastErrorAt = Date.now();
		this.persist();
		this.mirror("analytics_error", code.slice(0, 60));
	}
	get() {
		return {
			...this.snapshot,
			skillRuns: { ...this.snapshot.skillRuns }
		};
	}
	reset() {
		this.snapshot = EMPTY();
		this.persist();
	}
	subscribe(fn) {
		this.listeners.add(fn);
		fn(this.get());
		return () => this.listeners.delete(fn);
	}
};
var usageAnalytics = new UsageAnalytics();
var STYLES = [
	{
		id: "friendly",
		label: "ودود"
	},
	{
		id: "formal",
		label: "احترافي"
	},
	{
		id: "calm",
		label: "هادئ"
	},
	{
		id: "energetic",
		label: "مرِح"
	}
];
var LENGTHS = [
	{
		id: "concise",
		label: "قصير"
	},
	{
		id: "balanced",
		label: "متوازن"
	},
	{
		id: "detailed",
		label: "مفصّل"
	}
];
var PERMISSION_LABEL = {
	microphone: "الميكروفون",
	notifications: "الإشعارات",
	location: "الموقع",
	bluetooth: "البلوتوث",
	background_audio: "الاستماع في الخلفية",
	camera: "الكاميرا",
	files: "الملفات",
	contacts: "جهات الاتصال"
};
var SECTION = "space-y-4 rounded-3xl border border-border bg-card/40 p-5";
function SettingsPage() {
	const nico = useNico();
	const voice = nico.voiceProfile;
	const [skills, setSkills] = (0, import_react.useState)([]);
	const [schedules, setSchedules] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [cloudAnalytics, setCloudAnalytics] = (0, import_react.useState)(false);
	const [compressed, setCompressed] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const sync = () => setSkills(nico.runtime.skills.describe());
		sync();
		const off = nico.runtime.skills.registry.subscribe(sync);
		return () => {
			off();
		};
	}, [nico.runtime]);
	(0, import_react.useEffect)(() => {
		const off = taskAutomation.subscribe(setSchedules);
		return () => {
			off();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const off = usageAnalytics.subscribe(setStats);
		return () => {
			off();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		usageAnalytics.configureCloud((e) => nico.logEvent(e.event_type, e.detail), cloudAnalytics && nico.isAuthenticated);
	}, [
		cloudAnalytics,
		nico.isAuthenticated,
		nico.logEvent
	]);
	const permissionKeys = Object.keys(nico.permissions);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: "rtl",
		className: "mx-auto w-full max-w-2xl space-y-6 px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/nico",
						className: "text-sm text-muted-foreground",
						children: "رجوع"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg font-semibold",
						children: "إعدادات نيكو"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mobile",
						className: "text-sm text-muted-foreground",
						children: "التطبيق"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: SECTION,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "الملف الشخصي"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "الاسم"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							defaultValue: nico.profile.preferredName ?? nico.profile.name ?? "",
							onBlur: (e) => nico.updateProfile({ preferredName: e.target.value.trim() || void 0 }),
							placeholder: "كيف تحب أن يناديك نيكو؟",
							className: "w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: ["ar", "en"].map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								nico.updateProfile({ locale: lang });
								nico.updateVoiceProfile({ language: lang });
							},
							className: `flex-1 rounded-2xl border px-3 py-3 text-sm ${nico.profile.locale === lang ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
							children: lang === "ar" ? "العربية" : "English"
						}, lang))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: nico.isAuthenticated ? `مرتبط بالحساب ${nico.authEmail} — ذاكرتك تتزامن مع السحابة.` : "أنت تستخدم نيكو كضيف — البيانات محفوظة على هذا الجهاز فقط."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: SECTION,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "الصوت"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "صوت نيكو"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: voice.voiceId,
							onChange: (e) => nico.updateVoiceProfile({ voiceId: e.target.value }),
							className: "w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm",
							children: VOICE_OPTIONS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v.id,
								children: v.label
							}, v.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								"السرعة — ",
								voice.speed.toFixed(2),
								"×"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: .5,
							max: 2,
							step: .05,
							value: voice.speed,
							onChange: (e) => nico.updateVoiceProfile({ speed: Number(e.target.value) }),
							className: "w-full accent-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								"النبرة — ",
								voice.pitch.toFixed(2),
								"×"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: .5,
							max: 2,
							step: .05,
							value: voice.pitch,
							onChange: (e) => nico.updateVoiceProfile({ pitch: Number(e.target.value) }),
							className: "w-full accent-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: ["ar", "en"].map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => nico.updateVoiceProfile({ language: lang }),
							className: `flex-1 rounded-2xl border px-3 py-2 text-xs ${voice.language === lang ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
							children: lang === "ar" ? "لغة الصوت: العربية" : "Voice language: English"
						}, lang))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void nico.runtime.voice.say(voice.language === "ar" ? "هكذا سيكون صوتي." : "This is how I will sound."),
						className: "w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm",
						children: "استمع لعينة"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: SECTION,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "الشخصية"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: STYLES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => nico.updateVoiceProfile({ style: s.id }),
							className: `rounded-2xl border px-4 py-3 text-sm ${voice.style === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
							children: s.label
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: LENGTHS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => nico.updateProfile({ communicationStyle: l.id }),
							className: `flex-1 rounded-2xl border px-3 py-3 text-sm ${nico.profile.communicationStyle === l.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
							children: l.label
						}, l.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: SECTION,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "المهارات"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "فعّل أو أوقف أي مهارة. المهارة المتوقفة لا تُستدعى ولا تطلب صلاحيات."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl border border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[11px] text-muted-foreground",
										children: s.description
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => nico.runtime.skills.setEnabled(s.id, !s.enabled),
									className: `shrink-0 rounded-full px-3 py-1 text-xs ${s.enabled ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`,
									children: s.enabled ? "مفعّلة" : "متوقفة"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-[11px] text-muted-foreground",
								children: [
									"استُخدمت ",
									s.usage.runs,
									" مرة",
									s.usage.failures ? ` — ${s.usage.failures} إخفاق` : "",
									s.permissions.length ? ` — تحتاج: ${s.permissions.join("، ")}` : ""
								]
							})]
						}, s.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: SECTION,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "المهام التلقائية"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: schedules.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-2xl border border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							value: s.time,
							onChange: (e) => taskAutomation.update(s.id, { time: e.target.value }),
							className: "mt-1 rounded-xl border border-border bg-secondary px-2 py-1 text-xs"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => taskAutomation.update(s.id, { enabled: !s.enabled }),
							className: `rounded-full px-3 py-1 text-xs ${s.enabled ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`,
							children: s.enabled ? "مفعّل" : "متوقف"
						})]
					}, s.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: SECTION,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "الخصوصية والذاكرة"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"نيكو يتذكر ",
							nico.memories.length,
							" معلومة عنك. يمكنك ضغطها أو حذفها بالكامل."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCompressed(nico.runtime.memory.compress()),
								className: "rounded-2xl border border-border px-4 py-2 text-xs",
								children: "ضغط الذاكرة"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void nico.forgetAll(),
								className: "rounded-2xl border border-destructive px-4 py-2 text-xs text-destructive",
								children: "حذف كل الذاكرة"
							}),
							nico.isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "rounded-2xl border border-primary/50 bg-primary/10 px-4 py-2 text-xs text-primary",
								children: "مركز الخصوصية →"
							})
						]
					}),
					compressed !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: compressed ? `أزلت ${compressed} سجلاً مكرراً أو منتهياً.` : "الذاكرة مضغوطة أصلاً."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: permissionKeys.map((key) => {
							const status = nico.permissions[key];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-2xl border border-border px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: PERMISSION_LABEL[key] ?? key
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: nico.permissionReason(key)
								})] }), status === "granted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => nico.revokePermission(key),
									className: "text-xs text-destructive",
									children: "سحب"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void nico.requestPermission(key),
									className: "text-xs text-primary",
									children: "السماح"
								})]
							}, key);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: SECTION,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "التنبيهات"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-2xl border border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "تنبيهات التذكيرات والمواعيد"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => nico.permissions.notifications === "granted" ? nico.revokePermission("notifications") : void nico.requestPermission("notifications"),
							className: `rounded-full px-3 py-1 text-xs ${nico.permissions.notifications === "granted" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`,
							children: nico.permissions.notifications === "granted" ? "مفعّلة" : "متوقفة"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-2xl border border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "تحية تلقائية عند الفتح"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => nico.setAutoGreeting(!nico.assistant.autoGreeting),
							className: `rounded-full px-3 py-1 text-xs ${nico.assistant.autoGreeting ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`,
							children: nico.assistant.autoGreeting ? "مفعّلة" : "متوقفة"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: SECTION,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "الإحصائيات"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "أرقام فقط — لا نحفظ نص محادثاتك ضمن الإحصائيات."
					}),
					stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "المحادثات",
								value: stats.conversations
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "الرسائل",
								value: stats.messages
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "دقائق الصوت",
								value: stats.voiceMinutes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "الأخطاء التقنية",
								value: stats.errors
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-2xl border border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "مشاركة إحصائيات مجهولة مع حسابي"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCloudAnalytics((v) => !v),
							className: `rounded-full px-3 py-1 text-xs ${cloudAnalytics ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`,
							children: cloudAnalytics ? "مفعّلة" : "متوقفة"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => usageAnalytics.reset(),
						className: "w-full rounded-2xl border border-border px-4 py-2 text-xs text-muted-foreground",
						children: "تصفير الإحصائيات"
					})
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-base font-semibold",
			children: value
		})]
	});
}
//#endregion
export { SettingsPage as component };
