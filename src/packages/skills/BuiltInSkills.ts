import type { Skill } from "../shared/types";
import { WeatherSkill } from "./builtin/WeatherSkill";
import { CalendarSkill } from "./builtin/CalendarSkill";
import { ReminderSkill } from "./builtin/ReminderSkill";
import { SearchSkill } from "./builtin/SearchSkill";
import { SmartHomeSkill } from "./builtin/SmartHomeSkill";
import { MemorySkill } from "./builtin/MemorySkill";

export function builtInSkills(): Skill[] {
  return [WeatherSkill, CalendarSkill, ReminderSkill, SearchSkill, SmartHomeSkill, MemorySkill];
}

export {
  WeatherSkill,
  CalendarSkill,
  ReminderSkill,
  SearchSkill,
  SmartHomeSkill,
  MemorySkill,
};
