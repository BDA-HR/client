import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api";
import type {
  LeaveAppChainListDto,
  LeaveAppChainAddDto,
  LeaveAppChainModDto,
} from "../../../../types/core/Settings/leaveAppChain";
import type { UUID } from "../../../../types/core/Settings/leavePolicyConfig";

const baseUrl = `${
  import.meta.env.VITE_HRMM_LEAVE_URL || "hrm/leave/v1"
}/LeaveAppChain`;

const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(", ");
  }
  if (error.message) return error.message;
  return "An unexpected error occurred";
};

export const leaveAppChainKeys = {
  all: ["leave-app-chain"] as const,
  byPolicy: (leavePolicyId: UUID) =>
    [...leaveAppChainKeys.all, leavePolicyId] as const,
  activeByPolicy: (leavePolicyId: UUID) =>
    [...leaveAppChainKeys.all, "activeByPolicy", leavePolicyId] as const,
  byId: (leaveAppChainId: UUID) =>
    [...leaveAppChainKeys.all, leaveAppChainId] as const,
};

export const leaveAppChainServices = (leavePolicyId: UUID) => {
  const queryClient = useQueryClient();
  const listByPolicy = useQuery({
    queryKey: leaveAppChainKeys.byPolicy(leavePolicyId),
    queryFn: async (): Promise<LeaveAppChainListDto[]> => {
      const res = await api.get(`${baseUrl}/AllAppChain/${leavePolicyId}`);
      return res.data.data;
    },
    enabled: !!leavePolicyId,
  });

  const activeAppChain = useQuery({
    queryKey: leaveAppChainKeys.activeByPolicy(leavePolicyId),
    queryFn: async (): Promise<LeaveAppChainListDto | null> => {
      try {
        const res = await api.get(`${baseUrl}/ActiveAppChain/${leavePolicyId}`);
        console.log("Active chain response:", res.data);

        if (res.data.success && res.data.data) {
           return res.data.data;
        }
        return null;
      } catch (error: any) {
        console.error("Error fetching active chain:", error);
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!leavePolicyId,
  });

  const create = useMutation({
    mutationFn: async (
      payload: LeaveAppChainAddDto
    ): Promise<LeaveAppChainListDto> => {
      const res = await api.post(`${baseUrl}/AddAppChain`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: leaveAppChainKeys.byPolicy(leavePolicyId),
      });
     queryClient.invalidateQueries({
      queryKey: leaveAppChainKeys.activeByPolicy(leavePolicyId),
    });
  },
    onError: (error) => {
      throw new Error(extractErrorMessage(error));
    },
  });

  const update = useMutation({
    mutationFn: async (
      payload: LeaveAppChainModDto
    ): Promise<LeaveAppChainListDto> => {
      const res = await api.put(
        `${baseUrl}/ModAppChain/${payload.id}`,
        payload
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: leaveAppChainKeys.byPolicy(leavePolicyId),
      });
      queryClient.invalidateQueries({
        queryKey: leaveAppChainKeys.activeByPolicy(leavePolicyId),
      });
    },
    onError: (error) => {
      throw new Error(extractErrorMessage(error));
    },
  });

  const remove = useMutation({
    mutationFn: async (id: UUID): Promise<void> => {
      await api.delete(`${baseUrl}/DelAppChain/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: leaveAppChainKeys.byPolicy(leavePolicyId),
      });
    },
    onError: (error) => {
      throw new Error(extractErrorMessage(error));
    },
  });

  return {
    listByPolicy,
    create,
    update,
    remove,
    activeAppChain
  };
};
export const GetAppChainById = ( leaveAppChainId:UUID) => {  
  const GetAppChainById = useQuery({
  queryKey: leaveAppChainKeys.byId(leaveAppChainId),
  queryFn: async (): Promise<LeaveAppChainListDto[]> => {
    const res = await api.get(`${baseUrl}/GetAppChain/${leaveAppChainId}`);
    return res.data.data;
  },
  enabled: !!leaveAppChainId,
});

  return {
    GetAppChainById,
  };}