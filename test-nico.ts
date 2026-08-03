import { NicoBrain } from "./src/packages/core/NicoBrain";
import { MemoryManager } from "./src/packages/memory/MemoryManager";
import { SkillManager } from "./src/packages/skills/SkillManager";
import { PermissionManager } from "./src/packages/permissions/PermissionManager";

async function main() {
  console.log("🧠 تشغيل اختبار عقل نيكو...\n");

  const memory = new MemoryManager();
  const skills = new SkillManager();
  const permissions = new PermissionManager();

  const brain = new NicoBrain({
    memory,
    skills,
    permissions,
  });

  const questions = [
    "مرحبا نيكو",
    "من أنت؟",
    "ما هي عاصمة اليمن؟",
    "ماذا تعرف عن اليمن؟",
  ];

  for (const q of questions) {
    console.log("👤 أنت:", q);

    const res = await brain.handle(q);

console.log("DEBUG RESULT:", res);

    console.log("🤖 نيكو:", res.speech);
    console.log("🎯 النية:", res.intent.name);
    console.log("--------------------------------\n");
  }
}

main().catch(console.error);
