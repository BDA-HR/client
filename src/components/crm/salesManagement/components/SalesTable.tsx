import React from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Eye,
  PenBox,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import type { Opportunity } from "../../../../types/crm";
import { useNavigate } from "react-router-dom";

interface SalesTableProps {
  opportunities: Opportunity[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
  onView: (opportunity: Opportunity) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({
  opportunities,
  currentPage,
  totalPages,
  totalItems,
  isLoading = false,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}) => {
  const navigate = useNavigate();

  const handleEdit = (opportunity: Opportunity) => {
    onEdit(opportunity);
  };

  const handleDelete = (opportunity: Opportunity) => {
    onDelete(opportunity);
  };

  const handleView = (opportunity: Opportunity) => {
    onView(opportunity);
  };

  const handleGoToQuotation = (opportunity: Opportunity) => {
    navigate(`/crm/quotations`);
  };

  const getStageColor = (stage: string): string => {
    const colors: Record<string, string> = {
      'Prospecting': "bg-blue-100 text-blue-800 border border-blue-200",
      'Qualification': "bg-yellow-100 text-yellow-800 border border-yellow-200",
      'Proposal': "bg-purple-100 text-purple-800 border border-purple-200",
      'Negotiation': "bg-orange-100 text-orange-800 border border-orange-200",
      'Closed Won': "bg-green-100 text-green-800 border border-green-200",
      'Closed Lost': "bg-red-100 text-red-800 border border-red-200",
    };
    return colors[stage] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      'High': "bg-red-100 text-red-800",
      'Medium': "bg-yellow-100 text-yellow-800",
      'Low': "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl shadow-sm overflow-hidden bg-white"
    >
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 align-middle">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Close Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {opportunities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No opportunities found.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opportunity, index) => (
                    <motion.tr
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="transition-colors hover:bg-gray-50"
                    >
                      {/* Opportunity Name */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-orange-600 font-medium">
                              {opportunity.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {opportunity.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {opportunity.source}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(opportunity.amount)}
                          </span>
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="px-4 py-3 align-middle text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStageColor(
                            opportunity.stage
                          )}`}
                        >
                          {opportunity.stage}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3 align-middle text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getPriorityColor(
                            opportunity.priority
                          )}`}
                        >
                          {opportunity.priority}
                        </span>
                      </td>

                      {/* Close Date */}
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatDate(opportunity.expectedCloseDate)}
                          </span>
                        </div>
                      </td>

                      {/* Assigned To */}
                      <td className="px-4 py-3 align-middle text-center">
                        <div className="flex items-center justify-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {opportunity.assignedTo}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 align-middle text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(opportunity)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(opportunity)}>
                              <PenBox className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGoToQuotation(opportunity)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Go to Quotation
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(opportunity)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 10, totalItems)}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> opportunities
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default SalesTable;