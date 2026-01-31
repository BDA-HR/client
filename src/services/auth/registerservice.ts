import { api } from '../api';
import type { RegStep1, RegStep2, RegStep3, RegRes } from '../../types/auth/registration';

class RegistrationService {
  private baseUrl = `${import.meta.env.VITE_AUTH_MODULE_URL || 'auth/v1'}/Register`;

  private extractErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      return errorMessages.join(', ');
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // POST: /api/auth/v1/Register/Step1
  async step1(registrationData: RegStep1): Promise<RegRes> {
    try {
      const response = await api.post(`${this.baseUrl}/Step1`, registrationData);
      console.info('Registration step 1 completed successfully:', response.data.data.userId);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error in registration step 1:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: /api/auth/v1/Register/Step2
  async step2(registrationData: RegStep2): Promise<RegRes> {
    try {
      const response = await api.post(`${this.baseUrl}/Step2`, registrationData);
      console.info(response.data.data.message);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error in registration step 2:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // POST: /api/auth/v1/Register/Step3
  async step3(registrationData: RegStep3): Promise<RegRes> {
    try {
      const response = await api.post(`${this.baseUrl}/Step3`, registrationData);
      console.info(response.data.data.message);
      return response.data.data;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error in registration step 3:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Combined registration method
  async completeRegistration(step1Data: RegStep1, step2Data: Omit<RegStep2, 'userId'>, step3Data: Omit<RegStep3, 'userId'>): Promise<RegRes> {
    try {
      // Step 1
      const step1Result = await this.step1(step1Data);
      // Step 2
      await this.step2({ userId: step1Result.userId, ...step2Data });
      // Step 3
      const step3Result = await this.step3({ userId: step1Result.userId, ...step3Data });
      return step3Result;
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      console.error('Error in complete registration:', errorMessage);
      throw new Error(errorMessage);
    }
  }

}

export const registrationService = new RegistrationService();