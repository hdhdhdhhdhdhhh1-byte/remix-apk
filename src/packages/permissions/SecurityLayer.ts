import type { PermissionKey, Skill } from "../shared/types";
import type { PermissionManager } from "./PermissionManager";

export interface SecurityDecision {
  allowed: boolean;
  missing: PermissionKey[];
  reason?: string;
}

/**
 * Guard that sits between the planner and any skill execution.
 * Sensitive capabilities are default-deny.
 */
export class SecurityLayer {
  constructor(private readonly permissions: PermissionManager) {}

  authorize(skill: Skill): SecurityDecision {
    const missing = (skill.permissions ?? []).filter((p) => !this.permissions.isGranted(p));
    return missing.length
      ? { allowed: false, missing, reason: "permission_denied" }
      : { allowed: true, missing: [] };
  }

  /** Strips anything that must never leave the device into an LLM prompt. */
  sanitizeForModel(text: string): string {
    return text
      .replace(/\b\d{13,19}\b/g, "[رقم محجوب]")
      .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[بريد محجوب]");
  }
}
