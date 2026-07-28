import type { IntentName, Skill } from "../shared/types";
import { PluginSystem } from "./PluginSystem";
import { builtInSkills } from "./BuiltInSkills";

/** Public façade over the plugin registry used by the brain. */
export class SkillManager {
  readonly plugins = new PluginSystem();

  constructor(skills: Skill[] = builtInSkills()) {
    this.plugins.registerAll(skills);
  }

  get(id: string) {
    return this.plugins.get(id);
  }

  forIntent(intent: IntentName) {
    return this.plugins.forIntent(intent);
  }

  list() {
    return this.plugins.list();
  }

  install(skill: Skill) {
    return this.plugins.register(skill);
  }
}
