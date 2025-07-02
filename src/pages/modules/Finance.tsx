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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-600">Comprehensive financial management and reporting</p>
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
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Overview</h2>
        <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Revenue</h3>
            <p className="text-2xl font-bold">$2.1M</p>
            <p className="text-green-600 mt-1">+8.2% from last quarter</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Profit</h3>
            <p className="text-2xl font-bold">$325K</p>
            <p className="text-green-600 mt-1">+12.5% from last quarter</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Expenses</h3>
            <p className="text-2xl font-bold">$1.78M</p>
            <p className="text-red-600 mt-1">+4.3% from last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}