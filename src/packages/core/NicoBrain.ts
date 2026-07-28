import type { MemoryManager } from "../memory/MemoryManager";
import type { PermissionManager } from "../permissions/PermissionManager";
import type { SkillManager } from "../skills/SkillManager";
import type { BrainResponse, Plan, SkillResult } from "../shared/types";
import type { AgentTrace, ExecutionRecord } from "../shared/agent";
import { ConversationEngine } from "../conversation";
import { AdvancedIntentEngine } from "./intent";
import { TaskPlanner } from "./planner";
import { ReasoningLayer } from "./reasoning";
import { ReasoningEngine } from "./ReasoningEngine";
import { ResponseComposer } from "./response";
import { LearningEngine } from "../learning";
import { EmotionAnalyzer, type EmotionReading } from "./emotion/EmotionAnalyzer";
import { PersonalityEngine } from "./PersonalityEngine";

export interface BrainDeps {
  memory: MemoryManager;
  skills: SkillManager;
  permissions: PermissionManager;
}

export interface AgentResponse extends BrainResponse {
  trace: AgentTrace;
  emotion?: EmotionReading;
  learning?: string;
  pendingConfirmationId?: string;
}

/**
 * NicoBrain — the agent orchestrator.
 *
 * Pipeline:
 *   Input → Conversation Manager → Intent Engine → Memory Retrieval
 *   → Reasoning → Personality → Response → Voice → Memory Update
 */
export class NicoBrain {
  readonly conversation: ConversationEngine;
  private readonly intents = new AdvancedIntentEngine();
  private readonly planner: TaskPlanner;
  private readonly reasoningLayer: ReasoningLayer;
  private readonly reasoning: ReasoningEngine;
  private readonly responses = new ResponseComposer();
  private readonly personality = new PersonalityEngine();
  private readonly emotion = new EmotionAnalyzer();
  private readonly learning: LearningEngine;
  private turnCount = 0;

  constructor(
    private readonly deps: BrainDeps,
    reasoning: ReasoningEngine = new ReasoningEngine(),
  ) {
    this.conversation = new ConversationEngine(deps.memory.profile.data.isGuest);
    this.planner = new TaskPlanner(deps.skills, this.intents);
    this.reasoningLayer = new ReasoningLayer(deps.permissions, deps.skills);
    this.reasoning = reasoning;
    this.learning = new LearningEngine(deps.memory.profile);
  }

