import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Plus, Search, X, MoreVertical, Eye, Edit, Trash2, Truck, CheckCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import AddOrderModal from "../../components/crm/orders/AddOrderModal";
import { mockOpportunities, mockContacts } from "../../data/crmMockData";

// Mock orders data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    opportunityId: '1',
    opportunityName: 'Enterprise Software License',
    accountName: 'TechCorp Solutions',
    contactName: 'Alice Johnson',
    amount: 125000,
    status: 'In Production' as const,
    priority: 'High' as const,
    orderDate: '2024-01-20',
    expectedDelivery: '2024-02-15',
    assignedTo: 'Production Team',
    progress: 65,
    items: 3
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    opportunityId: '2',
    opportunityName: 'Professional Services Package',
    accountName: 'Global Industries',
    contactName: 'Bob Smith',
    amount: 45000,
    status: 'Shipped' as const,
    priority: 'Medium' as const,
    orderDate: '2024-01-25',
    expectedDelivery: '2024-02-10',
    assignedTo: 'Logistics Team',
    progress: 90,
    items: 2
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    opportunityId: '3',
    opportunityName: 'Training Package',
    accountName: 'StartupCorp',
    contactName: 'John Doe',
    amount: 15000,
    status: 'Confirmed' as const,
    priority: 'Low' as const,
    orderDate: '2024-01-28',
    expectedDelivery: '2024-03-01',
    assignedTo: 'Training Team',
    progress: 25,
    items: 1
  }
];

const OrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState(mockOrders);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const handleAddOrder = (orderData: any) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
      orderDate: new Date().toISOString().split('T')[0]
    };
    setOrders([...orders, newOrder]);
    setIsAddModalOpen(false);
  };

  const handleView = (order: any) => {
    navigate(`/crm/orders/${order.id}`);
  };

  const handleEdit = (order: any) => {
    console.log('Edit order:', order.id);
  };

  const handleDelete = (order: any) => {
    setOrders(orders.filter(o => o.id !== order.id));
  };

  const handleShip = (order: any) => {
    setOrders(orders.map(o => 
      o.id === order.id ? { ...o, status: 'Shipped' as const } : o
    ));
    console.log('Ship order:', order.id);
  };

  const handleMarkDelivered = (order: any) => {
    setOrders(orders.map(o => 
      o.id === order.id ? { ...o, status: 'Delivered' as const } : o
    ));
    console.log('Mark order as delivered:', order.id);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Confirmed': 'bg-orange-100 text-orange-800 border border-orange-200',
      'In Production': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'Shipped': 'bg-orange-100 text-orange-800 border border-orange-200',
      'Delivered': 'bg-orange-100 text-orange-800 border border-orange-200',
      'Cancelled': 'bg-red-100 text-red-800 border border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-orange-100 text-orange-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.opportunityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

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
            <ShoppingCart className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl font-bold text-black">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block"
              >
                <span className="bg-linear-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
                  Orders 
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
                placeholder="Search Orders"
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
            Add Order
          </Button>
        </div>
      </motion.div>

      {/* Orders Table */}
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
                  Order
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
                  Priority
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
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
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items} items
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {order.opportunityName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.accountName}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getPriorityColor(
                          order.priority
                        )}`}
                      >
                        {order.priority}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-600">
                          {order.progress}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle text-center">
                      <span className="text-sm text-gray-900">
                        {order.assignedTo}
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
                          <DropdownMenuItem onClick={() => handleView(order)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(order)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {order.status === 'Confirmed' && (
                            <DropdownMenuItem onClick={() => handleShip(order)}>
                              <Truck className="w-4 h-4 mr-2" />
                              Mark as Shipped
                            </DropdownMenuItem>
                          )}
                          {order.status === 'Shipped' && (
                            <DropdownMenuItem onClick={() => handleMarkDelivered(order)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(order)}
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
        {filteredOrders.length > 0 && (
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
                  <span className="font-medium">{totalItems}</span> orders
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

      {/* Add Order Modal */}
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddOrder}
        prefilledOpportunity={prefilledOpportunity}
      />
    </motion.section>
  );
};

export default OrdersPage;