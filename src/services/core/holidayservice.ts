import { api } from '../api';
import type { HolidayListDto, AddHolidayDto, EditHolidayDto, UUID } from '../../types/core/holiday';

class HolidayService {
  private baseUrl = `${import.meta.env.VITE_CORE_MODULE_URL || 'core/module/v1'}/Holiday`;

  // Helper method to extract error messages
  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      // Handle validation errors (object with field names as keys)
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      return errorMessages.join(', ');
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
  
  // GET: baseurl/AllHoliday
  async getAllHolidays(): Promise<HolidayListDto[]> {
    try {
      const response = await api.get(`${this.baseUrl}/AllHoliday`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching holidays:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // GET: baseurl/GetHoliday/{id}
  async getHolidayById(id: UUID): Promise<HolidayListDto> {
    try {
      const response = await api.get(`${this.baseUrl}/GetHoliday/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error fetching holiday:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: baseurl/AddHoliday
  async createHoliday(holiday: AddHolidayDto): Promise<HolidayListDto> {
    try {
      const response = await api.post(`${this.baseUrl}/AddHoliday`, holiday);
      console.info('Holiday created successfully:', response.data.id);
      return response.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error creating holiday:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // PUT: baseurl/ModHoliday/{id}
  async updateHoliday(updateData: EditHolidayDto): Promise<HolidayListDto> {
    try {
      const response = await api.put(`${this.baseUrl}/ModHoliday/${updateData.id}`, updateData);
      return response.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error updating holiday:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // DELETE: baseurl/DelHoliday/{id}
  async deleteHoliday(id: UUID): Promise<void> {
    try {
      const response = await api.delete(`${this.baseUrl}/DelHoliday/${id}`);
      console.info('Holiday deleted successfully:', response.data.message);
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error deleting holiday:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const holidayService = new HolidayService();