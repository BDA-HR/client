import { api } from '../../api';
import type { 
  Branch, 
  BranchListDto, 
  AddBranchDto, 
  EditBranchDto, 
  BranchCompListDto, 
  UUID 
} from '../../../types/core/branch';

export interface BranchFilters {
  companyId?: UUID;
  search?: string;
  page?: number;
  limit?: number;
}

class BranchApi {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Branch`;
  private braUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Names`;

  // Helper method to extract error messages
  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      return errorMessages.join(', ');
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // GET: baseurl/AllBranch
  async getAllBranches(): Promise<BranchListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllBranch`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching branches:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: baseurl/GetBranch/{id}
  async getBranchById(id: UUID): Promise<Branch> {
    try {
      const response = await api.get(`${this.baseUrl}/GetBranch/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching branch:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: baseurl/BranchComp/{id}
  async getCompanyBranches(companyId: UUID): Promise<BranchListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/BranchComp/${companyId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching company branches:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // NEW: GET: baseurl/BranchCompList
  async getBranchCompanyList(): Promise<BranchCompListDto[]> {
    try {
      const response = await api.get(`${this.braUrl}/BranchCompList`);
      // Check if response has data property or is the array directly
      return response.data?.data || response.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching branch company list:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: baseurl/AddBranch
  async createBranch(branch: AddBranchDto): Promise<BranchListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddBranch`, branch);
      console.info('Branch created successfully:', response.data.data.id);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating branch:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // PUT: baseurl/ModBranch/{id}
  async updateBranch(updateData: EditBranchDto): Promise<BranchListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModBranch/${updateData.id}`, updateData);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating branch:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // DELETE: baseurl/DelBranch/{id}
  async deleteBranch(id: UUID): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelBranch/${id}`);
      console.info('Branch deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting branch:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

// Export a singleton instance
export const branchApi = new BranchApi();

// Also export functions for React Query integration
export const branchFetcher = {
  // Queries
  getAllBranches: () => branchApi.getAllBranches(),
  getBranchById: (id: UUID) => branchApi.getBranchById(id),
  getCompanyBranches: (companyId: UUID) => branchApi.getCompanyBranches(companyId),
  getBranchCompanyList: () => branchApi.getBranchCompanyList(),

  // Mutations
  createBranch: (data: AddBranchDto) => branchApi.createBranch(data),
  updateBranch: (data: EditBranchDto) => branchApi.updateBranch(data),
  deleteBranch: (id: UUID) => branchApi.deleteBranch(id),
};

export interface IBranchApi {
  getAllBranches(): Promise<BranchListDto[]>;
  getBranchById(id: UUID): Promise<Branch>;
  getCompanyBranches(companyId: UUID): Promise<BranchListDto[]>;
  getBranchCompanyList(): Promise<BranchCompListDto[]>;
  createBranch(branch: AddBranchDto): Promise<BranchListDto>;
  updateBranch(updateData: EditBranchDto): Promise<BranchListDto>;
  deleteBranch(id: UUID): Promise<void>;
}