import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as VOICE_OPTIONS } from "./useNico-CbCwxMP-.mjs";
import { n as useNicoMobile, t as MOBILE_PERMISSIONS } from "./useNicoMobile-BAnxzujZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-YUN_6Shk.js
var import_jsx_runtime = require_jsx_runtime();
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
	background_audio: "الاستماع في الخلفية"
};
function NicoSettings() {
	const nico = useNicoMobile();
	const voice = nico.voiceProfile;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: "rtl",
		className: "mx-auto w-full max-w-md space-y-8 px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mobile",
						className: "text-sm text-muted-foreground",
						children: "رجوع"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-base font-semibold",
						children: "إعدادات نيكو"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-10" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void nico.runtime.voice.say("هكذا سيكون صوتي."),
						className: "w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm",
						children: "استمع لعينة"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "الشخصية"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: STYLES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => nico.updateVoiceProfile({ style: s.id }),
						className: `rounded-2xl border px-4 py-3 text-sm transition-colors ${voice.style === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
						children: s.label
					}, s.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "طريقة الرد"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: LENGTHS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => nico.updateProfile({ communicationStyle: l.id }),
						className: `flex-1 rounded-2xl border px-3 py-3 text-sm transition-colors ${nico.profile.communicationStyle === l.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
						children: l.label
					}, l.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "أذونات الهاتف"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "تُطلب عند الحاجة فقط، ويمكنك سحبها في أي وقت."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: MOBILE_PERMISSIONS.map((key) => {
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
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "الحساب"
				}), nico.isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void nico.signOut(),
					className: "w-full rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground",
					children: [
						"تسجيل الخروج (",
						nico.authEmail,
						")"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					className: "block w-full rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground",
					children: "تسجيل الدخول وربط الذاكرة"
				})]
			})
		]
	});
}
//#endregion
export { NicoSettings as component };
