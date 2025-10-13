import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  RefreshCw,
  Warehouse,
  ClipboardList,
  FileCheck,
  CheckCircle2,
  Package,
  Briefcase,
  ClipboardCheck,
  LineChart,
  Building,
  Network,
  Circle,
} from 'lucide-react';
import { useModule } from '../ModuleContext';

interface NavItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  end?: boolean;
  activeBg: string;
  textColor: string;
  hoverBg: string;
  matchPaths?: string[]; // New prop to specify which paths should activate this item
  isChild?: boolean; // New prop to identify child items for bullet points
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  end = false, 
  activeBg, 
  textColor, 
  hoverBg,
  matchPaths = [],
  isChild = false // Default to false
}) => {
  const location = useLocation();
  
  // Function to check if the current path matches
  const isActive = () => {
    const currentPath = location.pathname;
    
    // Check if current path matches the main 'to' path
    if (end) {
      if (currentPath === to) return true;
    } else {
      if (currentPath.startsWith(to)) return true;
    }
    
    // Check if current path matches any of the additional matchPaths
    if (matchPaths.length > 0) {
      return matchPaths.some(path => currentPath.startsWith(path));
    }
    
    return false;
  };

  const active = isActive();

  return (
    <NavLink
      to={to}
      end={end}
      className={() => {
        return `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
          active 
            ? `${activeBg} ${textColor}` 
            : `text-gray-600 ${hoverBg}`
        }`;
      }}
    >
      {icon && (
        <span className="mr-3">
          {isChild ? (
            <Circle size={8} className="text-gray-900" />
          ) : (
            icon
          )}
        </span>
      )}
      {label}
    </NavLink>
  );
};

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  hoverBg: string;
}

