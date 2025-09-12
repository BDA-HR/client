import { api } from '../api';
import type { Branch, UUID } from '../../types/core/branch';

class BranchService {
  private baseUrl = `${import.meta.env.VITE_CORE_URL || 'core/v1'}/branch`;

  async getBranchById(id: string): Promise<Branch> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error;
    }
  }

  async getCompanyBranches(companyId: UUID): Promise<Branch[]> {
    try {
      const response = await api.get(`${this.baseUrl}/BranchComp/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company branches:', error);
      throw error;
    }
  }

  async createBranch(branch: Omit<Branch, 'id'>): Promise<Branch> {
    try {
      const response = await api.post(this.baseUrl, branch);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  async updateBranch(id: UUID, branch: Partial<Branch>): Promise<Branch> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, branch);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  async deleteBranch(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
}


export const branchService = new BranchService();