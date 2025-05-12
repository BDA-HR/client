import React from 'react';
import { NavLink } from 'react-router';
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
  LogOut
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const NavGroup: React.FC<NavGroupProps> = ({ icon, label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          {label}
        </div>
        {isOpen ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
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
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary-600 text-white mr-2">
            <Users size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">HR Dashboard</h1>
        </div>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" end />
          
          <NavGroup icon={<Users size={18} />} label="Employees">
            <NavItem to="/employees" icon={<Users size={18} />} label="Directory" />
            <NavItem to="/employees/skills" icon={<Trophy size={18} />} label="Skills" />
            <NavItem to="/employees/appraisals" icon={<FileText size={18} />} label="Appraisals" />
          </NavGroup>
          
          <NavGroup icon={<Building2 size={18} />} label="Organization">
            <NavItem to="/organization/structure" icon={<Building2 size={18} />} label="Structure" />
            <NavItem to="/organization/departments" icon={<Users size={18} />} label="Departments" />
          </NavGroup>
          
          <NavItem to="/leave-management" icon={<Calendar size={18} />} label="Leave Management" />
          <NavItem to="/training" icon={<GraduationCap size={18} />} label="Training" />
          <NavItem to="/reports" icon={<FileSpreadsheet size={18} />} label="Reports" />
          <NavItem to="/analytics" icon={<BarChart4 size={18} />} label="Analytics" />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
        <button className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors w-full">
          <span className="mr-3"><LogOut size={18} /></span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;