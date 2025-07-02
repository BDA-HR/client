// src/modules/finance.tsx
import AccountsPayable from '../../components/finance/AccountsPayable';
import AccountsReceivable from '../../components/finance/AccountsReceivable';
import AssetManagement from '../../components/finance/AssetManagement';
import AuditAndComplianceManagement from '../../components/finance/AuditAndComplianceManagement';
import BudgetingAndForecasting from '../../components/finance/BudgetingAndForecasting';
import CashAndBankManagement from '../../components/finance/CashAndBankManagement';
import ConsolidationAndFinancialClose from '../../components/finance/ConsolidationAndFinancialClose';
import CostAccounting from '../../components/finance/CostAccounting';
import FinancialReportingAndAnalytics from '../../components/finance/FinancialReportingAndAnalytics';
import GeneralLedger from '../../components/finance/GeneralLedger';
import TaxManagement from '../../components/finance/TaxManagement';
import VoucherManagement from '../../components/finance/VoucherManagement';

export default function FinanceDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-800">Finance Dashboard</h1>
        <p className="text-indigo-800 mt-2">Comprehensive financial management and reporting</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-600 text-sm">Total Assets</span>
            <span className="text-2xl font-bold text-gray-800 mt-1">$1.7M</span>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-600 text-sm">Net Profit</span>
            <span className="text-2xl font-bold text-gray-800 mt-1">$325K</span>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center">
            <span className="text-gray-600 text-sm">Cash Flow</span>
            <span className="text-2xl font-bold text-gray-800 mt-1">+8.2%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GeneralLedger />
        <AccountsPayable />
        <AccountsReceivable />
        <CashAndBankManagement />
        <BudgetingAndForecasting />
        <CostAccounting />
        <AssetManagement />
        <TaxManagement />
        <VoucherManagement />
        <AuditAndComplianceManagement />
        <ConsolidationAndFinancialClose />
        <FinancialReportingAndAnalytics />
      </div>
      
      {/* Financial Overview Section */}
      <div className="mt-10 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue Streams</h3>
            <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
              Revenue Chart
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Expense Analysis</h3>
            <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
              Expense Chart
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Key Ratios</h3>
            <div className="space-y-3">
              {[
                { name: 'Current Ratio', value: '2.8', trend: 'positive' },
                { name: 'Debt-to-Equity', value: '0.4', trend: 'neutral' },
                { name: 'ROI', value: '18.2%', trend: 'positive' }
              ].map((ratio, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">{ratio.name}</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{ratio.value}</span>
                    {ratio.trend === 'positive' ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">↑</span>
                    ) : ratio.trend === 'negative' ? (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">↓</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">→</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left text-gray-700">Date</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Description</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Account</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Amount</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2023-12-15', desc: 'Office Supplies', account: 'Expenses', amount: '$1,250', status: 'Posted' },
                { date: '2023-12-14', desc: 'Client Payment', account: 'Accounts Receivable', amount: '$5,800', status: 'Cleared' },
                { date: '2023-12-14', desc: 'Software Subscription', account: 'Expenses', amount: '$420', status: 'Posted' },
                { date: '2023-12-13', desc: 'Vendor Payment', account: 'Accounts Payable', amount: '$3,200', status: 'Processing' },
              ].map((transaction, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-gray-600">{transaction.date}</td>
                  <td className="py-2 px-4 border-b text-gray-700">{transaction.desc}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{transaction.account}</td>
                  <td className="py-2 px-4 border-b font-medium">{transaction.amount}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`text-xs px-2 py-1 rounded ${
                      transaction.status === 'Posted' ? 'bg-blue-100 text-blue-800' :
                      transaction.status === 'Cleared' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
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
