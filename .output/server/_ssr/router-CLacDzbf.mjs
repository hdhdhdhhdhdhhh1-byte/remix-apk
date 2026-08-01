import { r as __toESM } from "../_runtime.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as supabase } from "./client-DeiHMjF_.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as redirect, _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as numberType, c as stringType, o as objectType } from "../_libs/zod.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CLacDzbf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DTPrbyrL.css";
function logRuntimeError(error, context = {}) {
	if (typeof window === "undefined") return;
	console.error("[runtime]", {
		error,
		...context
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		logRuntimeError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "نيكو — منصة المساعد الصوتي الذكي" },
			{
				name: "description",
				content: "منصة نيكو: مساعد شخصي يعمل بالصوت أولاً مع ذاكرة، مهارات، وأذونات آمنة."
			},
			{
				name: "author",
				content: "Nico AI Platform"
			},
			{
				property: "og:title",
				content: "نيكو — منصة المساعد الصوتي الذكي"
			},
			{
				property: "og:description",
				content: "مساعد صوتي شخصي يفهم، يتذكر، وينفذ المهام."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		let unsub;
		import("./client-DeiHMjF_.mjs").then((n) => n.t).then((n) => n.t).then(({ supabase }) => {
			const sub = supabase.auth.onAuthStateChange((event) => {
				if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
				router.invalidate();
				if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
			});
			unsub = () => sub.data.subscription.unsubscribe();
		});
		return () => unsub?.();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$8 = () => import("./routes-Cg4eC4ny.mjs");
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "نيكو — مساعد ذكاء اصطناعي صوتي شخصي" },
		{
			name: "description",
			content: "نيكو مساعد شخصي يعمل بالصوت أولاً: يفهم أوامرك، يحلل النية، يتذكر تفضيلاتك، وينفذ مهامك."
		},
		{
			property: "og:title",
			content: "نيكو — مساعد ذكاء اصطناعي صوتي شخصي"
		},
		{
			property: "og:description",
			content: "تحدث مع نيكو بدل الكتابة: ذاكرة دائمة، مهارات قابلة للتوسع، وأذونات تحت سيطرتك."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./route-Di7iQBCH.mjs");
var Route$11 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./auth-cuymMmTG.mjs");
var Route$10 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "تسجيل الدخول — نيكو" },
		{
			name: "description",
			content: "سجّل دخولك للوصول إلى ذاكرة نيكو الدائمة ومحادثاتك."
		},
		{
			property: "og:title",
			content: "تسجيل الدخول — نيكو"
		},
		{
			property: "og:description",
			content: "ادخل إلى حسابك في منصة نيكو."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./nico-CY8NzYRB.mjs");
var Route$9 = createFileRoute("/nico")({
	head: () => ({ meta: [
		{ title: "تحدث مع نيكو — تجربة صوتية كاملة" },
		{
			name: "description",
			content: "شاشة نيكو الصوتية: اضغط وتحدث، اختر صوت المساعد وسرعته ونبرته، وشاهد آخر رد بدون فوضى المحادثات."
		},
		{
			property: "og:title",
			content: "تحدث مع نيكو — تجربة صوتية كاملة"
		},
		{
			property: "og:description",
			content: "واجهة صوت أولاً: أوامر سريعة، ردود فورية، وإعدادات صوت شخصية."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./settings-BJcYhJ5C.mjs");
var Route$8 = createFileRoute("/settings")({
	head: () => ({ meta: [
		{ title: "إعدادات نيكو — الصوت والشخصية والمهارات والخصوصية" },
		{
			name: "description",
			content: "لوحة إعدادات نيكو الكاملة: ملفك الشخصي، صوت المساعد وسرعته، شخصيته، تفعيل المهارات، إدارة الذاكرة والأذونات، والتنبيهات."
		},
		{
			property: "og:title",
			content: "إعدادات نيكو — تحكم كامل بمساعدك الشخصي"
		},
		{
			property: "og:description",
			content: "اضبط الصوت والشخصية والمهارات والخصوصية والتنبيهات في مكان واحد."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var BASE_URL = "";
var Route$7 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		}, {
			path: "/dashboard",
			changefreq: "weekly",
			priority: "0.6"
		}].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$3 = () => import("./dashboard-qMj17QND.mjs");
var Route$6 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "مركز نيكو الشخصي — ذاكرتك، شخصيتك، محادثاتك" },
		{
			name: "description",
			content: "مركز التحكم الشخصي لنيكو: أدر ذاكرتك، شخصية نيكو، محادثاتك السابقة، وسجل التعلم والخصوصية."
		},
		{
			property: "og:title",
			content: "مركز نيكو الشخصي"
		},
		{
			property: "og:description",
			content: "ذاكرة نيكو، الشخصية، المحادثات، التعلم والخصوصية في مكان واحد."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./privacy-O4TmPBzR.mjs");
var Route$5 = createFileRoute("/_authenticated/privacy")({
	head: () => ({ meta: [
		{ title: "مركز الخصوصية — نيكو" },
		{
			name: "description",
			content: "تحكم كامل ببياناتك في نيكو: تصدير، حذف الذاكرة، تعطيل التعلم، وحذف الحساب."
		},
		{
			property: "og:title",
			content: "مركز الخصوصية — نيكو"
		},
		{
			property: "og:description",
			content: "بياناتك ملكك: صدّرها، احذف الذاكرة، أوقف التعلم، أو احذف الحساب بالكامل."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitErrorComponentImporter = () => import("./mobile-pYsIao1B.mjs");
var $$splitComponentImporter$1 = () => import("./mobile-CcshFTrJ.mjs");
var Route$4 = createFileRoute("/mobile/")({
	head: () => ({ meta: [
		{ title: "Nico AI — تطبيق المساعد الصوتي للأندرويد" },
		{
			name: "description",
			content: "واجهة تطبيق نيكو للهاتف: صوت أولاً، كلمة التنبيه «يا نيكو»، ذاكرة مرتبطة بحسابك، وأذونات تُطلب عند الحاجة فقط."
		},
		{
			property: "og:title",
			content: "Nico AI — تطبيق المساعد الصوتي للأندرويد"
		},
		{
			property: "og:description",
			content: "نيكو على هاتفك: استماع، تفكير، ورد صوتي بنفس العقل والذاكرة."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
/** Crash protection: a failed render never leaves a blank phone screen. */
var $$splitComponentImporter = () => import("./settings-YUN_6Shk.mjs");
var Route$3 = createFileRoute("/mobile/settings")({
	head: () => ({ meta: [
		{ title: "إعدادات نيكو — الصوت والشخصية وطريقة الرد" },
		{
			name: "description",
			content: "اضبط صوت نيكو وسرعته ونبرته، اختر شخصيته، وحدد طول ردوده، وأدر أذونات هاتفك في مكان واحد."
		},
		{
			property: "og:title",
			content: "إعدادات نيكو — الصوت والشخصية وطريقة الرد"
		},
		{
			property: "og:description",
			content: "تحكم كامل في صوت نيكو وشخصيته وأذوناته من داخل التطبيق."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function getAiConfig() {
	const apiKey = processModule.env.AI_API_KEY || processModule.env.OPENAI_API_KEY || processModule.env.LOVABLE_API_KEY;
	const baseUrl = processModule.env.AI_API_URL || (processModule.env.LOVABLE_API_KEY ? "https://ai.gateway.lovable.dev/v1" : "https://api.openai.com/v1");
	if (!apiKey) return null;
	return {
		provider: processModule.env.AI_PROVIDER || "openai",
		baseUrl: baseUrl.replace(/\/+$/, ""),
		apiKey,
		chatModel: processModule.env.AI_MODEL || "gpt-4o-mini",
		sttModel: processModule.env.AI_STT_MODEL || "gpt-4o-mini-transcribe",
		ttsModel: processModule.env.AI_TTS_MODEL || "gpt-4o-mini-tts",
		ttsVoice: processModule.env.AI_TTS_VOICE || "alloy"
	};
}
function authHeaders(cfg, extra = {}) {
	return {
		Authorization: `Bearer ${cfg.apiKey}`,
		...extra
	};
}
async function chat(cfg, opts) {
	return fetch(`${cfg.baseUrl}/chat/completions`, {
		method: "POST",
		headers: authHeaders(cfg, { "Content-Type": "application/json" }),
		body: JSON.stringify({
			model: opts.model || cfg.chatModel,
			messages: opts.messages,
			...opts.jsonMode ? { response_format: { type: "json_object" } } : {}
		})
	});
}
async function transcribe(cfg, opts) {
	const form = new FormData();
	form.append("model", opts.model || cfg.sttModel);
	form.append("file", opts.file, opts.file.name || "recording.wav");
	if (opts.prompt) form.append("prompt", opts.prompt);
	if (opts.language) form.append("language", opts.language);
	return fetch(`${cfg.baseUrl}/audio/transcriptions`, {
		method: "POST",
		headers: authHeaders(cfg),
		body: form
	});
}
async function speak(cfg, opts) {
	const fs = await import("node:fs/promises");
	const { spawn } = await import("./child_process-BxeS3ssc.mjs");
	const output = `/data/data/com.termux/files/home/remix-of-90159487/nico.wav`;
	const safe = opts.text.replace(/"/g, "").replace(/`/g, "").slice(0, 400);
	await new Promise((resolve, reject) => {
		const espeak = spawn("espeak", [
			"-v",
			"ar",
			"-s",
			"125",
			"-w",
			output,
			safe
		]);
		espeak.on("close", (code) => code === 0 ? resolve() : reject(/* @__PURE__ */ new Error(`espeak ${code}`)));
		espeak.on("error", (e) => reject(e));
	});
	const audio = await fs.readFile(output);
	return new Response(audio, { headers: { "Content-Type": "audio/wav" } });
}
/**
* Public entry point for AI calls.
*
* Server routes call these helpers instead of hitting a hard-coded gateway.
*/
var AiUnavailableError = class extends Error {
	constructor() {
		super("AI provider not configured. Set AI_API_KEY (and optionally AI_API_URL / AI_MODEL).");
		this.name = "AiUnavailableError";
	}
};
function requireConfig() {
	const cfg = getAiConfig();
	if (!cfg) throw new AiUnavailableError();
	return cfg;
}
var aiClient = {
	chat: (opts) => chat(requireConfig(), opts),
	transcribe: (opts) => transcribe(requireConfig(), opts),
	speak: (opts) => speak(requireConfig(), opts),
	isConfigured: () => getAiConfig() !== null
};
var BodySchema = objectType({
	text: stringType().min(1).max(4e3),
	voice: stringType().max(40).optional(),
	speed: numberType().min(.5).max(2).optional(),
	instructions: stringType().max(500).optional()
});
var Route$2 = createFileRoute("/api/nico/speak")({ server: { handlers: { POST: async ({ request }) => {
	if (!aiClient.isConfigured()) return new Response("AI provider not configured", { status: 500 });
	const raw = await request.json().catch(() => null);
	const parsed = BodySchema.safeParse(raw);
	if (!parsed.success) return new Response("Invalid speech request", { status: 400 });
	const { text, voice, speed, instructions } = parsed.data;
	const res = await aiClient.speak({
		text,
		voice,
		speed,
		instructions: instructions || "Speak warmly and naturally, like a friendly personal assistant talking to a friend.",
		streaming: true,
		format: "pcm"
	});
	if (!res.ok || !res.body) {
		const detail = await res.text().catch(() => "");
		console.error(`TTS failed [${res.status}]: ${detail}`);
		return new Response(detail || "TTS failed", { status: res.status });
	}
	return new Response(res.body, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache"
	} });
} } } });
var SYSTEM = `أنت "نيكو"، مساعد شخصي صوتي.
- تتحدث بالعربية بلهجة طبيعية وودودة، وبالإنجليزية إذا خاطبك المستخدم بها.
- ردودك قصيرة (جملة إلى ثلاث جمل) لأنها تُنطق صوتياً، بلا رموز أو markdown أو قوائم.
- أنت تتحدث ولا ترسل رسائل مكتوبة.
- استخدم المعلومات المحفوظة عن المستخدم بشكل طبيعي.
أعد دائماً JSON فقط بالشكل:
{"speech":"...","intent":"greeting|smalltalk|question|reminder|weather|calendar|search|smart_home|memory_store|memory_recall|unknown","memories":[{"key":"...","value":"...","kind":"profile|preference|habit|fact"}]}
ضع في memories فقط المعلومات الشخصية الجديدة الجديرة بالحفظ الدائم، وإلا اتركها فارغة.`;
var Route$1 = createFileRoute("/api/nico/think")({ server: { handlers: { POST: async ({ request }) => {
	if (!aiClient.isConfigured()) return new Response("AI provider not configured", { status: 500 });
	const body = await request.json().catch(() => null);
	const transcript = body?.transcript?.trim();
	if (!transcript) return new Response("Missing transcript", { status: 400 });
	const systemPrompt = body?.systemPrompt?.trim() || SYSTEM;
	const context = [body?.memoryDigest ? `ما أعرفه عن المستخدم:\n${body.memoryDigest}` : "", body?.skillFindings?.length ? `نتائج المهارات المنفذة:\n${body.skillFindings.join("\n")}` : ""].filter(Boolean).join("\n\n");
	const messages = [
		{
			role: "system",
			content: systemPrompt
		},
		...context ? [{
			role: "system",
			content: context
		}] : [],
		...(body?.history ?? []).slice(-10).map((t) => ({
			role: t.role === "nico" ? "assistant" : "user",
			content: t.content
		})),
		{
			role: "user",
			content: transcript
		}
	];
	const res = await aiClient.chat({
		messages,
		jsonMode: true
	});
	if (!res.ok) {
		const detail = await res.text().catch(() => "");
		console.error(`Reasoning failed [${res.status}]: ${detail}`);
		return new Response(detail || "Reasoning failed", { status: res.status });
	}
	const raw = (await res.json()).choices?.[0]?.message?.content ?? "{}";
	try {
		const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, ""));
		return Response.json({
			speech: String(parsed.speech ?? ""),
			intent: parsed.intent ?? null,
			memories: Array.isArray(parsed.memories) ? parsed.memories.slice(0, 5) : []
		});
	} catch {
		return Response.json({
			speech: raw,
			intent: null,
			memories: []
		});
	}
} } } });
var Route = createFileRoute("/api/nico/transcribe")({ server: { handlers: { POST: async ({ request }) => {
	if (!aiClient.isConfigured()) return new Response("AI provider not configured", { status: 500 });
	const audio = (await request.formData()).get("audio");
	if (!(audio instanceof File)) return new Response("Missing audio", { status: 400 });
	const result = await aiClient.transcribe({ file: audio });
	if (!result.ok) return new Response("Transcription failed", { status: 500 });
	return Response.json({ text: result.text });
} } } });
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AuthenticatedRouteRoute = Route$11.update({
	id: "/_authenticated",
	getParentRoute: () => Route$13
});
var AuthRoute = Route$10.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$13
});
var NicoRoute = Route$9.update({
	id: "/nico",
	path: "/nico",
	getParentRoute: () => Route$13
});
var SettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$13
});
var SitemapDotxmlRoute = Route$7.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$13
});
var AuthenticatedDashboardRoute = Route$6.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPrivacyRoute = Route$5.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => AuthenticatedRouteRoute
});
var MobileIndexRoute = Route$4.update({
	id: "/mobile/",
	path: "/mobile/",
	getParentRoute: () => Route$13
});
var MobileSettingsRoute = Route$3.update({
	id: "/mobile/settings",
	path: "/mobile/settings",
	getParentRoute: () => Route$13
});
var ApiNicoSpeakRoute = Route$2.update({
	id: "/api/nico/speak",
	path: "/api/nico/speak",
	getParentRoute: () => Route$13
});
var ApiNicoThinkRoute = Route$1.update({
	id: "/api/nico/think",
	path: "/api/nico/think",
	getParentRoute: () => Route$13
});
var ApiNicoTranscribeRoute = Route.update({
	id: "/api/nico/transcribe",
	path: "/api/nico/transcribe",
	getParentRoute: () => Route$13
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedDashboardRoute,
	AuthenticatedPrivacyRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	NicoRoute,
	SettingsRoute,
	SitemapDotxmlRoute,
	MobileSettingsRoute,
	MobileIndexRoute,
	ApiNicoSpeakRoute,
	ApiNicoThinkRoute,
	ApiNicoTranscribeRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
