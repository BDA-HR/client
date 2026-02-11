import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Plus, Search, X, MoreVertical, Eye, Edit, Trash2, RefreshCw, ShoppingCart, Download } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import AddQuotationModal from "../../../components/crm/quotations/AddQuotationModal";
import ChangeStatusModal from "../../../components/crm/quotations/ChangeStatusModal";
import { mockOpportunities, mockContacts } from "../../../data/crmMockData";

// Mock quotations data
const mockQuotations = [
  {
    id: '1',
    quotationNumber: 'QUO-2024-001',
    opportunityId: '1',
    opportunityName: 'Enterprise Software License',
    accountName: 'TechCorp Solutions',
    contactName: 'Alice Johnson',
    amount: 125000,
    status: 'Approved' as const,
    validUntil: '2024-03-15',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-15',
    version: 1
  },
  {
    id: '2',
    quotationNumber: 'QUO-2024-002',
    opportunityId: '2',
    opportunityName: 'Professional Services Package',
    accountName: 'Global Industries',
    contactName: 'Bob Smith',
    amount: 45000,
    status: 'Pending Approval' as const,
    validUntil: '2024-02-28',
    createdBy: 'Mike Wilson',
    createdAt: '2024-01-20',
    version: 2
  },
  {
    id: '3',
    quotationNumber: 'QUO-2024-003',
    opportunityId: '3',
    opportunityName: 'Training Package',
    accountName: 'StartupCorp',
    contactName: 'John Doe',
    amount: 15000,
    status: 'Draft' as const,
    validUntil: '2024-04-01',
    createdBy: 'Emily Davis',
    createdAt: '2024-01-25',
    version: 1
  }
];

const QuotationsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [quotations, setQuotations] = useState(mockQuotations);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<any>(null);
  const [changingStatusQuotation, setChangingStatusQuotation] = useState<any>(null);
  const [prefilledOpportunity, setPrefilledOpportunity] = useState<any>(null);

  // No auto-modal opening - modals only open when user clicks "Add" buttons
  useEffect(() => {
    // This useEffect can be removed or used for other initialization if needed
  }, [searchParams]);

  const handleBack = () => {
    navigate(-1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleAddQuotation = (quotationData: any) => {
    const newQuotation = {
      ...quotationData,
      id: Date.now().toString(),
      quotationNumber: `QUO-2024-${String(quotations.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      version: 1
    };
    setQuotations([...quotations, newQuotation]);
    setIsAddModalOpen(false);
  };

  const handleEditQuotation = (quotationData: any) => {
    setQuotations(quotations.map(q => 
      q.id === editingQuotation.id ? { ...q, ...quotationData } : q
    ));
    setIsEditModalOpen(false);
    setEditingQuotation(null);
  };

  const handleView = (quotation: any) => {
    console.log('View quotation:', quotation.id);
  };

  const handleEdit = (quotation: any) => {
    setEditingQuotation(quotation);
    setIsEditModalOpen(true);
  };

  const handleDelete = (quotation: any) => {
    if (window.confirm(`Are you sure you want to delete quotation ${quotation.quotationNumber}?`)) {
      setQuotations(quotations.filter(q => q.id !== quotation.id));
    }
  };

  const handleChangeStatus = (quotation: any) => {
    setChangingStatusQuotation(quotation);
    setIsChangeStatusModalOpen(true);
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (changingStatusQuotation) {
      setQuotations(quotations.map(q => 
        q.id === changingStatusQuotation.id ? { ...q, status: newStatus as const } : q
      ));
      console.log(`Status changed for quotation ${changingStatusQuotation.quotationNumber} to ${newStatus}`);
    }
    setIsChangeStatusModalOpen(false);
    setChangingStatusQuotation(null);
  };

  const handleConvertToOrder = (quotation: any) => {
    // Navigate to orders page without opening modal
    navigate(`/crm/orders`);
  };

  const handleDownload = (quotation: any) => {
    console.log('Download quotation PDF:', quotation.id);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Approved': 'bg-orange-100 text-orange-800 border border-orange-200',
      'Pending Approval': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'Draft': 'bg-gray-100 text-gray-800 border border-gray-200',
      'Sent': 'bg-orange-100 text-orange-800 border border-orange-200',
      'Accepted': 'bg-purple-100 text-purple-800 border border-purple-200',
      'Rejected': 'bg-red-100 text-red-800 border border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
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

  const filteredQuotations = quotations.filter(
    (quotation) =>
      quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.opportunityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredQuotations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, endIndex);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 space-y-6 min-h-screen"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-end"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Button>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <FileText className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl font-bold text-black">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block"
              >
                <span className="bg-linear-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
                  Quotations 
                </span>{" "}Management
              </motion.span>
            </h1>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="w-full lg:flex-1">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                placeholder="Search Quotations"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex cursor-pointer items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Quotation
          </Button>
        </div>
      </motion.div>

      {/* Quotations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl shadow-sm overflow-hidden bg-white"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 align-middle">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quotation
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedQuotations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No quotations found.
                  </td>
                </tr>
              ) : (
                paginatedQuotations.map((quotation, index) => (
                  <motion.tr
                    key={quotation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {quotation.quotationNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            Version {quotation.version}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {quotation.opportunityName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quotation.accountName}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(quotation.amount)}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
                          quotation.status
                        )}`}
                      >
                        {quotation.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-900">
                        {formatDate(quotation.validUntil)}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-900">
                        {quotation.createdBy}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-middle text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(quotation)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(quotation)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(quotation)}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Change Status
                          </DropdownMenuItem>
                          {/* Convert to Order - Available for all except Draft and Rejected */}
                          {!['Draft', 'Rejected'].includes(quotation.status) && (
                            <DropdownMenuItem onClick={() => handleConvertToOrder(quotation)}>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Convert to Order
                            </DropdownMenuItem>
                          )}
                          {/* Download PDF - Available for all except Draft */}
                          {quotation.status !== 'Draft' && (
                            <DropdownMenuItem onClick={() => handleDownload(quotation)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(quotation)}
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
        {filteredQuotations.length > 0 && (
          <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
                  <span className="font-medium">{totalItems}</span> quotations
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
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
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Quotation Modal */}
      <AddQuotationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddQuotation}
        prefilledOpportunity={prefilledOpportunity}
      />

      {/* Edit Quotation Modal */}
      {editingQuotation && (
        <AddQuotationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingQuotation(null);
          }}
          onSubmit={handleEditQuotation}
          prefilledOpportunity={prefilledOpportunity}
          editingQuotation={editingQuotation}
        />
      )}

      {/* Change Status Modal */}
      <ChangeStatusModal
        isOpen={isChangeStatusModalOpen}
        onClose={() => {
          setIsChangeStatusModalOpen(false);
          setChangingStatusQuotation(null);
        }}
        onSubmit={handleStatusUpdate}
        quotation={changingStatusQuotation}
      />
    </motion.section>
  );
};

export default QuotationsPage;
