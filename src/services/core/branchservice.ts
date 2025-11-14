import { api } from '../api';
import type { Branch, BranchListDto, AddBranchDto, EditBranchDto, BranchCompListDto, UUID } from '../../types/core/branch';

class BranchService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Branch`;
  private braUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Names`;

  // GET: baseurl/AllBranch
  async getAllBranches(): Promise<BranchListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllBranch`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }

  // GET: baseurl/GetBranch/{id}
  async getBranchById(id: UUID): Promise<Branch> {
    try {
      const response = await api.get(`${this.baseUrl}/GetBranch/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error;
    }
  }

  // GET: baseurl/BranchComp/{id}
  async getCompanyBranches(companyId: UUID): Promise<BranchListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/BranchComp/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company branches:', error);
      throw error;
    }
  }

  // NEW: GET: baseurl/BranchCompList
  async getBranchCompanyList(): Promise<BranchCompListDto[]> {
    try {
      const response = await api.get(`${this.braUrl}/BranchCompList`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch company list:', error);
      throw error;
    }
  }

  // POST: baseurl/AddBranch
  async createBranch(branch: AddBranchDto): Promise<BranchListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddBranch`, branch);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  // PUT: baseurl/ModBranch/{id}
  async updateBranch(updateData: EditBranchDto): Promise<BranchListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModBranch/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  // DELETE: baseurl/DelBranch/{id}
  async deleteBranch(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelBranch/${id}`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
}

export const branchService = new BranchService();