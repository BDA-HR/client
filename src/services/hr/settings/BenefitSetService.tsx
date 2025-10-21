import { api } from '../../api';
import type { 
  BenefitSetListDto, 
  BenefitSetAddDto, 
  BenefitSetModDto, 
  UUID 
} from '../../../types/hr/benefit';

class BenefitSetService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}/BenefitSet`;

  // GET: /api/core/hrmm/v1/BenefitSet/AllBenefitSet
  async getAllBenefitSets(): Promise<BenefitSetListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllBenefitSet`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefit sets:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/BenefitSet/GetBenefitSet/{id}
  async getBenefitSetById(id: UUID): Promise<BenefitSetListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetBenefitSet/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefit set:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/BenefitSet/AddBenefitSet
  async createBenefitSet(benefitSet: BenefitSetAddDto): Promise<BenefitSetListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddBenefitSet`, benefitSet);
      return response.data;
    } catch (error) {
      console.error('Error creating benefit set:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/BenefitSet/ModBenefitSet/{id}
  async updateBenefitSet(updateData: BenefitSetModDto): Promise<BenefitSetListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModBenefitSet/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating benefit set:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/BenefitSet/DelBenefitSet/{id}
  async deleteBenefitSet(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelBenefitSet/${id}`);
    } catch (error) {
      console.error('Error deleting benefit set:', error);
      throw error;
    }
  }
}

export const benefitSetService = new BenefitSetService();