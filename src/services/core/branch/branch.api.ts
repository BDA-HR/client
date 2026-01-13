import { api } from "../../api";
import type {
  Branch,
  BranchListDto,
  AddBranchDto,
  EditBranchDto,
  BranchCompListDto,
  UUID,
} from "../../../types/core/branch";

const BASE_URL = `${
  import.meta.env.VITE_CORE_MODULE_URL || "core/module/v1"
}/Branch`;
const NAMES_URL = `${
  import.meta.env.VITE_CORE_MODULE_URL || "core/module/v1"
}/Names`;

const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) return error.response.data.message;

  if (error.response?.data?.errors) {
    const errors = Object.values(error.response.data.errors).flat();
    return errors.join(", ");
  }

  if (error.message) return error.message;

  return "An unexpected error occurred";
};

export const branchApi = {
  async getAll(): Promise<BranchListDto[]> {
    try {
      const res = await api.get(`${BASE_URL}/AllBranch`);
      return res.data.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  },

  async getById(id: UUID): Promise<Branch> {
    try {
      const res = await api.get(`${BASE_URL}/GetBranch/${id}`);
      return res.data.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  },

  async getByCompany(companyId: UUID): Promise<BranchListDto[]> {
    try {
      const res = await api.get(`${BASE_URL}/BranchComp/${companyId}`);
      return res.data.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  },

  async getBranchCompanyList(): Promise<BranchCompListDto[]> {
    try {
      const res = await api.get(`${NAMES_URL}/BranchCompList`);
      return res.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  },

  async create(data: AddBranchDto): Promise<BranchListDto> {
    try {
      const res = await api.post(`${BASE_URL}/AddBranch`, data);
      return res.data.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  },

  async update(data: EditBranchDto): Promise<BranchListDto> {
    try {
      const res = await api.put(`${BASE_URL}/ModBranch/${data.id}`, data);
      return res.data.data;
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  },

  async delete(id: UUID): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/DelBranch/${id}`);
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  },
};
