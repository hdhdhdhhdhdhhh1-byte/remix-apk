import { KnowledgeEngine } from "./src/packages/knowledge/KnowledgeEngine";

async function main() {
  const k = new KnowledgeEngine();

  const questions = [
    "اليمن",
    "عاصمة اليمن",
    "صنعاء"
  ];

  for (const q of questions) {
    console.log("\nسؤال:", q);
    const result = await k.search(q);
    console.log(result);
    console.log("الجواب:", await k.answer(q));
  }
}

main();
