import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../../ui/button';
import type { LeaveTypeListDto } from '../../../../../types/hr/leavetype';
import { createPortal } from 'react-dom';

interface LeaveTypeCardProps {
  leaveType: LeaveTypeListDto;
  onEdit: (leaveType: LeaveTypeListDto) => void;
  onDelete: (leaveType: LeaveTypeListDto) => void;
}

const LeaveTypeCard: React.FC<LeaveTypeCardProps> = ({
  leaveType,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideMenuButton = menuButtonRef.current && 
        !menuButtonRef.current.contains(event.target as Node);
      const isOutsideMenu = menuRef.current && 
        !menuRef.current.contains(event.target as Node);
      
      if (isOutsideMenuButton && isOutsideMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(leaveType);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(leaveType);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 160
      });
    }
    
    setShowMenu(!showMenu);
  };

  // Dropdown menu component using portal
  const DropdownMenu = () => {
    if (!showMenu) return null;

    return createPortal(
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        style={{
          position: 'absolute',
          top: menuPosition.top,
          left: menuPosition.left,
        }}
        className="fixed w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] py-1"
      >
        <button
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </button>
        <button
          className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </button>
      </motion.div>,
      document.body
    );
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all relative cursor-pointer group p-6"
      >
        {/* More Options Menu Button */}
        <div className="absolute top-3 right-3">
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer relative z-10"
            onClick={handleMenuClick}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid View  */}
        <div className="flex items-center mb-4">
        
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
              {leaveType.name}
            </h3>
            <p className={`text-sm font-medium ${
              leaveType.isPaid ? 'text-green-400' : 'text-red-400'
            }`}>
              {leaveType.isPaid ? 'Paid' : 'Unpaid'}
            </p>
          </div>
        </div>
      </motion.div>
      <DropdownMenu />
    </>
  );
};

export default LeaveTypeCard;