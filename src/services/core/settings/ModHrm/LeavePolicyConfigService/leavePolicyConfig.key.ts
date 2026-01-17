import type { UUID } from "../../../../../types/core/Settings/leavePolicyConfig";

export const leavePolicyConfigKeys = {
  all: ["leave-policy-config"] as const,
  details: () => [...leavePolicyConfigKeys.all, "detail"] as const,
  detail: (id: UUID) => [...leavePolicyConfigKeys.details(), id] as const,
};
