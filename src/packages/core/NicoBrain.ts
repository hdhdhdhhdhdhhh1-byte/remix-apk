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
import { KnowledgeEngine } from "../knowledge/KnowledgeEngine";

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

export class NicoBrain {

  readonly conversation: ConversationEngine;

  private readonly intents = new AdvancedIntentEngine();
  private readonly planner: TaskPlanner;
  private readonly reasoningLayer: ReasoningLayer;
  private readonly reasoning: ReasoningEngine;
  private readonly responses = new ResponseComposer();
  private readonly personality = new PersonalityEngine();
  private readonly emotion = new EmotionAnalyzer();
  private readonly knowledge = new KnowledgeEngine();
  private readonly learning: LearningEngine;

  private turnCount = 0;


  constructor(
    private readonly deps: BrainDeps,
    reasoning: ReasoningEngine = new ReasoningEngine(),
  ) {
    this.conversation =
      new ConversationEngine(deps.memory.profile.data.isGuest);

    this.planner =
      new TaskPlanner(deps.skills, this.intents);

    this.reasoningLayer =
      new ReasoningLayer(deps.permissions, deps.skills);

    this.reasoning = reasoning;

    this.learning =
      new LearningEngine(deps.memory.profile);
  }


  private handleManagement(text: string): string | null {

    const t = text.trim();


    if (/^(ماذا تتذكر|شو تعرف|ماذا تعرف|what do you (know|remember))/i.test(t)) {

      const lines =
        this.deps.memory.describeAll();

      if (!lines.length)
        return "ما عندي شي محفوظ عنك بعد.";

      return "هذا اللي أتذكره: " +
        lines.slice(0,8).join("؛ ") +
        ".";
    }


    if (/^(نعم احفظ|احفظها|أوكي احفظ|yes save|save it)/i.test(t)) {

      const pending =
        this.deps.memory.pendingMemories().at(-1);

      if (!pending)
        return "ما عندي شي بانتظار الحفظ.";

      this.deps.memory.confirmPending(pending.id);

      return "تمام، حفظتها.";
    }


    if (/^(لا لا تحفظ|تجاهل|don'?t save|skip)/i.test(t)) {

      const pending =
        this.deps.memory.pendingMemories().at(-1);

      if (pending)
        this.deps.memory.rejectPending(pending.id);

      return "تمام، ما رح أحفظها.";
    }


    const rename =
      t.match(
        /(?:غير اسمي إلى|اسمي الجديد|change my name to)\s+([\u0600-\u06FFA-Za-z]+)/i
      );


    if (rename) {

      this.deps.memory.profile.update({
        name: rename[1]
      });

      return `تمام، رح أناديك ${rename[1]}.`;
    }


    return null;
  }


  private localFallback(text:string):string {

    const t=text.toLowerCase();


    if (/مرحبا|مرحبًا|السلام|اهلا|أهلا/.test(t))
      return "أهلاً بك، أنا نيكو. كيف أستطيع مساعدتك؟";


    if (/من أنت|من انت|اسمك/.test(t))
      return "أنا نيكو، مساعدك الذكي المحلي.";


    if (/الوقت|الساعة/.test(t))
      return `الوقت الآن ${new Date().toLocaleTimeString("ar")}`;


    return "أنا أعمل بالوضع المحلي الآن، ويمكنني مساعدتك بالأوامر والمهام المتاحة.";
  }
async handle(transcript: string): Promise<AgentResponse> {

    console.log("NICO DEBUG HANDLE START:", transcript);

    const startedAt = Date.now();

    const { memory, skills } = this.deps;


    const reference =
      this.conversation.beginTurn(transcript);

    const utterance =
      reference.text;


    const intent =
      this.intents.classify(
        utterance,
        { isReference: reference.resolved }
      );

    console.log("BRAIN INTENT:", intent.name);



    // المعرفة المحلية
    let knowledgeAnswer: string | null = null;

    const knowledgeIntent =
      intent.name === "question";


    if (knowledgeIntent) {
      knowledgeAnswer =
        await this.knowledge.ask(utterance);
    }



    if (knowledgeAnswer) {

      return {

        transcript,

        intent,

        plan: {
          steps: [],
          requiresMemory: false,
          requiresPermissions: [],
        },

        speech: knowledgeAnswer,

        skillResults: [],

        memoriesWritten: 0,

        emotion: undefined,

        learning: undefined,

        pendingConfirmationId: undefined,


        trace: {

          sessionId:
            this.conversation.session.id(),

          reference,

          intent,

          decision: true,

          executions: [],

          memoriesWritten: 0,

          durationMs:
            Date.now() - startedAt,
        },
      } as AgentResponse;
    }



    this.conversation.trackTopic(
      intent.name,
      intent.entities
    );



    const userTurn = {

      id: crypto.randomUUID(),

      role: "user" as const,

      content: transcript,

      createdAt: Date.now(),

      intent: intent.name,
    };


    memory.observe(userTurn);

    this.conversation.record(userTurn);



    const emotion =
      this.emotion.detect(utterance);


    const learning =
      this.learning.observe(utterance);



    const ingest =
      memory.ingest(utterance);



    const managed =
      this.handleManagement(utterance);



    if (managed) {

      const nicoTurn = {

        id: crypto.randomUUID(),

        role: "nico" as const,

        content: managed,

        createdAt: Date.now(),

        intent: intent.name,
      };


      memory.observe(nicoTurn);

      this.conversation.record(nicoTurn);


      return {

        transcript,

        intent,


        plan: {
          steps: [],
          requiresMemory: true,
          requiresPermissions: [],
        },


        speech: managed,


        skillResults: [],

        memoriesWritten: 0,

        emotion,

        learning: learning.change,

        pendingConfirmationId:
          ingest.pending?.id,


        trace: {

          sessionId:
            this.conversation.session.id(),

          reference,

          intent,

          decision: true,

          executions: [],

          memoriesWritten: 0,

          durationMs:
            Date.now() - startedAt,
        },

      } as AgentResponse;
    }



    const plan =
      this.planner.plan(intent);



    const decision =
      this.reasoningLayer.decide({

        intent,

        plan,

        hasMemory:
          memory.longTerm.all().length > 0,
      });



    const executions: ExecutionRecord[] = [];

    const skillResults: SkillResult[] = [];

    const completed =
      new Set<string>();



    for (const step of decision.executable) {

      if (!step.dependsOn.every(
        d => completed.has(d)
      ))
        continue;


      const skill =
        skills.get(step.skill);


      if (!skill)
        continue;


      const result =
        await skill.execute({

          intent,

          step,

          profile:
            memory.profile.data,

          recall:
            q => memory.recall(q),

          remember:
            r => void memory.remember(r),

          hasPermission:
            p => this.deps.permissions.isGranted(p),
        });



      if (result.ok) {

        completed.add(step.id);

      }


      executions.push({

        stepId: step.id,

        skill: step.skill,

        result,
      });


      skillResults.push(result);
    }
for (const b of decision.blocked) {

      skillResults.push({

        ok: false,

        speech:
          `أحتاج إذن ${b.missing.join(", ")} حتى أقدر أنفذ هذا الطلب.`,

        error:
          "permission_denied",

      });
    }



    let reasoningSpeech = "";

    let memoriesWritten =
      ingest.stored ? 1 : 0;



    if (decision.needsModel) {

      try {

        const out =
          await this.reasoning.reason({

            transcript:
              this.reasoningLayer.sanitize(utterance),

            history:
              this.conversation.memory.history(),

            memoryDigest:
              [
                memory.digest(),
                this.conversation.context.digest()
              ]
              .filter(Boolean)
              .join("\n"),


            skillFindings:
              skillResults
                .filter(r => r.ok)
                .map(r => r.speech),


            userName:
              memory.profile.data.preferredName ??
              memory.profile.data.name,


            systemPrompt:
              this.personality.buildSystemPrompt(
                memory.profile.data,
                emotion
              ),
          });



        reasoningSpeech =
          out.speech;



        for (const m of out.memories) {

          if (memory.remember(m))
            memoriesWritten++;

        }


      } catch {

        reasoningSpeech =
          this.localFallback(utterance);

      }

    }



    if (ingest.pending && !reasoningSpeech) {

      reasoningSpeech =
        `تبي أحفظ: "${ingest.pending.analysis.suggestion?.value}"؟ قل نعم احفظ لأخزنها.`;

    }



    let spoken;

      if (reasoningSpeech && !skillResults.length) {
        spoken = {
          speech: reasoningSpeech
        };
      } else {
        spoken =
          this.responses.compose({

            intent,

            decision,

            reasoning:
              reasoningSpeech,

            skillResults,

            firstTurn:
              this.turnCount === 0,


            userName:
              memory.profile.data.preferredName ??
              memory.profile.data.name,


            referenceNote:
              reference.note,
          });
      }



    this.turnCount++;



    const nicoTurn = {

      id: crypto.randomUUID(),

      role: "nico" as const,

      content:
        spoken.speech,

      createdAt:
        Date.now(),

      intent:
        intent.name,
    };


    memory.observe(nicoTurn);

    this.conversation.record(nicoTurn);



    const legacyPlan: Plan = {

      steps:
        plan.steps,

      requiresMemory:
        plan.requiresMemory,

      requiresPermissions:
        plan.requiresPermissions,
    };



    console.log(
      "NICO DEBUG FINAL SPEECH:",
      spoken.speech
    );



    return {

      transcript,

      intent,

      plan:
        legacyPlan,


      speech:
        spoken.speech,


      skillResults,


      memoriesWritten,


      emotion,


      learning:
        learning.change,


      pendingConfirmationId:
        ingest.pending?.id,


      trace: {

        sessionId:
          this.conversation.session.id(),


        reference,


        intent,


        decision,


        executions,


        memoriesWritten,


        durationMs:
          Date.now() - startedAt,
      },

    };

  }

}
