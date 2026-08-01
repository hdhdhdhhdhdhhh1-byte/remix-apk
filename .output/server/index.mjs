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
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-01T12:31:13.113Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-01T12:31:13.113Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/TranscriptPanel-BQa05bkO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ff-6jxpC//WZeJ0bnoDfGv+jiqyUcY\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 767,
		"path": "../public/assets/TranscriptPanel-BQa05bkO.js"
	},
	"/assets/VoiceWaves-DjTHHeWp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"208-AjbPrnmMDHKWObpYkSEgHLId78M\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 520,
		"path": "../public/assets/VoiceWaves-DjTHHeWp.js"
	},
	"/assets/WelcomeExperience-x1eRLTbz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11c7-DQP6NpHUpQ1XcvyBVNdndtcZ1Mw\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 4551,
		"path": "../public/assets/WelcomeExperience-x1eRLTbz.js"
	},
	"/assets/auth-BUEo8zAH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d6c-4c6zoraWF574vDxrT4JsR8+Oimw\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 3436,
		"path": "../public/assets/auth-BUEo8zAH.js"
	},
	"/assets/dist-Bv5dNuds.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e39-Yuzrca8UO4UJKFaKHuLPsONr4ZI\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 7737,
		"path": "../public/assets/dist-Bv5dNuds.js"
	},
	"/assets/esm-B1Fis8-o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-ObOhyNopDC3ZY5ik4GzeovJQ440\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 246,
		"path": "../public/assets/esm-B1Fis8-o.js"
	},
	"/assets/esm-BaFBaplU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245-ZZg7hJV/MWpLpjkAO01/WXb5NxU\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 581,
		"path": "../public/assets/esm-BaFBaplU.js"
	},
	"/assets/esm-BvgD2EjE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c7-7TzuOoEWNrfN8xFltCpEAPFrrrU\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 967,
		"path": "../public/assets/esm-BvgD2EjE.js"
	},
	"/assets/esm-D0do1T8V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"221-aMy8+rpYobelis5qFNDI5xMYNlo\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 545,
		"path": "../public/assets/esm-D0do1T8V.js"
	},
	"/assets/dashboard-BWJN3Hf9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30a2f-iiMureTM8JlZmOF5BleO7bndiRo\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 199215,
		"path": "../public/assets/dashboard-BWJN3Hf9.js"
	},
	"/assets/esm-D4pnd6py.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"165-A7+etCRHz8Zk3IWz9DI6vQM6MP0\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 357,
		"path": "../public/assets/esm-D4pnd6py.js"
	},
	"/assets/esm-DrzUuPWc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14a-vNjmgWZU0YSUfO0z0B+FW2TV2yg\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 330,
		"path": "../public/assets/esm-DrzUuPWc.js"
	},
	"/assets/mobile-qcJnSUB8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29c-I1I7D3eVR859SfDB61Goj35a4Xg\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 668,
		"path": "../public/assets/mobile-qcJnSUB8.js"
	},
	"/assets/mobile-w2DdFka9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a8e-JrFvcriyzE60cErTD3sUcQfrxLY\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 10894,
		"path": "../public/assets/mobile-w2DdFka9.js"
	},
	"/assets/nico-R6BtnCH2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1828-5x8Mi+8uA164LZg0eZKDXZ4Ysiw\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 6184,
		"path": "../public/assets/nico-R6BtnCH2.js"
	},
	"/assets/privacy-CK6c73G0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137c-I5xJKC5N8P7Ae0826MS02qf7oZY\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 4988,
		"path": "../public/assets/privacy-CK6c73G0.js"
	},
	"/assets/route-DEnyFPcF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66-qhoNWX4yLZb0zmWMPVzSCGS9GU0\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 102,
		"path": "../public/assets/route-DEnyFPcF.js"
	},
	"/assets/routes-BcOPOegt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ad-5ka5QDtTdjFwPppafSI4gSsKWVw\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 5549,
		"path": "../public/assets/routes-BcOPOegt.js"
	},
	"/assets/settings-BfQHXGO7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d19-5zH/O/UGEPDU8+yG6qRlZ6jRkl0\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 15641,
		"path": "../public/assets/settings-BfQHXGO7.js"
	},
	"/assets/settings-BqrcROG1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13a1-Sn+98t7snbk9N2xD0zKwif/ceCk\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 5025,
		"path": "../public/assets/settings-BqrcROG1.js"
	},
	"/assets/styles-DTPrbyrL.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"146b0-zx7gJePQjbA8Zw/BAqiBAf9frm0\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 83632,
		"path": "../public/assets/styles-DTPrbyrL.css"
	},
	"/assets/useNico-BgKj5C42.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13824-ZR5Zy0aTsLprdxiLfCEh/zpxaw4\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 79908,
		"path": "../public/assets/useNico-BgKj5C42.js"
	},
	"/assets/index-kTlDnsWk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"876f0-1Q8/PCyvpEBfDsxeo08hYrCmy2Q\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 554736,
		"path": "../public/assets/index-kTlDnsWk.js"
	},
	"/assets/useNicoMobile-DAFAcK9h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2463-hvOBOFGjYSNNZ0nQWSdubgdIagg\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 9315,
		"path": "../public/assets/useNicoMobile-DAFAcK9h.js"
	},
	"/assets/useRouter-DuSkGjms.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"204f-81x8gvPsADUm1haq2GCWWKGsFE0\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 8271,
		"path": "../public/assets/useRouter-DuSkGjms.js"
	},
	"/assets/web--WzLomhT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a-qN4g2UpJ92yPMWSJYYm5S2ImTRM\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 122,
		"path": "../public/assets/web--WzLomhT.js"
	},
	"/assets/web-CExgqSIt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d1d-BNynYbIg/yeYiWIX0OToPuFeV5s\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 3357,
		"path": "../public/assets/web-CExgqSIt.js"
	},
	"/assets/web-CjzxbXsG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34b-a55slnRETLD3gLOIq1LPR6p2Mjc\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 843,
		"path": "../public/assets/web-CjzxbXsG.js"
	},
	"/assets/web-D-fxRzko.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"826-2Cw74LVNKW7T+viRNpYUiY1Tod4\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 2086,
		"path": "../public/assets/web-D-fxRzko.js"
	},
	"/assets/web-LMVkZsb7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b5-YOPns0ZK8a8HT5LnLj7+ZjmN2Ig\"",
		"mtime": "2026-08-01T12:31:08.623Z",
		"size": 949,
		"path": "../public/assets/web-LMVkZsb7.js"
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
