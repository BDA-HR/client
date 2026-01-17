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
  >
) => {
  return useQuery<LeavePolicyConfigListDto, Error>({
    queryKey: leavePolicyConfigKeys.detail(id!),
    queryFn: () => leavePolicyConfigFetcher.getById(id!),
    enabled: !!id,
    ...options,
  });
};

export const useCreateLeavePolicyConfig = (
  options?: Omit<
    UseMutationOptions<
      LeavePolicyConfigListDto,
      Error,
      LeavePolicyConfigAddDto
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leavePolicyConfigFetcher.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: leavePolicyConfigKeys.detail(data.id as UUID),
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
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leavePolicyConfigFetcher.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: leavePolicyConfigKeys.detail(data.id as UUID),
      });
    },
    ...options,
  });
};

export const useDeleteLeavePolicyConfig = (
  options?: Omit<UseMutationOptions<void, Error, UUID>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leavePolicyConfigFetcher.delete,
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: leavePolicyConfigKeys.detail(id),
      });
    },
    ...options,
  });
};
