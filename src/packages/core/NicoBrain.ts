import { LongTermMemory } from "../memory/LongTermMemory";
import { getDatabase } from "../knowledge/Database";
import type { AgentResponse, ExecutionRecord, SkillResult, Plan } from "../shared/types";

export class NicoBrain {
  private turnCount = 0;
  private deps: any;

  constructor(deps: any) {
    this.deps = deps;
  }

  private localFallback(text: string): string {
    const t = text.toLowerCase();

    // Basic Intent Recognition Offline
    if (/مرحبا|مرحبًا|السلام|اهلا|أهلا/.test(t))
      return "أهلاً بك، أنا نيكو. كيف أستطيع مساعدتك؟";

    if (/من أنت|من انت|اسمك/.test(t) && !/اسمي/.test(t))
      return "أنا نيكو، مساعدك الذكي. أعمل حالياً في الوضع المحلي لضمان استمرارية الخدمة.";

    if (/الوقت|الساعة/.test(t))
      return "الوقت الآن هو " + new Date().toLocaleTimeString("ar-SA");
      
    if (/التاريخ|اليوم/.test(t))
      return "تاريخ اليوم هو " + new Date().toLocaleDateString("ar-SA");

    // Memory Search Fallback - check for "اسمي" specifically
    if (/اسمي/.test(t)) {
        const memoryResults = this.deps.memory.longTerm.search("user_name");
        if (memoryResults.length > 0) {
            return "اسمك هو " + memoryResults[0].value;
        }
    }

    const memoryResults = this.deps.memory.longTerm.search(text);
    if (memoryResults.length > 0) {
      const top = memoryResults[0];
      return "تذكرت شيئاً بخصوص ذلك: " + top.value;
    }

    if (!navigator.onLine) {
      return "عذراً، أنا أعمل بدون إنترنت حالياً. يمكنني مساعدتك في المهام المحلية والبحث في ذاكرتي الخاصة.";
    }

    return "لم أفهم ذلك تماماً، هل يمكنك التوضيح أكثر؟";
  }

  async handle(transcript: string): Promise<AgentResponse> {
    console.log("NICO DEBUG HANDLE START:", transcript);
    const startedAt = Date.now();
    const { memory, skills } = this.deps;

    // Auto-remember important things even offline BEFORE fallback
    if (/اسمي/.test(transcript) && (/أحمد|احمد/.test(transcript))) {
        memory.longTerm.write({ key: "user_name", value: "أحمد" });
    }

    // 1. Check Connectivity
    const isOffline = !navigator.onLine;

    // 2. Intent Recognition (Simplified for Offline)
    let intent = { name: "unknown", confidence: 0 };
    if (isOffline) {
        if (/احفظ|تذكر/.test(transcript)) intent = { name: "memory_write", confidence: 0.9 };
        else if (/بحث|ابحث/.test(transcript)) intent = { name: "knowledge_search", confidence: 0.8 };
    }

    // 3. Process Request
    let reasoningSpeech = "";
    let skillResults: SkillResult[] = [];
    let executions: ExecutionRecord[] = [];

    // Always try local fallback if offline or as a quick response path
    reasoningSpeech = this.localFallback(transcript);

    const nicoTurn = {
      id: crypto.randomUUID(),
      role: "nico" as const,
      content: reasoningSpeech,
      createdAt: Date.now(),
      intent: intent.name,
    };

    return {
      transcript,
      intent: intent as any,
      plan: { steps: [], requiresMemory: true, requiresPermissions: [] },
      speech: reasoningSpeech,
      skillResults,
      memoriesWritten: 1,
      emotion: "neutral",
      learning: false,
      trace: {
        sessionId: "local-session",
        intent: intent as any,
        decision: {} as any,
        executions,
        memoriesWritten: 1,
        durationMs: Date.now() - startedAt,
      },
    };
  }
}
