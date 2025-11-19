import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Edit, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../../../../ui/button';
import type { LeavePolicyListDto } from '../../../../../types/hr/leavepolicy';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

interface LeavePolicyCardProps {
  leavePolicy: LeavePolicyListDto;
  viewMode: 'grid' | 'list';
  onEdit: (leavePolicy: LeavePolicyListDto) => void;
  onDelete: (leavePolicy: LeavePolicyListDto) => void;
}

const LeavePolicyCard: React.FC<LeavePolicyCardProps> = ({
  leavePolicy,
  viewMode,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
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
    onEdit(leavePolicy);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(leavePolicy);
  };

  // FIXED: Use :Id (capital I) to match App.tsx route
  const handleCardClick = () => {
    navigate(`/hr/settings/annualleave/${leavePolicy.id}/policy`, {
      state: { leavePolicy }
    });
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

  // Format boolean values to display
  const formatBoolean = (value: boolean): string => {
    return value ? 'Yes' : 'No';
  };

  // Format duration for display
  const formatDuration = (days: number): string => {
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  // Get badge color based on requirements
  const getBadgeColor = (condition: boolean) => {
    return condition 
      ? 'bg-orange-100 text-orange-800 border-orange-200' 
      : 'bg-green-100 text-green-800 border-green-200';
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
        onClick={handleCardClick}
        className={`bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all relative cursor-pointer group ${
          viewMode === 'grid' ? 'p-6' : 'p-5 flex items-start'
        }`}
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

        {/* Click Indicator */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-4 w-4 text-green-600" />
        </div>

        {viewMode === 'grid' ? (
          // Grid View
          <>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-50 mr-4 group-hover:bg-green-100 transition-colors">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                  {leavePolicy.name}
                </h3>
                <p className="text-sm text-gray-600">{leavePolicy.leaveType}</p>
              </div>
            </div>
            
            {/* Policy Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500">Min Duration</p>
                  <p className="font-semibold text-gray-900">{formatDuration(leavePolicy.minDurPerReq)}</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500">Max Duration</p>
                  <p className="font-semibold text-gray-900">{formatDuration(leavePolicy.maxDurPerReq)}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(leavePolicy.requiresAttachment)}`}>
                  {leavePolicy.requiresAttachment ? '📎 Attachment Required' : '✅ No Attachment'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(leavePolicy.holidaysAsLeave)}`}>
                  {leavePolicy.holidaysAsLeave ? '🎯 Holidays as Leave' : '📅 Exclude Holidays'}
                </span>
              </div>
            </div>

            {/* Click Hint */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center group-hover:text-green-600 transition-colors">
                Click to view policy details
              </p>
            </div>
          </>
        ) : (
          // List View
          <>
            <div className="p-2 rounded-md bg-green-50 mr-4 group-hover:bg-green-100 transition-colors">
              <Calendar className="text-green-600" size={20} />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {leavePolicy.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{leavePolicy.leaveType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Min Duration</p>
                  <p className="font-semibold text-gray-900">{formatDuration(leavePolicy.minDurPerReq)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Max Duration</p>
                  <p className="font-semibold text-gray-900">{formatDuration(leavePolicy.maxDurPerReq)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Attachment</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(leavePolicy.requiresAttachment)}`}>
                    {formatBoolean(leavePolicy.requiresAttachment)}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Holidays</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(leavePolicy.holidaysAsLeave)}`}>
                    {formatBoolean(leavePolicy.holidaysAsLeave)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
      
      <DropdownMenu />
    </>
  );
};

export default LeavePolicyCard;