import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as numberType, c as stringType, i as enumType, n as arrayType, o as objectType, r as booleanType, s as recordType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nico.functions-C-sVQwWu.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Ensure a `public.users` row exists for the signed-in auth user. */
async function ensureUserId(supabase, authId) {
	const { data: existing } = await supabase.from("users").select("id").eq("auth_id", authId).maybeSingle();
	if (existing?.id) {
		await supabase.from("users").update({ last_active: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", existing.id);
		return existing.id;
	}
	const { data: created, error } = await supabase.from("users").insert({ auth_id: authId }).select("id").single();
	if (error) throw error;
	await supabase.from("user_profiles").insert({ user_id: created.id });
	return created.id;
}
var getBootstrap_createServerFn_handler = createServerRpc({
	id: "b997ae42a4e5ce96458a5a6ed005ab3a92ec642a3b9a4f3529c53415f3e7f7ca",
	name: "getBootstrap",
	filename: "src/lib/nico.functions.ts"
}, (opts) => getBootstrap.__executeServer(opts));
var getBootstrap = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getBootstrap_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const [{ data: profile }, { data: memories }, { data: conversations }] = await Promise.all([
		context.supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
		context.supabase.from("memories").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(200),
		context.supabase.from("conversations").select("id, title, updated_at").eq("user_id", userId).order("updated_at", { ascending: false }).limit(20)
	]);
	return {
		userId,
		profile,
		memories: memories ?? [],
		conversations: conversations ?? []
	};
});
var saveMemory_createServerFn_handler = createServerRpc({
	id: "b88bee95692876445bfca8517d624ee527813db31b1660f6b6f337fe9c605c0a",
	name: "saveMemory",
	filename: "src/lib/nico.functions.ts"
}, (opts) => saveMemory.__executeServer(opts));
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
}).parse(i)).handler(saveMemory_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data: row, error } = await context.supabase.from("memories").insert({
		user_id: userId,
		...data
	}).select().single();
	if (error) throw error;
	return row;
});
var deleteMemory_createServerFn_handler = createServerRpc({
	id: "abc29205c2d5ba03e62c056c2c234c84d0979cea1de73cd39e7bcd9e8775e615",
	name: "deleteMemory",
	filename: "src/lib/nico.functions.ts"
}, (opts) => deleteMemory.__executeServer(opts));
var deleteMemory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ id: stringType().uuid() }).parse(i)).handler(deleteMemory_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("memories").delete().eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
var searchMemories_createServerFn_handler = createServerRpc({
	id: "7e80a150ea6ab17a415d2f929aa91cf0809e1502b42906a27f6bf845660a413f",
	name: "searchMemories",
	filename: "src/lib/nico.functions.ts"
}, (opts) => searchMemories.__executeServer(opts));
var searchMemories = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	query: stringType().min(1).max(200),
	limit: numberType().default(10)
}).parse(i)).handler(searchMemories_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data: rows } = await context.supabase.from("memories").select("*").eq("user_id", userId).ilike("content", `%${data.query}%`).order("created_at", { ascending: false }).limit(data.limit);
	return rows ?? [];
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "0bd73642f34e2a6a901ec645fe7c5da283785e7d9101b9fb34743a4cbf37d04a",
	name: "updateProfile",
	filename: "src/lib/nico.functions.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	preferred_name: stringType().optional(),
	language: stringType().optional(),
	communication_style: stringType().optional(),
	personality_settings: recordType(anyType()).optional(),
	preferences: recordType(anyType()).optional(),
	interests: arrayType(anyType()).optional(),
	important_dates: arrayType(anyType()).optional()
}).parse(i)).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data: row, error } = await context.supabase.from("user_profiles").update(data).eq("user_id", userId).select().single();
	if (error) throw error;
	return row;
});
var ensureConversation_createServerFn_handler = createServerRpc({
	id: "21fc7dd2051424b8264f7baa8e2f0a560310291dcb7b6bf149afe04740ba3652",
	name: "ensureConversation",
	filename: "src/lib/nico.functions.ts"
}, (opts) => ensureConversation.__executeServer(opts));
var ensureConversation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	id: stringType().uuid().optional(),
	title: stringType().optional()
}).parse(i)).handler(ensureConversation_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	if (data.id) {
		const { data: row } = await context.supabase.from("conversations").select("id").eq("id", data.id).maybeSingle();
		if (row) return row;
	}
	const { data: created, error } = await context.supabase.from("conversations").insert({
		user_id: userId,
		title: data.title ?? null
	}).select("id").single();
	if (error) throw error;
	return created;
});
var saveMessage_createServerFn_handler = createServerRpc({
	id: "db8a89582af47556c78a180a35c54c885fa9f51c7eba813cba10d874d1b39b2f",
	name: "saveMessage",
	filename: "src/lib/nico.functions.ts"
}, (opts) => saveMessage.__executeServer(opts));
var saveMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	conversation_id: stringType().uuid(),
	role: enumType(["user", "nico"]),
	content: stringType().min(1),
	intent: stringType().optional(),
	voice_metadata: recordType(anyType()).optional()
}).parse(i)).handler(saveMessage_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { error } = await context.supabase.from("messages").insert({
		user_id: userId,
		...data
	});
	if (error) throw error;
	await context.supabase.from("conversations").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", data.conversation_id);
	return { ok: true };
});
var saveLearning_createServerFn_handler = createServerRpc({
	id: "ba082bb5b74e0092da3ca88face3384b69b0e2275a51fd50177197b9cd09d369",
	name: "saveLearning",
	filename: "src/lib/nico.functions.ts"
}, (opts) => saveLearning.__executeServer(opts));
var saveLearning = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	signal_type: stringType(),
	correction: stringType().optional(),
	learned_preference: recordType(anyType()).optional(),
	confidence: numberType().min(0).max(1).default(.5)
}).parse(i)).handler(saveLearning_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { error } = await context.supabase.from("learning_records").insert({
		user_id: userId,
		...data
	});
	if (error) throw error;
	return { ok: true };
});
var updateMemory_createServerFn_handler = createServerRpc({
	id: "1de84d362bcaa6e4ca06e3ebc17d47fec89b487ed5cef7e15b69fb20f585230a",
	name: "updateMemory",
	filename: "src/lib/nico.functions.ts"
}, (opts) => updateMemory.__executeServer(opts));
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
}).parse(i)).handler(updateMemory_createServerFn_handler, async ({ context, data }) => {
	const { id, ...patch } = data;
	const { data: row, error } = await context.supabase.from("memories").update(patch).eq("id", id).select().single();
	if (error) throw error;
	return row;
});
var deleteAllMemories_createServerFn_handler = createServerRpc({
	id: "862fc971ce0ac7021145d6e23c3cb1a26ba062e4d25676fca8470d5a351bc0f8",
	name: "deleteAllMemories",
	filename: "src/lib/nico.functions.ts"
}, (opts) => deleteAllMemories.__executeServer(opts));
var deleteAllMemories = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(deleteAllMemories_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { error } = await context.supabase.from("memories").delete().eq("user_id", userId);
	if (error) throw error;
	return { ok: true };
});
var listConversations_createServerFn_handler = createServerRpc({
	id: "a9bec40fefea17d9c817ae6f72a907014149f2f13437a69cfa1b7aa08883cbb7",
	name: "listConversations",
	filename: "src/lib/nico.functions.ts"
}, (opts) => listConversations.__executeServer(opts));
var listConversations = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listConversations_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data } = await context.supabase.from("conversations").select("id, title, created_at, updated_at").eq("user_id", userId).order("updated_at", { ascending: false }).limit(100);
	return data ?? [];
});
var listMessages_createServerFn_handler = createServerRpc({
	id: "c5e89e2894f406e1bca0ada8dbd07155550ce2064e23494a95e6b3e9374c6284",
	name: "listMessages",
	filename: "src/lib/nico.functions.ts"
}, (opts) => listMessages.__executeServer(opts));
var listMessages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ conversation_id: stringType().uuid() }).parse(i)).handler(listMessages_createServerFn_handler, async ({ context, data }) => {
	const { data: rows } = await context.supabase.from("messages").select("id, role, content, intent, created_at").eq("conversation_id", data.conversation_id).order("created_at", { ascending: true });
	return rows ?? [];
});
var listLearning_createServerFn_handler = createServerRpc({
	id: "62037b38af49466fcb54150a502a5e441ffff55e5546a90d9ac512583990bfb5",
	name: "listLearning",
	filename: "src/lib/nico.functions.ts"
}, (opts) => listLearning.__executeServer(opts));
var listLearning = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listLearning_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data } = await context.supabase.from("learning_records").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(200);
	return data ?? [];
});
var deleteLearning_createServerFn_handler = createServerRpc({
	id: "f71ff93cad85777ed110e2db05df9543f187b9a9f345214612a0cbfb02735b76",
	name: "deleteLearning",
	filename: "src/lib/nico.functions.ts"
}, (opts) => deleteLearning.__executeServer(opts));
var deleteLearning = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ id: stringType().uuid() }).parse(i)).handler(deleteLearning_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("learning_records").delete().eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
var exportData_createServerFn_handler = createServerRpc({
	id: "10485ac2d87dfa78c4fdf0f19a88ab4a056058a8a7a5d13836e3ce039a1b2d8a",
	name: "exportData",
	filename: "src/lib/nico.functions.ts"
}, (opts) => exportData.__executeServer(opts));
var exportData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(exportData_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const [profile, memories, conversations, messages, learning] = await Promise.all([
		context.supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
		context.supabase.from("memories").select("*").eq("user_id", userId),
		context.supabase.from("conversations").select("*").eq("user_id", userId),
		context.supabase.from("messages").select("*").eq("user_id", userId),
		context.supabase.from("learning_records").select("*").eq("user_id", userId)
	]);
	return {
		exported_at: (/* @__PURE__ */ new Date()).toISOString(),
		profile: profile.data,
		memories: memories.data ?? [],
		conversations: conversations.data ?? [],
		messages: messages.data ?? [],
		learning: learning.data ?? []
	};
});
var deleteAccount_createServerFn_handler = createServerRpc({
	id: "c94aec84d4aa4f9161fe19eac185457c0505765fd79dca23444623b855c6d189",
	name: "deleteAccount",
	filename: "src/lib/nico.functions.ts"
}, (opts) => deleteAccount.__executeServer(opts));
var deleteAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(deleteAccount_createServerFn_handler, async ({ context }) => {
	const authId = context.userId;
	const { data: userRow } = await context.supabase.from("users").select("id").eq("auth_id", authId).maybeSingle();
	if (userRow?.id) await context.supabase.from("users").delete().eq("id", userRow.id);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await supabaseAdmin.auth.admin.deleteUser(authId);
	return { ok: true };
});
var saveVoiceSession_createServerFn_handler = createServerRpc({
	id: "65d65934e8f2af77df1c57ce7ba19d3ccc27034b6db3a1f780dda6c0123bfffd",
	name: "saveVoiceSession",
	filename: "src/lib/nico.functions.ts"
}, (opts) => saveVoiceSession.__executeServer(opts));
var saveVoiceSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	conversation_id: stringType().uuid().optional(),
	duration: numberType().min(0).max(3600).default(0),
	language: stringType().max(12).default("ar"),
	confidence: numberType().min(0).max(1).optional()
}).parse(i)).handler(saveVoiceSession_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data: row, error } = await context.supabase.from("voice_sessions").insert({
		user_id: userId,
		...data
	}).select().single();
	if (error) throw error;
	return row;
});
var listVoiceSessions_createServerFn_handler = createServerRpc({
	id: "8a652f39f5c046db4ffc7486aec8818f10706d019617f12de3dac30754a319bd",
	name: "listVoiceSessions",
	filename: "src/lib/nico.functions.ts"
}, (opts) => listVoiceSessions.__executeServer(opts));
var listVoiceSessions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listVoiceSessions_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("voice_sessions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
	if (error) throw error;
	return data ?? [];
});
var getVoicePreferences_createServerFn_handler = createServerRpc({
	id: "0b4d013fa6b8bd5b60f470da8c8059311e331f1572bd09492d74e67e691e9d5b",
	name: "getVoicePreferences",
	filename: "src/lib/nico.functions.ts"
}, (opts) => getVoicePreferences.__executeServer(opts));
var getVoicePreferences = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getVoicePreferences_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("voice_preferences").select("*").eq("user_id", userId).maybeSingle();
	if (error) throw error;
	return data;
});
var saveVoicePreferences_createServerFn_handler = createServerRpc({
	id: "a54c1806e5ddbe341523859d5f5158e96255bf0e50bdec80577fe4719fa80467",
	name: "saveVoicePreferences",
	filename: "src/lib/nico.functions.ts"
}, (opts) => saveVoicePreferences.__executeServer(opts));
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
}).parse(i)).handler(saveVoicePreferences_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data: row, error } = await context.supabase.from("voice_preferences").upsert({
		user_id: userId,
		...data
	}, { onConflict: "user_id" }).select().single();
	if (error) throw error;
	return row;
});
var getVoiceSettings_createServerFn_handler = createServerRpc({
	id: "3482dfc96ef226f5e78fb4d63a19438d3ffb4c51a9a17da090adb2ab1df4e440",
	name: "getVoiceSettings",
	filename: "src/lib/nico.functions.ts"
}, (opts) => getVoiceSettings.__executeServer(opts));
var getVoiceSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getVoiceSettings_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("voice_settings").select("*").eq("user_id", userId).maybeSingle();
	if (error) throw error;
	return data;
});
var saveVoiceSettings_createServerFn_handler = createServerRpc({
	id: "4e4a0aabf518d9ff526c30a6002d4ef1d64d5366569340c8c4ceb0524842492b",
	name: "saveVoiceSettings",
	filename: "src/lib/nico.functions.ts"
}, (opts) => saveVoiceSettings.__executeServer(opts));
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
}).parse(i)).handler(saveVoiceSettings_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data: row, error } = await context.supabase.from("voice_settings").upsert({
		user_id: userId,
		...data
	}, { onConflict: "user_id" }).select().single();
	if (error) throw error;
	return row;
});
var listDevicePermissions_createServerFn_handler = createServerRpc({
	id: "ee97cb14eb7eedb6f10c367beaa66fcec49da47504a18e5a69ca1f3438e04f90",
	name: "listDevicePermissions",
	filename: "src/lib/nico.functions.ts"
}, (opts) => listDevicePermissions.__executeServer(opts));
var listDevicePermissions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listDevicePermissions_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("device_permissions").select("*").eq("user_id", userId);
	if (error) throw error;
	return data ?? [];
});
var saveDevicePermission_createServerFn_handler = createServerRpc({
	id: "75648b2094028769aaef2f2547041f873ab32e6a5212621515dd162b694c62af",
	name: "saveDevicePermission",
	filename: "src/lib/nico.functions.ts"
}, (opts) => saveDevicePermission.__executeServer(opts));
var saveDevicePermission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	permission: stringType().min(1).max(40),
	status: enumType([
		"granted",
		"denied",
		"prompt"
	]),
	platform: stringType().max(20).default("web"),
	device_label: stringType().max(120).optional()
}).parse(i)).handler(saveDevicePermission_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { error } = await context.supabase.from("device_permissions").upsert({
		user_id: userId,
		...data
	}, { onConflict: "user_id,permission,platform" });
	if (error) throw error;
	return { ok: true };
});
var logAssistantEvent_createServerFn_handler = createServerRpc({
	id: "9ca869d6142f1d1530b8479a5548ed4ba66d36fb852133828b2d3d57cfd9f51b",
	name: "logAssistantEvent",
	filename: "src/lib/nico.functions.ts"
}, (opts) => logAssistantEvent.__executeServer(opts));
var logAssistantEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	event_type: stringType().min(1).max(60),
	detail: stringType().max(500).optional(),
	metadata: recordType(anyType()).optional()
}).parse(i)).handler(logAssistantEvent_createServerFn_handler, async ({ context, data }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { error } = await context.supabase.from("assistant_events").insert({
		user_id: userId,
		...data
	});
	if (error) throw error;
	return { ok: true };
});
var listAssistantEvents_createServerFn_handler = createServerRpc({
	id: "ca4a5ce7f3a138dcb664f4a28ba2bfadf21b4970b83e042eb40d32b491c98b00",
	name: "listAssistantEvents",
	filename: "src/lib/nico.functions.ts"
}, (opts) => listAssistantEvents.__executeServer(opts));
var listAssistantEvents = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAssistantEvents_createServerFn_handler, async ({ context }) => {
	const userId = await ensureUserId(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("assistant_events").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
	if (error) throw error;
	return data ?? [];
});
//#endregion
export { deleteAccount_createServerFn_handler, deleteAllMemories_createServerFn_handler, deleteLearning_createServerFn_handler, deleteMemory_createServerFn_handler, ensureConversation_createServerFn_handler, exportData_createServerFn_handler, getBootstrap_createServerFn_handler, getVoicePreferences_createServerFn_handler, getVoiceSettings_createServerFn_handler, listAssistantEvents_createServerFn_handler, listConversations_createServerFn_handler, listDevicePermissions_createServerFn_handler, listLearning_createServerFn_handler, listMessages_createServerFn_handler, listVoiceSessions_createServerFn_handler, logAssistantEvent_createServerFn_handler, saveDevicePermission_createServerFn_handler, saveLearning_createServerFn_handler, saveMemory_createServerFn_handler, saveMessage_createServerFn_handler, saveVoicePreferences_createServerFn_handler, saveVoiceSession_createServerFn_handler, saveVoiceSettings_createServerFn_handler, searchMemories_createServerFn_handler, updateMemory_createServerFn_handler, updateProfile_createServerFn_handler };
