import type { Intent, IntentName } from "../shared/types";

interface Rule {
  intent: IntentName;
  patterns: RegExp[];
  entities?: (text: string) => Record<string, string>;
}

const RULES: Rule[] = [
  { intent: "greeting", patterns: [/^(مرحبا|أهلا|اهلا|سلام|السلام|hi|hello|hey)/i] },
  {
    intent: "reminder",
    patterns: [/ذكرني|تذكير|منبه|remind/i],
    entities: (t) => {
      const entities: Record<string, string> = {};
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
    },
  },
  { intent: "notes", patterns: [/ملاحظة|ملاحظاتي|الملاحظات|\bnote(s)?\b/i] },
  { intent: "weather", patterns: [/طقس|جو|حرارة|مطر|weather/i] },
  { intent: "calendar", patterns: [/موعد|اجتماع|تقويم|جدول|calendar|meeting/i] },
  { intent: "smart_home", patterns: [/أطفئ|اطفئ|شغل|النور|المكيف|الاضاءة|light|lamp/i] },
  { intent: "memory_store", patterns: [/تذكر أن|احفظ|خزن|remember that/i] },
  { intent: "memory_recall", patterns: [/ما هو اسمي|هل تتذكر|شو تعرف عني|what do you know/i] },
  { intent: "search", patterns: [/ابحث|بحث|search|google/i] },
  { intent: "question", patterns: [/^(ما|من|كيف|لماذا|متى|أين|هل|what|how|why|when|where)/i] },
];

/**
 * Fast deterministic first pass. The ReasoningEngine may override a
 * low-confidence result with the model's own classification.
 */
export class IntentEngine {
  detect(text: string): Intent {
    const raw = text.trim();
    for (const rule of RULES) {
      if (rule.patterns.some((p) => p.test(raw))) {
        return {
          name: rule.intent,
          confidence: 0.82,
          entities: rule.entities?.(raw) ?? {},
          raw,
        };
      }
    }
    return { name: raw.length > 0 ? "smalltalk" : "unknown", confidence: 0.4, entities: {}, raw };
  }
}
