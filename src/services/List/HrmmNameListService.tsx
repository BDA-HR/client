import { api } from '../api';
import type { NameListItem } from '../../types/NameList/nameList';
import type { UUID } from '../../types/List/list';
import type { NameListDto } from '../../types/hr/NameListDto';

class NameListService {
  private baseUrl = `${import.meta.env.VITE_CORE_HRMM_URL || '/core/hrmm/v1'}/Names`;
  private moduleBaseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || '/core/module/v1'}/Names`;

  // Address Name endpoints
  async getAllAddressNames(): Promise<NameListItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllAddressName`);
      return response.data;
    } catch (error) {
      console.error('Error fetching address names:', error);
      throw error;
    }
  }

  async getAddressNameById(id: UUID): Promise<NameListItem> {
    try {
      const response = await api.get(`${this.baseUrl}/GetAddressName/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching address name:', error);
      throw error;
    }
  }

  // Benefit Set Name endpoints
  async getAllBenefitSetNames(): Promise<NameListItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllBenefitSetName`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefit set names:', error);
      throw error;
    }
  }

  async getBenefitSetNameById(id: UUID): Promise<NameListItem> {
    try {
      const response = await api.get(`${this.baseUrl}/GetBenefitSetName/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefit set name:', error);
      throw error;
    }
  }

  // Education Qualification Name endpoints
  async getAllEducationQualNames(): Promise<NameListItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllEducationQualName`);
      return response.data;
    } catch (error) {
      console.error('Error fetching education qualification names:', error);
      throw error;
    }
  }

  async getEducationQualNameById(id: UUID): Promise<NameListItem> {
    try {
      const response = await api.get(`${this.baseUrl}/GetEducationQualName/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching education qualification name:', error);
      throw error;
    }
  }

  // Job Grade Name endpoints
  async getAllJobGradeNames(): Promise<NameListItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllJobGradeName`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job grade names:', error);
      throw error;
    }
  }

  async getJobGradeNameById(id: UUID): Promise<NameListItem> {
    try {
      const response = await api.get(`${this.baseUrl}/GetJobGradeName/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job grade name:', error);
      throw error;
    }
  }

  // Job Grade Step Name endpoints
  //   async getAllJgStepNames(): Promise<JgStepNameItem[]> {
  //     try {
  //       const response = await api.get(`${this.baseUrl}/AllJgStepName`);
  //       return response.data;
  //     } catch (error) {
  //       console.error('Error fetching job grade step names:', error);
  //       throw error;
  //     }
  //   }

  //   async getJgStepNameById(id: UUID): Promise<JgStepNameItem> {
  //     try {
  //       const response = await api.get(`${this.baseUrl}/GetJgStepName/${id}`);
  //       return response.data;
  //     } catch (error) {
  //       console.error('Error fetching job grade step name:', error);
  //       throw error;
  //     }
  //   }

  // Position Name endpoints
  async getAllPositionNames(): Promise<NameListItem[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllPositionName`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position names:', error);
      throw error;
    }
  }

  // Department Position endpoints
  async getDepartmentPositions(departmentId: UUID): Promise<NameListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/DeptPosition/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department positions:', error);
      throw error;
    }
  }

  // Department Position endpoints
  async getBranchComp(): Promise<NameListDto[]> {
    try {
      const response = await api.get(`${this.moduleBaseUrl}/BranchCompList`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department positions:', error);
      throw error;
    }
  }

  // Department Name endpoints (from module service)
  async getAllDepartmentNames(): Promise<NameListItem[]> {
    try {
      const response = await api.get(`${this.moduleBaseUrl}/AllDeptName`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department names:', error);
      throw error;
    }
  }

  async getDepartmentNameById(id: UUID): Promise<NameListItem> {
    try {
      const response = await api.get(`${this.moduleBaseUrl}/GetDeptName/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department name:', error);
      throw error;
    }
  }
}

export const nameListService = new NameListService();