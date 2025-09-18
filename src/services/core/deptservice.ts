import { api } from '../api';
import type { DeptListDto, AddDeptDto, EditDeptDto, UUID } from '../../types/core/dept';

class DepartmentService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core//module/v1'}/department`;

  async getAllDepartments(): Promise<DeptListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllDepartment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  async getDepartmentById(id: UUID): Promise<DeptListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetDepartment/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department:', error);
      throw error;
    }
  }

  async createDepartment(department: AddDeptDto): Promise<DeptListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddDepartment`, department);
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }

  async updateDepartment(updateData: EditDeptDto): Promise<DeptListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModDepartment/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }

  async deleteDepartment(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelDepartment/${id}`);
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  }
}

export const departmentService = new DepartmentService();