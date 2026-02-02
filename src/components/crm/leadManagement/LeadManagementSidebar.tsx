import React from "react";
import { NavLink } from "react-router-dom";
import { Trophy, BarChart4, RefreshCw, Calendar } from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  end?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  end = false,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? "bg-orange-100 text-orange-700"
            : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

export default function LeadManagementSidebar() {
  return (
    <div className="w-64 bg-white h-full border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Lead Management
        </h2>
        <nav className="space-y-1">
          <SidebarItem
            to="/crm/leads"
            icon={<Trophy size={18} />}
            label="Leads"
            end={true}
          />
          <SidebarItem
            to="/crm/leads/analytics"
            icon={<BarChart4 size={18} />}
            label="Analytics"
          />
          <SidebarItem
            to="/crm/leads/routing"
            icon={<RefreshCw size={18} />}
            label="Routing"
          />
          <SidebarItem
            to="/crm/leads/nurturing"
            icon={<Calendar size={18} />}
            label="Nurturing"
          />
        </nav>
      </div>
    </div>
  );
}
