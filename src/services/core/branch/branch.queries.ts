import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { branchApi } from "./branch.api";

import type {
  UUID
} from "../../../types/core/branch";
import { branchKeys } from "./branch.key";

/* ---------- Queries ---------- */

export const useBranches = () =>
  useQuery({
    queryKey: branchKeys.lists(),
    queryFn: branchApi.getAll,
  });

export const useBranch = (id: UUID) =>
  useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => branchApi.getById(id),
    enabled: !!id,
  });

export const useCompanyBranches = (companyId: UUID) =>
  useQuery({
    queryKey: branchKeys.listByCompany(companyId),
    queryFn: () => branchApi.getByCompany(companyId),
    enabled: !!companyId,
  });

export const useBranchCompanyList = () =>
  useQuery({
    queryKey: branchKeys.companyList(),
    queryFn: branchApi.getBranchCompanyList,
  });

/* ---------- Mutations ---------- */

export const useCreateBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: branchApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: branchKeys.lists() });
    },
  });
};

export const useUpdateBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: branchApi.update,
    onSuccess: (_, data) => {
      qc.invalidateQueries({ queryKey: branchKeys.lists() });
      qc.invalidateQueries({ queryKey: branchKeys.detail(data.id) });
    },
  });
};

export const useDeleteBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: branchApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: branchKeys.lists() });
    },
  });
};
