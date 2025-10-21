import { api } from '../../api';
import type { 
  UUID,
  PositionListDto,
  PositionAddDto,
  PositionModDto,
  PositionExpListDto,
  PositionExpAddDto,
  PositionExpModDto,
  PositionBenefitListDto,
  PositionBenefitAddDto,
  PositionBenefitModDto,
  PositionEduListDto,
  PositionEduAddDto,
  PositionEduModDto,
  PositionReqListDto,
  PositionReqAddDto,
  PositionReqModDto,
  ProfessionTypeDto,
  EducationLevelDto,
  BenefitSettingDto
} from '../../../types/hr/position';

class PositionService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}/Position`;
  private benefitUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}/PositionBenefit`;
  private eduUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}/PositionEdu`;
  private expUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}/PositionExp`;
  private reqUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}/PositionReq`;

  // ============ POSITION CRUD OPERATIONS ============

  // GET: /api/core/hrmm/v1/Position/AllPosition
  async getAllPositions(): Promise<PositionListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllPosition`);
      return response.data;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/Position/GetPosition/{id}
  async getPositionById(id: UUID): Promise<PositionListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetPosition/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/Position/AddPosition
  async createPosition(position: PositionAddDto): Promise<PositionListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddPosition`, position);
      return response.data;
    } catch (error) {
      console.error('Error creating position:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/Position/ModPosition/{id}
  async updatePosition(updateData: PositionModDto): Promise<PositionListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModPosition/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating position:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/Position/DelPosition/{id}
  async deletePosition(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelPosition/${id}`);
    } catch (error) {
      console.error('Error deleting position:', error);
      throw error;
    }
  }

  // ============ POSITION BENEFIT OPERATIONS ============

  // GET: /api/core/hrmm/v1/PositionBenefit/AllPositionBenefit
  async getAllPositionBenefits(): Promise<PositionBenefitListDto[]> {
    try {
      const response = await api.get(`${this.benefitUrl}/AllPositionBenefit`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position benefits:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/PositionBenefit/GetPositionBenefit/{id}
  async getPositionBenefitById(id: UUID): Promise<PositionBenefitListDto> {
    try {
      const response = await api.get(`${this.benefitUrl}/GetPositionBenefit/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position benefit:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/PositionBenefit/AddPositionBenefit
  async createPositionBenefit(benefit: PositionBenefitAddDto): Promise<PositionBenefitListDto> {
    try {
      const response = await api.post(`${this.benefitUrl}/AddPositionBenefit`, benefit);
      return response.data;
    } catch (error) {
      console.error('Error creating position benefit:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/PositionBenefit/ModPositionBenefit/{id}
  async updatePositionBenefit(updateData: PositionBenefitModDto): Promise<PositionBenefitListDto> {
    try {
      const response = await api.put(`${this.benefitUrl}/ModPositionBenefit/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating position benefit:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/PositionBenefit/DelPositionBenefit/{id}
  async deletePositionBenefit(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.benefitUrl}/DelPositionBenefit/${id}`);
    } catch (error) {
      console.error('Error deleting position benefit:', error);
      throw error;
    }
  }

  // ============ POSITION EDUCATION OPERATIONS ============

  // GET: /api/core/hrmm/v1/PositionEdu/AllPositionEdu
  async getAllPositionEducations(): Promise<PositionEduListDto[]> {
    try {
      const response = await api.get(`${this.eduUrl}/AllPositionEdu`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position educations:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/PositionEdu/GetPositionEdu/{id}
  async getPositionEducationById(id: UUID): Promise<PositionEduListDto> {
    try {
      const response = await api.get(`${this.eduUrl}/GetPositionEdu/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position education:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/PositionEdu/AddPositionEdu
  async createPositionEducation(education: PositionEduAddDto): Promise<PositionEduListDto> {
    try {
      const response = await api.post(`${this.eduUrl}/AddPositionEdu`, education);
      return response.data;
    } catch (error) {
      console.error('Error creating position education:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/PositionEdu/ModPositionEdu/{id}
  async updatePositionEducation(updateData: PositionEduModDto): Promise<PositionEduListDto> {
    try {
      const response = await api.put(`${this.eduUrl}/ModPositionEdu/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating position education:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/PositionEdu/DelPositionEdu/{id}
  async deletePositionEducation(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.eduUrl}/DelPositionEdu/${id}`);
    } catch (error) {
      console.error('Error deleting position education:', error);
      throw error;
    }
  }

  // ============ POSITION EXPERIENCE OPERATIONS ============

  // GET: /api/core/hrmm/v1/PositionExp/AllPositionExp
  async getAllPositionExperiences(): Promise<PositionExpListDto[]> {
    try {
      const response = await api.get(`${this.expUrl}/AllPositionExp`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position experiences:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/PositionExp/GetPositionExp/{id}
  async getPositionExperienceById(id: UUID): Promise<PositionExpListDto> {
    try {
      const response = await api.get(`${this.expUrl}/GetPositionExp/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position experience:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/PositionExp/AddPositionExp
  async createPositionExperience(experience: PositionExpAddDto): Promise<PositionExpListDto> {
    try {
      const response = await api.post(`${this.expUrl}/AddPositionExp`, experience);
      return response.data;
    } catch (error) {
      console.error('Error creating position experience:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/PositionExp/ModPositionExp/{id}
  async updatePositionExperience(updateData: PositionExpModDto): Promise<PositionExpListDto> {
    try {
      const response = await api.put(`${this.expUrl}/ModPositionExp/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating position experience:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/PositionExp/DelPositionExp/{id}
  async deletePositionExperience(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.expUrl}/DelPositionExp/${id}`);
    } catch (error) {
      console.error('Error deleting position experience:', error);
      throw error;
    }
  }

  // ============ POSITION REQUIREMENT OPERATIONS ============

  // GET: /api/core/hrmm/v1/PositionReq/AllPositionReq
  async getAllPositionRequirements(): Promise<PositionReqListDto[]> {
    try {
      const response = await api.get(`${this.reqUrl}/AllPositionReq`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position requirements:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/PositionReq/GetPositionReq/{id}
  async getPositionRequirementById(id: UUID): Promise<PositionReqListDto> {
    try {
      const response = await api.get(`${this.reqUrl}/GetPositionReq/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching position requirement:', error);
      throw error;
    }
  }

  // POST: /api/core/hrmm/v1/PositionReq/AddPositionReq
  async createPositionRequirement(requirement: PositionReqAddDto): Promise<PositionReqListDto> {
    try {
      const response = await api.post(`${this.reqUrl}/AddPositionReq`, requirement);
      return response.data;
    } catch (error) {
      console.error('Error creating position requirement:', error);
      throw error;
    }
  }

  // PUT: /api/core/hrmm/v1/PositionReq/ModPositionReq/{id}
  async updatePositionRequirement(updateData: PositionReqModDto): Promise<PositionReqListDto> {
    try {
      const response = await api.put(`${this.reqUrl}/ModPositionReq/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating position requirement:', error);
      throw error;
    }
  }

  // DELETE: /api/core/hrmm/v1/PositionReq/DelPositionReq/{id}
  async deletePositionRequirement(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.reqUrl}/DelPositionReq/${id}`);
    } catch (error) {
      console.error('Error deleting position requirement:', error);
      throw error;
    }
  }
}

class LookupService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/hrmm/v1'}`;

  // GET: /api/core/hrmm/v1/EducationQual/AllEducationQual
  async getAllEducationLevels(): Promise<EducationLevelDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/EducationQual/AllEducationQual`);
      return response.data;
    } catch (error) {
      console.error('Error fetching education levels:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/ProfessionType/AllProfessionType
  async getAllProfessionTypes(): Promise<ProfessionTypeDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/ProfessionType/AllProfessionType`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profession types:', error);
      throw error;
    }
  }

  // GET: /api/core/hrmm/v1/BenefitSet/AllBenefitSet
  async getAllBenefitSettings(): Promise<BenefitSettingDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/BenefitSet/AllBenefitSet`);
      return response.data;
    } catch (error) {
      console.error('Error fetching benefit settings:', error);
      throw error;
    }
  }
}

export const positionService = new PositionService();
export const lookupService = new LookupService();