const NavGroup: React.FC<NavGroupProps> = ({
  icon,
  label,
  children,
  isOpen,
  onToggle,
  hoverBg,
}) => {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
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
  const [openGroup, setOpenGroup] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOpenGroup(null); // Close all groups when module changes
  }, [activeModule]);

  const toggleGroup = (groupLabel: string) => {
    setOpenGroup(prev => prev === groupLabel ? null : groupLabel);
  };

  const themeMap: Record<string, { textColor: string; activeBg: string; hoverBg: string }> = {
    Inventory: { textColor: 'text-yellow-700', activeBg: 'bg-yellow-100', hoverBg: 'hover:bg-yellow-50' },
    HR: { textColor: 'text-green-700', activeBg: 'bg-green-100', hoverBg: 'hover:bg-green-50' },
    Core: { textColor: 'text-emerald-700', activeBg: 'bg-emerald-100', hoverBg: 'hover:bg-emerald-50' },
    CRM: { textColor: 'text-orange-700', activeBg: 'bg-orange-100', hoverBg: 'hover:bg-orange-50' },
    Finance: { textColor: 'text-indigo-700', activeBg: 'bg-indigo-100', hoverBg: 'hover:bg-indigo-50' },
    Procurement: { textColor: 'text-purple-700', activeBg: 'bg-purple-100', hoverBg: 'hover:bg-purple-50' },
    Logo: { textColor: 'text-cyan-700', activeBg: 'bg-cyan-100', hoverBg: 'hover:bg-cyan-50' },
    default: { textColor: 'text-gray-600', activeBg: 'bg-gray-100', hoverBg: 'hover:bg-gray-50' },
  };

  const theme = themeMap[activeModule] || themeMap.default;

  return (
    <div className="w-56 bg-white h-screen flex flex-col">
      <div className="mb-1/2 p-2 flex items-center gap-2 mx-auto">
        <button
          onClick={() => navigate('/modules')}
          className="focus:outline-none cursor-pointer"
        >
          <img
            src="/bda-logo-1.png"
            alt="Logo"
            className="w-12 h-12 rounded-full border object-cover overflow-clip"
          />
        </button>
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
              activeModule === 'HR' ? '/hr' :
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
              <NavGroup 
                icon={<Users size={18} />} 
                label="Employees" 
                isOpen={openGroup === 'Employees'} 
                onToggle={() => toggleGroup('Employees')} 
                hoverBg={theme.hoverBg}
              >
                <NavItem to="/hr/employees/record" icon={<Users size={18} />} label="Employee Record" {...theme} isChild />
                <NavItem to="/hr/settings/jobgrade" icon={<Trophy size={18} />} label="Job Grade" {...theme} isChild />
              </NavGroup>

              <NavGroup 
                icon={<Building2 size={18} />} 
                label="Recruitment" 
                isOpen={openGroup === 'Recruitment'} 
                onToggle={() => toggleGroup('Recruitment')} 
                hoverBg={theme.hoverBg}
              >
                <NavItem to="/hr/recruitment/list" icon={<Building2 size={18} />} label="Recruitment List" {...theme} isChild />
                <NavItem to="/hr/recruitment/pipeline" icon={<Building2 size={18} />} label="Candidate Pipeline" {...theme} isChild />
                <NavItem to="/hr/recruitment/onboarding" icon={<Users size={18} />} label="On Boarding" {...theme} isChild />
              </NavGroup>
              
              <NavGroup 
                icon={<Building2 size={18} />} 
                label="Leave" 
                isOpen={openGroup === 'Leave'} 
                onToggle={() => toggleGroup('Leave')} 
                hoverBg={theme.hoverBg}
              >
                <NavItem to="/hr/leave/list" icon={<Building2 size={18} />} label="Leave List" {...theme} isChild />
                <NavItem to="/hr/leave/form" icon={<Building2 size={18} />} label="Leave Request" {...theme} isChild />
                <NavItem to="/hr/leave/Entitlement" icon={<Users size={18} />} label="Leave Entitlement" {...theme} isChild />
              </NavGroup>

              <NavGroup 
                icon={<Building2 size={18} />} 
                label="Attendance" 
                isOpen={openGroup === 'Attendance'} 
                onToggle={() => toggleGroup('Attendance')} 
                hoverBg={theme.hoverBg}
              >
                <NavItem to="/hr/attendance/list" icon={<Building2 size={18} />} label="Attendance List" {...theme} isChild />
                <NavItem to="/hr/shift-scheduler" icon={<Building2 size={18} />} label="Shift Schedule" {...theme} isChild />
                <NavItem to="/hr/time-clock" icon={<Users size={18} />} label="Time clock" {...theme} isChild />
                <NavItem to="/hr/attendance/form" icon={<Users size={18} />} label="Attendance Form" {...theme} isChild />
              </NavGroup>
              
              <NavItem to="/hr/training" icon={<GraduationCap size={18} />} label="Training" {...theme} />
              <NavItem to="/hr/reports" icon={<FileSpreadsheet size={18} />} label="Reports" {...theme} />
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
              <NavItem 
                to="/core/company" 
                icon={<Building size={18} />} 
                label="Companies" 
                {...theme}
                matchPaths={['/branches']} // This will make it active for /branches routes
              />
              <NavItem to="/core/department" icon={<Network size={18} />} label="Department" {...theme} /> 
              <NavItem to="/core/fiscal-year" icon={<FileText size={18} />} label="Fiscal Year" {...theme} />
              <NavItem to="/core/users" icon={<Users size={18} />} label="User Management" {...theme} />
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
              <NavItem to="/finance/accounts" icon={<Package size={18} />} label="Accounts" {...theme} />
              <NavItem to="/finance/assets" icon={<Briefcase size={18} />} label="Assets" {...theme} />
              <NavItem to="/finance/budget-list" icon={<FileSpreadsheet size={18} />} label="Budgeting" {...theme} />
              <NavItem to="/finance/payroll" icon={<FileSpreadsheet size={18} />} label="Payroll" {...theme} />
              <NavItem to="/finance/transactions" icon={<FileSpreadsheet size={18} />} label="Transaction" {...theme} />
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
        <NavItem to="/hr/settings" icon={<Settings size={18} />} label="Settings" {...theme} />
      </div>
    </div>
  );
};

export default Sidebar;