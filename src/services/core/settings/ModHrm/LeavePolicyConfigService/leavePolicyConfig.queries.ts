import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { leavePolicyConfigFetcher } from "./leavePolicyConfig.api";
import { leavePolicyConfigKeys } from "./leavePolicyConfig.key";
import type {
  LeavePolicyConfigListDto,
  LeavePolicyConfigAddDto,
  LeavePolicyConfigModDto,
  UUID,
} from "../../../../../types/core/Settings/leavePolicyConfig";

export const useLeavePolicyConfig = (
  id: UUID | undefined,
  options?: Omit<
    UseQueryOptions<LeavePolicyConfigListDto, Error>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: leavePolicyConfigKeys.detail(id!),
    queryFn: () => leavePolicyConfigFetcher.getById(id!),
    enabled: !!id,
    ...options,
  });

export const useActiveLeavePolicyConfig = (
  id: UUID | undefined,
  options?: Omit<
    UseQueryOptions<LeavePolicyConfigListDto, Error>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: leavePolicyConfigKeys.active(id!),
    queryFn: () => leavePolicyConfigFetcher.getActiveById(id!),
    enabled: !!id,
    ...options,
  });

export const useAllLeavePolicyConfigs = (
  id: UUID | undefined,
  options?: Omit<
    UseQueryOptions<LeavePolicyConfigListDto[], Error>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: leavePolicyConfigKeys.list(id!),
    queryFn: () => leavePolicyConfigFetcher.getAllById(id!),
    enabled: !!id,
    ...options,
  });

export const useCreateLeavePolicyConfig = (
  options?: Omit<
    UseMutationOptions<
      LeavePolicyConfigListDto,
      Error,
      LeavePolicyConfigAddDto
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leavePolicyConfigFetcher.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: leavePolicyConfigKeys.all,
      });
    },
    ...options,
  });
};

export const useUpdateLeavePolicyConfig = (
  options?: Omit<
    UseMutationOptions<
      LeavePolicyConfigListDto,
      Error,
      LeavePolicyConfigModDto
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leavePolicyConfigFetcher.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: leavePolicyConfigKeys.detail(data.id as UUID),
      });
      queryClient.invalidateQueries({
        queryKey: leavePolicyConfigKeys.all,
      });
    },
    ...options,
  });
};

export const useDeleteLeavePolicyConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => leavePolicyConfigFetcher.delete(id),
    onSuccess: (_, id) => {
      // Invalidate the leave policy config list so table updates automatically
      queryClient.invalidateQueries({ queryKey: leavePolicyConfigKeys.all });
      queryClient.invalidateQueries({
        queryKey: leavePolicyConfigKeys.list(id),
      });
    },
  });
};
