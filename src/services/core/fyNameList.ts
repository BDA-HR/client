import { useQuery } from "@tanstack/react-query";
import type { NameListItem } from "../../types/NameList/nameList";
import { api } from "../api";


export const ActiveFiscalYear = () => {
  const getActiveFiscalYear = useQuery({
    queryKey: ["fiscalYear", "names"],
    queryFn: async (): Promise<NameListItem[]> => {
      const res = await api.get("hrm/profile/v1/Names/AllEmpName");
      return res.data;
    },
  });

  return {
    getActiveFiscalYear,
  };
};
