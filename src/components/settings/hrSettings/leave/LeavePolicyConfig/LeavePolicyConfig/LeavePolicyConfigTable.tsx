import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import type { LeavePolicyConfigListDto } from "../../../../../../types/core/Settings/leavePolicyConfig";

interface LeavePolicyConfigTableProps {
  leavePolicyConfig: LeavePolicyConfigListDto[];
  onEdit: (leaveType: LeavePolicyConfigListDto) => void;
  onDelete: (leaveType: LeavePolicyConfigListDto) => void;
  onToggleStatus?: (leaveType: LeavePolicyConfigListDto) => void;
}


const LeavePolicyConfigTable: React.FC<LeavePolicyConfigTableProps> = ({
  leavePolicyConfig,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const getBooleanColor = (value: boolean) =>
    value
      ? "bg-green-500 text-white border border-green-200"
      : "bg-red-500 text-white border border-red-200";

  const getBooleanIcon = (value: boolean) =>
    value ? (
      <CheckCircle className="h-3 w-3 text-white" />
    ) : (
      <XCircle className="h-3 w-3 text-white" />
    );
 const getStatusColor = (status: string): string => {
   const colors: Record<string, string> = {
     0: "bg-green-100 text-green-800 border border-green-200",
     1: "bg-red-100 text-red-800 border border-red-200",
   };
   console.log("status", status);
   return (
     colors[status] || "bg-gray-100 text-gray-800 border border-gray-200"

   );
 };

     const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-b-xl shadow-sm overflow-hidden bg-white"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 align-middle">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ">
                Annual Entitlement
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Accrual Frequency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Accrual Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Max Days PerReq
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Max Carry Over Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Min Service Months
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Is Active
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                Fiscal Year
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {leavePolicyConfig.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No leave policies found.
                </td>
              </tr>
            ) : (
              leavePolicyConfig.map((leavePolicyConfig, index) => (
                <motion.tr
                  key={leavePolicyConfig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="transition-colors hover:bg-gray-50"
                >
                  {/* Name */}
                  <td className="px-4 py-3 align-middle text-center">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {leavePolicyConfig.annualEntitlement}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* accrualFrequency */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.accrualFrequency}
                  </td>
                  {/* accrualRate */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.accrualRate}
                  </td>
                  {/* accrualRate */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.accrualRate}
                  </td>

                  {/* maxDaysPerReq */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.maxDaysPerReq}
                  </td>

                  {/* minServiceMonths */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.minServiceMonths}
                  </td>
                  {/* isActive */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.isActiveStr}
                  </td>
                  {/* fiscalYear */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.fiscalYear}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LeavePolicyConfigTable;
