import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Eye,
  PenBox,
  CheckCircle,
  XCircle,
  Trash2,
  Cog,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../../ui/popover";
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
      className="rounded-xl shadow-sm overflow-hidden bg-white"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 align-middle">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ">
                Annual Entitlement
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accrual Frequency
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accrual Rate
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requires Attachment
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Days PerReq
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Carry Over Days
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Policy Configure
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Service Months
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Is Active
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Policy
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      {/* <div className="shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-medium">
                          {leavePolicyConfig.annualEntitlement
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div> */}
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

                  {/* minServiceMonths */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.leavePolicy}
                  </td>
                  {/* fiscalYear */}
                  <td className="px-4 py-3 align-middle text-center">
                    {leavePolicyConfig.fiscalYear}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 align-middle text-right  text-sm font-medium">
                    <Popover
                      open={popoverOpen === leavePolicyConfig.id}
                      onOpenChange={(open) => leavePolicyConfig}
                    >
                      <PopoverTrigger asChild>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0" align="end">
                        <div className="py-1">
                          <button
                            onClick={() => onEdit(leavePolicyConfig)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                          >
                            <PenBox size={16} />
                            Edit
                          </button>
                          {onToggleStatus && (
                            <button
                              onClick={() => onToggleStatus(leavePolicyConfig)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 text-gray-700"
                            >
                              {leavePolicyConfig.isActive ? (
                                <>
                                  <XCircle size={16} />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} />
                                  Activate
                                </>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(leavePolicyConfig)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
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
