import { r as __toESM } from "../_runtime.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as nicoSync, s as useNico } from "./useNico-DG1TdfhW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-CdjvowXd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "nico.offline.snapshot.v1";
function safeGet() {
	if (typeof window === "undefined") return empty();
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return empty();
		return JSON.parse(raw);
	} catch {
		return empty();
	}
}
function empty() {
	return {
		turns: [],
		memories: [],
		settings: {},
		updatedAt: 0
	};
}
var OfflineStore = {
	read() {
		return safeGet();
	},
	write(patch) {
		if (typeof window === "undefined") return;
		const next = {
			...safeGet(),
			...patch,
			updatedAt: Date.now()
		};
		try {
			window.localStorage.setItem(KEY, JSON.stringify(next));
		} catch {}
	},
	clear() {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.removeItem(KEY);
		} catch {}
	},
	appendTurn(turn, keep = 40) {
		const turns = [...safeGet().turns, turn].slice(-keep);
		OfflineStore.write({ turns });
	}
};
var CARD = "space-y-3 rounded-3xl border border-border bg-card/40 p-5";
function PrivacyCenter() {
	const nico = useNico();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [learningOn, setLearningOn] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		try {
			if (window.localStorage.getItem("nico.learning.enabled.v1") === "false") setLearningOn(false);
		} catch {}
	}, []);
	async function run(name, fn, done) {
		setBusy(name);
		setMsg(null);
		try {
			await fn();
			setMsg(done);
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "حدث خطأ.");
		} finally {
			setBusy(null);
		}
	}
	const exportData = () => run("export", async () => {
		const data = await nicoSync.exportData();
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `nico-export-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}, "تم تنزيل بياناتك.");
	const wipeMemories = () => run("wipe", async () => {
		if (!window.confirm("سيتم حذف كل ذاكرة نيكو عنك بشكل نهائي. هل أنت متأكد؟")) return;
		await nicoSync.deleteAllMemories();
		nico.runtime.memory.forgetAll();
		OfflineStore.clear();
	}, "تم حذف الذاكرة.");
	const deleteAccount = () => run("account", async () => {
		if (!window.confirm("سيتم حذف حسابك وكل بياناتك بلا رجعة. هل أنت متأكد؟")) return;
		await nicoSync.deleteAccount();
		OfflineStore.clear();
		await nico.signOut();
		window.location.href = "/";
	}, "تم حذف الحساب.");
	const toggleLearning = (next) => {
		setLearningOn(next);
		try {
			window.localStorage.setItem("nico.learning.enabled.v1", next ? "true" : "false");
		} catch {}
		setMsg(next ? "تم تفعيل التعلّم." : "تم تعطيل التعلّم.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: "rtl",
		className: "mx-auto w-full max-w-2xl space-y-6 px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "مركز الخصوصية"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: "← الإعدادات"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "كل بياناتك في نيكو ملكك. من هنا يمكنك تصديرها، حذفها، أو التحكم بما يتعلمه عنك."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: CARD,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "تصدير البيانات"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "تنزيل ملف JSON يحتوي ملفك، محادثاتك، ذاكرتك، وتعلّمك."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: exportData,
						disabled: busy === "export",
						className: "rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50",
						children: busy === "export" ? "جاري التحضير…" : "تنزيل بياناتي"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: CARD,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "التعلّم الذكي"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "يتعلم نيكو تفضيلاتك تلقائياً من محادثاتك. يمكنك إيقافه في أي وقت."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: learningOn,
							onChange: (e) => toggleLearning(e.target.checked)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: learningOn ? "التعلّم مفعّل" : "التعلّم موقوف" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: CARD,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "حذف الذاكرة"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "يحذف كل ما يتذكره نيكو عنك — لكن يبقى حسابك."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: wipeMemories,
						disabled: busy === "wipe",
						className: "rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive disabled:opacity-50",
						children: busy === "wipe" ? "…" : "حذف كل الذاكرة"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: CARD,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-destructive",
						children: "حذف الحساب"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "يحذف حسابك وكل بياناتك (ملف، محادثات، ذاكرة، تعلّم) نهائياً."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: deleteAccount,
						disabled: busy === "account",
						className: "rounded-full bg-destructive px-4 py-2 text-sm text-destructive-foreground disabled:opacity-50",
						children: busy === "account" ? "…" : "حذف حسابي نهائياً"
					})
				]
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted-foreground",
				children: msg
			})
		]
	});
}
//#endregion
export { PrivacyCenter as component };
