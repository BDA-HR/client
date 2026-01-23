import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import type { NameListDto } from "../../../types/hr/NameListDto";


export const employeeService = () => {
  const getAllNames = useQuery({
    queryKey: ["employees", "names"],
    queryFn: async (): Promise<NameListDto[]> => {
      const res = await api.get("hrm/profile/v1/Names/AllEmpName");
      return res.data;
    },
  });

  return {
    getAllNames,
  };
};
