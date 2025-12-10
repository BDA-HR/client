import { api } from '../api';
import type { Branch, BranchListDto, AddBranchDto, EditBranchDto, BranchCompListDto, UUID } from '../../types/core/branch';

class BranchService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Branch`;
  private braUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Names`;

  // Helper method to extract error messages
  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      // Handle validation errors (object with field names as keys)
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
      return response.data.data; // Fixed: should be response.data.data based on your company service pattern
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
      return response.data.data; // Fixed: should be response.data.data
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
      return response.data; // Fixed: should be response.data.data
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

export const branchService = new BranchService();