  /** Handle management-style commands locally without hitting the model. */
  private handleManagement(text: string): string | null {
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

  async handle(transcript: string): Promise<AgentResponse> {
    const startedAt = Date.now();
    const { memory, skills } = this.deps;

    // 1 — Conversation Manager.
    const reference = this.conversation.beginTurn(transcript);
    const utterance = reference.text;

    // 2 — Intent Engine.
    const intent = this.intents.classify(utterance, { isReference: reference.resolved });
    this.conversation.trackTopic(intent.name, intent.entities);

    const userTurn = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: transcript,
      createdAt: Date.now(),
      intent: intent.name,
    };
    memory.observe(userTurn);
    this.conversation.record(userTurn);

    // 2b — Emotion + Learning (side signals).
    const emotion = this.emotion.detect(utterance);
    const learning = this.learning.observe(utterance);

    // 2c — Memory Intelligence: analyze utterance before storing.
    const ingest = memory.ingest(utterance);

    // 2d — Management shortcuts (describe / forget / rename).
    const managed = this.handleManagement(utterance);
    if (managed) {
      const spoken = managed;
      const nicoTurn = {
        id: crypto.randomUUID(),
        role: "nico" as const,
        content: spoken,
        createdAt: Date.now(),
        intent: intent.name,
      };
      memory.observe(nicoTurn);
      this.conversation.record(nicoTurn);
      this.turnCount++;
      return {
        transcript,
        intent,
        plan: { steps: [], requiresMemory: true, requiresPermissions: [] },
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
            plan: { id: "mgmt", goal: "memory_mgmt", steps: [], requiresMemory: true, requiresPermissions: [] },
            executable: [],
            blocked: [],
            needsMemoryRecall: true,
            needsMemoryWrite: false,
            needsModel: false,
            style: "brief",
            rationale: ["management_command"],
          },
          executions: [],
          memoriesWritten: 0,
          durationMs: Date.now() - startedAt,
        },
      };
    }

    // 3 — Planner.
    const plan = this.planner.plan(intent);

    // 4 — Reasoning Engine (decisioning).
    const decision = this.reasoningLayer.decide({
      intent,
      plan,
      hasMemory: memory.longTerm.all().length > 0,
    });

    // 5 — Skill Execution.
    const executions: ExecutionRecord[] = [];
    const skillResults: SkillResult[] = [];
    const completed = new Set<string>();
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
        hasPermission: (p) => this.deps.permissions.isGranted(p),
      });
      if (result.ok) {
        completed.add(step.id);
        this.conversation.context.rememberAction(step.skill, step.input);
      }
      executions.push({ stepId: step.id, skill: step.skill, result });
      skillResults.push(result);
    }
    for (const b of decision.blocked) {
      skillResults.push({
        ok: false,
        speech: `أحتاج إذن ${b.missing.join(", ")} حتى أقدر أنفذ هذا الطلب.`,
        error: "permission_denied",
      });
    }

    // 6 — Reasoning generation (Personality-shaped system prompt) + Memory Update.
    let reasoningSpeech = "";
    let memoriesWritten = ingest.stored ? 1 : 0;
    if (decision.needsModel) {
      try {
        const out = await this.reasoning.reason({
          transcript: this.reasoningLayer.sanitize(utterance),
          history: this.conversation.memory.history(),
          memoryDigest: [memory.digest(), this.conversation.context.digest()]
            .filter(Boolean)
            .join("\n"),
          skillFindings: skillResults.filter((r) => r.ok).map((r) => r.speech),
          userName: memory.profile.data.preferredName ?? memory.profile.data.name,
          systemPrompt: this.personality.buildSystemPrompt(memory.profile.data, emotion),
        });
        reasoningSpeech = out.speech;
        for (const m of out.memories) {
          const analysis = memory.intelligence.analyze(m.value);
          if (!analysis.shouldConsider) continue;
          if (memory.remember(m)) memoriesWritten++;
          if (m.kind === "profile" && /اسم|name/i.test(m.key)) {
            memory.profile.update({ name: m.value });
          }
        }
      } catch {
        reasoningSpeech = skillResults.some((r) => r.ok)
          ? ""
          : "ما قدرت أوصل لعقلي الآن، جرّب مرة ثانية بعد لحظات.";
      }
    }

    // 6b — If a memory needs confirmation, ask for it in the reply.
    if (ingest.pending && !reasoningSpeech) {
      reasoningSpeech = `تبي أحفظ: "${ingest.pending.analysis.suggestion?.value}"؟ قل "نعم احفظ" لأخزنها.`;
    }

    // 7 — Response Engine.
    const spoken = this.responses.compose({
      intent,
      decision,
      reasoning: reasoningSpeech,
      skillResults,
      firstTurn: this.turnCount === 0,
      userName: memory.profile.data.preferredName ?? memory.profile.data.name,
      referenceNote: reference.note,
    });
    this.turnCount++;

    const nicoTurn = {
      id: crypto.randomUUID(),
      role: "nico" as const,
      content: spoken.speech,
      createdAt: Date.now(),
      intent: intent.name,
    };
    memory.observe(nicoTurn);
    this.conversation.record(nicoTurn);

    const legacyPlan: Plan = {
      steps: plan.steps,
      requiresMemory: plan.requiresMemory,
      requiresPermissions: plan.requiresPermissions,
    };

    return {
      transcript,
      intent,
      plan: legacyPlan,
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
        durationMs: Date.now() - startedAt,
      },
    };
  }
}
