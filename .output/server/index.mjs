globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-07-30T17:16:42.862Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-30T17:16:42.862Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/TranscriptPanel-CIljx6nH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ff-68vxuQU/hkNWK9ghz7Kl364JFOw\"",
		"mtime": "2026-07-30T17:16:37.272Z",
		"size": 767,
		"path": "../public/assets/TranscriptPanel-CIljx6nH.js"
	},
	"/assets/VoiceWaves-Cw1ltR6F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"208-yl0epdtBXluBc4iVIhFW2tFPw84\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 520,
		"path": "../public/assets/VoiceWaves-Cw1ltR6F.js"
	},
	"/assets/dashboard-Cb1YcBfJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30ada-DXYDZmgnecMeT0eFJXmRqMByvg8\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 199386,
		"path": "../public/assets/dashboard-Cb1YcBfJ.js"
	},
	"/assets/WelcomeExperience-C8I9Nug6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11c7-XiL7H+8wjA4a/CLZeQ/AMotxZSY\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 4551,
		"path": "../public/assets/WelcomeExperience-C8I9Nug6.js"
	},
	"/assets/dist-Do0m8ifp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3e-gkPD3OJD+5AWb9etJfor7yFeD9c\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 7742,
		"path": "../public/assets/dist-Do0m8ifp.js"
	},
	"/assets/auth-MIDn5u7S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bc1-tkA30DyvpPDwl/OygrhbWqijKy0\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 7105,
		"path": "../public/assets/auth-MIDn5u7S.js"
	},
	"/assets/esm-BA8TMCQV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c7-wchb++8hdcZZ09MYQfLhnWPb+eM\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 967,
		"path": "../public/assets/esm-BA8TMCQV.js"
	},
	"/assets/esm-CNu5MScF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14a-Z7jgLgayAhaG9hFIA0R6HibhRj8\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 330,
		"path": "../public/assets/esm-CNu5MScF.js"
	},
	"/assets/esm-BVcOLIQk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-/pVyAH/IfM03W6sDx4eD6XQMfJE\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 246,
		"path": "../public/assets/esm-BVcOLIQk.js"
	},
	"/assets/esm-D46y1RJD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"221-YIdozyk6OZLTiCvCHsDnPMFK4MM\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 545,
		"path": "../public/assets/esm-D46y1RJD.js"
	},
	"/assets/esm-DdzPSOUp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"165-GaFVmuEsT3sQy0iHzboalIaPJlM\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 357,
		"path": "../public/assets/esm-DdzPSOUp.js"
	},
	"/assets/esm-CjxmSfjR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245-nvK5QOfwblicsZ3khtUekUw85VI\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 581,
		"path": "../public/assets/esm-CjxmSfjR.js"
	},
	"/assets/mobile-08Na-aIE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a8e-dbSYK/1FGwXfl/1axN1zo8mFhk8\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 10894,
		"path": "../public/assets/mobile-08Na-aIE.js"
	},
	"/assets/mobile-BDhaM50j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29c-ZLW++uUIb5htAMOsmXJ7MRTGVIg\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 668,
		"path": "../public/assets/mobile-BDhaM50j.js"
	},
	"/assets/nico-DLIUhZ88.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1828-/2A/M4kW2a8VFs9bBCogjkIYh2s\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 6184,
		"path": "../public/assets/nico-DLIUhZ88.js"
	},
	"/assets/routes-B5Mk0kmD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ad-4EyBLEoP5ElvvNYiH7+nCxWYDhA\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 5549,
		"path": "../public/assets/routes-B5Mk0kmD.js"
	},
	"/assets/route-B655_28X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66-a+L15gkrq91LLiD9SgrB7KBRJ+U\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 102,
		"path": "../public/assets/route-B655_28X.js"
	},
	"/assets/privacy-CSD3_cu8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137c-O+Ooam9iRJLZdobpmqqqbU8BJHc\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 4988,
		"path": "../public/assets/privacy-CSD3_cu8.js"
	},
	"/assets/settings-BX7FozoW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13a1-Wc0i1kI7uiKGnyfvyuq2T9S8FVs\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 5025,
		"path": "../public/assets/settings-BX7FozoW.js"
	},
	"/assets/settings--db1T8WN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d19-bX9W/Ag0w9qXDdDnUg4zvmVX/TE\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 15641,
		"path": "../public/assets/settings--db1T8WN.js"
	},
	"/assets/styles-DTPrbyrL.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"146b0-zx7gJePQjbA8Zw/BAqiBAf9frm0\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 83632,
		"path": "../public/assets/styles-DTPrbyrL.css"
	},
	"/assets/useNico-Dro87ft3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13828-6nMbCLkNhH9R5Kd0ZdDRx+mp1Yc\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 79912,
		"path": "../public/assets/useNico-Dro87ft3.js"
	},
	"/assets/index-Kak_GOFG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86860-Kq2eM/DQoWnt6iOSoiqMzJWr1pw\"",
		"mtime": "2026-07-30T17:16:37.272Z",
		"size": 551008,
		"path": "../public/assets/index-Kak_GOFG.js"
	},
	"/assets/web-BW_PL7iv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34b-XCrgskPj+jiWFQuCC63uCK1WaaA\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 843,
		"path": "../public/assets/web-BW_PL7iv.js"
	},
	"/assets/useNicoMobile-BKqEIGvC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2463-VxtlIMZ/g70yQUJAEzU3zSD1PsE\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 9315,
		"path": "../public/assets/useNicoMobile-BKqEIGvC.js"
	},
	"/assets/web-CA_WgATn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d1d-KOLW8ZZCpmZ+c9+vKCBb7+hxSUE\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 3357,
		"path": "../public/assets/web-CA_WgATn.js"
	},
	"/assets/useRouter-BgHg7z-e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2039-rp+TePsl4+0GHZN1RonqdLqK1xU\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 8249,
		"path": "../public/assets/useRouter-BgHg7z-e.js"
	},
	"/assets/web-CrcSnH7a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b5-Q9sEOWDbhwkATnejGJABDqU3E20\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 949,
		"path": "../public/assets/web-CrcSnH7a.js"
	},
	"/assets/web-6BK00nuG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"826-yA3+7AzMcaVlqS5ZvT7ZBGcCh2Y\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 2086,
		"path": "../public/assets/web-6BK00nuG.js"
	},
	"/assets/web-L01B_zse.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a-fNmaGndETaMwRvB61hIH0+tdrgo\"",
		"mtime": "2026-07-30T17:16:37.282Z",
		"size": 122,
		"path": "../public/assets/web-L01B_zse.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_DQ_7zv = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_DQ_7zv
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
