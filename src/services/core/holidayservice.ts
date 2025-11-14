import { api } from '../api';
import type { HolidayListDto, AddHolidayDto, EditHolidayDto, UUID } from '../../types/core/holiday';

class HolidayService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Holiday`;
  
// GET: baseurl/AllHoliday
  async getAllHolidays(): Promise<HolidayListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllHoliday`);
      return response.data;
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }
  }

  // GET: baseurl/GetHoliday/{id}
  async getHolidayById(id: UUID): Promise<HolidayListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetHoliday/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching holiday:', error);
      throw error;
    }
  }

    // POST: baseurl/AddHoliday
  async createHoliday(holiday: AddHolidayDto): Promise<HolidayListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddHoliday`, holiday);
      return response.data;
    } catch (error) {
      console.error('Error creating holiday:', error);
      throw error;
    }
  }

    // PUT: baseurl/ModHoliday/{id}
  async updateHoliday(updateData: EditHolidayDto): Promise<HolidayListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModHoliday/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating holiday:', error);
      throw error;
    }
  }

    // DELETE: baseurl/DelHoliday/{id}
  async deleteHoliday(id: UUID): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/DelHoliday/${id}`);
    } catch (error) {
      console.error('Error deleting holiday:', error);
      throw error;
    }
  }
}

export const holidayService = new HolidayService();