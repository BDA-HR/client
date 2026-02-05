import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { LeaveRequest } from "./LeaveRequestTable";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: LeaveRequest | null;
}

const LeaveRequestDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-xl w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-3">
          <h2 className="text-base font-semibold text-emerald-700">
            Leave Request Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-4 text-sm">
          <Info label="Employee" value={data.employee.fullName} />
          <Info
            label="Employee Code"
            value={data.employee.employeeCode ?? "-"}
          />
          <Info label="Leave Type" value={data.leaveType} />

          <Info label="Fiscal Year" value={data.fiscalYear} />
          <Info label="Start Date" value={data.startDate} />
          <Info label="End Date" value={data.endDate} />

          <Info label="Duration" value={`${data.duration} day(s)`} />
          <Info label="Half Day" value={data.isHalfDay ? "Yes" : "No"} />

         
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-3 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium text-gray-900 truncate">{value}</p>
  </div>
);

export default LeaveRequestDetailModal;
