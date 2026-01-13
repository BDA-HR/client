import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions
} from '@tanstack/react-query';
import { branchFetcher } from './branch.api';
import { branchKeys } from './branch.key';
import type { 
  Branch, 
  BranchListDto, 
  AddBranchDto, 
  EditBranchDto, 
  BranchCompListDto, 
  UUID 
} from '../../../types/core/branch';
import type { BranchFilters } from './branch.api';

// Query Hooks

export const useBranches = (
  filters?: BranchFilters,
  options?: Omit<UseQueryOptions<BranchListDto[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<BranchListDto[], Error>({
    queryKey: branchKeys.list(filters),
    queryFn: async () => {
      if (filters?.companyId) {
        return branchFetcher.getCompanyBranches(filters.companyId);
      }
      return branchFetcher.getAllBranches();
    },
    ...options,
  });
};

export const useBranch = (
  id: UUID | undefined,
  options?: Omit<UseQueryOptions<Branch, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Branch, Error>({
    queryKey: branchKeys.detail(id!),
    queryFn: () => branchFetcher.getBranchById(id!),
    enabled: !!id,
    ...options,
  });
};

export const useBranchCompanyList = (
  options?: Omit<UseQueryOptions<BranchCompListDto[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<BranchCompListDto[], Error>({
    queryKey: branchKeys.companyList(),
    queryFn: () => branchFetcher.getBranchCompanyList(),
    ...options,
  });
};

// Mutation Hooks

export const useCreateBranch = (
  options?: Omit<UseMutationOptions<BranchListDto, Error, AddBranchDto>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<BranchListDto, Error, AddBranchDto>({
    mutationFn: branchFetcher.createBranch,
    onSuccess: (newBranch) => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      if (newBranch.compId) {
        queryClient.invalidateQueries({ 
          queryKey: branchKeys.list({ companyId: newBranch.compId }) 
        });
      }
      
      console.info('Branch created successfully:', newBranch.id);
    },
    ...options,
  });
};

export const useUpdateBranch = (
  options?: Omit<UseMutationOptions<BranchListDto, Error, EditBranchDto>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<BranchListDto, Error, EditBranchDto>({
    mutationFn: branchFetcher.updateBranch,
    onSuccess: (updatedBranch) => {
      // Invalidate specific branch detail
      queryClient.invalidateQueries({ 
        queryKey: branchKeys.detail(updatedBranch.id as UUID) 
      });
      
      // Invalidate branches list
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      
      // If branch has a companyId, also invalidate company-specific queries
      if (updatedBranch.compId) {
        queryClient.invalidateQueries({ 
          queryKey: branchKeys.list({ companyId: updatedBranch.compId }) 
        });
      }
      
      console.info('Branch updated successfully:', updatedBranch.id);
    },
    ...options,
  });
};

export const useDeleteBranch = (
  options?: Omit<UseMutationOptions<void, Error, UUID>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, UUID>({
    mutationFn: branchFetcher.deleteBranch,
    onSuccess: (_, id) => {
      // Remove the specific branch from cache
      queryClient.removeQueries({ queryKey: branchKeys.detail(id) });
      
      // Invalidate branches list
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      
      console.info('Branch deleted successfully:', id);
    },
    ...options,
  });
};

// Custom hook for optimistic updates
export const useOptimisticUpdateBranch = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BranchListDto, Error, EditBranchDto, {
    previousBranches: BranchListDto[] | undefined;
    companyId?: UUID;
  }>({
    mutationFn: branchFetcher.updateBranch,
    
    // When mutate is called:
    onMutate: async (updatedBranch) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: branchKeys.lists() });
      
      // Snapshot the previous value
      const previousBranches = queryClient.getQueryData<BranchListDto[]>(
        branchKeys.lists()
      );
      
      // Optimistically update to the new value
      if (previousBranches) {
        queryClient.setQueryData<BranchListDto[]>(
          branchKeys.lists(),
          old => old?.map(branch => 
            branch.id === updatedBranch.id 
              ? { ...branch, ...updatedBranch } 
              : branch
          )
        );
      }
      
      return { previousBranches, companyId: updatedBranch.compId };
    },
    
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, updatedBranch, context) => {
      if (context?.previousBranches) {
        queryClient.setQueryData(branchKeys.lists(), context.previousBranches);
      }
      
      if (context?.companyId) {
        queryClient.invalidateQueries({ 
          queryKey: branchKeys.list({ companyId: context.companyId }) 
        });
      }
    },
    
    // Always refetch after error or success
    onSettled: (updatedBranch) => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      
      if (updatedBranch?.compId) {
        queryClient.invalidateQueries({ 
          queryKey: branchKeys.list({ companyId: updatedBranch.compId }) 
        });
      }
    },
  });
};