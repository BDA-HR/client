// services/hr/JgStepService.ts
import { api } from '../../api';
import type { 
  JgStepListDto, 
  JgStepAddDto, 
  JgStepModDto, 
  UUID 
} from '../../../types/hr/JgStep';

class JgStepService {
  private baseUrl = `${import.meta.env.VITE_CORE_HRMM_URL || 'core/hrmm/v1'}/JgStep`;

  // GET: /api/core/hrmm/v1/JgStep/AllJgSteps/{id} - Get list of Job Grade Steps by JobGradeId
  async getJgStepsByJobGrade(jobGradeId: UUID): Promise<JgStepListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllJgSteps/${jobGradeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job grade steps by job grade:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/JgStep/GetJgStep/{id} - Get single job grade step
  async getJgStepById(id: UUID): Promise<JgStepListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetJgStep/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job grade step:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/JgStep/AddJgStep
  async createJgStep(jgStep: JgStepAddDto): Promise<JgStepListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddJgStep`, jgStep);
      return response.data;
    } catch (error) {
      console.error('Error creating job grade step:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/JgStep/ModJgStep/{id}
  async updateJgStep(updateData: JgStepModDto): Promise<JgStepListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModJgStep/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating job grade step:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/JgStep/DelJgStep/{id}
  async deleteJgStep(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelJgStep/${id}`);
    } catch (error) {
      console.error('Error deleting job grade step:', error);
      throw error;
    }
  }
}

export const jgStepService = new JgStepService();