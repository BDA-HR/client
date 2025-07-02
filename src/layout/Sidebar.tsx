import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  Trophy,
  Calendar,
  GraduationCap,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Settings,
  BarChart4,
  FileText,
  LogOut,
  RefreshCw,
  Warehouse,
  ClipboardList,
  DollarSign,
  FileCheck,
  CheckCircle2,
  Package,
  Briefcase,
  ClipboardCheck,
  LineChart,
} from 'lucide-react';
import { useModule } from '../ModuleContext';

interface NavItemProps {
  to: string;
  icon?: React.ReactNode; // Made optional with ?
  label: string;
  end?: boolean;
  activeBg: string;
  textColor: string;
  hoverBg: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  end = false, 
  activeBg, 
  textColor, 
  hoverBg 
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
          isActive 
            ? `${activeBg} ${textColor}` 
            : `text-gray-600 ${hoverBg}`
        }`
      }
    >
      {icon && <span className="mr-3">{icon}</span>}
      {label}
    </NavLink>
  );
};

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  hoverBg: string;
}

const NavGroup: React.FC<NavGroupProps> = ({
  icon,
  label,
  children,
  defaultOpen = false,
  hoverBg,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-600 rounded-md transition-colors ${hoverBg}`}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          {label}
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-10 pr-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { activeModule } = useModule();

  const handleLogout = () => {
    navigate('/login');
  };

  const themeMap: Record<string, { textColor: string; activeBg: string; hoverBg: string }> = {
    Inventory: { textColor: 'text-yellow-700', activeBg: 'bg-yellow-100', hoverBg: 'hover:bg-yellow-50' },
    HR: { textColor: 'text-green-700', activeBg: 'bg-green-100', hoverBg: 'hover:bg-green-50' },
    Core: { textColor: 'text-emerald-700', activeBg: 'bg-emerald-100', hoverBg: 'hover:bg-emerald-50' },
    CRM: { textColor: 'text-orange-700', activeBg: 'bg-orange-100', hoverBg: 'hover:bg-orange-50' },
    Finance: { textColor: 'text-amber-700', activeBg: 'bg-amber-100', hoverBg: 'hover:bg-amber-50' },
    Procurement: { textColor: 'text-purple-700', activeBg: 'bg-purple-100', hoverBg: 'hover:bg-purple-50' },
    Logo: { textColor: 'text-cyan-700', activeBg: 'bg-cyan-100', hoverBg: 'hover:bg-cyan-50' },
    default: { textColor: 'text-gray-600', activeBg: 'bg-gray-100', hoverBg: 'hover:bg-gray-50' },
  };

  const theme = themeMap[activeModule] || themeMap.default;

  return (
    <div className="w-56 bg-white h-screen flex flex-col">
      <div className="mb-1/2 p-2 flex items-center gap-2 mx-auto">
        <img
          src="/bda-logo-1.png"
          alt="Logo"
          className="w-12 h-12 rounded-full border object-cover overflow-clip"
        />
        <div className="flex flex-col justify-center text-center">
          <h1 className={`text-xl font-bold ${theme.textColor} leading-tight`}>BDA</h1>
          <p className="text-sm text-gray-500">Investment Group</p>
        </div>
      </div>

      <hr className="mx-2" />

      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          <NavItem
            to={
              activeModule === 'Inventory' ? '/inventory' :
              activeModule === 'Core' ? '/core' :
              activeModule === 'HR' ? '/dashboard' :
              activeModule === 'CRM' ? '/crm' :
              activeModule === 'Finance' ? '/finance' :
              activeModule === 'Procurement' ? '/procurement' :
              '/dashboard'
            }
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            end
            {...theme}
          />


          {activeModule === 'HR' && (
            <>
              <NavGroup icon={<Users size={18} />} label="Employees" hoverBg={theme.hoverBg}>
                <NavItem to="/employees" icon={<Users size={18} />} label="Directory" {...theme} />
                <NavItem to="/employees/skills" icon={<Trophy size={18} />} label="Skills" {...theme} />
                <NavItem to="/employees/appraisals" icon={<FileText size={18} />} label="Appraisals" {...theme} />
              </NavGroup>

              <NavGroup icon={<Building2 size={18} />} label="Organization" hoverBg={theme.hoverBg}>
                <NavItem to="/organization/structure" icon={<Building2 size={18} />} label="Structure" {...theme} />
                <NavItem to="/organization/departments" icon={<Users size={18} />} label="Departments" {...theme} />
              </NavGroup>

              <NavItem to="/leave-management" icon={<Calendar size={18} />} label="Leave Management" {...theme} />
              <NavItem to="/training" icon={<GraduationCap size={18} />} label="Training" {...theme} />
              <NavItem to="/reports" icon={<FileSpreadsheet size={18} />} label="Reports" {...theme} />
              <NavItem to="/analytics" icon={<BarChart4 size={18} />} label="Analytics" {...theme} />
            </>
          )}

          {activeModule === 'Inventory' && (
            <>
              <NavItem to="/inventory/tracking" icon={<FileText size={18} />} label="Inventory Tracking" {...theme} />
              <NavItem to="/inventory/inbound" icon={<FileText size={18} />} label="Stock Management" {...theme} />
              <NavItem to="/inventory/warehouse" icon={<Warehouse size={18} />} label="Warehouse Management" {...theme} />
              <NavItem to="/inventory/valuation" icon={<BarChart4 size={18} />} label="Inventory Valuation" {...theme} />
              <NavItem to="/inventory/reorder" icon={<RefreshCw size={18} />} label="Reorder Management" {...theme} />
              <NavItem to="/inventory/analytics" icon={<BarChart4 size={18} />} label="Reporting & Analytics" {...theme} />
            </>
          )}

          {activeModule === 'Core' && (
            <>
              <NavItem to="/core/branch" icon={<Building2 size={18} />} label="Branch" {...theme} />
              <NavItem to="/core/department" icon={<Users size={18} />} label="Department" {...theme} />
              <NavItem to="/core/fiscal-year" icon={<FileText size={18} />} label="Fiscal Year" {...theme} />
              <NavItem to="/core/hierarchy" icon={<BarChart4 size={18} />} label="Hierarchy" {...theme} />
              <NavItem to="/core/users" icon={<Users size={18} />} label="User Management" {...theme} />
              <NavGroup icon={<Users size={18} />} label="Users" hoverBg={theme.hoverBg}>
                <NavItem to="/core/users"  label="user-list" {...theme} />
                <NavItem to="/core/users"  label="User-profile" {...theme} />
              </NavGroup>
            </>
          )}

          {activeModule === 'CRM' && (
          <>
            <NavItem to="/crm/leads" icon={<Trophy size={18} />} label="Lead Management" {...theme} />
            <NavItem to="/crm/contacts" icon={<Users size={18} />} label="Contact Management" {...theme} />
            <NavItem to="/crm/sales" icon={<BarChart4 size={18} />} label="Sales Management" {...theme} />
            <NavItem to="/crm/marketing" icon={<FileSpreadsheet size={18} />} label="Marketing Automation" {...theme} />
            <NavItem to="/crm/support" icon={<Calendar size={18} />} label="Customer Service" {...theme} />
            <NavItem to="/crm/activities" icon={<ClipboardList size={18} />} label="Activity Management" {...theme} />
            <NavItem to="/crm/analytics" icon={<BarChart4 size={18} />} label="Analytics & Reporting" {...theme} />
          </>
        )}
        {activeModule === 'Finance' && (
          <>
            <NavItem to="/finance/gl" icon={<FileText size={18} />} label="General Ledger" {...theme} />
            <NavItem to="/finance/ap" icon={<Package size={18} />} label="Accounts Payable" {...theme} />
            <NavItem to="/finance/ar" icon={<DollarSign size={18} />} label="Accounts Receivable" {...theme} />
            <NavItem to="/finance/assets" icon={<Briefcase size={18} />} label="Assets" {...theme} />
            <NavItem to="/finance/budget" icon={<FileSpreadsheet size={18} />} label="Budgeting" {...theme} />
            <NavItem to="/finance/reports" icon={<LineChart size={18} />} label="Reports" {...theme} />
          </>
        )}

        {activeModule === 'Procurement' && (
          <>
            <NavItem to="/procurement/requisitions" icon={<FileText size={18} />} label="Requisitions" {...theme} />
            <NavItem to="/procurement/vendors" icon={<Users size={18} />} label="Vendors" {...theme} />
            <NavItem to="/procurement/po" icon={<ClipboardCheck size={18} />} label="Purchase Orders" {...theme} />
            <NavItem to="/procurement/receipt" icon={<CheckCircle2 size={18} />} label="Goods Receipt" {...theme} />
            <NavItem to="/procurement/invoice" icon={<FileCheck size={18} />} label="Invoices" {...theme} />
            <NavItem to="/procurement/analytics" icon={<BarChart4 size={18} />} label="Analytics" {...theme} />
          </>
        )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" {...theme} />
        <button
          className={`flex items-center px-4 py-2.5 text-sm font-medium w-full rounded-md transition-colors ${theme.textColor} ${theme.hoverBg}`}
          onClick={handleLogout}
        >
          <span className="mr-3">
            <LogOut size={18} />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
