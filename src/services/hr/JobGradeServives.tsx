import { api } from '../api';
import type { 
  JobGradeListDto, 
  JobGradeAddDto, 
  JobGradeModDto, 
  UUID 
} from '../../types/hr/jobgrade';

class JobGradeService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}/JobGrade`;

  // GET: /api/core/hrmm/v1/JobGrade/AllJobGrade
  async getAllJobGrades(): Promise<JobGradeListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllJobGrade`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job grades:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/JobGrade/GetJobGrade/{id}
  async getJobGradeById(id: UUID): Promise<JobGradeListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetJobGrade/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job grade:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/JobGrade/AddJobGrade
  async createJobGrade(jobGrade: JobGradeAddDto): Promise<JobGradeListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddJobGrade`, jobGrade);
      return response.data;
    } catch (error) {
      console.error('Error creating job grade:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/JobGrade/ModJobGrade/{id}
  async updateJobGrade(updateData: JobGradeModDto): Promise<JobGradeListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModJobGrade/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating job grade:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/JobGrade/DelJobGrade/{id}
  async deleteJobGrade(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelJobGrade/${id}`);
    } catch (error) {
      console.error('Error deleting job grade:', error);
      throw error;
    }
  }
}

export const jobGradeService = new JobGradeService();