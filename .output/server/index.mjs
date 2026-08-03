globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { a as toEventHandler, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
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
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-02T18:50:00.937Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-02T18:50:00.937Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/TranscriptPanel-DwhwjYjk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ff-ZKoNvePjuBrD7niZDroBlmWQoQ8\"",
		"mtime": "2026-08-02T18:49:57.227Z",
		"size": 767,
		"path": "../public/assets/TranscriptPanel-DwhwjYjk.js"
	},
	"/assets/VoiceWaves-15xN-W7N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"208-IlcqSh/fy/zGyFpTTlWag+7XKwM\"",
		"mtime": "2026-08-02T18:49:57.227Z",
		"size": 520,
		"path": "../public/assets/VoiceWaves-15xN-W7N.js"
	},
	"/assets/WelcomeExperience-WsRkKtE6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11c7-F2zcUXBotC4itXVXJsqLNSOgXWo\"",
		"mtime": "2026-08-02T18:49:57.227Z",
		"size": 4551,
		"path": "../public/assets/WelcomeExperience-WsRkKtE6.js"
	},
	"/assets/auth-BVgG6GOo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d6c-NwehFK3Exm8bA+TftL4Kuu9k/iE\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 3436,
		"path": "../public/assets/auth-BVgG6GOo.js"
	},
	"/assets/dist-Bv5dNuds.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e39-Yuzrca8UO4UJKFaKHuLPsONr4ZI\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 7737,
		"path": "../public/assets/dist-Bv5dNuds.js"
	},
	"/assets/esm-B1Fis8-o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-ObOhyNopDC3ZY5ik4GzeovJQ440\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 246,
		"path": "../public/assets/esm-B1Fis8-o.js"
	},
	"/assets/esm-Bb_3f5ik.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14a-CQVvGTnu6LXDM1BihQqQEeJY2B4\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 330,
		"path": "../public/assets/esm-Bb_3f5ik.js"
	},
	"/assets/esm-CUsXONAA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"221-ZMsCnpw3XiNXfLQsPOljsR8WnYE\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 545,
		"path": "../public/assets/esm-CUsXONAA.js"
	},
	"/assets/esm-C_5UtSoS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"165-w4WYFl+1FpYpalshAh8L71RCh9g\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 357,
		"path": "../public/assets/esm-C_5UtSoS.js"
	},
	"/assets/esm-Cf9BNRio.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c7-3++KrMzMeC3n5SvM1TMKnRe2nAY\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 967,
		"path": "../public/assets/esm-Cf9BNRio.js"
	},
	"/assets/esm-aZL8EdDP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c5-GytPIIolCJ1VPhZHrB2v61DH3wk\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 965,
		"path": "../public/assets/esm-aZL8EdDP.js"
	},
	"/assets/dashboard-B-so4b9S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30a2f-IAXzaeTvQ5TcAbl3F3ss0FkY4N0\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 199215,
		"path": "../public/assets/dashboard-B-so4b9S.js"
	},
	"/assets/esm-y1jsgcis.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"245-KtjnWk5st1gQ2SqubbfVWg0N4ts\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 581,
		"path": "../public/assets/esm-y1jsgcis.js"
	},
	"/assets/mobile-9vNpu4Ti.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a8e-RsK6+N5Lg2cobPhc0z3mqeHNp3Y\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 10894,
		"path": "../public/assets/mobile-9vNpu4Ti.js"
	},
	"/assets/mobile-DhSH7Oeu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29c-N9iea2n9RypwbWh32oTXZAXC0yE\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 668,
		"path": "../public/assets/mobile-DhSH7Oeu.js"
	},
	"/assets/nico-2ydg4GXB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1828-00gvy8C9vbaggyCo3ZdR4+cLL48\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 6184,
		"path": "../public/assets/nico-2ydg4GXB.js"
	},
	"/assets/privacy-Dn_k0id7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137c-IPbkq8+1+w6dCQ/EMZcx+teIy2g\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 4988,
		"path": "../public/assets/privacy-Dn_k0id7.js"
	},
	"/assets/route-poUz9S3N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66-KhmnN5DU6l4UvYMgDNZs2pU24dI\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 102,
		"path": "../public/assets/route-poUz9S3N.js"
	},
	"/assets/routes-BXCxAun-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ad-m6z0Yb1MxY6fQ6BsUFmwwbcbKTQ\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 5549,
		"path": "../public/assets/routes-BXCxAun-.js"
	},
	"/assets/settings-DgLg5DYF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13a1-JV/vMvhPnSsmZrL5Q7475qNJPQU\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 5025,
		"path": "../public/assets/settings-DgLg5DYF.js"
	},
	"/assets/styles-DTPrbyrL.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"146b0-zx7gJePQjbA8Zw/BAqiBAf9frm0\"",
		"mtime": "2026-08-02T18:49:57.247Z",
		"size": 83632,
		"path": "../public/assets/styles-DTPrbyrL.css"
	},
	"/assets/settings-Tn42pZY0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d19-w+SeVzXGZ95+qrvxFzqW2kZxPIU\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 15641,
		"path": "../public/assets/settings-Tn42pZY0.js"
	},
	"/assets/index-BKZAeNVQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"87792-sTd0pTSqcYo/bBAa2fdeO6OTQy8\"",
		"mtime": "2026-08-02T18:49:57.227Z",
		"size": 554898,
		"path": "../public/assets/index-BKZAeNVQ.js"
	},
	"/assets/useNico-CI80gOQ2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13b2a-y/dv3gu9O5eJXQBaiy8Ir77YI0A\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 80682,
		"path": "../public/assets/useNico-CI80gOQ2.js"
	},
	"/assets/useNicoMobile-C3MQ6rkT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25c2-PnUmqaOWDv05LLOb2qDE/YVmhds\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 9666,
		"path": "../public/assets/useNicoMobile-C3MQ6rkT.js"
	},
	"/assets/web--WzLomhT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a-qN4g2UpJ92yPMWSJYYm5S2ImTRM\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 122,
		"path": "../public/assets/web--WzLomhT.js"
	},
	"/assets/web-CExgqSIt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d1d-BNynYbIg/yeYiWIX0OToPuFeV5s\"",
		"mtime": "2026-08-02T18:49:57.247Z",
		"size": 3357,
		"path": "../public/assets/web-CExgqSIt.js"
	},
	"/assets/web-CjzxbXsG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34b-a55slnRETLD3gLOIq1LPR6p2Mjc\"",
		"mtime": "2026-08-02T18:49:57.247Z",
		"size": 843,
		"path": "../public/assets/web-CjzxbXsG.js"
	},
	"/assets/web-BjywqWQL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25f-Lumge9XH/ARtME8W29Hqybuyd6g\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 607,
		"path": "../public/assets/web-BjywqWQL.js"
	},
	"/assets/useRouter-DuSkGjms.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"204f-81x8gvPsADUm1haq2GCWWKGsFE0\"",
		"mtime": "2026-08-02T18:49:57.237Z",
		"size": 8271,
		"path": "../public/assets/useRouter-DuSkGjms.js"
	},
	"/assets/web-D-fxRzko.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"826-2Cw74LVNKW7T+viRNpYUiY1Tod4\"",
		"mtime": "2026-08-02T18:49:57.247Z",
		"size": 2086,
		"path": "../public/assets/web-D-fxRzko.js"
	},
	"/assets/web-DQffihPD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b5-lYS/1KqOEdjkLVmgUGbKsZZq+ck\"",
		"mtime": "2026-08-02T18:49:57.247Z",
		"size": 949,
		"path": "../public/assets/web-DQffihPD.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
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
var _lazy_WETLm6 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_WETLm6
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
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
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
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
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
