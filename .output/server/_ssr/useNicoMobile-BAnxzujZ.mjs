import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as nicoSync, i as mobileBridge, o as registerMobileBridge, s as useNico } from "./useNico-CbCwxMP-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useNicoMobile-BAnxzujZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** True only inside the Android/iOS shell. */
function isNativePlatform() {
	if (typeof window === "undefined") return false;
	const cap = window.Capacitor;
	return Boolean(cap?.isNativePlatform?.());
}
function nativePlatform() {
	if (typeof window === "undefined") return "web";
	const p = window.Capacitor?.getPlatform?.();
	return p === "android" || p === "ios" ? p : "web";
}
function voiceServicePlugin() {
	if (typeof window === "undefined") return void 0;
	return window.Capacitor?.Plugins?.NicoVoiceService;
}
var CapacitorBackgroundService = class {
	running = false;
	async start(options = {}) {
		const plugin = voiceServicePlugin();
		if (!plugin) {
			this.running = false;
			return false;
		}
		try {
			const res = await plugin.start({
				wakeWord: options.wakeWord ?? "يا نيكو",
				foregroundText: options.foregroundText ?? "نيكو جاهز — قل «يا نيكو»"
			});
			this.running = Boolean(res?.running);
		} catch {
			this.running = false;
		}
		return this.running;
	}
	async stop() {
		this.running = false;
		try {
			await voiceServicePlugin()?.stop();
		} catch {}
	}
	async isRunning() {
		try {
			const res = await voiceServicePlugin()?.isRunning();
			this.running = Boolean(res?.running);
		} catch {}
		return this.running;
	}
};
var CapacitorNotifications = class {
	async requestPermission() {
		try {
			const { LocalNotifications } = await import("../_libs/capacitor__local-notifications.mjs").then((n) => n.t);
			return (await LocalNotifications.requestPermissions()).display === "granted" ? "granted" : "denied";
		} catch {
			return "denied";
		}
	}
	async notify({ title, body, at, id }) {
		try {
			const { LocalNotifications } = await import("../_libs/capacitor__local-notifications.mjs").then((n) => n.t);
			await LocalNotifications.schedule({ notifications: [{
				id: hashId(id),
				title,
				body,
				schedule: at ? { at: new Date(at) } : void 0
			}] });
		} catch {}
	}
	async cancel(id) {
		try {
			const { LocalNotifications } = await import("../_libs/capacitor__local-notifications.mjs").then((n) => n.t);
			await LocalNotifications.cancel({ notifications: [{ id: hashId(id) }] });
		} catch {}
	}
};
/** Local notifications need a numeric id; derive a stable one from the string. */
function hashId(id) {
	if (!id) return Math.floor(Math.random() * 1e5) + 1;
	let h = 0;
	for (let i = 0; i < id.length; i++) h = h * 31 + id.charCodeAt(i) | 0;
	return Math.abs(h % 1e5) + 1;
}
var CapacitorPhoneActions = class {
	async call(number) {
		if (typeof window !== "undefined") window.location.href = `tel:${number}`;
	}
	async sendSms(number, message) {
		if (typeof window !== "undefined") window.location.href = `sms:${number}?body=${encodeURIComponent(message)}`;
	}
	async pickContact() {
		return null;
	}
};
var CapacitorAppControl = class {
	async openApp(packageName) {
		if (typeof window === "undefined") return false;
		try {
			window.location.href = `intent://#Intent;package=${packageName};end`;
			return true;
		} catch {
			return false;
		}
	}
	async openUrl(url) {
		if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
	}
	async setVolume() {}
};
var CapacitorMobileBridge = class {
	platform = nativePlatform() === "ios" ? "ios" : "android";
	available = true;
	background = new CapacitorBackgroundService();
	notifications = new CapacitorNotifications();
	phone = new CapacitorPhoneActions();
	apps = new CapacitorAppControl();
};
var installed = false;
/** Installs the native bridge once, only when running inside the app shell. */
function installCapacitorBridge() {
	if (installed || !isNativePlatform()) return installed;
	registerMobileBridge(new CapacitorMobileBridge());
	installed = true;
	return true;
}
/** Permissions the phone app may ask for, in the order the user meets them. */
var MOBILE_PERMISSIONS = [
	"microphone",
	"notifications",
	"location",
	"bluetooth",
	"background_audio"
];
var MobilePermissions = class {
	base;
	constructor(base) {
		this.base = base;
	}
	snapshot() {
		return this.base.snapshot();
	}
	isGranted(key) {
		return this.base.isGranted(key);
	}
	reason(key) {
		return this.base.reason(key);
	}
	/** Ask the OS (native) or the browser (web), then record the decision. */
	async request(key) {
		if (!isNativePlatform()) return this.base.request(key);
		if (key === "notifications") {
			const mapped = await mobileBridge().notifications.requestPermission() === "granted" ? "granted" : "denied";
			this.base.set(key, mapped);
			return mapped;
		}
		if (key === "location") try {
			const { Geolocation } = await import("../_libs/@capacitor/geolocation+[...].mjs").then((n) => n.t);
			const res = await Geolocation.requestPermissions();
			const granted = res.location === "granted" || res.coarseLocation === "granted";
			this.base.set(key, granted ? "granted" : "denied");
			return granted ? "granted" : "denied";
		} catch {
			this.base.set(key, "denied");
			return "denied";
		}
		return this.base.request(key);
	}
	/** Never re-asks something already granted. */
	async ensure(key) {
		if (this.base.isGranted(key)) return "granted";
		return this.request(key);
	}
	revoke(key) {
		this.base.revoke(key);
	}
};
var VoiceBackgroundService = class {
	voice;
	state = "stopped";
	listeners = /* @__PURE__ */ new Set();
	cleanups = [];
	opts = {};
	wasActive = false;
	constructor(voice) {
		this.voice = voice;
	}
	get current() {
		return this.state;
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	set(next) {
		this.state = next;
		this.listeners.forEach((l) => l(next));
	}
	/**
	* Battery-aware: the service is only started after the user explicitly
	* enables always-ready listening, and it is stopped as soon as they turn it
	* off or the app is closed.
	*/
	async start(options = {}) {
		this.opts = {
			...this.opts,
			...options
		};
		this.set("starting");
		await this.bindAppState();
		const started = await mobileBridge().background.start({
			wakeWord: this.opts.wakeWord ?? "يا نيكو",
			foregroundText: this.opts.foregroundText ?? "نيكو جاهز — قل «يا نيكو»"
		});
		this.set(started ? "running" : isNativePlatform() ? "unavailable" : "unavailable");
		return this.state;
	}
	async stop() {
		await mobileBridge().background.stop();
		this.voice.cancel();
		this.unbind();
		this.set("stopped");
	}
	/** App lifecycle: suspend an open mic when hidden, re-arm when visible. */
	async bindAppState() {
		this.unbind();
		const onHidden = () => {
			this.wasActive = this.voice.current !== "idle" || this.voice.continuous;
			if (this.voice.current === "listening" || this.voice.current === "speaking") {
				this.voice.cancel();
				this.opts.onSuspend?.();
			}
		};
		const onVisible = () => {
			if (!this.wasActive) return;
			this.wasActive = false;
			this.opts.onReconnect?.();
		};
		if (typeof document !== "undefined") {
			const handler = () => document.hidden ? onHidden() : onVisible();
			document.addEventListener("visibilitychange", handler);
			this.cleanups.push(() => document.removeEventListener("visibilitychange", handler));
		}
		if (isNativePlatform()) try {
			const { App } = await import("../_libs/@capacitor/app+[...].mjs").then((n) => n.t);
			const sub = await App.addListener("appStateChange", ({ isActive }) => isActive ? onVisible() : onHidden());
			this.cleanups.push(() => void sub.remove());
		} catch {}
	}
	unbind() {
		this.cleanups.forEach((fn) => fn());
		this.cleanups = [];
	}
	/** Called on unmount so no listener or service survives the screen. */
	async dispose() {
		this.unbind();
		if (this.state === "running") await mobileBridge().background.stop();
		this.set("stopped");
	}
};
var FLAG = "nico.guest.upgraded.v1";
function alreadyUpgraded(userKey) {
	if (typeof window === "undefined") return true;
	try {
		return window.localStorage.getItem(FLAG) === userKey;
	} catch {
		return true;
	}
}
function markUpgraded(userKey) {
	try {
		window.localStorage.setItem(FLAG, userKey);
	} catch {}
}
/**
* Pushes local guest memories + profile into the signed-in account.
* Safe to call repeatedly: it runs at most once per account on this device.
*/
async function upgradeGuestData(memory, userKey) {
	if (!userKey || alreadyUpgraded(userKey)) return { migrated: 0 };
	markUpgraded(userKey);
	const records = memory.longTerm.all();
	let migrated = 0;
	for (const record of records) try {
		await nicoSync.saveMemory({
			key: record.key,
			content: record.value,
			type: record.kind,
			importance: record.importance,
			retention: record.retention,
			confirmed: true
		});
		migrated++;
	} catch {}
	const profile = memory.profile.data;
	if (profile.name || profile.preferredName) try {
		await nicoSync.updateProfile({
			preferred_name: profile.preferredName ?? profile.name,
			language: profile.locale,
			communication_style: profile.communicationStyle,
			preferences: profile.preferences,
			interests: profile.interests,
			important_dates: profile.importantDates
		});
	} catch {}
	memory.profile.update({ isGuest: false });
	return { migrated };
}
var booted = false;
/**
* Boots the native shell once: installs the Capacitor bridge, themes the
* status bar and dismisses the splash screen. A no-op in the browser.
*/
async function initNicoMobile() {
	if (booted || typeof window === "undefined") return isNativePlatform();
	booted = true;
	if (!isNativePlatform()) return false;
	installCapacitorBridge();
	try {
		const { StatusBar, Style } = await import("../_libs/capacitor__status-bar.mjs").then((n) => n.t);
		await StatusBar.setStyle({ style: Style.Dark });
		await StatusBar.setBackgroundColor({ color: "#070B18" });
	} catch {}
	try {
		const { SplashScreen } = await import("../_libs/capacitor__splash-screen.mjs").then((n) => n.t);
		await SplashScreen.hide();
	} catch {}
	return true;
}
/** Light haptic feedback for voice state changes; silent on the web. */
async function tapFeedback() {
	if (!isNativePlatform()) return;
	try {
		const { Haptics, ImpactStyle } = await import("../_libs/capacitor__haptics.mjs").then((n) => n.t);
		await Haptics.impact({ style: ImpactStyle.Light });
	} catch {}
}
/**
* Native wake-word events.
*
* `VoiceBackgroundService` (Kotlin) detects «يا نيكو» while the app is in the
* background and brings the activity forward with the `com.nico.ai.WAKE`
* intent. The Capacitor plugin re-emits that as a `wake` event, which this
* module turns into a plain callback for the TypeScript layer.
*
* Nothing here knows about NicoBrain: it only says "the user called Nico".
*/
function wakePlugin() {
	if (typeof window === "undefined") return void 0;
	return window.Capacitor?.Plugins?.NicoVoiceService;
}
/**
* Subscribe to native wake-word detections. Returns an unsubscribe function.
* On the web (and before the native plugin is installed) it is a no-op, so
* every existing surface keeps working unchanged.
*/
function onNativeWake(handler) {
	if (!isNativePlatform()) return () => {};
	let disposed = false;
	const pending = [];
	const register = async () => {
		try {
			const sub = await wakePlugin()?.addListener?.("wake", handler);
			if (sub && !disposed) pending.push(sub);
			else if (sub) sub.remove();
		} catch {}
		try {
			const { App } = await import("../_libs/@capacitor/app+[...].mjs").then((n) => n.t);
			const sub = await App.addListener("appUrlOpen", ({ url }) => {
				if (typeof url === "string" && url.includes("wake")) handler();
			});
			if (!disposed) pending.push(sub);
			else sub.remove();
		} catch {}
	};
	register();
	return () => {
		disposed = true;
		pending.forEach((s) => void s.remove());
		pending.length = 0;
	};
}
/**
* useNicoMobile — the phone-facing wrapper around the existing `useNico`.
*
* It does not create a second brain: it takes the same runtime and adds
* onboarding state, phone permissions, the voice background service, guest
* data upgrade on sign-in, and crash-safe error surfaces.
*/
var ONBOARD_KEY = "nico.mobile.onboarded.v1";
function hasCompletedMobileOnboarding() {
	if (typeof window === "undefined") return true;
	try {
		return window.localStorage.getItem(ONBOARD_KEY) === "done";
	} catch {
		return true;
	}
}
function markMobileOnboarded() {
	try {
		window.localStorage.setItem(ONBOARD_KEY, "done");
	} catch {}
}
function useNicoMobile() {
	const nico = useNico();
	const [native, setNative] = (0, import_react.useState)(false);
	const [onboarded, setOnboarded] = (0, import_react.useState)(true);
	const [background, setBackground] = (0, import_react.useState)("stopped");
	const [migrated, setMigrated] = (0, import_react.useState)(null);
	const [offline, setOffline] = (0, import_react.useState)(false);
	const [mobileError, setMobileError] = (0, import_react.useState)(null);
	const [wokeAt, setWokeAt] = (0, import_react.useState)(null);
	const upgradedFor = (0, import_react.useRef)(null);
	const permissions = (0, import_react.useMemo)(() => new MobilePermissions(nico.runtime.permissions), [nico.runtime]);
	const service = (0, import_react.useMemo)(() => new VoiceBackgroundService(nico.runtime.voice), [nico.runtime]);
	(0, import_react.useEffect)(() => {
		initNicoMobile().then(setNative);
		setOnboarded(hasCompletedMobileOnboarding());
		setNative(isNativePlatform());
	}, []);
	(0, import_react.useEffect)(() => {
		const update = () => setOffline(typeof navigator !== "undefined" && !navigator.onLine);
		update();
		window.addEventListener("online", update);
		window.addEventListener("offline", update);
		return () => {
			window.removeEventListener("online", update);
			window.removeEventListener("offline", update);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const off = service.subscribe(setBackground);
		return () => {
			off();
			service.dispose();
		};
	}, [service]);
	(0, import_react.useEffect)(() => {
		if (!nico.assistant.alwaysReady) {
			if (background === "running" || background === "starting") service.stop();
			return;
		}
		service.start({
			wakeWord: nico.assistant.wakeWord,
			onSuspend: () => setMobileError(null),
			onReconnect: () => {
				if (nico.assistant.alwaysReady) nico.startConversation();
			}
		});
	}, [
		nico.assistant.alwaysReady,
		nico.assistant.wakeWord,
		service
	]);
	(0, import_react.useEffect)(() => {
		return onNativeWake(() => {
			setWokeAt(Date.now());
			tapFeedback();
			nico.startConversation();
		});
	}, [nico.startConversation]);
	(0, import_react.useEffect)(() => {
		if (!nico.authEmail || upgradedFor.current === nico.authEmail) return;
		upgradedFor.current = nico.authEmail;
		upgradeGuestData(nico.runtime.memory, nico.authEmail).then((res) => setMigrated(res.migrated)).catch(() => setMigrated(null));
	}, [nico.authEmail, nico.runtime]);
	const requestPermission = (0, import_react.useCallback)(async (key) => {
		try {
			return await permissions.request(key);
		} catch {
			setMobileError("تعذر طلب الإذن، جرّب من إعدادات الهاتف.");
			return "denied";
		}
	}, [permissions]);
	/** Onboarding completion: mark as done, then Nico speaks first. */
	const finishOnboarding = (0, import_react.useCallback)(async () => {
		markMobileOnboarded();
		setOnboarded(true);
		tapFeedback();
		try {
			await nico.greet({ force: true });
		} catch {}
	}, [nico]);
	return {
		...nico,
		native,
		onboarded,
		finishOnboarding,
		mobilePermissions: permissions,
		requestPermission,
		background,
		offline,
		wokeAt,
		migratedMemories: migrated,
		mobileError,
		clearMobileError: () => setMobileError(null)
	};
}
//#endregion
export { useNicoMobile as n, MOBILE_PERMISSIONS as t };
