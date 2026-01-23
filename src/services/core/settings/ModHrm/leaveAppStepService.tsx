import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api";
import type {
  LeaveAppStepListDto,
  LeaveAppStepAddDto,
  LeaveAppStepModDto,
  UUID,
} from "../../../../types/core/Settings/leaveAppStep";

const baseUrl = `${
  import.meta.env.VITE_HRMM_LEAVE_URL || "hrm/leave/v1"
}/LeaveAppStep`;

const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(", ");
  }
  if (error.message) return error.message;
  return "An unexpected error occurred";
};

export const leaveAppStepKeys = {
  all: ["leave-app-step"] as const,
  byChain: (leaveAppChainId: UUID) =>
    [...leaveAppStepKeys.all, "chain", leaveAppChainId] as const,
  byId: (id: UUID) => [...leaveAppStepKeys.all, id] as const,
};

export const leaveAppStepServices = (leaveAppChainId?: UUID) => {
  const queryClient = useQueryClient();

  const listByChain = useQuery({
    queryKey: leaveAppChainId
      ? leaveAppStepKeys.byChain(leaveAppChainId)
      : ["disabled"],
    queryFn: async (): Promise<LeaveAppStepListDto[]> => {
      if (!leaveAppChainId) {
        throw new Error("leaveAppChainId is required");
      }
      console.log("📞 Fetching steps for chain ID:", leaveAppChainId);
      console.log(
        "📞 Endpoint:",
        `${baseUrl}/AllLeaveAppStep/${leaveAppChainId}`,
      );

      try {
        const res = await api.get(
          `${baseUrl}/AllLeaveAppStep/${leaveAppChainId}`,
        );
        console.log("✅ Steps response:", res.data);
        return res.data.data;
      } catch (error: any) {
        console.error("❌ Error fetching steps:", error);
        console.error("❌ Error response:", error.response);

        if (error.response?.status === 400) {
          console.error(
            "❌ 400 Bad Request - Check if chain ID is valid:",
            leaveAppChainId,
          );
          // Return empty array instead of throwing
          return [];
        }
        throw error;
      }
    },
    enabled: !!leaveAppChainId,
  });

  const create = useMutation({
    mutationFn: async (
      payload: LeaveAppStepAddDto,
    ): Promise<LeaveAppStepListDto> => {
      const res = await api.post(`${baseUrl}/AddLeaveAppStep`, payload);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: leaveAppStepKeys.byChain(variables.leaveAppChainId),
      });
    },
    onError: (error) => {
      throw new Error(extractErrorMessage(error));
    },
  });

  const update = useMutation({
    mutationFn: async (
      payload: LeaveAppStepModDto,
    ): Promise<LeaveAppStepListDto> => {
      const res = await api.put(
        `${baseUrl}/ModLeaveAppStep/${payload.id}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: leaveAppStepKeys.byId(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: leaveAppStepKeys.byChain(variables.leaveAppChainId),
      });
    },
    onError: (error) => {
      throw new Error(extractErrorMessage(error));
    },
  });

  const remove = useMutation({
    mutationFn: async (stepId: UUID): Promise<void> => {
      await api.delete(`${baseUrl}/DelLeaveAppStep/${stepId}`);
    },
    onSuccess: () => {
      if (leaveAppChainId) {
        queryClient.invalidateQueries({
          queryKey: leaveAppStepKeys.byChain(leaveAppChainId),
        });
      }
    },
    onError: (error) => {
      throw new Error(extractErrorMessage(error));
    },
  });

  const getById = (stepId: UUID) =>
    useQuery({
      queryKey: leaveAppStepKeys.byId(stepId),
      queryFn: async (): Promise<LeaveAppStepListDto> => {
        const res = await api.get(`${baseUrl}/GetLeaveAppStep/${stepId}`);
        return res.data.data;
      },
      enabled: !!stepId,
    });

  return {
    listByChain,
    create,
    update,
    remove,
    getById,
  };
};
