import { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../../../ui/popover";

export interface LeaveRequest {
  id: string;
  employee: {
    id: string;
    fullName: string;
    employeeCode?: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  dateRequested: string;
  duration: number;
  isHalfDay: boolean;
  fiscalYear: string;
  appStep: number;
}

interface Props {
  leaveRequests: LeaveRequest[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onReview: (row: LeaveRequest) => void;
  onView: (row: LeaveRequest) => void;
}

const AllLeaveRequestTable: React.FC<Props> = ({
  leaveRequests,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onReview,
  onView,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl shadow-sm overflow-hidden bg-white"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                #
              </th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Employee
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Start Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                End Date
              </th>

              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Date Requested
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Durations
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Half Day
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Leave Type
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Approval Step
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {leaveRequests.map((row, index) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {/* <td className="px-4 py-3 text-center">
                  {(currentPage - 1) * 10 + index + 1}
                </td> */}

                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {row.employee.fullName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {row.employee.employeeCode}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {row.startDate}
                </td>
                <td className="px-4 py-3 text-center text-sm">{row.endDate}</td>
                <td className="px-4 py-3 text-center">{row.dateRequested}</td>
                <td className="px-4 py-3 text-center">{row.duration}</td>
                <td className="px-4 py-3 text-center">
                  {row.isHalfDay ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">{row.leaveType}</td>
                <td className="px-4 py-3 text-center">{row.appStep}</td>
             

                <td className="px-4 py-3 text-right">
                  <Popover
                    open={popoverOpen === row.id}
                    onOpenChange={(open) =>
                      setPopoverOpen(open ? row.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-44 p-1" align="end">
                      <button
                        onClick={() => {
                          onView(row);
                          setPopoverOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>

                      <button
                        onClick={() => {
                          onReview(row);
                          setPopoverOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Review
                      </button>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 10 + 1} –{" "}
            {Math.min(currentPage * 10, totalItems)} of {totalItems}
          </p>

          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AllLeaveRequestTable;
