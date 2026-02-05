import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { XCircleIcon } from "lucide-react";
import AllLeaveRequestTable, { type LeaveRequest } from "./LeaveRequestTable";
import LeaveRequestHeader from "./LeaveRequestHeader";
import { showToast } from "../../../../layout/layout";
import ReviewLeaveRequestModal from "./ReviewLeaveRequestModal";
import LeaveRequestDetailModal from "./LeaveRequestDetailModal";

// -------- SAMPLE DATA --------
const SAMPLE_DATA: LeaveRequest[] = [
  {
    id: "1",
    employee: { id: "e1", fullName: "Abel Tesfaye", employeeCode: "EMP001" },
    leaveType: "Annual Leave",
    startDate: "2025-02-10",
    endDate: "2025-02-14",
    dateRequested: "2025-01-20",
    duration: 5,
    isHalfDay: false,
    fiscalYear: "2025/26",
    appStep: 3,
  },
  {
    id: "2",
    employee: { id: "e2", fullName: "Sara Mekonnen", employeeCode: "EMP002" },
    leaveType: "Sick Leave",
    startDate: "2025-02-03",
    endDate: "2025-02-03",
    dateRequested: "2025-01-20",
    duration: 1,
    isHalfDay: true,
    fiscalYear: "2025/26",
    appStep: 3,
  },
];

const ITEMS_PER_PAGE = 10;

const LeaveRequestSection = () => {
  const [data, setData] = useState<LeaveRequest[]>(SAMPLE_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );
  const [reviewOpen, setReviewOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);


  // ---------------- FILTER ----------------
  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return data.filter(
      (row) =>
        row.employee.fullName.toLowerCase().includes(search) ||
        row.employee.employeeCode?.toLowerCase().includes(search) ||
        row.leaveType.toLowerCase().includes(search) ||
        row.fiscalYear.toLowerCase().includes(search),
    );
  }, [data, searchTerm]);

  // ---------------- PAGINATION ----------------
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ---------------- ACTION HANDLERS ----------------
  const handleApprove = (row: LeaveRequest, comment: string) => {
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "Approved" } : r)),
    );
    showToast.success(`Approved: ${row.employee.fullName}`);
  };

  const handleReject = (row: LeaveRequest, comment: string) => {
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "Rejected" } : r)),
    );
    showToast.error(`Rejected: ${row.employee.fullName}`);
  };

  const handleReview = (row: LeaveRequest) => {
    setSelectedRequest(row);
    setReviewOpen(true);
  };

  const handleView = (row: LeaveRequest) => {
    setSelectedRequest(row);
    setDetailOpen(true);
  };


  return (
    <div className="space-y-6">
      {/* ---------- HEADER ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <LeaveRequestHeader />
      </motion.div>

      {/* ---------- EMPTY STATE ---------- */}
      {totalItems === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-red-100 border-l-4 border-yellow-500 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-yellow-800 font-medium">
                No Leave Requests Found
              </h3>
              <p className="text-yellow-700 text-sm mt-1">
                No leave requests match your search criteria.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---------- TABLE ---------- */}
      {totalItems > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AllLeaveRequestTable
            leaveRequests={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onReview={handleReview}
            onView={handleView}
          />

          <ReviewLeaveRequestModal
            isOpen={reviewOpen}
            onClose={() => setReviewOpen(false)}
            leaveRequest={selectedRequest}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          <LeaveRequestDetailModal
            isOpen={detailOpen}
            onClose={() => setDetailOpen(false)}
            data={selectedRequest}
          />
        </motion.div>
      )}
    </div>
  );
};

export default LeaveRequestSection;
