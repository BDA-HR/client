import { api } from '../../api';
import type { 
  EducationQualListDto, 
  EducationQualAddDto, 
  EducationQualModDto, 
  UUID 
} from '../../../types/hr/educationalqual';

class EducationQualService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}/EducationQual`;

  // GET: /api/core/hrmm/v1/EducationQual/AllEducationQual
  async getAllEducationQuals(): Promise<EducationQualListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllEducationQual`);
      return response.data;
    } catch (error) {
      console.error('Error fetching educational qualifications:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/EducationQual/GetEducationQual/{id}
  async getEducationQualById(id: UUID): Promise<EducationQualListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetEducationQual/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching educational qualification:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/EducationQual/AddEducationQual
  async createEducationQual(educationQual: EducationQualAddDto): Promise<EducationQualListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddEducationQual`, educationQual);
      return response.data;
    } catch (error) {
      console.error('Error creating educational qualification:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/EducationQual/ModEducationQual/{id}
  async updateEducationQual(updateData: EducationQualModDto): Promise<EducationQualListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModEducationQual/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating educational qualification:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/EducationQual/DelEducationQual/{id}
  async deleteEducationQual(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelEducationQual/${id}`);
    } catch (error) {
      console.error('Error deleting educational qualification:', error);
      throw error;
    }
  }
}

export const educationQualService = new EducationQualService();