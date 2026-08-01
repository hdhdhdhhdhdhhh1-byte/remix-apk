import { r as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DeiHMjF_.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-CK1dyWw0.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as numberType, c as stringType, i as enumType, n as arrayType, o as objectType, r as booleanType, s as recordType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useNico-CItiVl90.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var TOPIC_LABELS = {
	weather: "الطقس",
	calendar: "المواعيد",
	reminder: "التذكيرات",
	search: "البحث",
	smart_home: "المنزل الذكي",
	memory_store: "الذاكرة",
	memory_recall: "الذاكرة",
	question: "سؤال",
	greeting: "ترحيب",
	smalltalk: "حديث عام",
	unknown: "غير محدد"
};
/**
* Conversation-scoped memory: the ordered turn log plus the topics those
* turns belong to. Distinct from `@nico/memory` — this layer is about the
* *dialogue*, not about facts worth persisting.
*/
var ConversationMemory = class {
	windowSize;
	turns = [];
	topicList = [];
	constructor(windowSize = 24) {
		this.windowSize = windowSize;
	}
	record(turn) {
		this.turns.push(turn);
		if (this.turns.length > this.windowSize) this.turns = this.turns.slice(-this.windowSize);
		if (turn.role === "user" && turn.intent) this.touchTopic(turn.intent, {});
	}
	/** Creates or refreshes the topic bound to an intent. */
	touchTopic(intent, entities) {
		const existing = this.topicList.find((t) => t.intent === intent);
		if (existing) {
			existing.turns += 1;
			existing.lastSeenAt = Date.now();
			existing.entities = {
				...existing.entities,
				...entities
			};
			this.promote(existing);
			return existing;
		}
		const topic = {
			id: `${intent}-${Date.now().toString(36)}`,
			label: TOPIC_LABELS[intent] ?? intent,
			intent,
			entities,
			turns: 1,
			lastSeenAt: Date.now()
		};
		this.topicList.unshift(topic);
		this.topicList = this.topicList.slice(0, 8);
		return topic;
	}
	promote(topic) {
		this.topicList = [topic, ...this.topicList.filter((t) => t.id !== topic.id)];
	}
	activeTopic() {
		return this.topicList[0];
	}
	topics() {
		return [...this.topicList];
	}
	history() {
		return [...this.turns];
	}
	lastUserTurn() {
		return [...this.turns].reverse().find((t) => t.role === "user");
	}
	/** Compact transcript handed to the reasoning model. */
	transcript(limit = 8) {
		return this.turns.slice(-limit).map((t) => `${t.role === "user" ? "المستخدم" : "نيكو"}: ${t.content}`).join("\n");
	}
	clear() {
		this.turns = [];
		this.topicList = [];
	}
};
/** Phrases that only make sense with prior context. */
var REFERENCE_PATTERNS = [
	{
		re: /^\s*(و\s*)?(ماذا|شو|وش|ايش|إيش)\s+(عن|بخصوص)/i,
		kind: "topic"
	},
	{
		re: /^\s*what about\b/i,
		kind: "topic"
	},
	{
		re: /(كرره|كررها|أعدها|اعدها|مرة ثانية|مرة أخرى|again|do it again|repeat)/i,
		kind: "last_action"
	},
	{
		re: /^\s*(و\s*)?(بكرة|بكره|غدا|غداً|اليوم|tomorrow|today)\s*[?؟]?\s*$/i,
		kind: "topic"
	}
];
/**
* Owns the *live* context of a conversation: which topic is active, what the
* last executed action was, and how to turn an elliptical utterance into a
* self-contained one before the intent engine ever sees it.
*/
var ContextManager = class {
	memory;
	sessionId;
	slots = /* @__PURE__ */ new Map();
	lastAction;
	constructor(memory, sessionId) {
		this.memory = memory;
		this.sessionId = sessionId;
	}
	setSlot(key, value) {
		this.slots.set(key, value);
	}
	getSlot(key) {
		return this.slots.get(key);
	}
	rememberAction(skill, input) {
		this.lastAction = {
			skill,
			input,
			at: Date.now()
		};
	}
	/** Expands references such as "وماذا عن بكرة؟" or "كررها" into full asks. */
	resolve(utterance) {
		const text = utterance.trim();
		const match = REFERENCE_PATTERNS.find((p) => p.re.test(text));
		if (!match) return {
			text,
			resolved: false
		};
		if (match.kind === "last_action" && this.lastAction) {
			const original = String(this.lastAction.input.text ?? "");
			if (original) return {
				text: original,
				resolved: true,
				source: "last_action",
				note: `إعادة تنفيذ ${this.lastAction.skill}`
			};
		}
		const topic = this.memory.activeTopic();
		if (topic) return {
			text: `${this.memory.lastUserTurn()?.content ?? topic.label} — ${text}`.trim(),
			resolved: true,
			source: "topic",
			note: `الموضوع النشط: ${topic.label}`
		};
		return {
			text,
			resolved: false
		};
	}
	snapshot() {
		return {
			sessionId: this.sessionId(),
			activeTopic: this.memory.activeTopic(),
			topics: this.memory.topics(),
			lastUserUtterance: this.memory.lastUserTurn()?.content,
			lastAction: this.lastAction,
			slots: Object.fromEntries(this.slots)
		};
	}
	/** Human-readable context block injected into the reasoning prompt. */
	digest() {
		const s = this.snapshot();
		const lines = [];
		if (s.activeTopic) lines.push(`الموضوع الحالي: ${s.activeTopic.label}`);
		if (s.lastAction) lines.push(`آخر إجراء: ${s.lastAction.skill}`);
		for (const [k, v] of Object.entries(s.slots)) lines.push(`${k}: ${v}`);
		return lines.join("\n");
	}
	clear() {
		this.slots.clear();
		this.lastAction = void 0;
	}
};
var IDLE_MS = 1800 * 1e3;
/**
* Tracks the lifetime of a conversation session. A session ends when the user
* signs out, resets, or stays idle long enough that context is no longer safe
* to reuse.
*/
var SessionManager = class {
	idleMs;
	info;
	listeners = /* @__PURE__ */ new Set();
	constructor(isGuest = true, idleMs = IDLE_MS) {
		this.idleMs = idleMs;
		this.info = this.fresh(isGuest);
	}
	fresh(isGuest) {
		return {
			id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now().toString(36)}`,
			startedAt: Date.now(),
			lastActivityAt: Date.now(),
			turns: 0,
			isGuest
		};
	}
	current() {
		return { ...this.info };
	}
	id() {
		return this.info.id;
	}
	isExpired(now = Date.now()) {
		return now - this.info.lastActivityAt > this.idleMs;
	}
	/** Marks activity, rotating the session when it went stale. Returns true on rotation. */
	touch(now = Date.now()) {
		const rotated = this.isExpired(now);
		if (rotated) this.info = this.fresh(this.info.isGuest);
		this.info.lastActivityAt = now;
		this.info.turns += 1;
		this.emit();
		return rotated;
	}
	reset(isGuest = this.info.isGuest) {
		this.info = this.fresh(isGuest);
		this.emit();
		return this.current();
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	emit() {
		const snap = this.current();
		this.listeners.forEach((l) => l(snap));
	}
};
/**
* Conversation Engine — the façade the brain talks to.
* Session lifecycle + dialogue memory + reference resolution in one place.
*/
var ConversationEngine = class {
	memory;
	session;
	context;
	constructor(isGuest = true) {
		this.memory = new ConversationMemory();
		this.session = new SessionManager(isGuest);
		this.context = new ContextManager(this.memory, () => this.session.id());
	}
	/** Begins a turn: rotates stale sessions and expands references. */
	beginTurn(utterance) {
		if (this.session.touch()) {
			this.memory.clear();
			this.context.clear();
		}
		return this.context.resolve(utterance);
	}
	record(turn) {
		this.memory.record(turn);
	}
	trackTopic(intent, entities) {
		return this.memory.touchTopic(intent, entities);
	}
	reset() {
		this.memory.clear();
		this.context.clear();
		this.session.reset();
	}
};
var AR_DIGITS = /[\u0660-\u0669]/g;
var normalizeDigits = (s) => s.replace(AR_DIGITS, (d) => String(d.charCodeAt(0) - 1632));
/**
* Arabic/English natural time parsing for reminders and calendar events.
* Supports "بعد 10 دقائق"، "غداً الساعة 8"، "اليوم 20:30"، "at 7am".
*/
function parseWhen(input, now = /* @__PURE__ */ new Date()) {
	const text = normalizeDigits(input).toLowerCase();
	const rel = text.match(/(?:بعد|خلال|in)\s+(\d+)\s*(دقيقة|دقائق|دقيقه|ساعة|ساعات|ساعه|يوم|أيام|minute|minutes|hour|hours|day|days)/i);
	if (rel) {
		const n = Number(rel[1]);
		const unit = rel[2];
		const minutes = /ساع|hour/i.test(unit) ? n * 60 : /يوم|day/i.test(unit) ? n * 1440 : n;
		const at = now.getTime() + minutes * 6e4;
		return {
			minutesFromNow: minutes,
			at,
			label: formatLabel(new Date(at), now)
		};
	}
	const dayOffset = /(غدا|غداً|بكرة|بكره|tomorrow)/i.test(text) ? 1 : /(بعد غد|بعد بكرة|day after tomorrow)/i.test(text) ? 2 : /(اليوم|today)/i.test(text) ? 0 : null;
	const clock = text.match(/(?:الساعة|الساعه|at)?\s*(\d{1,2})(?::(\d{2}))?\s*(ص|صباحا|صباحاً|م|مساء|مساءً|am|pm)?/i);
	if (clock && (dayOffset !== null || /الساعة|الساعه|\bat\b/i.test(text))) {
		let hour = Number(clock[1]);
		const minute = Number(clock[2] ?? 0);
		const marker = clock[3] ?? "";
		if (/م|مساء|pm/i.test(marker) && hour < 12) hour += 12;
		if (/ص|صباح|am/i.test(marker) && hour === 12) hour = 0;
		const target = new Date(now);
		target.setSeconds(0, 0);
		target.setDate(target.getDate() + (dayOffset ?? 0));
		target.setHours(hour, minute, 0, 0);
		if (dayOffset === null && target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
		if (target.getTime() <= now.getTime()) return null;
		return {
			minutesFromNow: Math.round((target.getTime() - now.getTime()) / 6e4),
			at: target.getTime(),
			label: formatLabel(target, now)
		};
	}
	return null;
}
function formatLabel(target, now) {
	const hh = String(target.getHours()).padStart(2, "0");
	const mm = String(target.getMinutes()).padStart(2, "0");
	const sameDay = target.toDateString() === now.toDateString();
	const tomorrow = new Date(now);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const isTomorrow = target.toDateString() === tomorrow.toDateString();
	return `${sameDay ? "اليوم" : isTomorrow ? "غداً" : target.toLocaleDateString("ar", {
		day: "numeric",
		month: "long"
	})} ${hh}:${mm}`;
}
var RULES = [
	{
		intent: "greeting",
		patterns: [/^(مرحبا|أهلا|اهلا|سلام|السلام|hi|hello|hey)/i]
	},
	{
		intent: "reminder",
		patterns: [/ذكرني|تذكير|منبه|remind/i],
		entities: (t) => {
			const entities = {};
			const m = t.match(/(?:بعد|خلال)\s+(\d+)\s*(دقيقة|دقائق|ساعة|ساعات|minute|hour)/i);
			if (m) {
				entities.amount = m[1];
				entities.unit = m[2];
			}
			const when = parseWhen(t);
			if (when) {
				entities.at = String(when.at);
				entities.whenLabel = when.label;
			}
			return entities;
		}
	},
	{
		intent: "notes",
		patterns: [/ملاحظة|ملاحظاتي|الملاحظات|\bnote(s)?\b/i]
	},
	{
		intent: "weather",
		patterns: [/طقس|جو|حرارة|مطر|weather/i]
	},
	{
		intent: "calendar",
		patterns: [/موعد|اجتماع|تقويم|جدول|calendar|meeting/i]
	},
	{
		intent: "smart_home",
		patterns: [/أطفئ|اطفئ|شغل|النور|المكيف|الاضاءة|light|lamp/i]
	},
	{
		intent: "memory_store",
		patterns: [/تذكر أن|احفظ|خزن|remember that/i]
	},
	{
		intent: "memory_recall",
		patterns: [/ما هو اسمي|هل تتذكر|شو تعرف عني|what do you know/i]
	},
	{
		intent: "search",
		patterns: [/ابحث|بحث|search|google/i]
	},
	{
		intent: "question",
		patterns: [/^(ما|من|كيف|لماذا|متى|أين|هل|what|how|why|when|where)/i]
	}
];
/**
* Fast deterministic first pass. The ReasoningEngine may override a
* low-confidence result with the model's own classification.
*/
var IntentEngine = class {
	detect(text) {
		const raw = text.trim();
		for (const rule of RULES) if (rule.patterns.some((p) => p.test(raw))) return {
			name: rule.intent,
			confidence: .82,
			entities: rule.entities?.(raw) ?? {},
			raw
		};
		return {
			name: raw.length > 0 ? "smalltalk" : "unknown",
			confidence: .4,
			entities: {},
			raw
		};
	}
};
/** Maps a fine-grained intent to its high-level request category. */
var CATEGORY_BY_INTENT = {
	greeting: "conversation",
	smalltalk: "conversation",
	question: "question",
	reminder: "reminder",
	weather: "question",
	calendar: "task_execution",
	search: "search",
	smart_home: "command",
	notes: "task_execution",
	memory_store: "personal_info",
	memory_recall: "personal_info",
	unknown: "conversation"
};
var COMMAND_RE = /^(شغل|أطفئ|اطفئ|افتح|اقفل|أرسل|ارسل|احجز|سوي|نفذ|turn|open|close|send|play|stop)/i;
var PERSONAL_RE = /(اسمي|أنا أحب|انا احب|تفضيلي|عادتي|my name is|i like|i prefer)/i;
var SPLIT_RE = /\s*(?:،|,|\bثم\b|\bوبعدين\b|\bبعدها\b|\band then\b|\bثمّ\b)\s*|\s+و(?=(?:أرسل|ارسل|ذكرني|شغل|أطفئ|اطفئ|ابحث|احجز|أضف|اضف))/i;
/**
* Advanced Intent Engine.
* Adds request-category classification, multi-ask segmentation and
* reference detection on top of the deterministic rule engine.
*/
var AdvancedIntentEngine = class {
	base;
	constructor(base = new IntentEngine()) {
		this.base = base;
	}
	classify(text, opts = {}) {
		const raw = text.trim();
		const intent = this.base.detect(raw);
		const segments = this.segment(raw);
		return {
			...intent,
			confidence: segments.length > 1 ? Math.min(intent.confidence, .75) : intent.confidence,
			category: this.categorize(raw, intent.name),
			segments,
			isReference: opts.isReference ?? false
		};
	}
	/** Classifies a single sub-request (used by the planner per segment). */
	classifySegment(segment) {
		const intent = this.base.detect(segment.trim());
		return {
			...intent,
			category: this.categorize(segment, intent.name),
			segments: [segment.trim()],
			isReference: false
		};
	}
	categorize(raw, intent) {
		if (PERSONAL_RE.test(raw)) return "personal_info";
		if (intent === "smalltalk" || intent === "unknown") {
			if (COMMAND_RE.test(raw)) return "command";
			if (/[?؟]$/.test(raw)) return "question";
		}
		if (COMMAND_RE.test(raw) && CATEGORY_BY_INTENT[intent] === "conversation") return "command";
		return CATEGORY_BY_INTENT[intent];
	}
	/** Splits "ذكرني بكرة وأرسل رسالة" into independent asks. */
	segment(raw) {
		const parts = raw.split(new RegExp(SPLIT_RE, "gi")).map((p) => (p ?? "").trim()).filter((p) => p.length > 2);
		return parts.length > 1 ? parts : [raw];
	}
};
/**
* Planning Engine.
* Breaks a possibly-compound request into an ordered, dependency-aware set of
* steps. "ذكرني بكرة وأرسل رسالة" becomes: create reminder → prepare message →
* execute action.
*/
var TaskPlanner = class {
	skills;
	intents;
	constructor(skills, intents) {
		this.skills = skills;
		this.intents = intents;
	}
	plan(intent) {
		const steps = [];
		let order = 0;
		let previousId = null;
		for (const segment of intent.segments) {
			const sub = segment === intent.raw ? intent : this.intents.classifySegment(segment);
			const matched = this.skills.forIntent(sub.name);
			for (const skill of matched) {
				const id = `${skill.id}-${order}`;
				steps.push({
					id,
					order,
					skill: skill.id,
					description: skill.description,
					category: sub.category,
					input: {
						...sub.entities,
						text: segment
					},
					dependsOn: previousId ? [previousId] : [],
					requiresPermissions: skill.permissions ?? [],
					optional: sub.category === "conversation"
				});
				previousId = id;
				order++;
			}
		}
		const requiresPermissions = steps.flatMap((s) => s.requiresPermissions).filter((p, i, arr) => arr.indexOf(p) === i);
		return {
			id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `plan-${Date.now().toString(36)}`,
			goal: intent.raw,
			steps,
			requiresMemory: intent.category === "personal_info" || steps.some((s) => s.category === "personal_info") || intent.name === "memory_recall" || intent.name === "memory_store",
			requiresPermissions
		};
	}
	/** Topologically ordered steps whose dependencies all succeeded. */
	runnable(plan, completed) {
		return [...plan.steps].sort((a, b) => a.order - b.order).filter((s) => s.dependsOn.every((d) => completed.has(d) || !plan.steps.some((p) => p.id === d)));
	}
};
/**
* In-memory sliding-window limiter. Protects skills (and the network calls
* behind them) from runaway loops or abusive command bursts.
*/
var RateLimiter = class {
	limit;
	windowMs;
	hits = /* @__PURE__ */ new Map();
	constructor(limit = 12, windowMs = 6e4) {
		this.limit = limit;
		this.windowMs = windowMs;
	}
	check(key) {
		const now = Date.now();
		const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
		if (recent.length >= this.limit) return {
			allowed: false,
			retryAfterMs: this.windowMs - (now - recent[0])
		};
		recent.push(now);
		this.hits.set(key, recent);
		return {
			allowed: true,
			retryAfterMs: 0
		};
	}
	reset(key) {
		if (key) this.hits.delete(key);
		else this.hits.clear();
	}
};
/**
* Security Layer — the guard between the planner and any skill execution.
*
*  - Permission validation (default-deny for sensitive capabilities).
*  - Rate limiting per skill to contain runaway loops.
*  - User data isolation checks for anything leaving the device.
*  - Redaction of sensitive spans before text reaches a model.
*/
var SecurityLayer = class {
	permissions;
	limiter;
	constructor(permissions, limiter = new RateLimiter(30, 6e4)) {
		this.permissions = permissions;
		this.limiter = limiter;
	}
	authorize(skill) {
		const missing = (skill.permissions ?? []).filter((p) => !this.permissions.isGranted(p));
		if (missing.length) return {
			allowed: false,
			missing,
			reason: "permission_denied"
		};
		if (!this.limiter.check(`skill:${skill.id}`).allowed) return {
			allowed: false,
			missing: [],
			reason: "rate_limited"
		};
		return {
			allowed: true,
			missing: []
		};
	}
	/**
	* Data isolation: a record may only be read or written by its owner.
	* Guest records (no owner) stay on-device and never sync.
	*/
	ownsRecord(currentUserId, recordUserId) {
		if (!recordUserId) return currentUserId === null;
		return !!currentUserId && currentUserId === recordUserId;
	}
	/** Throws when a caller tries to touch another user's row. */
	assertOwnership(currentUserId, recordUserId) {
		if (!this.ownsRecord(currentUserId, recordUserId)) throw new Error("access_denied: record belongs to another user");
	}
	/** Guest data must never be pushed to the cloud without an upgrade. */
	canSync(isGuest) {
		return !isGuest;
	}
	/** Strips anything that must never leave the device into an LLM prompt. */
	sanitizeForModel(text) {
		return text.replace(/\b\d{13,19}\b/g, "[رقم محجوب]").replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[بريد محجوب]").replace(/\b(?:\+?\d[\d\s-]{8,14}\d)\b/g, "[هاتف محجوب]").replace(/\b(?:sk|pk|sb|ghp)_[A-Za-z0-9_-]{8,}\b/g, "[مفتاح محجوب]");
	}
};
/**
* Reasoning Layer.
* Decides — before anything runs — which steps are allowed to execute,
* whether memory is involved, whether the model is needed, and in which
* style Nico should answer.
*/
var ReasoningLayer = class {
	skills;
	security;
	constructor(permissions, skills) {
		this.skills = skills;
		this.security = new SecurityLayer(permissions);
	}
	decide({ intent, plan, hasMemory }) {
		const rationale = [];
		const executable = [];
		const blocked = [];
		for (const step of [...plan.steps].sort((a, b) => a.order - b.order)) {
			const skill = this.skills.get(step.skill);
			if (!skill) {
				rationale.push(`تجاهلت خطوة ${step.skill}: المهارة غير مسجلة.`);
				continue;
			}
			const decision = this.security.authorize(skill);
			if (!decision.allowed) {
				blocked.push({
					step,
					missing: decision.missing
				});
				rationale.push(`أوقفت ${skill.name}: صلاحيات ناقصة (${decision.missing.join(", ")}).`);
				continue;
			}
			executable.push(step);
			rationale.push(`اخترت ${skill.name} للخطوة ${step.order + 1}.`);
		}
		const needsMemoryRecall = intent.name === "memory_recall" || intent.category === "personal_info" || intent.isReference && hasMemory;
		const needsMemoryWrite = intent.name === "memory_store" || intent.category === "personal_info";
		const needsModel = executable.length === 0 || intent.category !== "command";
		if (needsMemoryRecall) rationale.push("استرجعت الذاكرة الطويلة قبل الرد.");
		if (!needsModel) rationale.push("الأمر تنفيذي مباشر، لا حاجة لاستدعاء النموذج.");
		return {
			plan,
			executable,
			blocked,
			needsMemoryRecall,
			needsMemoryWrite,
			needsModel,
			style: this.style(intent, blocked.length > 0),
			rationale
		};
	}
	style(intent, hasBlocked) {
		if (hasBlocked) return "empathetic";
		switch (intent.category) {
			case "command":
			case "task_execution": return "confirming";
			case "question":
			case "search": return "informative";
			case "personal_info":
			case "reminder": return "brief";
			default: return intent.name === "greeting" ? "playful" : "brief";
		}
	}
	/** Redacts sensitive spans before any text reaches the model. */
	sanitize(text) {
		return this.security.sanitizeForModel(text);
	}
};
/**
* LLM-backed reasoning. Runs against the server route so no key touches
* the browser. Falls back to a deterministic reply if the call fails.
*/
var ReasoningEngine = class {
	endpoint;
	constructor(endpoint = "/api/nico/think") {
		this.endpoint = endpoint;
	}
	async reason(input) {
		const res = await fetch(this.endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(input)
		});
		if (!res.ok) {
			const detail = await res.text().catch(() => "");
			throw new Error(`Reasoning failed [${res.status}]: ${detail}`);
		}
		const data = await res.json();
		return {
			speech: data.speech?.trim() || "ما قدرت أفهم الطلب، جرّب تعيد صياغته.",
			intent: data.intent ?? null,
			memories: data.memories ?? []
		};
	}
};
/** Nico's persona. One place to tune tone across every surface. */
var NICO_PERSONALITY = {
	name: "نيكو",
	traits: [
		"ودود",
		"ذكي",
		"طبيعي",
		"مختصر"
	],
	systemPrompt: `أنت "نيكو"، مساعد شخصي صوتي.
- تتحدث بالعربية بلهجة طبيعية وودودة، وبالإنجليزية إذا خاطبك المستخدم بها.
- ردودك قصيرة (جملة إلى ثلاث جمل) لأنها تُنطق صوتياً، بلا نقاط تعداد ولا رموز ولا markdown.
- أنت تتحدث، لا ترسل رسائل: استخدم صياغة محكية سلسة.
- تتذكر ما يخص المستخدم وتستخدمه بشكل طبيعي دون تكرار ممل.
- إذا لم تعرف شيئاً قل ذلك بصراحة وباختصار.
- لا تستخدم لغة آلية: قل "تمام، نفذت لك الأمر" بدل "تم تنفيذ الأمر"، وقل "لم أجد الإجابة الآن، دعني أبحث لك" بدل "لا أعرف".`,
	greeting: (name) => name ? `أهلاً ${name}!` : "أهلاً! أنا نيكو.",
	listening: "أسمعك...",
	apology: "صار عندي خلل بسيط في تنفيذ جزء من الطلب."
};
/** The first thing Nico says on his own, right after the mic is granted. */
var NICO_AUTO_GREETING = "أهلاً وسهلاً، أنا نيكو. أنا هنا لمساعدتك. يمكنك التحدث معي في أي وقت.";
/** Spoken phrasing for system moments — never robotic, always in Nico's voice. */
var NICO_PHRASES = {
	greetingBack: (name) => name ? `أهلاً ${name}، رجعت لك. تحت أمرك.` : "أهلاً من جديد، أنا معك.",
	wake: "نعم، أسمعك.",
	sleeping: "أنا هنا، ناديني بـ«يا نيكو».",
	micDenied: "أحتاج إذن الميكروفون حتى أسمعك، وقتما تحب فعّله وأنا جاهز.",
	micFailed: "ما قدرت أفتح الميكروفون الآن، جرّب مرة ثانية من فضلك.",
	notHeard: "ما وصلني صوتك بوضوح، أعد الكلام لو سمحت.",
	unknown: "لم أجد الإجابة الآن، دعني أبحث لك.",
	done: "تمام، نفذت لك الأمر.",
	failed: "صار عندي خلل بسيط، خلّنا نجرّب مرة ثانية.",
	needsPermission: (label) => `عشان أقدر أساعدك بهذا، أحتاج إذن ${label}. تسمح لي؟`
};
/** Rewrites machine-sounding sentences into Nico's spoken style. */
function humanize(text) {
	const rules = [
		[/^\s*تم تنفيذ الأمر\.?\s*$/, NICO_PHRASES.done],
		[/^\s*تم\.?\s*$/, NICO_PHRASES.done],
		[/^\s*لا أعرف\.?\s*$/, NICO_PHRASES.unknown],
		[/^\s*غير معروف\.?\s*$/, NICO_PHRASES.unknown],
		[/^\s*خطأ\.?\s*$/, NICO_PHRASES.failed],
		[/^\s*فشل(ت)? العملية\.?\s*$/, NICO_PHRASES.failed]
	];
	for (const [re, replacement] of rules) if (re.test(text)) return replacement;
	return text.replace(/^تم تنفيذ /, "تمام، نفذت لك ").replace(/^لا أعرف[،,]?\s*/, "لم أجد الإجابة الآن، ");
}
var STYLE_VOICE = {
	brief: {
		rate: 1,
		pauseAfterMs: 120
	},
	informative: {
		rate: .98,
		pauseAfterMs: 200
	},
	confirming: {
		rate: 1.04,
		pauseAfterMs: 100
	},
	empathetic: {
		rate: .95,
		pauseAfterMs: 260
	},
	playful: {
		rate: 1.06,
		pauseAfterMs: 120
	}
};
/**
* Response Engine.
* Merges skill facts and model reasoning into one natural, spoken utterance
* that stays in Nico's voice regardless of which path produced the content.
*/
var ResponseComposer = class {
	compose(input) {
		const { intent, decision } = input;
		const parts = [];
		if (input.firstTurn && intent.name === "greeting") parts.push(NICO_PERSONALITY.greeting(input.userName));
		parts.push(...input.skillResults.filter((r) => r.ok).map((r) => r.speech));
		if (input.reasoning) parts.push(input.reasoning);
		for (const b of decision.blocked) parts.push(`أحتاج إذن ${b.missing.join(" و")} حتى أنفذ ${b.step.description}.`);
		if (input.skillResults.filter((r) => !r.ok && r.error !== "permission_denied").length) parts.push(NICO_PERSONALITY.apology);
		if (!parts.length) parts.push("تمام.");
		return {
			speech: this.polish(parts.join(" "), decision.style),
			style: decision.style,
			voice: STYLE_VOICE[decision.style]
		};
	}
	polish(text, style) {
		let out = text.replace(/\s+/g, " ").replace(/\s+([.،؟!])/g, "$1").trim();
		if (style === "brief") out = out.split(/(?<=[.؟!])\s+/).slice(0, 2).join(" ");
		return out;
	}
};
var CONCISE_RE = /(?:لا تستخدم كلمات كثيرة|كن مختصر|اختصر|be concise|shorter answers?)/i;
var DETAILED_RE = /(?:اشرح أكثر|بالتفصيل|explain more|more detail)/i;
var NAME_ME_RE = /(?:نادني(?:\s+يا)?|call me)\s+([\u0600-\u06FFA-Za-z]+)/i;
var FORMAL_RE = /(?:رسميّاً|بشكل رسمي|be formal|more formal)/i;
var PLAYFUL_RE = /(?:مرِح|كن مرحاً|be playful|funny)/i;
/**
* Learning Engine.
* Watches user utterances for corrections and adjusts the persistent
* profile (communication style, preferred name, tone) accordingly.
*/
var LearningEngine = class {
	profile;
	constructor(profile) {
		this.profile = profile;
	}
	observe(text) {
		const t = text.trim();
		if (!t) return { applied: false };
		if (CONCISE_RE.test(t)) return this.setStyle("concise");
		if (DETAILED_RE.test(t)) return this.setStyle("detailed");
		const name = t.match(NAME_ME_RE);
		if (name) {
			this.profile.update({ preferredName: name[1] });
			return {
				applied: true,
				change: `preferredName=${name[1]}`
			};
		}
		if (FORMAL_RE.test(t)) {
			this.profile.update({ personality: {
				...this.profile.data.personality,
				tone: "formal"
			} });
			return {
				applied: true,
				change: "tone=formal"
			};
		}
		if (PLAYFUL_RE.test(t)) {
			this.profile.update({ personality: {
				...this.profile.data.personality,
				tone: "playful"
			} });
			return {
				applied: true,
				change: "tone=playful"
			};
		}
		return { applied: false };
	}
	setStyle(style) {
		this.profile.setCommunicationStyle(style);
		return {
			applied: true,
			change: `communicationStyle=${style}`
		};
	}
};
var SIGNS = [
	{
		emotion: "sad",
		patterns: [/حزين|زعلان|مكتئب|تعبان نفسياً|sad|down|depressed/i]
	},
	{
		emotion: "tired",
		patterns: [/تعبان|مرهق|منهك|ما عندي طاقة|tired|exhausted|worn out/i]
	},
	{
		emotion: "angry",
		patterns: [/غاضب|زهقان|معصب|angry|furious|annoyed/i]
	},
	{
		emotion: "happy",
		patterns: [/سعيد|فرحان|مبسوط|رائع|excited|happy|great news/i]
	}
];
/**
* Emotion Analysis Layer.
* Lightweight lexical check used only to adjust Nico's tone — NOT a
* medical or diagnostic signal.
*/
var EmotionAnalyzer = class {
	detect(text) {
		const t = text.trim();
		if (!t) return {
			emotion: "neutral",
			confidence: 0,
			suggestedTone: "neutral"
		};
		for (const s of SIGNS) if (s.patterns.some((p) => p.test(t))) return {
			emotion: s.emotion,
			confidence: .7,
			suggestedTone: this.toneFor(s.emotion)
		};
		return {
			emotion: "neutral",
			confidence: .3,
			suggestedTone: "neutral"
		};
	}
	toneFor(e) {
		switch (e) {
			case "sad": return "warm";
			case "tired": return "calm";
			case "angry": return "empathetic";
			case "happy": return "cheerful";
			default: return "neutral";
		}
	}
};
/**
* Personality Engine.
* Holds Nico's stable persona and adapts delivery (tone, verbosity) based
* on the user's learned communication style and current emotional state.
* The core personality never changes — only its expression does.
*/
var PersonalityEngine = class PersonalityEngine {
	static BASE = {
		traits: [
			"friendly",
			"helpful",
			"respectful",
			"shortAnswers"
		],
		tone: "friendly",
		verbosity: "concise",
		respectful: true
	};
	buildSystemPrompt(profile, emotion) {
		const personality = {
			...PersonalityEngine.BASE,
			...profile.personality
		};
		const name = profile.preferredName || profile.name;
		const lines = [
			`أنت "نيكو"، مساعد شخصي دائم يعرف مستخدمه ويتذكره.`,
			`شخصيتك ثابتة: ${personality.traits.join("، ")}.`,
			personality.tone === "formal" ? "تحدث بأسلوب مهذب ورسمي." : personality.tone === "playful" ? "تحدث بأسلوب مرِح خفيف الظل مع الحفاظ على الاحترام." : "تحدث بلهجة ودودة وطبيعية.",
			personality.verbosity === "concise" ? "ردودك قصيرة جداً (جملة إلى جملتين) لأنها تُنطق صوتياً." : personality.verbosity === "detailed" ? "أعطِ إجابات وافية عند الحاجة لكن دون حشو." : "وازن بين الاختصار والوضوح.",
			"بلا رموز أو نقاط تعداد أو markdown. أنت تتحدث لا تكتب رسائل.",
			"تستخدم المعلومات التي تعرفها عن المستخدم بشكل طبيعي دون تكرار ممل.",
			"لا تخترع معلومات؛ إذا لم تعرف قل ذلك باختصار."
		];
		if (name) lines.push(`نادِ المستخدم باسم "${name}" عند المناسبة.`);
		if (profile.interests.length) lines.push(`اهتمامات المستخدم: ${profile.interests.slice(0, 5).join("، ")}.`);
		if (emotion && emotion.emotion !== "neutral") {
			const tone = {
				warm: "استخدم نبرة دافئة ومتفهمة",
				empathetic: "استخدم نبرة متعاطفة وهادئة",
				calm: "استخدم نبرة هادئة ومريحة",
				cheerful: "شاركه فرحته بنبرة مبهجة",
				neutral: ""
			}[emotion.suggestedTone];
			if (tone) lines.push(`المستخدم يبدو ${emotion.emotion}؛ ${tone}.`);
		}
		lines.push(`أعد دائماً JSON فقط بالشكل: {"speech":"...","intent":"greeting|smalltalk|question|reminder|weather|calendar|search|smart_home|memory_store|memory_recall|unknown","memories":[{"key":"...","value":"...","kind":"profile|preference|habit|fact|event"}]}`, "ضع في memories فقط المعلومات الشخصية الجديدة الجديرة بالحفظ الدائم؛ خلاف ذلك اتركها فارغة.");
		return lines.join("\n");
	}
};
new PersonalityEngine();
/**
* NicoBrain — the agent orchestrator.
*
* Pipeline:
*   Input → Conversation Manager → Intent Engine → Memory Retrieval
*   → Reasoning → Personality → Response → Voice → Memory Update
*/
var NicoBrain = class {
	deps;
	conversation;
	intents = new AdvancedIntentEngine();
	planner;
	reasoningLayer;
	reasoning;
	responses = new ResponseComposer();
	personality = new PersonalityEngine();
	emotion = new EmotionAnalyzer();
	learning;
	turnCount = 0;
	constructor(deps, reasoning = new ReasoningEngine()) {
		this.deps = deps;
		this.conversation = new ConversationEngine(deps.memory.profile.data.isGuest);
		this.planner = new TaskPlanner(deps.skills, this.intents);
		this.reasoningLayer = new ReasoningLayer(deps.permissions, deps.skills);
		this.reasoning = reasoning;
		this.learning = new LearningEngine(deps.memory.profile);
	}
	/** Handle management-style commands locally without hitting the model. */
	handleManagement(text) {
		const t = text.trim();
		if (/^(ماذا تتذكر|شو تعرف|ماذا تعرف|what do you (know|remember))/i.test(t)) {
			const lines = this.deps.memory.describeAll();
			if (!lines.length) return "ما عندي شي محفوظ عنك بعد.";
			return "هذا اللي أتذكره: " + lines.slice(0, 8).join("؛ ") + ".";
		}
		if (/^(نعم احفظ|احفظها|أوكي احفظ|yes save|save it)/i.test(t)) {
			const pending = this.deps.memory.pendingMemories().at(-1);
			if (!pending) return "ما عندي شي بانتظار الحفظ.";
			this.deps.memory.confirmPending(pending.id);
			return "تمام، حفظتها.";
		}
		if (/^(لا لا تحفظ|تجاهل|don'?t save|skip)/i.test(t)) {
			const pending = this.deps.memory.pendingMemories().at(-1);
			if (pending) this.deps.memory.rejectPending(pending.id);
			return "تمام، ما رح أحفظها.";
		}
		const rename = t.match(/(?:غير اسمي إلى|اسمي الجديد|change my name to)\s+([\u0600-\u06FFA-Za-z]+)/i);
		if (rename) {
			this.deps.memory.profile.update({ name: rename[1] });
			return `تمام، رح أناديك ${rename[1]}.`;
		}
		const forget = t.match(/(?:انس|امسح|احذف|forget)\s+(.+)/i);
		if (forget) {
			const removed = this.deps.memory.forget(forget[1]);
			return removed ? `نسيت ${removed} معلومة تخص "${forget[1]}".` : `ما لقيت شي محفوظ عن "${forget[1]}".`;
		}
		return null;
	}
	async handle(transcript) {
		const startedAt = Date.now();
		const { memory, skills } = this.deps;
		const reference = this.conversation.beginTurn(transcript);
		const utterance = reference.text;
		const intent = this.intents.classify(utterance, { isReference: reference.resolved });
		this.conversation.trackTopic(intent.name, intent.entities);
		const userTurn = {
			id: crypto.randomUUID(),
			role: "user",
			content: transcript,
			createdAt: Date.now(),
			intent: intent.name
		};
		memory.observe(userTurn);
		this.conversation.record(userTurn);
		const emotion = this.emotion.detect(utterance);
		const learning = this.learning.observe(utterance);
		const ingest = memory.ingest(utterance);
		const managed = this.handleManagement(utterance);
		if (managed) {
			const spoken = managed;
			const nicoTurn = {
				id: crypto.randomUUID(),
				role: "nico",
				content: spoken,
				createdAt: Date.now(),
				intent: intent.name
			};
			memory.observe(nicoTurn);
			this.conversation.record(nicoTurn);
			this.turnCount++;
			return {
				transcript,
				intent,
				plan: {
					steps: [],
					requiresMemory: true,
					requiresPermissions: []
				},
				speech: spoken,
				skillResults: [],
				memoriesWritten: 0,
				emotion,
				learning: learning.change,
				pendingConfirmationId: ingest.pending?.id,
				trace: {
					sessionId: this.conversation.session.id(),
					reference,
					intent,
					decision: {
						plan: {
							id: "mgmt",
							goal: "memory_mgmt",
							steps: [],
							requiresMemory: true,
							requiresPermissions: []
						},
						executable: [],
						blocked: [],
						needsMemoryRecall: true,
						needsMemoryWrite: false,
						needsModel: false,
						style: "brief",
						rationale: ["management_command"]
					},
					executions: [],
					memoriesWritten: 0,
					durationMs: Date.now() - startedAt
				}
			};
		}
		const plan = this.planner.plan(intent);
		const decision = this.reasoningLayer.decide({
			intent,
			plan,
			hasMemory: memory.longTerm.all().length > 0
		});
		const executions = [];
		const skillResults = [];
		const completed = /* @__PURE__ */ new Set();
		for (const step of decision.executable) {
			if (!step.dependsOn.every((d) => completed.has(d))) continue;
			const skill = skills.get(step.skill);
			if (!skill) continue;
			const result = await skill.execute({
				intent,
				step,
				profile: memory.profile.data,
				recall: (q) => memory.recall(q),
				remember: (r) => void memory.remember(r),
				hasPermission: (p) => this.deps.permissions.isGranted(p)
			});
			if (result.ok) {
				completed.add(step.id);
				this.conversation.context.rememberAction(step.skill, step.input);
			}
			executions.push({
				stepId: step.id,
				skill: step.skill,
				result
			});
			skillResults.push(result);
		}
		for (const b of decision.blocked) skillResults.push({
			ok: false,
			speech: `أحتاج إذن ${b.missing.join(", ")} حتى أقدر أنفذ هذا الطلب.`,
			error: "permission_denied"
		});
		let reasoningSpeech = "";
		let memoriesWritten = ingest.stored ? 1 : 0;
		if (decision.needsModel) try {
			const out = await this.reasoning.reason({
				transcript: this.reasoningLayer.sanitize(utterance),
				history: this.conversation.memory.history(),
				memoryDigest: [memory.digest(), this.conversation.context.digest()].filter(Boolean).join("\n"),
				skillFindings: skillResults.filter((r) => r.ok).map((r) => r.speech),
				userName: memory.profile.data.preferredName ?? memory.profile.data.name,
				systemPrompt: this.personality.buildSystemPrompt(memory.profile.data, emotion)
			});
			reasoningSpeech = out.speech;
			for (const m of out.memories) {
				if (!memory.intelligence.analyze(m.value).shouldConsider) continue;
				if (memory.remember(m)) memoriesWritten++;
				if (m.kind === "profile" && /اسم|name/i.test(m.key)) memory.profile.update({ name: m.value });
			}
		} catch {
			reasoningSpeech = skillResults.some((r) => r.ok) ? "" : "ما قدرت أوصل لعقلي الآن، جرّب مرة ثانية بعد لحظات.";
		}
		if (ingest.pending && !reasoningSpeech) reasoningSpeech = `تبي أحفظ: "${ingest.pending.analysis.suggestion?.value}"؟ قل "نعم احفظ" لأخزنها.`;
		const spoken = this.responses.compose({
			intent,
			decision,
			reasoning: reasoningSpeech,
			skillResults,
			firstTurn: this.turnCount === 0,
			userName: memory.profile.data.preferredName ?? memory.profile.data.name,
			referenceNote: reference.note
		});
		this.turnCount++;
		const nicoTurn = {
			id: crypto.randomUUID(),
			role: "nico",
			content: spoken.speech,
			createdAt: Date.now(),
			intent: intent.name
		};
		memory.observe(nicoTurn);
		this.conversation.record(nicoTurn);
		return {
			transcript,
			intent,
			plan: {
				steps: plan.steps,
				requiresMemory: plan.requiresMemory,
				requiresPermissions: plan.requiresPermissions
			},
			speech: spoken.speech,
			skillResults,
			memoriesWritten,
			emotion,
			learning: learning.change,
			pendingConfirmationId: ingest.pending?.id,
			trace: {
				sessionId: this.conversation.session.id(),
				reference,
				intent,
				decision,
				executions,
				memoriesWritten,
				durationMs: Date.now() - startedAt
			}
		};
	}
};
var STORAGE_KEY = "nico.ltm.v1";
/**
* Durable memory. Backed by localStorage in the browser today; the same
* interface is implemented by the SQLite/Postgres adapter on the server.
*/
var LongTermMemory = class {
	persistent;
	records = [];
	constructor(persistent = true) {
		this.persistent = persistent;
		this.load();
	}
	load() {
		if (!this.persistent || typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) this.records = JSON.parse(raw);
		} catch {
			this.records = [];
		}
	}
	save() {
		if (!this.persistent || typeof window === "undefined") return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
		} catch {}
	}
	all() {
		return [...this.records].sort((a, b) => b.score - a.score);
	}
	write(record) {
		const existing = this.records.find((r) => r.key === record.key);
		if (existing) {
			existing.value = record.value;
			existing.score += 1;
			this.save();
			return existing;
		}
		const created = {
			...record,
			id: crypto.randomUUID(),
			createdAt: Date.now(),
			score: 1
		};
		this.records.push(created);
		this.save();
		return created;
	}
	search(query, limit = 5) {
		const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
		return this.records.map((r) => {
			const hay = `${r.key} ${r.value}`.toLowerCase();
			return {
				r,
				hits: tokens.filter((t) => hay.includes(t)).length
			};
		}).filter((x) => x.hits > 0).sort((a, b) => b.hits - a.hits || b.r.score - a.r.score).slice(0, limit).map((x) => x.r);
	}
	forget(id) {
		this.records = this.records.filter((r) => r.id !== id);
		this.save();
	}
	clear() {
		this.records = [];
		this.save();
	}
};
/**
* Volatile working memory: last turns + current context slots.
* Never persisted for guests, mirrored to storage for signed-in profiles.
*/
var ShortTermMemory = class {
	windowSize;
	turns = [];
	slots = /* @__PURE__ */ new Map();
	constructor(windowSize = 12) {
		this.windowSize = windowSize;
	}
	push(turn) {
		this.turns.push(turn);
		if (this.turns.length > this.windowSize) this.turns = this.turns.slice(-this.windowSize);
	}
	history() {
		return [...this.turns];
	}
	setSlot(key, value) {
		this.slots.set(key, value);
	}
	getSlot(key) {
		return this.slots.get(key);
	}
	context() {
		return this.turns.map((t) => `${t.role === "user" ? "المستخدم" : "نيكو"}: ${t.content}`).join("\n");
	}
	clear() {
		this.turns = [];
		this.slots.clear();
	}
};
var KEY$4 = "nico.profile.v1";
var DEFAULT_PERSONALITY = {
	traits: [
		"friendly",
		"helpful",
		"respectful"
	],
	tone: "friendly",
	verbosity: "concise",
	respectful: true
};
function defaults() {
	return {
		id: crypto.randomUUID(),
		locale: "ar",
		voice: "alloy",
		isGuest: true,
		createdAt: Date.now(),
		preferences: {},
		interests: [],
		importantDates: [],
		communicationStyle: "concise",
		personality: { ...DEFAULT_PERSONALITY }
	};
}
var UserProfile = class {
	data;
	constructor(seed) {
		this.data = {
			...defaults(),
			...seed
		};
		this.load();
	}
	load() {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(KEY$4);
			if (raw) {
				const parsed = JSON.parse(raw);
				this.data = {
					...this.data,
					...parsed,
					preferences: {
						...this.data.preferences,
						...parsed.preferences ?? {}
					},
					interests: parsed.interests ?? this.data.interests,
					importantDates: parsed.importantDates ?? this.data.importantDates,
					personality: {
						...this.data.personality,
						...parsed.personality ?? {}
					}
				};
			}
		} catch {}
	}
	persist() {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(KEY$4, JSON.stringify(this.data));
		} catch {}
	}
	update(patch) {
		this.data = {
			...this.data,
			...patch,
			preferences: {
				...this.data.preferences,
				...patch.preferences ?? {}
			},
			personality: {
				...this.data.personality,
				...patch.personality ?? {}
			}
		};
		this.persist();
		return this.data;
	}
	setPreference(key, value) {
		this.data.preferences[key] = value;
		this.persist();
	}
	addInterest(interest) {
		const norm = interest.trim();
		if (!norm) return;
		if (!this.data.interests.includes(norm)) {
			this.data.interests.push(norm);
			this.persist();
		}
	}
	addImportantDate(entry) {
		this.data.importantDates.push(entry);
		this.persist();
	}
	setCommunicationStyle(style) {
		this.data.communicationStyle = style;
		this.data.personality.verbosity = style;
		this.persist();
	}
	register(name) {
		this.data.isGuest = false;
		if (name) this.data.name = name;
		this.persist();
	}
	reset() {
		this.data = defaults();
		this.persist();
	}
};
var NAME_RE = /(?:اسمي|أنا اسمي|my name is|call me)\s+([\u0600-\u06FFA-Za-z]+)/i;
var CALL_ME_RE = /(?:نادني(?:\s+يا)?|call me)\s+([\u0600-\u06FFA-Za-z]+)/i;
var EXPLICIT_STORE_RE = /(?:^|\b)(?:احفظ|خزن|تذكر أن|remember that|save that|ملاحظة)\b/i;
var PREFERENCE_RE = /(?:أحب|احب|أفضل|افضل|أكره|اكره|i (?:like|love|prefer|hate))/i;
var INTEREST_RE = /(?:هوايتي|اهتمامي|مهتم ب|i'?m interested in)/i;
var HABIT_RE = /(?:عادتي|دائماً|كل يوم|every day|usually|i always)/i;
var DATE_RE = /(?:عيد ميلادي|ذكرى|موعد مهم|my birthday|anniversary)/i;
var TRANSIENT_RE = /(?:الجو|الطقس|weather|الساعة الآن|what time is it|كم الساعة|أخبار اليوم)/i;
/**
* Memory Intelligence Engine.
*
* Analyzes a user utterance BEFORE writing to memory:
*  - decides whether it is worth keeping,
*  - sets its importance and retention,
*  - flags when the user's explicit confirmation is required.
*/
var MemoryIntelligence = class {
	analyze(utterance) {
		const text = utterance.trim();
		if (!text) return {
			shouldConsider: false,
			needsConfirmation: false,
			importance: "low",
			retention: "session",
			reason: "empty"
		};
		const nameMatch = text.match(NAME_RE);
		if (nameMatch) return {
			shouldConsider: true,
			needsConfirmation: false,
			importance: "high",
			retention: "permanent",
			suggestion: {
				key: "name",
				value: nameMatch[1],
				kind: "profile"
			},
			profilePatch: { name: nameMatch[1] },
			reason: "identity"
		};
		const callMe = text.match(CALL_ME_RE);
		if (callMe) return {
			shouldConsider: true,
			needsConfirmation: false,
			importance: "high",
			retention: "permanent",
			suggestion: {
				key: "preferredName",
				value: callMe[1],
				kind: "profile"
			},
			profilePatch: { preferredName: callMe[1] },
			reason: "preferred_name"
		};
		if (TRANSIENT_RE.test(text)) return {
			shouldConsider: false,
			needsConfirmation: false,
			importance: "low",
			retention: "session",
			reason: "transient"
		};
		if (EXPLICIT_STORE_RE.test(text)) {
			const value = text.replace(EXPLICIT_STORE_RE, "").trim() || text;
			return {
				shouldConsider: true,
				needsConfirmation: true,
				importance: "high",
				retention: "long",
				suggestion: {
					key: value.split(/\s+/).slice(0, 4).join(" "),
					value,
					kind: "fact"
				},
				reason: "explicit_store"
			};
		}
		if (PREFERENCE_RE.test(text)) return {
			shouldConsider: true,
			needsConfirmation: true,
			importance: "medium",
			retention: "long",
			suggestion: {
				key: text.split(/\s+/).slice(0, 4).join(" "),
				value: text,
				kind: "preference"
			},
			reason: "preference"
		};
		if (INTEREST_RE.test(text)) return {
			shouldConsider: true,
			needsConfirmation: false,
			importance: "medium",
			retention: "long",
			suggestion: {
				key: "interest",
				value: text,
				kind: "fact"
			},
			reason: "interest"
		};
		if (HABIT_RE.test(text)) return {
			shouldConsider: true,
			needsConfirmation: false,
			importance: "medium",
			retention: "long",
			suggestion: {
				key: "habit",
				value: text,
				kind: "habit"
			},
			reason: "habit"
		};
		if (DATE_RE.test(text)) return {
			shouldConsider: true,
			needsConfirmation: true,
			importance: "high",
			retention: "permanent",
			suggestion: {
				key: "date",
				value: text,
				kind: "event"
			},
			reason: "important_date"
		};
		return {
			shouldConsider: false,
			needsConfirmation: false,
			importance: "low",
			retention: "session",
			reason: "no_signal"
		};
	}
};
var IMPORTANCE_WEIGHT = {
	low: 1,
	medium: 2.5,
	high: 5
};
var DAY = 864e5;
/**
* Memory Ranking & Compression.
*
* Ranking  — importance × reinforcement × recency decay.
* Scoring  — turns raw text into an importance grade.
* Compress — collapses duplicates/low-value records.
* Summary  — turns a long conversation into a few durable lines.
*/
var MemoryRanking = class {
	/** Score a candidate memory before it is written. */
	score(value, kind) {
		if (kind === "profile") return "high";
		const text = value.trim();
		if (/(عيد ميلاد|زوجت|زوجي|ابني|ابنتي|حساسية|دوائي|عملي|وظيفتي|birthday|allergy)/i.test(text)) return "high";
		if (kind === "preference" || kind === "habit") return "medium";
		if (text.length < 12) return "low";
		return "medium";
	}
	rank(records, now = Date.now()) {
		return records.map((r) => {
			const recency = 1 / (1 + Math.max(0, (now - r.createdAt) / DAY) / 30);
			const rank = IMPORTANCE_WEIGHT[r.importance ?? "medium"] * (r.retention === "permanent" ? 1.5 : r.retention === "long" ? 1.2 : 1) * (1 + Math.log1p(r.score)) * (.4 + .6 * recency);
			return {
				...r,
				rank: Number(rank.toFixed(3))
			};
		}).sort((a, b) => b.rank - a.rank);
	}
	top(records, limit = 10) {
		return this.rank(records).slice(0, limit);
	}
	/**
	* Returns the ids that should be dropped: duplicates by key, expired
	* records, and low-importance short-retention records older than 30 days.
	*/
	compress(records, now = Date.now()) {
		const seen = /* @__PURE__ */ new Set();
		const keep = [];
		const drop = [];
		for (const r of this.rank(records, now)) {
			const dupKey = `${r.kind}:${r.key.toLowerCase()}`;
			const expired = r.expiresAt ? r.expiresAt < now : false;
			const stale = (r.importance ?? "medium") === "low" && r.retention !== "permanent" && now - r.createdAt > 30 * DAY;
			if (seen.has(dupKey) || expired || stale) {
				drop.push(r.id);
				continue;
			}
			seen.add(dupKey);
			const { rank: _rank, ...rest } = r;
			keep.push(rest);
		}
		return {
			keep,
			drop
		};
	}
	/** Compresses a long conversation into a handful of durable lines. */
	summarize(turns, maxLines = 5) {
		const userLines = turns.filter((t) => t.role === "user" && t.content.trim().length > 8).map((t) => t.content.trim());
		if (!userLines.length) return [];
		const scored = userLines.map((line) => ({
			line,
			weight: (/(اسمي|أحب|احب|أكره|اكره|أفضل|افضل|عملي|أهتم|هوايتي|my name|i like|i prefer)/i.test(line) ? 3 : 1) + Math.min(2, line.length / 80)
		})).sort((a, b) => b.weight - a.weight);
		const unique = [];
		for (const s of scored) {
			if (unique.some((u) => u.slice(0, 24) === s.line.slice(0, 24))) continue;
			unique.push(s.line.length > 140 ? `${s.line.slice(0, 140)}…` : s.line);
			if (unique.length >= maxLines) break;
		}
		return unique;
	}
};
var memoryRanking = new MemoryRanking();
/**
* Decides WHAT is stored, WHERE it lives, and WHEN it is recalled.
* Uses MemoryIntelligence to filter what deserves long-term storage
* and to gate on user confirmation when needed.
*/
var MemoryManager = class {
	shortTerm;
	longTerm;
	profile;
	intelligence = new MemoryIntelligence();
	ranking = memoryRanking;
	pending = [];
	summaryLines = [];
	constructor(profile = new UserProfile()) {
		this.profile = profile;
		this.shortTerm = new ShortTermMemory();
		this.longTerm = new LongTermMemory(!profile.data.isGuest);
	}
	observe(turn) {
		this.shortTerm.push(turn);
	}
	/**
	* Analyze a raw user utterance and either store, queue for confirmation,
	* or ignore it. Returns the resulting analysis for the pipeline.
	*/
	ingest(utterance) {
		const analysis = this.intelligence.analyze(utterance);
		if (analysis.profilePatch) this.profile.update(analysis.profilePatch);
		if (!analysis.shouldConsider || !analysis.suggestion) return { analysis };
		if (analysis.needsConfirmation) {
			const pending = {
				id: crypto.randomUUID(),
				analysis,
				createdAt: Date.now()
			};
			this.pending.push(pending);
			return {
				analysis,
				pending
			};
		}
		return {
			analysis,
			stored: this.remember({
				key: analysis.suggestion.key,
				value: analysis.suggestion.value,
				kind: analysis.suggestion.kind,
				importance: analysis.importance,
				retention: analysis.retention
			}) ?? void 0
		};
	}
	pendingMemories() {
		return [...this.pending];
	}
	confirmPending(id) {
		const idx = this.pending.findIndex((p) => p.id === id);
		if (idx < 0) return null;
		const [p] = this.pending.splice(idx, 1);
		if (!p.analysis.suggestion) return null;
		return this.remember({
			key: p.analysis.suggestion.key,
			value: p.analysis.suggestion.value,
			kind: p.analysis.suggestion.kind,
			importance: p.analysis.importance,
			retention: p.analysis.retention
		});
	}
	rejectPending(id) {
		const before = this.pending.length;
		this.pending = this.pending.filter((p) => p.id !== id);
		return this.pending.length !== before;
	}
	remember(record) {
		if (this.profile.data.isGuest && record.kind !== "profile") {
			this.shortTerm.setSlot(record.key, record.value);
			return null;
		}
		return this.longTerm.write({
			...record,
			importance: record.importance ?? this.ranking.score(record.value, record.kind)
		});
	}
	recall(query) {
		return this.longTerm.search(query);
	}
	/** Memories ordered by importance × reinforcement × recency. */
	ranked(limit = 10) {
		return this.ranking.top(this.longTerm.all(), limit);
	}
	/**
	* Memory compression — drops duplicates, expired and stale low-value
	* records. Returns how many were removed.
	*/
	compress() {
		const { drop } = this.ranking.compress(this.longTerm.all());
		drop.forEach((id) => this.longTerm.forget(id));
		return drop.length;
	}
	/**
	* Summarizes the current short-term conversation into durable lines and
	* keeps them as the running memory summary.
	*/
	summarizeSession(maxLines = 5) {
		const lines = this.ranking.summarize(this.shortTerm.history(), maxLines);
		if (lines.length) this.summaryLines = lines;
		return lines;
	}
	/** Short human summary of what Nico durably knows. */
	summary() {
		return [...this.ranked(5).map((r) => `${r.key}: ${r.value}`), ...this.summaryLines];
	}
	/** List everything Nico remembers about the user (profile + LTM). */
	describeAll() {
		const p = this.profile.data;
		const lines = [];
		if (p.name) lines.push(`اسمك ${p.name}`);
		if (p.preferredName && p.preferredName !== p.name) lines.push(`تحب أن أناديك ${p.preferredName}`);
		if (p.interests.length) lines.push(`اهتماماتك: ${p.interests.join("، ")}`);
		for (const [k, v] of Object.entries(p.preferences)) lines.push(`${k}: ${v}`);
		for (const d of p.importantDates) lines.push(`${d.label}: ${d.date}`);
		for (const r of this.longTerm.all().slice(0, 10)) lines.push(`- ${r.value}`);
		return lines;
	}
	/** Forget memory records matching a query. Returns count removed. */
	forget(query) {
		const targets = this.longTerm.search(query, 20);
		for (const t of targets) this.longTerm.forget(t.id);
		return targets.length;
	}
	digest() {
		const p = this.profile.data;
		const lines = this.ranked(12).map((r) => `- ${r.key}: ${r.value}`);
		if (p.name) lines.unshift(`- الاسم: ${p.name}`);
		if (p.preferredName) lines.unshift(`- ينادى بـ: ${p.preferredName}`);
		if (p.interests.length) lines.unshift(`- اهتمامات: ${p.interests.join("، ")}`);
		if (p.communicationStyle) lines.unshift(`- أسلوب مفضّل: ${p.communicationStyle}`);
		return lines.join("\n");
	}
	forgetAll() {
		this.shortTerm.clear();
		this.longTerm.clear();
		this.pending = [];
	}
};
/**
* PluginSystem — the extension boundary.
* Third-party skills register here; the brain is never modified.
*/
var PluginSystem = class {
	plugins = /* @__PURE__ */ new Map();
	listeners = /* @__PURE__ */ new Set();
	register(skill) {
		if (this.plugins.has(skill.id)) throw new Error(`Skill "${skill.id}" is already registered`);
		this.plugins.set(skill.id, skill);
		this.emit();
		return () => this.unregister(skill.id);
	}
	registerAll(skills) {
		skills.forEach((s) => {
			if (!this.plugins.has(s.id)) this.plugins.set(s.id, s);
		});
		this.emit();
	}
	unregister(id) {
		this.plugins.delete(id);
		this.emit();
	}
	get(id) {
		return this.plugins.get(id);
	}
	list() {
		return [...this.plugins.values()];
	}
	forIntent(intent) {
		return this.list().filter((s) => s.intents.includes(intent));
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	emit() {
		const snapshot = this.list();
		this.listeners.forEach((l) => l(snapshot));
	}
};
var CODE_AR = {
	0: "صافي",
	1: "صافي جزئياً",
	2: "غائم جزئياً",
	3: "غائم",
	45: "ضباب",
	48: "ضباب كثيف",
	51: "رذاذ خفيف",
	61: "مطر خفيف",
	63: "مطر",
	65: "مطر غزير",
	71: "ثلج خفيف",
	80: "زخات مطر",
	95: "عاصفة رعدية"
};
var describe = (code) => CODE_AR[code] ?? "متقلب";
/**
* Live weather + multi-day forecast via Open-Meteo (keyless).
* Uses device location when the user granted the permission.
*/
var WeatherSkill = {
	id: "weather",
	name: "الطقس",
	description: "يجلب حالة الطقس الحالية وتوقعات الأيام القادمة",
	intents: ["weather"],
	permissions: ["location"],
	category: "معلومات",
	async execute({ intent }) {
		const coords = await getCoords();
		if (!coords) return {
			ok: false,
			speech: "",
			error: "no_location"
		};
		const wantsForecast = /غدا|غداً|بكرة|الأيام|الاسبوع|الأسبوع|توقع|forecast|tomorrow|week/i.test(intent.raw);
		try {
			const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=4&timezone=auto`);
			if (!res.ok) throw new Error(String(res.status));
			const data = await res.json();
			const current = `الطقس عندك الآن ${describe(data.current.weather_code)}، ${Math.round(data.current.temperature_2m)} درجة والرياح ${Math.round(data.current.wind_speed_10m)} كم بالساعة.`;
			if (!wantsForecast || !data.daily) return {
				ok: true,
				speech: current,
				data: data.current
			};
			const days = data.daily.time.slice(1, 4).map((iso, i) => {
				return `${new Date(iso).toLocaleDateString("ar", { weekday: "long" })}: ${describe(data.daily.weather_code[i + 1])} بين ${Math.round(data.daily.temperature_2m_min[i + 1])} و${Math.round(data.daily.temperature_2m_max[i + 1])} درجة`;
			});
			return {
				ok: true,
				speech: `${current} التوقعات: ${days.join("، ")}.`,
				data: {
					current: data.current,
					days: days.length
				}
			};
		} catch (e) {
			return {
				ok: false,
				speech: "",
				error: String(e)
			};
		}
	}
};
function getCoords() {
	if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);
	return new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition((p) => resolve({
			lat: p.coords.latitude,
			lon: p.coords.longitude
		}), () => resolve(null), { timeout: 6e3 });
	});
}
/** Generic time-based task store shared by reminders and calendar. */
var Scheduler = class {
	tasks = [];
	listeners = /* @__PURE__ */ new Set();
	timer = null;
	schedule(title, minutesFromNow) {
		const task = {
			id: crypto.randomUUID(),
			title: title.trim() || "مهمة",
			dueAt: Date.now() + minutesFromNow * 6e4,
			done: false
		};
		this.tasks.push(task);
		this.emit();
		return task;
	}
	upcoming() {
		return this.tasks.filter((t) => !t.done).sort((a, b) => a.dueAt - b.dueAt);
	}
	complete(id) {
		const t = this.tasks.find((x) => x.id === id);
		if (t) t.done = true;
		this.emit();
	}
	remove(id) {
		this.tasks = this.tasks.filter((t) => t.id !== id);
		this.emit();
	}
	subscribe(fn) {
		this.listeners.add(fn);
		fn(this.upcoming());
		if (!this.timer && typeof window !== "undefined") this.timer = setInterval(() => this.tick(), 15e3);
		return () => {
			this.listeners.delete(fn);
			if (!this.listeners.size && this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		};
	}
	tick() {
		const due = this.tasks.filter((t) => !t.done && t.dueAt <= Date.now());
		if (due.length) {
			due.forEach((t) => this.onDue(t));
			this.emit();
		}
	}
	onDue(task) {
		task.done = true;
	}
	emit() {
		const snapshot = this.upcoming();
		this.listeners.forEach((l) => l(snapshot));
	}
};
var scheduler = new Scheduler();
var CalendarSkill = {
	id: "calendar",
	name: "التقويم",
	description: "يقرأ ويضيف المواعيد في تقويم نيكو المحلي",
	intents: ["calendar"],
	async execute({ intent }) {
		const upcoming = scheduler.upcoming();
		if (/أضف|احجز|سجل|add/i.test(intent.raw)) {
			const task = scheduler.schedule(intent.raw.replace(/^.*?(أضف|احجز|سجل)\s*/i, ""), 60);
			return {
				ok: true,
				speech: `سجّلت الموعد "${task.title}".`,
				data: { id: task.id }
			};
		}
		if (!upcoming.length) return {
			ok: true,
			speech: "ما عندك مواعيد قادمة."
		};
		return {
			ok: true,
			speech: `عندك ${upcoming.length} موعد قادم، أقربها ${upcoming[0].title}.`,
			data: { count: upcoming.length }
		};
	}
};
/** Scheduler specialization that notifies (and speaks) when a task is due. */
var ReminderEngine = class extends Scheduler {
	speak = null;
	bindVoice(speak) {
		this.speak = speak;
	}
	create(title, minutes) {
		return this.schedule(title, minutes);
	}
	onDue(task) {
		task.done = true;
		const message = `تذكير: ${task.title}`;
		if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification("نيكو", { body: message });
		this.speak?.(message);
	}
};
var reminderEngine = new ReminderEngine();
/** Creates reminders from relative ("بعد 10 دقائق") or absolute ("غداً الساعة 8") time. */
var ReminderSkill = {
	id: "reminder",
	name: "التذكيرات",
	description: "ينشئ تذكيرات بوقت محدد وينبّه المستخدم",
	intents: ["reminder"],
	permissions: ["notifications"],
	category: "إنتاجية",
	async execute({ intent }) {
		const parsed = parseWhen(intent.raw);
		const fallbackAmount = Number(intent.entities.amount ?? 10);
		const unit = intent.entities.unit ?? "دقيقة";
		const minutes = parsed ? parsed.minutesFromNow : /ساع|hour/i.test(unit) ? fallbackAmount * 60 : fallbackAmount;
		const title = intent.raw.replace(/ذكرني|تذكير|remind me/gi, "").replace(/(?:بعد|خلال|in)\s+\d+\s*\S+/i, "").replace(/(?:غدا|غداً|بكرة|بكره|اليوم|tomorrow|today)/gi, "").replace(/(?:الساعة|الساعه|at)\s*\d{1,2}(?::\d{2})?\s*(?:ص|م|صباحا|مساء|am|pm)?/gi, "").replace(/^\s*(ب|أن|ان|to)\s*/i, "").trim();
		const task = reminderEngine.create(title || "تذكير", minutes);
		const when = parsed ? parsed.label : `بعد ${minutes} دقيقة`;
		return {
			ok: true,
			speech: `تمام، بذكرك بـ"${task.title}" ${when}.`,
			data: {
				id: task.id,
				dueAt: task.dueAt,
				when
			}
		};
	}
};
/** Keyless knowledge lookup used to ground answers before reasoning. */
var SearchSkill = {
	id: "search",
	name: "البحث",
	description: "يبحث عن معلومة عامة ويعيد ملخصاً قصيراً",
	intents: ["search"],
	async execute({ intent }) {
		const query = intent.raw.replace(/ابحث\s*(عن|لي)?/i, "").replace(/search( for)?/i, "").trim();
		if (!query) return {
			ok: false,
			speech: "",
			error: "empty_query"
		};
		try {
			const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
			if (!res.ok) throw new Error(String(res.status));
			const data = await res.json();
			if (!data.AbstractText) return {
				ok: false,
				speech: "",
				error: "no_result"
			};
			return {
				ok: true,
				speech: data.AbstractText.slice(0, 300),
				data: { query }
			};
		} catch (e) {
			return {
				ok: false,
				speech: "",
				error: String(e)
			};
		}
	}
};
/**
* Device + rule state for automations. Swappable for a real hub adapter
* (Home Assistant, Matter) without touching skills.
*/
var AutomationEngine = class {
	devices = /* @__PURE__ */ new Map();
	rules = [];
	listeners = /* @__PURE__ */ new Set();
	setDevice(name, on) {
		this.devices.set(name, on);
		this.listeners.forEach((l) => l());
	}
	deviceState() {
		return [...this.devices.entries()].map(([name, on]) => ({
			name,
			on
		}));
	}
	addRule(when, then) {
		const rule = {
			id: crypto.randomUUID(),
			when,
			then,
			enabled: true
		};
		this.rules.push(rule);
		this.listeners.forEach((l) => l());
		return rule;
	}
	listRules() {
		return [...this.rules];
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
};
var automationEngine = new AutomationEngine();
var SmartHomeSkill = {
	id: "smart_home",
	name: "المنزل الذكي",
	description: "يتحكم بأجهزة المنزل عبر محرك الأتمتة",
	intents: ["smart_home"],
	permissions: ["files"],
	async execute({ intent }) {
		const on = /شغل|افتح|turn on/i.test(intent.raw);
		const device = /مكيف|ac/i.test(intent.raw) ? "المكيف" : "الإضاءة";
		automationEngine.setDevice(device, on);
		return {
			ok: true,
			speech: `${on ? "شغّلت" : "أطفأت"} ${device}.`,
			data: {
				device,
				on
			}
		};
	}
};
var MemorySkill = {
	id: "memory",
	name: "الذاكرة",
	description: "يحفظ ويسترجع المعلومات الشخصية بناءً على طلب المستخدم",
	intents: ["memory_store", "memory_recall"],
	async execute({ intent, recall, remember }) {
		if (intent.name === "memory_store") {
			const value = intent.raw.replace(/تذكر أن|احفظ|خزن|remember that/gi, "").trim();
			if (!value) return {
				ok: false,
				speech: "",
				error: "empty"
			};
			remember({
				key: value.split(/\s+/).slice(0, 4).join(" "),
				value,
				kind: "fact"
			});
			return {
				ok: true,
				speech: "حفظتها في ذاكرتي."
			};
		}
		const hits = recall(intent.raw);
		if (!hits.length) return {
			ok: false,
			speech: "",
			error: "no_memory"
		};
		return {
			ok: true,
			speech: hits.map((h) => h.value).join("، ") + "."
		};
	}
};
var KEY$3 = "nico.notes.v1";
/**
* Local-first note storage. Signed-in users mirror notes into the cloud
* memory table through MemoryManager; guests keep them on-device only.
*/
var NotesStore = class {
	notes = [];
	listeners = /* @__PURE__ */ new Set();
	constructor() {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(KEY$3);
			if (raw) this.notes = JSON.parse(raw);
		} catch {
			this.notes = [];
		}
	}
	persist() {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(KEY$3, JSON.stringify(this.notes));
		} catch {}
		const snapshot = this.all();
		this.listeners.forEach((l) => l(snapshot));
	}
	add(text, source = "voice") {
		const note = {
			id: crypto.randomUUID(),
			text: text.trim(),
			createdAt: Date.now(),
			source
		};
		this.notes.unshift(note);
		this.persist();
		return note;
	}
	all() {
		return [...this.notes];
	}
	search(query, limit = 5) {
		const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
		if (!tokens.length) return this.all().slice(0, limit);
		return this.notes.map((n) => ({
			n,
			hits: tokens.filter((t) => n.text.toLowerCase().includes(t)).length
		})).filter((x) => x.hits > 0).sort((a, b) => b.hits - a.hits).slice(0, limit).map((x) => x.n);
	}
	remove(id) {
		this.notes = this.notes.filter((n) => n.id !== id);
		this.persist();
	}
	removeMatching(query) {
		const targets = this.search(query, 20);
		const ids = new Set(targets.map((t) => t.id));
		this.notes = this.notes.filter((n) => !ids.has(n.id));
		this.persist();
		return ids.size;
	}
	clear() {
		this.notes = [];
		this.persist();
	}
	subscribe(fn) {
		this.listeners.add(fn);
		fn(this.all());
		return () => this.listeners.delete(fn);
	}
};
var notesStore = new NotesStore();
var DELETE_RE = /(احذف|امسح|delete|remove)/i;
var SEARCH_RE = /(ابحث|دور|اعرض|شو|ما هي|find|show|list)/i;
/** Voice notes: create, search and delete — fully on-device. */
var NotesSkill = {
	id: "notes",
	name: "الملاحظات",
	description: "ينشئ ملاحظات صوتية ويبحث فيها ويحذفها",
	intents: ["notes"],
	async execute({ intent }) {
		const raw = intent.raw.trim();
		const body = raw.replace(/(ملاحظة|ملاحظاتي|الملاحظات|note[s]?)/gi, " ").replace(DELETE_RE, " ").replace(SEARCH_RE, " ").replace(/^\s*(سجل|اكتب|أضف|اضف|add|save)\s*/i, "").trim();
		if (DELETE_RE.test(raw)) {
			if (!body) {
				const count = notesStore.all().length;
				notesStore.clear();
				return {
					ok: true,
					speech: `حذفت ${count} ملاحظة.`,
					data: { removed: count }
				};
			}
			const removed = notesStore.removeMatching(body);
			return removed ? {
				ok: true,
				speech: `حذفت ${removed} ملاحظة عن "${body}".`,
				data: { removed }
			} : {
				ok: false,
				speech: "",
				error: "no_match"
			};
		}
		if (SEARCH_RE.test(raw) || !body) {
			const hits = body ? notesStore.search(body) : notesStore.all().slice(0, 5);
			if (!hits.length) return {
				ok: false,
				speech: "",
				error: "no_notes"
			};
			return {
				ok: true,
				speech: `عندك ${hits.length} ملاحظة: ` + hits.map((n) => n.text).join("، ") + ".",
				data: { count: hits.length }
			};
		}
		const note = notesStore.add(body, "voice");
		return {
			ok: true,
			speech: `سجّلت الملاحظة: ${note.text}.`,
			data: { id: note.id }
		};
	}
};
function builtInSkills() {
	return [
		WeatherSkill,
		CalendarSkill,
		ReminderSkill,
		NotesSkill,
		SearchSkill,
		SmartHomeSkill,
		MemorySkill
	];
}
var STATE_KEY = "nico.skills.state.v1";
var USAGE_KEY = "nico.skills.usage.v1";
function load(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function save(key, value) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
/**
* SkillRegistry — enable/disable state + privacy-safe usage counters for the
* plugin platform. Stores only skill ids and counts, never user content.
*/
var SkillRegistry = class {
	enabled = load(STATE_KEY, {});
	usage = load(USAGE_KEY, {});
	listeners = /* @__PURE__ */ new Set();
	isEnabled(skill) {
		const explicit = this.enabled[skill.id];
		if (typeof explicit === "boolean") return explicit;
		return skill.enabledByDefault ?? true;
	}
	setEnabled(id, on) {
		this.enabled[id] = on;
		save(STATE_KEY, this.enabled);
		this.emit();
	}
	toggle(id, current) {
		this.setEnabled(id, !current);
	}
	record(id, ok, durationMs) {
		const entry = this.usage[id] ?? {
			runs: 0,
			failures: 0,
			totalMs: 0
		};
		entry.runs += 1;
		if (!ok) entry.failures += 1;
		entry.totalMs += Math.max(0, Math.round(durationMs));
		entry.lastRunAt = Date.now();
		this.usage[id] = entry;
		save(USAGE_KEY, this.usage);
		this.emit();
	}
	usageFor(id) {
		return this.usage[id] ?? {
			runs: 0,
			failures: 0,
			totalMs: 0
		};
	}
	allUsage() {
		return { ...this.usage };
	}
	resetUsage() {
		this.usage = {};
		save(USAGE_KEY, this.usage);
		this.emit();
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	emit() {
		this.listeners.forEach((l) => l());
	}
};
/**
* SkillManager — the plugin platform façade used by the brain.
*
* Adds on top of the raw registry:
*  - enable / disable per skill (persisted),
*  - permission declaration + runtime validation hook,
*  - usage tracking (counts only, never content),
*  - rate limiting so a looping skill cannot hammer the network.
*
* Every registered skill's `execute` is wrapped once at registration, so the
* brain calls skills exactly as before — no orchestrator changes required.
*/
var SkillManager = class {
	plugins = new PluginSystem();
	registry;
	limiter;
	constructor(skills = builtInSkills(), registry = new SkillRegistry(), limiter = new RateLimiter(20, 6e4)) {
		this.registry = registry;
		this.limiter = limiter;
		this.plugins.registerAll(skills.map((s) => this.instrument(s)));
	}
	instrument(skill) {
		if (skill.__instrumented) return skill;
		const raw = skill.execute.bind(skill);
		const wrapped = {
			...skill,
			execute: async (ctx) => {
				if (!this.registry.isEnabled(skill)) return {
					ok: false,
					speech: "",
					error: "skill_disabled"
				};
				const missing = (skill.permissions ?? []).filter((p) => !ctx.hasPermission(p));
				if (missing.length) return {
					ok: false,
					speech: "",
					error: `permission_denied:${missing.join(",")}`
				};
				if (!this.limiter.check(skill.id).allowed) return {
					ok: false,
					speech: "",
					error: "rate_limited"
				};
				const startedAt = Date.now();
				try {
					const result = await raw(ctx);
					this.registry.record(skill.id, result.ok, Date.now() - startedAt);
					return result;
				} catch (e) {
					this.registry.record(skill.id, false, Date.now() - startedAt);
					return {
						ok: false,
						speech: "",
						error: String(e)
					};
				}
			}
		};
		wrapped.__instrumented = true;
		return wrapped;
	}
	get(id) {
		return this.plugins.get(id);
	}
	/** Only enabled skills are planned against. */
	forIntent(intent) {
		return this.plugins.forIntent(intent).filter((s) => this.registry.isEnabled(s));
	}
	list() {
		return this.plugins.list();
	}
	/** UI-facing view: metadata + enabled state + usage counters. */
	describe() {
		return this.list().map((s) => ({
			id: s.id,
			name: s.name,
			description: s.description,
			intents: s.intents,
			permissions: s.permissions ?? [],
			enabled: this.registry.isEnabled(s),
			usage: this.registry.usageFor(s.id)
		}));
	}
	setEnabled(id, on) {
		this.registry.setEnabled(id, on);
	}
	isEnabled(id) {
		const skill = this.get(id);
		return skill ? this.registry.isEnabled(skill) : false;
	}
	install(skill) {
		return this.plugins.register(this.instrument(skill));
	}
	uninstall(id) {
		this.plugins.unregister(id);
	}
};
var KEY$2 = "nico.permissions.v1";
var DEFAULTS$1 = {
	microphone: "prompt",
	location: "prompt",
	files: "prompt",
	camera: "prompt",
	notifications: "prompt",
	background_audio: "prompt",
	bluetooth: "prompt",
	contacts: "prompt"
};
/** Spoken reason shown/said the moment a capability is actually needed. */
var PERMISSION_REASONS = {
	microphone: "الميكروفون — حتى أسمعك عندما تتحدث",
	location: "الموقع — لأخبرك بالطقس أو أدلّك على الطريق",
	contacts: "جهات الاتصال — عندما تطلب مني الاتصال بأحد",
	notifications: "الإشعارات — لأذكّرك في وقتها",
	camera: "الكاميرا — عند تصوير شيء تريد أن أراه",
	files: "الملفات — عند فتح أو حفظ ملف لك",
	background_audio: "الاستماع في الخلفية — لأبقى جاهزاً لكلمة «يا نيكو»",
	bluetooth: "البلوتوث — للتحكم بأجهزتك القريبة"
};
/** Which capability an intent needs, so nothing is requested up front. */
var INTENT_PERMISSIONS = {
	weather: "location",
	navigation: "location",
	location: "location",
	call: "contacts",
	contact: "contacts",
	reminder: "notifications",
	calendar: "notifications",
	smart_home: "bluetooth"
};
/** Explicit, revocable consent for every sensitive capability. */
var PermissionManager = class {
	state = { ...DEFAULTS$1 };
	listeners = /* @__PURE__ */ new Set();
	constructor() {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(KEY$2);
			if (raw) this.state = {
				...this.state,
				...JSON.parse(raw)
			};
		} catch {}
	}
	snapshot() {
		return { ...this.state };
	}
	isGranted(key) {
		return this.state[key] === "granted";
	}
	set(key, value) {
		this.state = {
			...this.state,
			[key]: value
		};
		if (typeof window !== "undefined") try {
			window.localStorage.setItem(KEY$2, JSON.stringify(this.state));
		} catch {}
		this.listeners.forEach((l) => l(this.snapshot()));
	}
	/** Requests the OS-level grant when one exists, then records the decision. */
	async request(key) {
		if (key === "microphone" && typeof navigator !== "undefined") try {
			(await navigator.mediaDevices.getUserMedia({ audio: true })).getTracks().forEach((t) => t.stop());
			this.set("microphone", "granted");
			return "granted";
		} catch {
			this.set("microphone", "denied");
			return "denied";
		}
		if (key === "notifications" && typeof Notification !== "undefined") {
			const mapped = await Notification.requestPermission() === "granted" ? "granted" : "denied";
			this.set("notifications", mapped);
			return mapped;
		}
		if (key === "location" && typeof navigator !== "undefined" && navigator.geolocation) return new Promise((resolve) => {
			navigator.geolocation.getCurrentPosition(() => {
				this.set("location", "granted");
				resolve("granted");
			}, () => {
				this.set("location", "denied");
				resolve("denied");
			});
		});
		if (key === "bluetooth") {
			const bt = navigator.bluetooth;
			if (!bt) {
				this.set("bluetooth", "denied");
				return "denied";
			}
			try {
				await bt.requestDevice({ acceptAllDevices: true });
				this.set("bluetooth", "granted");
				return "granted";
			} catch {
				this.set("bluetooth", "denied");
				return "denied";
			}
		}
		if (key === "contacts") {
			const contacts = navigator.contacts;
			if (!contacts) {
				this.set("contacts", "denied");
				return "denied";
			}
			try {
				await contacts.select(["name"], { multiple: false });
				this.set("contacts", "granted");
				return "granted";
			} catch {
				this.set("contacts", "denied");
				return "denied";
			}
		}
		this.set(key, "granted");
		return "granted";
	}
	/**
	* Just-in-time consent: only asks when the feature is being used, and only
	* if it was never granted before.
	*/
	async ensure(key) {
		if (this.isGranted(key)) return "granted";
		return this.request(key);
	}
	/** Resolves the capability an intent needs, if any. */
	static permissionForIntent(intent) {
		if (!intent) return null;
		return INTENT_PERMISSIONS[intent] ?? null;
	}
	reason(key) {
		return PERMISSION_REASONS[key];
	}
	revoke(key) {
		this.set(key, "denied");
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
};
var DEFAULTS = {
	threshold: .035,
	silenceMs: 1200,
	maxUtteranceMs: 3e4,
	startTimeoutMs: 6e3,
	intervalMs: 100
};
var VoiceActivityDetector = class {
	timer = null;
	startedAt = 0;
	started = false;
	lastVoiceAt = 0;
	speaking = false;
	done = false;
	opts;
	constructor(opts = {}) {
		this.opts = {
			...DEFAULTS,
			...opts
		};
	}
	/** True once speech has been detected in the current utterance. */
	get hasSpeech() {
		return this.speaking;
	}
	/** Feeds a live amplitude sample (0..1). Returns true while still running. */
	push(level, now = Date.now()) {
		if (this.done) return false;
		if (!this.started) {
			this.started = true;
			this.startedAt = now;
			this.lastVoiceAt = now;
		}
		if (level >= this.opts.threshold) {
			this.lastVoiceAt = now;
			if (!this.speaking) {
				this.speaking = true;
				this.opts.onSpeechStart?.();
			}
		}
		if (now - this.startedAt >= this.opts.maxUtteranceMs) return this.finish("timeout");
		const quietFor = now - this.lastVoiceAt;
		if (this.speaking && quietFor >= this.opts.silenceMs) return this.finish("silence");
		if (!this.speaking && now - this.startedAt >= this.opts.startTimeoutMs) return this.finish("timeout");
		return true;
	}
	finish(reason) {
		this.done = true;
		this.stop();
		this.opts.onSpeechEnd?.(reason);
		return false;
	}
	/** Polls `read()` on a slow interval — cheaper than a per-frame rAF loop. */
	attach(read) {
		this.stop();
		this.timer = setInterval(() => this.push(read()), this.opts.intervalMs);
	}
	stop() {
		if (this.timer) clearInterval(this.timer);
		this.timer = null;
	}
};
var SpeechToText = class {
	endpoint;
	constructor(endpoint = "/api/nico/transcribe") {
		this.endpoint = endpoint;
	}
	async start(options = {}) {
		const startedAt = Date.now();
		const stream = await navigator.mediaDevices.getUserMedia({ audio: {
			echoCancellation: true,
			noiseSuppression: true
		} });
		const ctx = new AudioContext();
		const source = ctx.createMediaStreamSource(stream);
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 512;
		const processor = ctx.createScriptProcessor(4096, 1, 1);
		const chunks = [];
		let stopped = false;
		processor.onaudioprocess = (e) => {
			if (stopped) return;
			chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
		};
		source.connect(analyser);
		source.connect(processor);
		processor.connect(ctx.destination);
		const levelData = new Uint8Array(analyser.frequencyBinCount);
		const readLevel = () => {
			analyser.getByteTimeDomainData(levelData);
			let peak = 0;
			for (const v of levelData) peak = Math.max(peak, Math.abs(v - 128) / 128);
			return peak;
		};
		let vad = null;
		if (options.vad !== false) {
			vad = new VoiceActivityDetector({
				...options.vad ?? {},
				onSpeechStart: options.onSpeechStart,
				onSpeechEnd: (reason) => options.onAutoStop?.(reason)
			});
			vad.attach(readLevel);
		}
		const teardown = async () => {
			stopped = true;
			vad?.stop();
			processor.disconnect();
			analyser.disconnect();
			source.disconnect();
			stream.getTracks().forEach((t) => t.stop());
			const rate = ctx.sampleRate;
			await ctx.close();
			return rate;
		};
		return {
			level: readLevel,
			hasSpeech: () => vad?.hasSpeech ?? true,
			cancel: () => void teardown(),
			stop: async (hint) => {
				const durationMs = Date.now() - startedAt;
				const rate = await teardown();
				const wav = encodeWav(chunks, rate);
				if (wav.size < 2048) throw new Error("empty_recording");
				const form = new FormData();
				form.append("audio", wav, "recording.wav");
				if (hint) form.append("language", hint);
				form.append("duration_ms", String(durationMs));
				const res = await fetch(this.endpoint, {
					method: "POST",
					body: form
				});
				if (!res.ok) {
					const detail = await res.text().catch(() => "");
					throw new Error(`Transcription failed [${res.status}]: ${detail}`);
				}
				const data = await res.json();
				return {
					text: (data.text ?? "").trim(),
					language: data.language ?? hint ?? "ar",
					durationMs,
					confidence: data.confidence
				};
			}
		};
	}
};
/** Downsamples to 16 kHz and writes a standard 16-bit mono WAV. */
function encodeWav(chunks, sampleRate, target = 16e3) {
	const total = chunks.reduce((n, c) => n + c.length, 0);
	const merged = new Float32Array(total);
	let offset = 0;
	for (const c of chunks) {
		merged.set(c, offset);
		offset += c.length;
	}
	const ratio = sampleRate / target;
	const outLength = Math.floor(merged.length / ratio);
	const samples = new Int16Array(outLength);
	for (let i = 0; i < outLength; i++) {
		const s = Math.max(-1, Math.min(1, merged[Math.floor(i * ratio)] ?? 0));
		samples[i] = s < 0 ? s * 32768 : s * 32767;
	}
	const buffer = /* @__PURE__ */ new ArrayBuffer(44 + samples.length * 2);
	const view = new DataView(buffer);
	const writeStr = (pos, str) => {
		for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i));
	};
	writeStr(0, "RIFF");
	view.setUint32(4, 36 + samples.length * 2, true);
	writeStr(8, "WAVE");
	writeStr(12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, 1, true);
	view.setUint32(24, target, true);
	view.setUint32(28, target * 2, true);
	view.setUint16(32, 2, true);
	view.setUint16(34, 16, true);
	writeStr(36, "data");
	view.setUint32(40, samples.length * 2, true);
	new Int16Array(buffer, 44).set(samples);
	return new Blob([buffer], { type: "audio/wav" });
}
var TextToSpeech = class {
	endpoint;
	ctx = null;
	sources = /* @__PURE__ */ new Set();
	analyser = null;
	constructor(endpoint = "/api/nico/speak") {
		this.endpoint = endpoint;
	}
	level() {
		if (!this.analyser) return 0;
		const data = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteTimeDomainData(data);
		let peak = 0;
		for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
		return peak;
	}
	async speak(text, options = {}) {
		const opts = typeof options === "string" ? { voice: options } : options;
		if (!text.trim()) return;
		this.stop();
		const ctx = new AudioContext({ sampleRate: 24e3 });
		this.ctx = ctx;
		if (ctx.state === "suspended") await ctx.resume().catch(() => {});
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 512;
		analyser.connect(ctx.destination);
		this.analyser = analyser;
		let playhead = 0;
		let pending = /* @__PURE__ */ new Uint8Array(0);
		const push = (incoming) => {
			const bytes = new Uint8Array(pending.length + incoming.length);
			bytes.set(pending);
			bytes.set(incoming, pending.length);
			const usable = bytes.length - bytes.length % 2;
			pending = bytes.slice(usable);
			if (!usable) return;
			const pcm = new Int16Array(bytes.buffer, 0, usable / 2);
			const floats = Float32Array.from(pcm, (s) => s / 32768);
			const buffer = ctx.createBuffer(1, floats.length, 24e3);
			buffer.copyToChannel(floats, 0);
			const src = ctx.createBufferSource();
			src.buffer = buffer;
			src.connect(analyser);
			playhead = playhead === 0 ? ctx.currentTime + .05 : Math.max(playhead, ctx.currentTime);
			src.start(playhead);
			playhead += buffer.duration;
			this.sources.add(src);
			src.onended = () => this.sources.delete(src);
		};
		const res = await fetch(this.endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text,
				voice: opts.voice ?? "alloy",
				speed: opts.speed,
				instructions: opts.instructions
			})
		});
		if (!res.ok || !res.body) {
			const detail = await res.text().catch(() => "");
			throw new Error(`TTS failed [${res.status}]: ${detail}`);
		}
		const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
		let buf = "";
		for (;;) {
			const { value, done } = await reader.read();
			if (done) break;
			buf += value;
			const parts = buf.split("\n\n");
			buf = parts.pop() ?? "";
			for (const part of parts) {
				const line = part.split("\n").find((l) => l.startsWith("data:"));
				if (!line) continue;
				const payloadText = line.slice(5).trim();
				if (!payloadText || payloadText === "[DONE]") continue;
				let payload;
				try {
					payload = JSON.parse(payloadText);
				} catch {
					continue;
				}
				if (payload.type !== "speech.audio.delta" || !payload.audio) continue;
				const bin = atob(payload.audio);
				const bytes = new Uint8Array(bin.length);
				for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
				push(bytes);
			}
		}
		const remaining = Math.max(0, playhead - ctx.currentTime);
		await new Promise((r) => setTimeout(r, remaining * 1e3 + 120));
	}
	stop() {
		this.sources.forEach((s) => {
			try {
				s.stop();
			} catch {}
		});
		this.sources.clear();
		this.analyser = null;
		this.ctx?.close().catch(() => {});
		this.ctx = null;
	}
};
var KEY$1 = "nico.voice.profile.v2";
var LEGACY_KEY = "nico.voice.profile.v1";
var DEFAULT_VOICE_PROFILE = {
	voiceId: "alloy",
	language: "ar",
	speed: 1,
	pitch: 1,
	style: "friendly"
};
/** Voices exposed in the UI. Swappable without touching the pipeline. */
var VOICE_OPTIONS = [
	{
		id: "alloy",
		label: "ألوي — محايد ودافئ"
	},
	{
		id: "verse",
		label: "فيرس — تعبيري"
	},
	{
		id: "sage",
		label: "سيج — هادئ"
	},
	{
		id: "ballad",
		label: "بالاد — ناعم"
	},
	{
		id: "coral",
		label: "كورال — حيوي"
	}
];
var STYLE_INSTRUCTIONS = {
	friendly: "Speak warmly and naturally, like a close friend who is happy to help.",
	calm: "Speak slowly, softly and reassuringly.",
	energetic: "Speak with upbeat energy and a lively rhythm.",
	formal: "Speak clearly and professionally, with measured pacing."
};
function pitchInstruction(pitch) {
	if (pitch >= 1.15) return " Use a noticeably higher, brighter pitch.";
	if (pitch <= .85) return " Use a lower, deeper pitch.";
	return "";
}
var clamp = (v, min, max) => Math.min(max, Math.max(min, v));
var VoiceProfile = class {
	data;
	constructor(seed) {
		this.data = {
			...DEFAULT_VOICE_PROFILE,
			...seed
		};
		this.load();
	}
	load() {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(KEY$1);
			if (raw) {
				this.data = {
					...this.data,
					...JSON.parse(raw)
				};
				return;
			}
			const legacy = window.localStorage.getItem(LEGACY_KEY);
			if (legacy) {
				const old = JSON.parse(legacy);
				this.data = {
					...this.data,
					voiceId: old.voiceName ?? this.data.voiceId,
					style: old.tone ?? this.data.style,
					speed: old.speed ?? this.data.speed,
					language: old.language ?? this.data.language
				};
			}
		} catch {}
	}
	persist() {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(KEY$1, JSON.stringify(this.data));
		} catch {}
	}
	update(patch) {
		this.data = {
			...this.data,
			...patch
		};
		this.data.speed = clamp(this.data.speed, .5, 2);
		this.data.pitch = clamp(this.data.pitch, .5, 2);
		this.persist();
		return this.data;
	}
	/** Body fields for the /api/nico/speak route. */
	speechOptions() {
		return {
			voice: this.data.voiceId,
			speed: this.data.speed,
			instructions: STYLE_INSTRUCTIONS[this.data.style] + pitchInstruction(this.data.pitch) + (this.data.language === "ar" ? " Respond in natural spoken Arabic." : "")
		};
	}
};
var KEY = "nico.voice.cache.v1";
var MAX_ENTRIES = 60;
/** Deterministic offline answers. Matched before any network call. */
var OFFLINE_COMMANDS = [
	{
		test: /^(كم الساعة|الساعة كم|what time is it)(?![\p{L}\p{N}])/iu,
		reply: (now) => `الساعة ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}.`
	},
	{
		test: /^(ما تاريخ اليوم|اليوم كم|what'?s the date)(?![\p{L}\p{N}])/iu,
		reply: (now) => `اليوم ${now.toLocaleDateString("ar")}.`
	},
	{
		test: /^(توقف|اسكت|stop|be quiet)(?![\p{L}\p{N}])/iu,
		reply: () => ""
	},
	{
		test: /^(شكرا|شكراً|thanks|thank you)(?![\p{L}\p{N}])/iu,
		reply: () => "العفو، دائماً في خدمتك."
	}
];
var LocalVoiceCache = class LocalVoiceCache {
	entries = /* @__PURE__ */ new Map();
	constructor() {
		this.load();
	}
	load() {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(KEY);
			if (!raw) return;
			for (const e of JSON.parse(raw)) this.entries.set(e.key, e);
		} catch {}
	}
	persist() {
		if (typeof window === "undefined") return;
		try {
			const list = [...this.entries.values()].sort((a, b) => b.hits - a.hits || b.createdAt - a.createdAt).slice(0, MAX_ENTRIES);
			this.entries = new Map(list.map((e) => [e.key, e]));
			window.localStorage.setItem(KEY, JSON.stringify(list));
		} catch {}
	}
	static normalize(text) {
		return text.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.،؟?!]+$/g, "");
	}
	/** True when the device currently has no connectivity. */
	static isOffline() {
		return typeof navigator !== "undefined" && navigator.onLine === false;
	}
	/** Answer a command locally, or null when it needs the full brain. */
	resolveOffline(utterance, now = /* @__PURE__ */ new Date()) {
		const text = LocalVoiceCache.normalize(utterance);
		for (const cmd of OFFLINE_COMMANDS) if (cmd.test.test(text)) return cmd.reply(now);
		return this.get(utterance);
	}
	get(utterance) {
		const hit = this.entries.get(LocalVoiceCache.normalize(utterance));
		if (!hit) return null;
		hit.hits++;
		this.persist();
		return hit.reply;
	}
	put(utterance, reply) {
		if (!reply.trim()) return;
		const key = LocalVoiceCache.normalize(utterance);
		const existing = this.entries.get(key);
		this.entries.set(key, {
			key,
			reply,
			createdAt: Date.now(),
			hits: existing ? existing.hits + 1 : 1
		});
		this.persist();
	}
	size() {
		return this.entries.size;
	}
	clear() {
		this.entries.clear();
		this.persist();
	}
};
var WAKE_PHRASES = [
	"يا نيكو",
	"هاي نيكو",
	"hey nico",
	"hi nico",
	"nico"
];
/** Text-based detector: cheap, exact, and always available. */
function matchesWakeWord(text) {
	const t = text.trim().toLowerCase();
	for (const phrase of WAKE_PHRASES) if (t.startsWith(phrase) || t.includes(` ${phrase}`)) return phrase;
	return null;
}
/** Strips the wake phrase so the brain sees only the actual request. */
function stripWakeWord(text) {
	const t = text.trim();
	for (const phrase of WAKE_PHRASES) {
		const re = new RegExp(`^${phrase}[\\s,،.!؟]*`, "i");
		if (re.test(t)) return t.replace(re, "").trim();
	}
	return t;
}
/**
* Always-on detector built on the browser SpeechRecognition API. It runs a
* low-cost background recognizer and fires only on the wake phrase; the real
* request is still captured by the normal STT session.
*/
function createSpeechRecognitionDetector(lang = "ar-SA") {
	if (typeof window === "undefined") return null;
	const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
	if (!Ctor) return null;
	let rec = null;
	let wanted = false;
	return {
		arm(onDetected) {
			wanted = true;
			rec = new Ctor();
			rec.lang = lang;
			rec.continuous = true;
			rec.interimResults = true;
			rec.onresult = (e) => {
				const results = Array.from(e.results);
				for (const r of results) {
					const phrase = matchesWakeWord(r[0]?.transcript ?? "");
					if (phrase) onDetected(phrase);
				}
			};
			rec.onend = () => {
				if (wanted) try {
					rec?.start();
				} catch {}
			};
			rec.onerror = () => {};
			try {
				rec.start();
			} catch {}
		},
		disarm() {
			wanted = false;
			try {
				rec?.stop();
			} catch {}
			rec = null;
		}
	};
}
var WakeWordManager = class {
	detector = null;
	armed = false;
	listeners = /* @__PURE__ */ new Set();
	/** Wake word is off until a detector is registered and enable() is called. */
	get enabled() {
		return this.armed;
	}
	get hasDetector() {
		return this.detector !== null;
	}
	registerDetector(detector) {
		this.detector = detector;
	}
	/** Registers the browser detector when available. Returns true if one exists. */
	useDefaultDetector(lang = "ar-SA") {
		if (this.detector) return true;
		const detector = createSpeechRecognitionDetector(lang);
		if (!detector) return false;
		this.detector = detector;
		return true;
	}
	onWake(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	fire(phrase) {
		this.listeners.forEach((l) => l(phrase));
	}
	async enable() {
		if (!this.detector) return false;
		if (this.armed) return true;
		await this.detector.arm((phrase) => this.fire(phrase));
		this.armed = true;
		return true;
	}
	disable() {
		this.detector?.disarm();
		this.armed = false;
	}
	/** Temporarily stop listening (e.g. while Nico speaks), keeping intent to resume. */
	pause() {
		if (!this.armed) return;
		this.detector?.disarm();
		this.armed = false;
	}
	/**
	* Feed a transcript through the text detector. Returns the request with the
	* wake phrase removed, or null when the phrase was absent.
	*/
	consumeTranscript(text) {
		const phrase = matchesWakeWord(text);
		if (!phrase) return null;
		this.fire(phrase);
		return stripWakeWord(text);
	}
};
/**
* VoiceSessionManager owns the microphone session lifecycle:
* start recording → stop recording → transcribe → speak the reply,
* while tracking timing/language/confidence metadata for persistence.
*/
var VoiceSessionManager = class {
	profile = new VoiceProfile();
	cache = new LocalVoiceCache();
	wakeWord = new WakeWordManager();
	stt = new SpeechToText();
	tts = new TextToSpeech();
	handle = null;
	state = "idle";
	listeners = /* @__PURE__ */ new Set();
	session = null;
	hooks;
	constructor(hooks = {}) {
		this.hooks = hooks;
	}
	setHooks(hooks) {
		this.hooks = {
			...this.hooks,
			...hooks
		};
	}
	get current() {
		return this.state;
	}
	get activeSession() {
		return this.session;
	}
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	set(s) {
		this.state = s;
		this.listeners.forEach((l) => l(s));
	}
	/** Live amplitude 0..1 for the orb and waveform. */
	level() {
		if (this.state === "listening") return this.handle?.level() ?? 0;
		if (this.state === "speaking") return this.tts.level();
		return 0;
	}
	/** True while the conversation loop should re-arm after Nico finishes speaking. */
	continuous = false;
	/** Did the detector hear speech in the current utterance? */
	heardSpeech() {
		return this.handle?.hasSpeech() ?? false;
	}
	async startListening() {
		this.tts.stop();
		this.handle = await this.stt.start({
			onSpeechStart: () => this.hooks.onSpeechStart?.(),
			onAutoStop: (reason) => this.hooks.onAutoStop?.(reason)
		});
		this.session = {
			id: crypto.randomUUID(),
			startedAt: Date.now(),
			durationMs: 0,
			language: this.profile.data.language
		};
		this.set("listening");
	}
	/** Stops recording and returns the transcription plus its metadata. */
	async stopListening() {
		if (!this.handle) return {
			text: "",
			language: this.profile.data.language,
			durationMs: 0
		};
		const h = this.handle;
		this.handle = null;
		this.set("thinking");
		try {
			const result = await h.stop(this.profile.data.language);
			if (this.session) {
				this.session.durationMs = result.durationMs;
				this.session.language = result.language;
				this.session.confidence = result.confidence;
				this.session.transcript = result.text;
				const stripped = this.wakeWord.consumeTranscript(result.text);
				if (stripped !== null) {
					this.session.wakeWord = "detected";
					result.text = stripped || result.text;
				}
			}
			return result;
		} catch (e) {
			this.endSession();
			this.set("idle");
			throw e;
		}
	}
	/** Answer without the network when the request is locally resolvable. */
	resolveOffline(utterance) {
		if (!LocalVoiceCache.isOffline()) return null;
		return this.cache.resolveOffline(utterance);
	}
	cancel() {
		this.continuous = false;
		this.handle?.cancel();
		this.handle = null;
		this.tts.stop();
		this.endSession();
		this.set("idle");
	}
	async say(text, voiceOverride) {
		if (!text.trim()) return;
		this.set("speaking");
		const opts = this.profile.speechOptions();
		try {
			await this.tts.speak(text, {
				...opts,
				voice: voiceOverride || opts.voice
			});
			if (this.session) this.session.reply = text;
		} finally {
			this.endSession();
			this.set("idle");
		}
	}
	endSession() {
		if (!this.session) return;
		const session = {
			...this.session,
			endedAt: Date.now()
		};
		this.session = null;
		if (!session.durationMs) session.durationMs = (session.endedAt ?? 0) - session.startedAt;
		this.hooks.onSessionEnd?.(session);
	}
};
/**
* VoiceManager — the UI-facing entry point for the voice loop.
* Kept as the stable name used across the app; the session lifecycle,
* metadata capture, wake word and offline cache live in VoiceSessionManager.
*/
var VoiceManager = class extends VoiceSessionManager {};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Ensure a `public.users` row exists for the signed-in auth user. */
var getBootstrap = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b997ae42a4e5ce96458a5a6ed005ab3a92ec642a3b9a4f3529c53415f3e7f7ca"));
var saveMemory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	key: stringType().optional(),
	content: stringType().min(1).max(4e3),
	type: stringType().default("fact"),
	importance: enumType([
		"low",
		"medium",
		"high"
	]).default("medium"),
	retention: enumType([
		"session",
		"short",
		"long",
		"permanent"
	]).default("long"),
	confirmed: booleanType().default(true)
}).parse(i)).handler(createSsrRpc("b88bee95692876445bfca8517d624ee527813db31b1660f6b6f337fe9c605c0a"));
var deleteMemory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ id: stringType().uuid() }).parse(i)).handler(createSsrRpc("abc29205c2d5ba03e62c056c2c234c84d0979cea1de73cd39e7bcd9e8775e615"));
var searchMemories = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	query: stringType().min(1).max(200),
	limit: numberType().default(10)
}).parse(i)).handler(createSsrRpc("7e80a150ea6ab17a415d2f929aa91cf0809e1502b42906a27f6bf845660a413f"));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	preferred_name: stringType().optional(),
	language: stringType().optional(),
	communication_style: stringType().optional(),
	personality_settings: recordType(anyType()).optional(),
	preferences: recordType(anyType()).optional(),
	interests: arrayType(anyType()).optional(),
	important_dates: arrayType(anyType()).optional()
}).parse(i)).handler(createSsrRpc("0bd73642f34e2a6a901ec645fe7c5da283785e7d9101b9fb34743a4cbf37d04a"));
var ensureConversation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	id: stringType().uuid().optional(),
	title: stringType().optional()
}).parse(i)).handler(createSsrRpc("21fc7dd2051424b8264f7baa8e2f0a560310291dcb7b6bf149afe04740ba3652"));
var saveMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	conversation_id: stringType().uuid(),
	role: enumType(["user", "nico"]),
	content: stringType().min(1),
	intent: stringType().optional(),
	voice_metadata: recordType(anyType()).optional()
}).parse(i)).handler(createSsrRpc("db8a89582af47556c78a180a35c54c885fa9f51c7eba813cba10d874d1b39b2f"));
var saveLearning = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	signal_type: stringType(),
	correction: stringType().optional(),
	learned_preference: recordType(anyType()).optional(),
	confidence: numberType().min(0).max(1).default(.5)
}).parse(i)).handler(createSsrRpc("ba082bb5b74e0092da3ca88face3384b69b0e2275a51fd50177197b9cd09d369"));
var updateMemory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	id: stringType().uuid(),
	content: stringType().min(1).max(4e3).optional(),
	key: stringType().optional(),
	importance: enumType([
		"low",
		"medium",
		"high"
	]).optional(),
	retention: enumType([
		"session",
		"short",
		"long",
		"permanent"
	]).optional()
}).parse(i)).handler(createSsrRpc("1de84d362bcaa6e4ca06e3ebc17d47fec89b487ed5cef7e15b69fb20f585230a"));
var deleteAllMemories = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("862fc971ce0ac7021145d6e23c3cb1a26ba062e4d25676fca8470d5a351bc0f8"));
var listConversations = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a9bec40fefea17d9c817ae6f72a907014149f2f13437a69cfa1b7aa08883cbb7"));
var listMessages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ conversation_id: stringType().uuid() }).parse(i)).handler(createSsrRpc("c5e89e2894f406e1bca0ada8dbd07155550ce2064e23494a95e6b3e9374c6284"));
var listLearning = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("62037b38af49466fcb54150a502a5e441ffff55e5546a90d9ac512583990bfb5"));
var deleteLearning = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ id: stringType().uuid() }).parse(i)).handler(createSsrRpc("f71ff93cad85777ed110e2db05df9543f187b9a9f345214612a0cbfb02735b76"));
var exportData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("10485ac2d87dfa78c4fdf0f19a88ab4a056058a8a7a5d13836e3ce039a1b2d8a"));
var deleteAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c94aec84d4aa4f9161fe19eac185457c0505765fd79dca23444623b855c6d189"));
var saveVoiceSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	conversation_id: stringType().uuid().optional(),
	duration: numberType().min(0).max(3600).default(0),
	language: stringType().max(12).default("ar"),
	confidence: numberType().min(0).max(1).optional()
}).parse(i)).handler(createSsrRpc("65d65934e8f2af77df1c57ce7ba19d3ccc27034b6db3a1f780dda6c0123bfffd"));
var listVoiceSessions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8a652f39f5c046db4ffc7486aec8818f10706d019617f12de3dac30754a319bd"));
var getVoicePreferences = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0b4d013fa6b8bd5b60f470da8c8059311e331f1572bd09492d74e67e691e9d5b"));
var saveVoicePreferences = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	voice_name: stringType().min(1).max(40),
	speed: numberType().min(.5).max(2),
	tone: enumType([
		"friendly",
		"calm",
		"energetic",
		"formal"
	]),
	language: enumType(["ar", "en"])
}).parse(i)).handler(createSsrRpc("a54c1806e5ddbe341523859d5f5158e96255bf0e50bdec80577fe4719fa80467"));
var getVoiceSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3482dfc96ef226f5e78fb4d63a19438d3ffb4c51a9a17da090adb2ab1df4e440"));
var saveVoiceSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	voice_id: stringType().min(1).max(40).optional(),
	speed: numberType().min(.5).max(2).optional(),
	pitch: numberType().min(.5).max(2).optional(),
	style: enumType([
		"friendly",
		"calm",
		"energetic",
		"formal"
	]).optional(),
	language: enumType(["ar", "en"]).optional(),
	wake_word: stringType().min(1).max(40).optional(),
	wake_word_enabled: booleanType().optional(),
	auto_greeting: booleanType().optional(),
	always_ready: booleanType().optional()
}).parse(i)).handler(createSsrRpc("4e4a0aabf518d9ff526c30a6002d4ef1d64d5366569340c8c4ceb0524842492b"));
var listDevicePermissions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ee97cb14eb7eedb6f10c367beaa66fcec49da47504a18e5a69ca1f3438e04f90"));
var saveDevicePermission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	permission: stringType().min(1).max(40),
	status: enumType([
		"granted",
		"denied",
		"prompt"
	]),
	platform: stringType().max(20).default("web"),
	device_label: stringType().max(120).optional()
}).parse(i)).handler(createSsrRpc("75648b2094028769aaef2f2547041f873ab32e6a5212621515dd162b694c62af"));
var logAssistantEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	event_type: stringType().min(1).max(60),
	detail: stringType().max(500).optional(),
	metadata: recordType(anyType()).optional()
}).parse(i)).handler(createSsrRpc("9ca869d6142f1d1530b8479a5548ed4ba66d36fb852133828b2d3d57cfd9f51b"));
var listAssistantEvents = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ca4a5ce7f3a138dcb664f4a28ba2bfadf21b4970b83e042eb40d32b491c98b00"));
/**
* Client-side persistence bridge between the in-memory Nico runtime and
* the Lovable Cloud database. Called from useNico whenever the user is
* authenticated. When signed out, callers are no-ops and everything stays
* in-process (the existing Guest experience).
*/
var nicoSync = {
	getVoiceSettings: () => getVoiceSettings(),
	saveVoiceSettings: (data) => saveVoiceSettings({ data }),
	listDevicePermissions: () => listDevicePermissions(),
	saveDevicePermission: (data) => saveDevicePermission({ data: {
		platform: "web",
		...data
	} }),
	logEvent: (data) => logAssistantEvent({ data }),
	listAssistantEvents: () => listAssistantEvents(),
	saveVoiceSession: (data) => saveVoiceSession({ data }),
	listVoiceSessions: () => listVoiceSessions(),
	getVoicePreferences: () => getVoicePreferences(),
	saveVoicePreferences: (data) => saveVoicePreferences({ data }),
	bootstrap: () => getBootstrap(),
	saveMemory: (data) => saveMemory({ data }),
	deleteMemory: (id) => deleteMemory({ data: { id } }),
	searchMemories: (query, limit = 10) => searchMemories({ data: {
		query,
		limit
	} }),
	updateProfile: (data) => updateProfile({ data }),
	ensureConversation: (id, title) => ensureConversation({ data: {
		id,
		title
	} }),
	saveMessage: (data) => saveMessage({ data }),
	saveLearning: (data) => saveLearning({ data }),
	updateMemory: (id, patch) => updateMemory({ data: {
		id,
		...patch
	} }),
	deleteAllMemories: () => deleteAllMemories(),
	listConversations: () => listConversations(),
	listMessages: (conversation_id) => listMessages({ data: { conversation_id } }),
	listLearning: () => listLearning(),
	deleteLearning: (id) => deleteLearning({ data: { id } }),
	exportData: () => exportData(),
	deleteAccount: () => deleteAccount()
};
var PRESENCE_LABEL = {
	idle: "اضغط للتحدث",
	listening: "أسمعك...",
	thinking: "أفكر...",
	speaking: "أتحدث",
	sleeping: "نائم — قل «يا نيكو»"
};
function derivePresence(state, opts = {}) {
	if (state === "idle" && opts.wakeWordArmed) return "sleeping";
	return state;
}
/**
* Web implementation. Does whatever the browser genuinely supports and reports
* `available: false` so callers can degrade gracefully (e.g. tell the user a
* feature needs the Android app).
*/
var WebBackgroundService = class {
	running = false;
	async start() {
		this.running = typeof window !== "undefined";
		return this.running;
	}
	async stop() {
		this.running = false;
	}
	async isRunning() {
		return this.running;
	}
};
var WebNotifications = class {
	async requestPermission() {
		if (typeof Notification === "undefined") return "denied";
		return await Notification.requestPermission() === "granted" ? "granted" : "denied";
	}
	async notify({ title, body }) {
		if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
		new Notification(title, { body });
	}
	async cancel() {}
};
var WebPhoneActions = class {
	async call(number) {
		if (typeof window !== "undefined") window.location.href = `tel:${number}`;
	}
	async sendSms(number, message) {
		if (typeof window !== "undefined") window.location.href = `sms:${number}?body=${encodeURIComponent(message)}`;
	}
	async pickContact() {
		const contacts = navigator.contacts;
		if (!contacts) return null;
		try {
			const [picked] = await contacts.select(["name", "tel"], { multiple: false });
			if (!picked) return null;
			return {
				name: picked.name?.[0] ?? "",
				number: picked.tel?.[0]
			};
		} catch {
			return null;
		}
	}
};
var WebAppControl = class {
	async openApp() {
		return false;
	}
	async openUrl(url) {
		if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
	}
	async setVolume() {}
};
var WebMobileBridge = class {
	platform = "web";
	available = false;
	background = new WebBackgroundService();
	notifications = new WebNotifications();
	phone = new WebPhoneActions();
	apps = new WebAppControl();
};
var current = new WebMobileBridge();
/** Android Native (or a test harness) calls this once at startup. */
function registerMobileBridge(bridge) {
	current = bridge;
}
function mobileBridge() {
	return (typeof window !== "undefined" ? window.NicoNativeBridge : void 0) ?? current;
}
/** Wires the Nico runtime into React state for any surface (web, dashboard). */
function useNico() {
	const pendingSessionsRef = (0, import_react.useRef)([]);
	const runtime = (0, import_react.useMemo)(() => {
		const permissions = new PermissionManager();
		const memory = new MemoryManager();
		const skills = new SkillManager();
		return {
			permissions,
			memory,
			skills,
			brain: new NicoBrain({
				memory,
				skills,
				permissions
			}),
			voice: new VoiceManager({ onSessionEnd: (session) => pendingSessionsRef.current.push(session) })
		};
	}, []);
	const [state, setState] = (0, import_react.useState)("idle");
	const [level, setLevel] = (0, import_react.useState)(0);
	const [turns, setTurns] = (0, import_react.useState)([]);
	const [memories, setMemories] = (0, import_react.useState)([]);
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [permissions, setPermissions] = (0, import_react.useState)(() => runtime.permissions.snapshot());
	const [error, setError] = (0, import_react.useState)(null);
	const [lastIntent, setLastIntent] = (0, import_react.useState)(null);
	const [lastTrace, setLastTrace] = (0, import_react.useState)(null);
	const [authEmail, setAuthEmail] = (0, import_react.useState)(null);
	const [voiceProfile, setVoiceProfile] = (0, import_react.useState)(() => runtime.voice.profile.data);
	/** Phase 7 assistant behaviour toggles, mirrored to `voice_settings`. */
	const [assistant, setAssistant] = (0, import_react.useState)({
		autoGreeting: true,
		alwaysReady: false,
		wakeWordEnabled: false,
		wakeWord: "يا نيكو"
	});
	const [greeted, setGreeted] = (0, import_react.useState)(false);
	const [wakeArmed, setWakeArmed] = (0, import_react.useState)(false);
	const [continuous, setContinuous] = (0, import_react.useState)(false);
	const continuousRef = (0, import_react.useRef)(false);
	const stopListeningRef = (0, import_react.useRef)(null);
	const startListeningRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(null);
	const conversationIdRef = (0, import_react.useRef)(null);
	const signedInRef = (0, import_react.useRef)(false);
	const greetedRef = (0, import_react.useRef)(false);
	/** Fire-and-forget activity log; silently skipped for guests. */
	const logEvent = (0, import_react.useCallback)((event_type, detail) => {
		if (!signedInRef.current) return;
		nicoSync.logEvent({
			event_type,
			detail
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function loadForUser() {
			try {
				const bootstrap = await nicoSync.bootstrap();
				if (!mounted) return;
				signedInRef.current = true;
				if (bootstrap.profile) runtime.memory.profile.update({
					isGuest: false,
					name: bootstrap.profile.preferred_name ?? void 0,
					preferredName: bootstrap.profile.preferred_name ?? void 0,
					locale: bootstrap.profile.language ?? "ar",
					communicationStyle: bootstrap.profile.communication_style ?? "concise"
				});
				const mapped = bootstrap.memories.map((m) => ({
					id: m.id,
					key: m.key ?? m.content.slice(0, 40),
					value: m.content,
					kind: m.type ?? "fact",
					createdAt: new Date(m.created_at).getTime(),
					score: m.score ?? 1,
					importance: m.importance,
					retention: m.retention
				}));
				setMemories(mapped);
				const conv = await nicoSync.ensureConversation();
				conversationIdRef.current = conv.id;
			} catch (e) {
				console.error("nico bootstrap failed", e);
			}
		}
		supabase.auth.getSession().then(({ data }) => {
			if (data.session?.user) {
				setAuthEmail(data.session.user.email ?? null);
				loadForUser();
			}
		});
		const sub = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				setAuthEmail(session?.user?.email ?? null);
				loadForUser();
			} else if (event === "SIGNED_OUT") {
				signedInRef.current = false;
				conversationIdRef.current = null;
				setAuthEmail(null);
				runtime.memory.forgetAll();
				setMemories([]);
				setTurns([]);
			}
		});
		return () => {
			mounted = false;
			sub.data.subscription.unsubscribe();
		};
	}, [runtime]);
	(0, import_react.useEffect)(() => {
		setMemories(runtime.memory.longTerm.all());
		reminderEngine.bindVoice((text) => void runtime.voice.say(text));
		const offVoice = runtime.voice.subscribe(setState);
		const offPerm = runtime.permissions.subscribe(setPermissions);
		const offTasks = reminderEngine.subscribe(setTasks);
		return () => {
			offVoice();
			offPerm();
			offTasks();
			runtime.voice.cancel();
		};
	}, [runtime]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function hydrate() {
			if (!signedInRef.current) return;
			try {
				const prefs = await nicoSync.getVoicePreferences();
				if (!prefs || cancelled) return;
				setVoiceProfile(runtime.voice.profile.update({
					voiceId: prefs.voice_name,
					speed: Number(prefs.speed),
					style: prefs.tone,
					language: prefs.language
				}));
			} catch (e) {
				console.error("voice prefs hydrate failed", e);
			}
			try {
				const settings = await nicoSync.getVoiceSettings();
				if (!settings || cancelled) return;
				setAssistant({
					autoGreeting: settings.auto_greeting,
					alwaysReady: settings.always_ready,
					wakeWordEnabled: settings.wake_word_enabled,
					wakeWord: settings.wake_word
				});
				setVoiceProfile(runtime.voice.profile.update({
					voiceId: settings.voice_id,
					speed: Number(settings.speed),
					pitch: Number(settings.pitch),
					style: settings.style,
					language: settings.language
				}));
			} catch (e) {
				console.error("voice settings hydrate failed", e);
			}
		}
		hydrate();
		const flush = window.setInterval(() => {
			if (!signedInRef.current) return;
			const pending = pendingSessionsRef.current.splice(0);
			for (const session of pending) nicoSync.saveVoiceSession({
				conversation_id: conversationIdRef.current ?? void 0,
				duration: Math.round(session.durationMs / 1e3),
				language: session.language,
				confidence: session.confidence
			}).catch((e) => console.error("voice session save failed", e));
		}, 5e3);
		return () => {
			cancelled = true;
			window.clearInterval(flush);
		};
	}, [runtime, authEmail]);
	(0, import_react.useEffect)(() => {
		if (state === "idle") {
			setLevel(0);
			return;
		}
		const loop = () => {
			setLevel(runtime.voice.level());
			rafRef.current = requestAnimationFrame(loop);
		};
		rafRef.current = requestAnimationFrame(loop);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [state, runtime]);
	const persistTurn = (0, import_react.useCallback)(async (role, content, intent, voiceMeta) => {
		if (!signedInRef.current) return;
		try {
			if (!conversationIdRef.current) {
				const c = await nicoSync.ensureConversation();
				conversationIdRef.current = c.id;
			}
			await nicoSync.saveMessage({
				conversation_id: conversationIdRef.current,
				role,
				content,
				intent,
				voice_metadata: voiceMeta
			});
		} catch (e) {
			console.error("persist message failed", e);
		}
	}, []);
	const process = (0, import_react.useCallback)(async (transcript, voiceMeta) => {
		if (!transcript.trim()) return;
		setError(null);
		persistTurn("user", transcript, void 0, voiceMeta);
		const offline = runtime.voice.resolveOffline(transcript);
		if (offline) {
			setTurns(runtime.memory.shortTerm.history());
			await runtime.voice.say(offline);
			return;
		}
		const beforeIds = new Set(runtime.memory.longTerm.all().map((m) => m.id));
		const res = await runtime.brain.handle(transcript);
		setLastIntent(res.intent.name);
		setLastTrace(res.trace);
		const needed = PermissionManager.permissionForIntent(res.intent.name);
		if (needed && !runtime.permissions.isGranted(needed)) {
			const status = await runtime.permissions.ensure(needed);
			logEvent("permission_request", `${needed}:${status}`);
			if (signedInRef.current) nicoSync.saveDevicePermission({
				permission: needed,
				status
			}).catch(() => {});
		}
		setTurns(runtime.memory.shortTerm.history());
		setMemories(runtime.memory.longTerm.all());
		runtime.voice.cache.put(transcript, res.speech);
		if (signedInRef.current) {
			const fresh = runtime.memory.longTerm.all().filter((m) => !beforeIds.has(m.id));
			for (const m of fresh) try {
				await nicoSync.saveMemory({
					key: m.key,
					content: m.value,
					type: m.kind,
					importance: m.importance,
					retention: m.retention,
					confirmed: true
				});
			} catch (e) {
				console.error("persist memory failed", e);
			}
			if (res.learning) nicoSync.saveLearning({
				signal_type: res.learning,
				correction: transcript,
				confidence: .7
			});
		}
		const speech = humanize(res.speech);
		persistTurn("nico", speech, res.intent.name);
		logEvent("reply", res.intent.name);
		await runtime.voice.say(speech);
	}, [
		runtime,
		persistTurn,
		logEvent
	]);
	const startListening = (0, import_react.useCallback)(async () => {
		setError(null);
		try {
			if (!runtime.permissions.isGranted("microphone")) {
				const granted = await runtime.permissions.ensure("microphone");
				if (signedInRef.current) nicoSync.saveDevicePermission({
					permission: "microphone",
					status: granted
				}).catch(() => {});
				if (granted !== "granted") {
					setError(NICO_PHRASES.micDenied);
					return;
				}
			}
			logEvent("listen_start");
			await runtime.voice.startListening();
		} catch {
			setError(NICO_PHRASES.micFailed);
		}
	}, [runtime, logEvent]);
	const stopListening = (0, import_react.useCallback)(async () => {
		try {
			const result = await runtime.voice.stopListening();
			if (!result.text) {
				if (!continuousRef.current) setError(NICO_PHRASES.notHeard);
				return;
			}
			setTurns((prev) => [...prev, {
				id: crypto.randomUUID(),
				role: "user",
				content: result.text,
				createdAt: Date.now()
			}]);
			await process(result.text, {
				language: result.language,
				durationMs: result.durationMs,
				confidence: result.confidence
			});
		} catch (e) {
			if (!continuousRef.current) setError(e instanceof Error ? e.message : NICO_PHRASES.failed);
			runtime.voice.cancel();
		} finally {
			if (continuousRef.current) window.setTimeout(() => {
				if (continuousRef.current && runtime.voice.current === "idle") startListening();
			}, 350);
		}
	}, [
		runtime,
		process,
		startListening
	]);
	(0, import_react.useEffect)(() => {
		stopListeningRef.current = stopListening;
		startListeningRef.current = startListening;
	}, [stopListening, startListening]);
	(0, import_react.useEffect)(() => {
		runtime.voice.setHooks({ onAutoStop: () => {
			if (runtime.voice.current === "listening") stopListeningRef.current?.();
		} });
	}, [runtime]);
	/** Hands-free mode: listen → think → speak → listen again. */
	const startConversation = (0, import_react.useCallback)(async () => {
		continuousRef.current = true;
		setContinuous(true);
		logEvent("conversation_start");
		await startListening();
	}, [startListening, logEvent]);
	const stopConversation = (0, import_react.useCallback)(() => {
		continuousRef.current = false;
		setContinuous(false);
		runtime.voice.cancel();
		logEvent("conversation_stop");
	}, [runtime, logEvent]);
	/**
	* Auto greeting: Nico speaks first, right after the microphone is allowed —
	* no button press. Runs once per app load.
	*/
	const greet = (0, import_react.useCallback)(async (opts = {}) => {
		if (greetedRef.current && !opts.force) return;
		greetedRef.current = true;
		setGreeted(true);
		logEvent("auto_greeting");
		try {
			await runtime.voice.say(NICO_AUTO_GREETING);
		} catch {}
	}, [runtime, logEvent]);
	(0, import_react.useEffect)(() => {
		if (!assistant.autoGreeting || greetedRef.current) return;
		if (!runtime.permissions.isGranted("microphone")) return;
		greet();
	}, [
		assistant.autoGreeting,
		runtime,
		greet
	]);
	/** Always Ready: wake word armed, session opened the moment Nico is called. */
	const setAlwaysReady = (0, import_react.useCallback)(async (on) => {
		setAssistant((prev) => ({
			...prev,
			alwaysReady: on,
			wakeWordEnabled: on
		}));
		if (signedInRef.current) nicoSync.saveVoiceSettings({
			always_ready: on,
			wake_word_enabled: on
		}).catch(() => {});
		if (!on) {
			runtime.voice.wakeWord.disable();
			setWakeArmed(false);
			continuousRef.current = false;
			setContinuous(false);
			runtime.voice.cancel();
			logEvent("always_ready_off");
			return;
		}
		if (await runtime.permissions.ensure("microphone") !== "granted") {
			setError(NICO_PHRASES.micDenied);
			return;
		}
		await runtime.permissions.ensure("background_audio");
		mobileBridge().background.start({ wakeWord: assistant.wakeWord });
		runtime.voice.wakeWord.useDefaultDetector(runtime.voice.profile.data.language === "en" ? "en-US" : "ar-SA");
		const armed = await runtime.voice.wakeWord.enable();
		setWakeArmed(armed);
		logEvent("always_ready_on", armed ? "wake_word_armed" : "wake_word_unavailable");
		if (!armed) await startConversation();
	}, [
		runtime,
		assistant.wakeWord,
		startConversation,
		logEvent
	]);
	(0, import_react.useEffect)(() => {
		const off = runtime.voice.wakeWord.onWake(() => {
			logEvent("wake_word");
			if (runtime.voice.current === "idle") {
				continuousRef.current = true;
				setContinuous(true);
				startListeningRef.current?.();
			}
		});
		return () => {
			off();
		};
	}, [runtime, logEvent]);
	const presence = derivePresence(state, { wakeWordArmed: wakeArmed && !continuous });
	const signOut = (0, import_react.useCallback)(async () => {
		await supabase.auth.signOut();
	}, []);
	return {
		runtime,
		state,
		level,
		turns,
		memories,
		tasks,
		permissions,
		error,
		lastIntent,
		lastTrace,
		authEmail,
		isAuthenticated: !!authEmail,
		session: runtime.brain.conversation.session.current(),
		activeTopic: runtime.brain.conversation.memory.activeTopic(),
		profile: runtime.memory.profile.data,
		skills: runtime.skills.list(),
		startListening,
		stopListening,
		continuous,
		startConversation,
		stopConversation,
		presence,
		greeted,
		greet,
		assistant,
		wakeWordArmed: wakeArmed,
		setAlwaysReady,
		setAutoGreeting: (on) => {
			setAssistant((prev) => ({
				...prev,
				autoGreeting: on
			}));
			if (signedInRef.current) nicoSync.saveVoiceSettings({ auto_greeting: on }).catch(() => {});
		},
		logEvent,
		permissionReason: (key) => runtime.permissions.reason(key),
		isGuest: !authEmail,
		sendText: process,
		signOut,
		requestPermission: (key) => runtime.permissions.request(key),
		revokePermission: (key) => runtime.permissions.revoke(key),
		forgetAll: async () => {
			if (signedInRef.current) for (const m of runtime.memory.longTerm.all()) try {
				await nicoSync.deleteMemory(m.id);
			} catch (e) {
				console.error(e);
			}
			runtime.memory.forgetAll();
			setMemories([]);
			setTurns([]);
		},
		forget: async (query) => {
			const targets = runtime.memory.longTerm.search(query, 20);
			if (signedInRef.current) for (const t of targets) try {
				await nicoSync.deleteMemory(t.id);
			} catch (e) {
				console.error(e);
			}
			const n = runtime.memory.forget(query);
			setMemories(runtime.memory.longTerm.all());
			return n;
		},
		deleteMemory: async (id) => {
			if (signedInRef.current) try {
				await nicoSync.deleteMemory(id);
			} catch (e) {
				console.error(e);
			}
			runtime.memory.longTerm.forget(id);
			setMemories(runtime.memory.longTerm.all());
		},
		describeMemories: () => runtime.memory.describeAll(),
		pendingMemories: () => runtime.memory.pendingMemories(),
		confirmPending: (id) => {
			const r = runtime.memory.confirmPending(id);
			setMemories(runtime.memory.longTerm.all());
			if (r && signedInRef.current) nicoSync.saveMemory({
				key: r.key,
				content: r.value,
				type: r.kind,
				importance: r.importance,
				retention: r.retention,
				confirmed: true
			});
			return r;
		},
		rejectPending: (id) => runtime.memory.rejectPending(id),
		updateProfile: (patch) => {
			const next = runtime.memory.profile.update(patch);
			if (signedInRef.current) nicoSync.updateProfile({
				preferred_name: next.preferredName ?? next.name,
				language: next.locale,
				communication_style: next.communicationStyle,
				preferences: next.preferences,
				interests: next.interests,
				important_dates: next.importantDates
			});
			return next;
		},
		voiceProfile,
		updateVoiceProfile: (patch) => {
			const next = runtime.voice.profile.update(patch);
			setVoiceProfile(next);
			if (signedInRef.current) {
				nicoSync.saveVoicePreferences({
					voice_name: next.voiceId,
					speed: next.speed,
					tone: next.style,
					language: next.language
				});
				nicoSync.saveVoiceSettings({
					voice_id: next.voiceId,
					speed: next.speed,
					pitch: next.pitch,
					style: next.style,
					language: next.language
				}).catch(() => {});
			}
			return next;
		},
		registerUser: (name) => runtime.memory.profile.register(name),
		cancel: () => runtime.voice.cancel()
	};
}
//#endregion
export { nicoSync as a, mobileBridge as i, PRESENCE_LABEL as n, registerMobileBridge as o, VOICE_OPTIONS as r, useNico as s, NICO_AUTO_GREETING as t };
