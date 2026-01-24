import { useQuery } from "@tanstack/react-query";
import type { NameListItem } from "../../types/NameList/nameList";
import { api } from "../api";

const baseUrl = `${
  import.meta.env.VITE_HRMM_LEAVE_URL || "core/module/v1"
}/Names`;
export const ActiveFiscalYear = () => {
  const getActiveFiscalYear = useQuery({
    queryKey: ["fiscalYear", "names"],
    queryFn: async (): Promise<NameListItem[]> => {
      const res = await api.get(`${baseUrl}/ActiveFiscalYear`);
      return res.data;
    },
  });

  return {
    getActiveFiscalYear,
  };
};