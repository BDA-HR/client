import { api } from '../api';

export interface Branch {
  id: string;
  branchId: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  city: string;
  country: string;
  // ... other branch properties
}

class BranchService {
  private baseUrl = `${import.meta.env.VITE_CORE_URL || 'http://localhost:1212/api/core/v1'}/branches`;

  async getAllBranches(): Promise<Branch[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }

  async getBranchById(id: string): Promise<Branch> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch:', error);
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

  async updateBranch(id: string, branch: Partial<Branch>): Promise<Branch> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, branch);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  async deleteBranch(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
}

export const branchService = new BranchService();