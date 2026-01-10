import type { UUID } from "../../../types/core/branch";

export const branchKeys = {
  all: ["branches"] as const,
  lists: () => [...branchKeys.all, "list"] as const,
  listByCompany: (companyId: UUID) =>
    [...branchKeys.lists(), "company", companyId] as const,
  details: () => [...branchKeys.all, "detail"] as const,
  detail: (id: UUID) => [...branchKeys.details(), id] as const,
  companyList: () => [...branchKeys.all, "company-list"] as const,
};
