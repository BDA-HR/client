import React from 'react';
import { Bell, HelpCircle, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useModule } from '../ModuleContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '../components/ui/dropdown-menu';
import { useNavigate } from "react-router";


interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { activeModule } = useModule();
  const navigate = useNavigate();

  
  // Module-based color themes
  const themeMap: Record<string, { bg: string; border: string; text: string }> = {
    Inventory: { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-700' },
    HR: { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-700' },
    Core: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700' },
    CRM: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-700' },
    Finance: { bg: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-700' },
    Procurement: { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-700' },
    default: { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-600' },
  };

  const theme = themeMap[activeModule] || themeMap.default;

  return (
    <header className={`${theme.bg} border-b ${theme.border} shadow-nav h-16 flex items-center justify-between px-4 lg:px-6`}>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500 ring-2 ring-white" />
          </button>
        </div>
        
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
          <HelpCircle size={20} />
        </button>
        
        <div className="flex items-center border-l border-gray-200 pl-4 ml-2">
          <div className="mr-3 text-right hidden sm:block">
            <p className={`text-sm font-medium ${theme.text}`}>John Smith</p>
            <p className="text-xs text-gray-500">{activeModule || 'HR'} Manager</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger><Avatar>            <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback> </Avatar></DropdownMenuTrigger>
            <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem onClick={() => navigate("/login")}>logout</DropdownMenuItem>
  </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;