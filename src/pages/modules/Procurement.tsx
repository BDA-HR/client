import PurchaseRequisitionManagement from '../../components/procurement/PurchaseRequisitionManagement';
import VendorManagement from '../../components/procurement/VendorManagement';
import PurchaseOrderManagement from '../../components/procurement/PurchaseOrderManagement';
import QuotationAndTenderManagement from '../../components/procurement/QuotationAndTenderManagement';
import GoodsReceiptAndInspection from '../../components/procurement/GoodsReceiptAndInspection';
import InvoiceProcessingAndPayment from '../../components/procurement/InvoiceProcessingAndPayment';
import ContractManagement from '../../components/procurement/ContractManagement';
import ReportingAndAnalytics from '../../components/procurement/ReportingAndAnalytics';

export default function ProcurementDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-purple-900">Procurement Dashboard</h1>
        <p className="text-purple-600 mt-2">Streamlined purchasing and vendor management</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 flex flex-col items-center">
            <span className="text-purple-600 text-sm">Monthly Spend</span>
            <span className="text-2xl font-bold text-purple-800 mt-1">$185K</span>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 flex flex-col items-center">
            <span className="text-purple-600 text-sm">Cost Savings</span>
            <span className="text-2xl font-bold text-purple-800 mt-1">$28.5K</span>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 flex flex-col items-center">
            <span className="text-purple-600 text-sm">Active Vendors</span>
            <span className="text-2xl font-bold text-purple-800 mt-1">42</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <PurchaseRequisitionManagement />
        <VendorManagement />
        <PurchaseOrderManagement />
        <QuotationAndTenderManagement />
        <GoodsReceiptAndInspection />
        <InvoiceProcessingAndPayment />
        <ContractManagement />
        <ReportingAndAnalytics />
      </div>
      
      {/* Procurement Performance Section */}
      <div className="mt-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-100">
        <h2 className="text-xl font-semibold text-black-800 mb-4">Procurement Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border-2 border-purple-100 shadow-sm">
            <h3 className="text-lg font-semibold text-black-700 mb-2">Spend by Category</h3>
            <div className="h-60 bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl flex items-center justify-center text-purple-400">
              Spend Distribution Chart
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border-2 border-purple-100 shadow-sm">
            <h3 className="text-lg font-semibold text-black-700 mb-2">Vendor Performance</h3>
            <div className="space-y-4">
              {[
                { name: 'Tech Supplies Inc', rating: 4.8, performance: 'Excellent' },
                { name: 'Office Solutions Ltd', rating: 4.2, performance: 'Good' },
                { name: 'Global Logistics', rating: 3.7, performance: 'Average' }
              ].map((vendor, idx) => (
                <div key={idx} className="pb-3 border-b border-purple-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-black-700">{vendor.name}</span>
                    <span className="flex items-center bg-purple-100 text-black-800 px-2 py-1 rounded text-sm">
                      ★ {vendor.rating}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-black-600">Performance:</span>
                    <span className={`text-sm font-medium ${
                      vendor.performance === 'Excellent' ? 'text-green-600' : 
                      vendor.performance === 'Good' ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {vendor.performance}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-2 border-t border-purple-200">
                <div className="flex justify-between">
                  <span className="text-black-700 font-medium">Average Rating:</span>
                  <span className="flex items-center text-black-800">
                    ★ 4.3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 bg-purple-50 rounded-xl p-6 border-2 border-purple-100">
        <h2 className="text-xl font-semibold text-black-800 mb-4">Active Purchase Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-purple-200">
            <thead>
              <tr className="bg-purple-100">
                <th className="py-2 px-4 border-b text-left text-black-700">PO Number</th>
                <th className="py-2 px-4 border-b text-left text-black-700">Vendor</th>
                <th className="py-2 px-4 border-b text-left text-black-700">Amount</th>
                <th className="py-2 px-4 border-b text-left text-black-700">Due Date</th>
                <th className="py-2 px-4 border-b text-left text-black-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { po: 'PO-2023-101', vendor: 'Tech Supplies Inc', amount: '$8,500', due: '2023-12-20', status: 'Shipped' },
                { po: 'PO-2023-102', vendor: 'Office Solutions Ltd', amount: '$3,200', due: '2023-12-18', status: 'Processing' },
                { po: 'PO-2023-103', vendor: 'Global Logistics', amount: '$12,800', due: '2023-12-22', status: 'Partially Received' },
                { po: 'PO-2023-104', vendor: 'Industrial Supplies Co', amount: '$5,750', due: '2023-12-25', status: 'Approved' },
              ].map((order, idx) => (
                <tr key={idx} className="hover:bg-purple-50">
                  <td className="py-2 px-4 border-b text-black-700 font-medium">{order.po}</td>
                  <td className="py-2 px-4 border-b text-gray-700">{order.vendor}</td>
                  <td className="py-2 px-4 border-b font-medium">{order.amount}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{order.due}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Partially Received' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}