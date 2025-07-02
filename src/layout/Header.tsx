import React from 'react';
import { Bell, HelpCircle, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-nav h-16 flex items-center justify-between px-4 lg:px-6">
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
            <p className="text-sm font-medium text-gray-700">John Smith</p>
            <p className="text-xs text-gray-500">HR Manager</p>
          </div>
          <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;