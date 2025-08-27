import { api } from '../api';
import type { Branch, UUID } from '../../types/core/branch';

class BranchService {
  private baseUrl = `${import.meta.env.VITE_CORE_URL || 'http://localhost:1212/api/core/v1'}/branches`;



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
        const response = await api.get(`${this.baseUrl}/${companyId}/branches`);
        return response.data;
      } catch (error) {
        console.error('Error fetching company branches:', error);
        throw error;
      }
    }
  
    async createBranch(companyId: UUID, branch: Omit<Branch, 'id'>): Promise<Branch> {
      try {
        const response = await api.post(`${this.baseUrl}/${companyId}/branches`, branch);
        return response.data;
      } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
      }
    }
  
    async updateBranch(companyId: UUID, branchId: UUID, branch: Partial<Branch>): Promise<Branch> {
      try {
        const response = await api.put(`${this.baseUrl}/${companyId}/branches/${branchId}`, branch);
        return response.data;
      } catch (error) {
        console.error('Error updating branch:', error);
        throw error;
      }
    }
  
    async deleteBranch(companyId: UUID, branchId: UUID): Promise<void> {
      try {
        await api.delete(`${this.baseUrl}/${companyId}/branches/${branchId}`);
      } catch (error) {
        console.error('Error deleting branch:', error);
        throw error;
      }
    }
  }
  

export const branchService = new BranchService();