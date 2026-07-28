import type { Skill } from "../../shared/types";
import { reminderEngine } from "../../tasks/ReminderEngine";

export const ReminderSkill: Skill = {
  id: "reminder",
  name: "التذكيرات",
  description: "ينشئ تذكيرات مؤقتة وينبّه المستخدم",
  intents: ["reminder"],
  permissions: ["notifications"],
  async execute({ intent }) {
    const amount = Number(intent.entities.amount ?? 10);
    const unit = intent.entities.unit ?? "دقيقة";
    const minutes = /ساع|hour/i.test(unit) ? amount * 60 : amount;
    const title = intent.raw
      .replace(/ذكرني|remind me/gi, "")
      .replace(/(?:بعد|خلال)\s+\d+\s*\S+/i, "")
      .replace(/^\s*(ب|أن|ان|to)\s*/i, "")
      .trim();

    const task = reminderEngine.create(title || "تذكير", minutes);
    return {
      ok: true,
      speech: `تمام، بذكرك بـ"${task.title}" بعد ${minutes} دقيقة.`,
      data: { id: task.id, dueAt: task.dueAt },
    };
  },
};
